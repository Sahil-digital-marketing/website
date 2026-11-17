# SAHIL Digital Marketing — Website Requirements Register

Source: founder brief dated 2026-11-17. This is the working hand-off for the
founder, content team, designer, developer, and launch owner. **Confirmed**
items may be designed or implemented; **approval required** items must not be
guessed or published.

## Confirmed Scope

| Area | Confirmed requirement |
| --- | --- |
| Brand | SAHIL Digital Marketing; tagline: *Signature of Success* |
| Market | India only; broad startups, local businesses, brands, creators, and entrepreneurs |
| Goal | Generate qualified enquiries through the primary CTA: **Start a Project** |
| Services | Social Media Marketing, SEO, Google Ads, Content Marketing, Analytics & Reporting, Website Development |
| Direction | Premium, professional, modern, dark-blue-led, responsive, accessible |
| Proof | Publish only genuine projects, verified outcomes, and permissioned testimonials |
| Launch pages | Home, About, Services + six service pages, Work, Process, Contact, Privacy, Terms, Thank You; add case studies only when real approved work exists |

## Founder Decisions Required Before Design Sign-off

| Decision | Required information | Owner |
| --- | --- | --- |
| Legal identity | Legal name, business structure, Udyam proof/approved wording, business start date | Founder |
| Public identity | Founder public name, bio, approved portrait, team details | Founder |
| Operations | Cities/states served; remote/in-person delivery; working hours | Founder |
| Services | Exact deliverables, platform coverage, quantities, exclusions, timelines, revision rules | Founder + service leads |
| Commercials | Pricing/package approach, taxes, payment milestones, ad-budget responsibility, cancellation/refund terms | Founder + finance/legal adviser |
| Brand kit | Final logo files, approved palette, font approval, image treatment, words/visuals to avoid | Founder + designer |
| Contact | Public email, phone, WhatsApp, address (if public), enquiry owner and backup | Founder |
| Content proof | Project assets, client permissions, testimonials, measurable outcomes, sources for every claim | Founder + content lead |
| Launch | Budget, target date, final approver, domain/hosting/source-code account owner | Founder |

## Technical Requirements

### Current Frontend Baseline

- React, Vite, TypeScript, Tailwind CSS v4.3, owned UI components, and paired
  light/dark themes.
- Mobile-first responsive layouts; verify 375px, 768px, 1024px, and 1440px.
- Semantic HTML, keyboard operation, visible focus, labelled forms, meaningful
  image alt text, reduced-motion support, and 4.5:1 normal-text contrast.
- Performance budget: optimized responsive images, explicit dimensions, lazy
  below-fold media, minimal third-party scripts, and no unnecessary UI kits.

### Hosting, Deployment, and Access

- Select the production host, DNS provider, CDN, and deployment owner.
- Use HTTPS, domain redirect policy, backups/rollback plan, uptime monitoring,
  and least-privilege account access. The business must own domain, hosting,
  source repository, analytics, and advertising accounts.
- Use `.env.development`, `.env.production`, and ignored `.env.local` for
  public frontend configuration only. Never put passwords, API secrets, or
  service-role keys in `VITE_` variables.

### Forms and Optional Backend

- The form requires name, email, service, and project description; phone,
  budget, and timeline are optional.
- Choose the delivery path before implementation: managed form provider, CRM,
  email service, or a dedicated `server/` backend. Confirm recipients, backup
  recipient, response-time expectation, spam protection, error handling, and
  data retention.
- A backend is not required for the marketing site unless private integrations,
  a CMS, authentication, database storage, or secure server-side form handling
  are approved. Any backend stays in `server/` and owns its own secrets.

### SEO, Analytics, and Consent

- Research final India-focused keywords; initial keywords are ideas, not search
  volume or ranking claims.
- Implement unique titles/descriptions, logical headings, canonicals, internal
  links, sitemap, robots.txt, image optimization, and Search Console.
- Confirm GA4, Search Console, Google Ads, and Meta Pixel account ownership and
  consent requirements before adding tags. Track form success and contact
  clicks; never send form contents or personal data to analytics.

## Non-Technical Content Checklist

- Final approved copy for each launch page and all six service pages.
- Real portfolio items: challenge, services, duration, result, assets, and
  publication permission. Label concepts clearly.
- Genuine testimonials with consent, attribution preference, and source.
- FAQ answers for scope, timeline, pricing approach, and working process.
- Privacy Policy and Terms based on actual form, analytics, cookies, and data
  retention practices; obtain appropriate legal review before launch.

## Launch Acceptance Criteria

- [ ] Founder approves copy, assets, claims, brand kit, prices, and contacts.
- [ ] All pages, navigation, links, forms, confirmation page, and email/CRM
  delivery work in production.
- [ ] Mobile/desktop, accessibility, performance, SEO metadata, sitemap,
  analytics events, and consent behavior are tested.
- [ ] Domain, SSL, redirects, backups, access ownership, privacy/terms, and
  rollback process are confirmed.
- [ ] Founder gives written final approval to publish.

## Recommended Delivery Order

1. Approve the decision table and collect assets.
2. Deliver the launch marketing site without unapproved case studies or prices.
3. Add the form delivery integration, analytics, SEO basics, and legal pages.
4. Test, obtain written approval, launch, and monitor enquiries.
5. Add verified case studies, packages, blog content, or a CMS only when there
   is a confirmed business need.
