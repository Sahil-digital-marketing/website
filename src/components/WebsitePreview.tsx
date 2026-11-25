export function WebsitePreview({ kind }: { kind: 'landing' | 'business' | 'ecommerce' }) {
  return (
    <div className={`website-preview website-preview--${kind}`} aria-hidden="true">
      <div className="preview-toolbar"><span /><span /><span /><i /></div>
      <div className="preview-screen">
        <div className="preview-nav"><b>STUDIO / {kind === 'ecommerce' ? 'SHOP' : kind === 'business' ? 'WORK' : '01'}</b><span>—— &nbsp; —— &nbsp; —</span></div>
        {kind === 'landing' ? (
          <div className="preview-landing"><p>A bold idea.<br />A clear next step.</p><span className="preview-sun" /><i>Let’s begin ↗</i></div>
        ) : kind === 'business' ? (
          <div className="preview-business"><p>A home for<br />what comes next.</p><div className="preview-building"><i /><i /><i /><i /></div><div className="preview-stat"><span>Discover</span><span>Connect</span><span>Manage</span></div></div>
        ) : (
          <div className="preview-shop"><p>Everyday, considered.</p><div className="preview-products"><i /><i /><i /></div><div className="preview-stat"><span>Objects</span><span>Essentials</span><span>New arrivals</span></div></div>
        )}
      </div>
    </div>
  )
}
