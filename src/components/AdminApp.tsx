'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { Enquiry } from '../../shared/enquiry'

async function post(url: string, data?: unknown, method = 'POST') {
  const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: data ? JSON.stringify(data) : undefined })
  const result = await response.json() as { error?: string, message?: string, ok?: boolean }
  if (!response.ok) throw new Error(result.error || 'Request failed.')
  return result
}

export function AdminApp({ signedIn }: { signedIn: boolean }) {
  const [authenticated, setAuthenticated] = useState(signedIn)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const load = useCallback(async (search = '') => {
    try {
      const response = await fetch(`/api/admin/enquiries?q=${encodeURIComponent(search)}`, { cache: 'no-store' })
      if (response.status === 401) { setAuthenticated(false); return }
      if (!response.ok) throw new Error('Could not load enquiries.')
      const data = await response.json() as { enquiries: Enquiry[] }
      setEnquiries(data.enquiries)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load enquiries.') }
  }, [])

  useEffect(() => { if (authenticated) void load(query) }, [authenticated, load, query])

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const email = new FormData(event.currentTarget).get('email')
      const result = await post('/api/admin/request-code', { email })
      setMessage(result.message || '')
      setStep('code')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not send code.') }
    finally { setBusy(false) }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      await post('/api/admin/verify-code', { code: new FormData(event.currentTarget).get('code') })
      setAuthenticated(true)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sign in.') }
    finally { setBusy(false) }
  }

  async function updateStatus(id: string, status: Enquiry['status']) {
    try { await post(`/api/admin/enquiries/${id}`, { status }, 'PATCH'); await load(query) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not update enquiry.') }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this enquiry permanently?')) return
    try { await post(`/api/admin/enquiries/${id}`, undefined, 'DELETE'); setSelected(null); await load(query) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not delete enquiry.') }
  }

  const active = enquiries.find(item => item.id === selected)

  return <main className="admin-page"><div className="admin-wrap"><header className="admin-head"><a className="eyebrow" href="/">SAHIL DIGITAL MARKETING</a><span>Private enquiry dashboard</span>{authenticated && <button type="button" onClick={async () => { await post('/api/admin/logout'); setAuthenticated(false); setEnquiries([]) }}>Sign out</button>}</header>
    {!authenticated ? <section className="admin-login"><p className="eyebrow">Private access</p><h1>Sign in to enquiries.</h1>{step === 'email' ? <form onSubmit={requestCode}><label>Admin email<input name="email" type="email" autoComplete="email" required /></label><button className="button button-primary" disabled={busy}>Send sign-in code</button></form> : <form onSubmit={verifyCode}><label>Six-digit code<input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required /></label><button className="button button-primary" disabled={busy}>Sign in</button><button type="button" onClick={() => setStep('email')}>Use a different email</button></form>}</section> : <section className="admin-content"><div className="admin-title"><div><p className="eyebrow">Enquiries</p><h1>Project conversations.</h1></div><label>Search<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, email, service or reference" /></label></div><div className="admin-grid"><div className="admin-list">{enquiries.length === 0 && <p>No enquiries found.</p>}{enquiries.map(item => <button type="button" className={selected === item.id ? 'admin-item selected' : 'admin-item'} key={item.id} onClick={() => setSelected(item.id)}><span>{new Date(item.created_at).toLocaleString()}</span><strong>{item.name}</strong><span>{item.service} · {item.status}</span><small>Admin email: {item.admin_email_state} · Client email: {item.client_email_state}</small></button>)}</div><div className="admin-detail">{active ? <><p className="eyebrow">Reference {active.id}</p><h2>{active.name}</h2><dl>{[['Received', new Date(active.created_at).toLocaleString()], ['Service', active.service], ['Package', active.package_id], ['Email', active.email], ['Business', active.company], ['Phone', active.phone], ['Project', active.project], ['Budget', active.budget], ['Timeline', active.timeline], ['Admin email', `${active.admin_email_state}${active.admin_email_error ? `: ${active.admin_email_error}` : ''}`], ['Client email', `${active.client_email_state}${active.client_email_error ? `: ${active.client_email_error}` : ''}`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl><label>Status<select value={active.status} onChange={event => void updateStatus(active.id, event.target.value as Enquiry['status'])}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label><button className="admin-delete" type="button" onClick={() => void remove(active.id)}>Delete enquiry</button></> : <p>Select an enquiry to see its details.</p>}</div></div></section>}
    <p className="admin-message" role="status">{message}</p></div></main>
}
