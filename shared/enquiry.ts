export type Enquiry = {
  id: string
  submission_key: string
  created_at: string
  status: 'new' | 'contacted' | 'closed'
  service: string
  package_id: string | null
  name: string
  email: string
  company: string | null
  phone: string | null
  project: string
  budget: string | null
  timeline: string | null
  admin_email_state: string
  client_email_state: string
  admin_email_error: string | null
  client_email_error: string | null
}
