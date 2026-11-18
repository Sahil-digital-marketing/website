export type Service = {
  id: string
  title: string
  tagline: string
  description: string
  terms: [string, string, string]
  included: string[]
  steps: [string, string, string, string]
  bestFor: string
}

export type FieldNote = {
  id: string
  topic: string
  readTime: string
  title: string
  summary: string
  body: string
  image: { src: string, alt: string }
}

export const navigationLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Field notes', href: '#notes' },
  { label: 'FAQ', href: '#faq' },
]

export const contactLinks = {
  email: 'Info@sahildigitalmarketing.com',
  whatsappNumber: '+91 76769 74316',
  whatsappHref: 'https://wa.me/917676974316',
  instagramHref: 'https://www.instagram.com/sahil__digitalmarketing',
}

export const about = {
  lead: 'SAHIL Digital Marketing',
  statement: 'is a growth studio that helps brands across India get seen, trusted and chosen. We plan, create, launch and measure, then improve every campaign.',
  philosophy: 'Creativity gets attention. Strategy keeps it. Data proves it worked. We treat your growth as our own, and report on it openly.',
  facts: [
    { label: 'Based in', value: 'India' },
    { label: 'Registered', value: 'Udyam MSME' },
    { label: 'Works with', value: 'Startups, local businesses and brands' },
  ],
  vision: 'To be the digital marketing partner that helps every brand we work with rise above its competition.',
  mission: 'To turn creative ideas, clear strategy and honest data into growth our clients can measure.',
}

export const services: Service[] = [
  {
    id: 'social',
    title: 'Social Media Marketing',
    tagline: 'Turn attention into community.',
    description: 'We plan, design and run social campaigns that stop the scroll and give people a reason to follow, engage and come back.',
    terms: ['Content calendars', 'Reels and stories', 'Community care'],
    included: ['Platform strategy and content calendar', 'Scroll-stopping posts, reels and stories', 'Community management and engagement', 'Paid social support and audience targeting', 'Monthly performance reporting'],
    steps: ['Audit', 'Strategy', 'Create', 'Grow'],
    bestFor: 'Brands that want a consistent, recognisable presence and a real community, not just a follower count.',
  },
  {
    id: 'seo',
    title: 'Search Engine Optimization',
    tagline: 'Get found when it matters.',
    description: 'We connect what people search for with what your business offers, so visibility keeps building long after the work ships.',
    terms: ['Search intent', 'Technical fixes', 'Helpful content'],
    included: ['Keyword and search-intent research', 'Technical SEO audit and fixes', 'On-page optimization for key pages', 'Content and link-building plan', 'Ranking and traffic reporting'],
    steps: ['Research', 'Fix', 'Optimize', 'Scale'],
    bestFor: 'Businesses that want steady, long-term inbound traffic instead of paying for every click.',
  },
  {
    id: 'ads',
    title: 'Google Ads',
    tagline: 'Make every click count.',
    description: 'Focused campaigns that put your brand in front of high-intent customers, with tracking tied to leads and sales.',
    terms: ['Search campaigns', 'Conversion tracking', 'Budget control'],
    included: ['Account and campaign setup', 'Keyword, audience and ad copy testing', 'Landing page recommendations', 'Conversion tracking and budget control', 'Ongoing optimization and clear reports'],
    steps: ['Plan', 'Launch', 'Test', 'Optimize'],
    bestFor: 'Businesses that want fast, measurable leads or sales and full control over spend.',
  },
  {
    id: 'content',
    title: 'Content Marketing',
    tagline: 'A voice worth listening to.',
    description: 'Stories and useful content that build trust, answer real questions and spark action, in one consistent voice.',
    terms: ['Brand voice', 'Articles and guides', 'Editorial plans'],
    included: ['Brand voice and messaging guidance', 'Blog articles, guides and web copy', 'Content that supports SEO and social', 'Editorial calendar and planning', 'Review and refresh of existing content'],
    steps: ['Discover', 'Plan', 'Write', 'Refine'],
    bestFor: 'Brands that want to be seen as the trusted expert in their space.',
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    tagline: 'See what is working, and what is next.',
    description: 'We turn campaign data into plain-language insight, so every decision is based on evidence rather than guesswork.',
    terms: ['Tracking setup', 'Dashboards', 'Plain reports'],
    included: ['Tracking and dashboard setup', 'Reach, engagement and conversion analysis', 'Campaign and channel comparison', 'Plain-language insight reports', 'Recommendations for the next step'],
    steps: ['Track', 'Measure', 'Analyze', 'Act'],
    bestFor: 'Teams that already run campaigns and want clarity on what is actually working.',
  },
  {
    id: 'web',
    title: 'Website Development',
    tagline: 'A better home for your business.',
    description: 'Responsive websites and landing pages designed around the next action a visitor should take.',
    terms: ['Responsive builds', 'Landing pages', 'Speed and SEO basics'],
    included: ['Website and landing page design', 'Responsive, accessible build', 'Speed and on-page SEO foundations', 'Enquiry forms and analytics setup', 'Handover and care plan'],
    steps: ['Discover', 'Design', 'Build', 'Launch'],
    bestFor: 'Businesses whose website should bring in enquiries, not just sit online.',
  },
]

export const processSteps = [
  { line: 'First, we listen.', detail: 'Your business, your audience and the challenge you want to solve, before any plan.' },
  { line: 'Then we agree the plan.', detail: 'Direction, scope and deliverables are settled with you before work begins.' },
  { line: 'We build and launch.', detail: 'The plan comes to life with clear review points and room for your feedback.' },
  { line: 'Then we measure, and refine.', detail: 'We share what we learn in plain language and use it to shape the next step.' },
]

const photo = (id: number, w = 1200, h = 900) => `https://picsum.photos/id/${id}/${w}/${h}`

export const fieldNotes: FieldNote[] = [
  {
    id: 'community',
    topic: 'Social Media',
    readTime: '4 min read',
    title: 'Your audience is a community, not a number.',
    summary: 'Turn passive followers into people who recognise, trust and choose your brand.',
    body: 'Strong social media is not about posting every day just to stay visible. It is about giving the right people a reason to care. Start with a clear point of view, create repeatable content themes, respond like a human and use saves, shares, meaningful replies and enquiries to understand what is resonating. Build a community before chasing a bigger number.',
    image: { src: photo(319), alt: 'Hands holding a vintage camera against a denim jacket' },
  },
  {
    id: 'search',
    topic: 'SEO',
    readTime: '5 min read',
    title: 'Search visibility starts before the click.',
    summary: 'A useful SEO foundation connects search intent, helpful pages and a clear user journey.',
    body: 'SEO works best when you understand what a person is trying to solve. Group keywords by intent, make each important page answer one clear need, improve page speed and internal links, and publish genuinely useful information. Rankings matter, but the real goal is to help the right visitor take the next step.',
    image: { src: photo(1060), alt: 'Water poured slowly over a coffee dripper on a dark counter' },
  },
  {
    id: 'conversions',
    topic: 'Google Ads',
    readTime: '3 min read',
    title: 'Clicks are easy. Conversions take a plan.',
    summary: 'Make every campaign decision connect to the outcome your business actually needs.',
    body: 'Before increasing ad spend, check the foundations: a specific audience, focused keywords, compelling creative, a relevant landing page and conversion tracking that works. Review search terms regularly and separate high-intent traffic from curiosity clicks. Optimise towards qualified enquiries or sales, not clicks alone.',
    image: { src: photo(304), alt: 'A hand adjusting faders on an audio mixing console' },
  },
  {
    id: 'stories',
    topic: 'Content',
    readTime: '4 min read',
    title: 'Good content gives every story a job.',
    summary: 'A consistent voice across reels, blogs, campaigns and everyday conversations.',
    body: 'Useful content should educate, build trust or help someone make a decision. Choose a few content pillars, adapt the message to each platform and keep the brand voice recognisable. A single strong idea can become a short video, carousel, blog article and email, without copying the same format everywhere.',
    image: { src: photo(491), alt: 'Hand tools and leather gloves laid out on dark wood' },
  },
  {
    id: 'measure',
    topic: 'Analysis',
    readTime: '4 min read',
    title: 'Measure what moves the business.',
    summary: 'Turn campaign reports into clear decisions, sharper experiments and better next steps.',
    body: 'A useful report connects activity to outcomes. Look beyond reach and impressions: examine qualified leads, conversion rate, cost per acquisition, return on ad spend and the journey between them. Compare performance over time, note what changed and choose one practical experiment for the next cycle. Data is valuable when it changes a decision.',
    image: { src: photo(407), alt: 'Hands lighting a sparkler that throws bright sparks in the dark' },
  },
]

export const faqs = [
  { question: 'Who do you work with?', answer: 'Startups, local businesses, established brands, entrepreneurs, creators and growing teams across India. The starting point is your business goal.' },
  { question: 'Can I start with a single service?', answer: 'Yes. We agree a focused scope around what you need. You do not need to take every service to work with us.' },
  { question: 'How is pricing decided?', answer: 'Pricing depends on the agreed scope, deliverables and required work. We discuss these with you before sharing a proposal.' },
  { question: 'What does getting started look like?', answer: 'We talk through your business, goals and requirements, then align on services, timing, responsibilities and next steps before work starts.' },
  { question: 'How will I know it is working?', answer: 'You get clear dashboards and regular reports in plain language, tied to the outcomes we agreed at the start.' },
  { question: 'Do you create the content too?', answer: 'Yes. Blogs, posts, reels and campaign creative are part of our content and social work.' },
  { question: 'Do you build websites?', answer: 'Yes. We design and build responsive websites and landing pages designed around enquiries.' },
  { question: 'Do you keep improving after launch?', answer: 'Ongoing optimization is part of the work: we test, learn and adjust so growth keeps moving.' },
]
