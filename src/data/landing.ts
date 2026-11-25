import { homeImages, type HomeImage } from './homeImages'

export type Service = {
  id: string
  href: string
  title: string
  tagline: string
  description: string
  terms: [string, string, string]
  included: string[]
  steps: [string, string, string, string]
  bestFor: string
  image: HomeImage
}

export type FieldNote = {
  id: string
  topic: string
  readTime: string
  title: string
  summary: string
  body: string
  image: HomeImage
}

export const navigationLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Process', href: '/process' },
  { label: 'Field notes', href: '#notes' },
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
    id: 'web',
    href: '/services/website-development',
    image: homeImages.web,
    title: 'Website Development',
    tagline: 'A better home for your business.',
    description: 'Responsive websites and landing pages designed around the next action a visitor should take.',
    terms: ['Responsive builds', 'Landing pages', 'Speed and SEO basics'],
    included: ['Website and landing page design', 'Responsive, accessible build', 'Speed and on-page SEO foundations', 'Enquiry forms and analytics setup', 'Handover and care plan'],
    steps: ['Discover', 'Design', 'Build', 'Launch'],
    bestFor: 'Businesses whose website should bring in enquiries, not just sit online.',
  },
  {
    id: 'growth',
    href: '/services/digital-growth',
    image: homeImages.social,
    title: 'Digital Growth',
    tagline: 'A monthly plan for a stronger digital presence.',
    description: 'Choose a monthly package for social content and planning, with reels, SEO and Google Ads support in selected tiers.',
    terms: ['Monthly social content', 'Reels in selected tiers', 'Strategy and reporting'],
    included: ['8, 12 or 20 social media posts per month', '1, 2 or 3 social platforms', 'Content planning for your tier', 'Reporting or analytics for your tier', 'Reels, SEO and Ads support in selected tiers'],
    steps: ['Discuss', 'Plan', 'Create', 'Review'],
    bestFor: 'Brands that want a defined monthly content plan, with the option to add reels, search or paid campaigns.',
  },
]

export const processSteps = [
  {
    line: 'First, we listen.',
    detail: 'Your business, your audience and the challenge you want to solve, before any plan.',
    agencyRole: 'We explore your goals, your starting point and the people you want to reach. That helps us recommend the right kind of work.',
    clientRole: 'Share your priorities, existing materials and the context behind the challenge.',
    checkpoint: 'A shared understanding of the problem and the next step.',
  },
  {
    line: 'Then we agree the plan.',
    detail: 'Direction, scope and deliverables are settled with you before work begins.',
    agencyRole: 'We outline the proposed direction, scope and deliverables. Once agreed, we gather the content and access needed to begin.',
    clientRole: 'Review the proposal, confirm priorities and provide the agreed inputs or access.',
    checkpoint: 'A clear scope and a practical starting point.',
  },
  {
    line: 'We build and launch.',
    detail: 'The plan comes to life with clear review points and room for your feedback.',
    agencyRole: 'We create the agreed work, share it for review and prepare the approved website, content or campaign for launch.',
    clientRole: 'Review the work, give consolidated feedback and approve what is ready to go live.',
    checkpoint: 'Work reviewed and approved against the agreed scope.',
  },
  {
    line: 'Then we measure, and refine.',
    detail: 'We share what we learn in plain language and use it to shape the next step.',
    agencyRole: 'Where measurement or ongoing support is included, we review available results, explain what they show and recommend the next move.',
    clientRole: 'Share the business context behind enquiries or sales and help set the next priority.',
    checkpoint: 'An informed decision about what to improve next.',
  },
]

export const fieldNotes: FieldNote[] = [
  {
    id: 'community',
    topic: 'Social Media',
    readTime: '4 min read',
    title: 'Your audience is a community, not a number.',
    summary: 'Turn passive followers into people who recognise, trust and choose your brand.',
    body: 'Strong social media is not about posting every day just to stay visible. It is about giving the right people a reason to care. Start with a clear point of view, create repeatable content themes, respond like a human and use saves, shares, meaningful replies and enquiries to understand what is resonating. Build a community before chasing a bigger number.',
    image: homeImages.social,
  },
  {
    id: 'search',
    topic: 'SEO',
    readTime: '5 min read',
    title: 'Search visibility starts before the click.',
    summary: 'A useful SEO foundation connects search intent, helpful pages and a clear user journey.',
    body: 'SEO works best when you understand what a person is trying to solve. Group keywords by intent, make each important page answer one clear need, improve page speed and internal links, and publish genuinely useful information. Rankings matter, but the real goal is to help the right visitor take the next step.',
    image: homeImages.seo,
  },
  {
    id: 'conversions',
    topic: 'Google Ads',
    readTime: '3 min read',
    title: 'Clicks are easy. Conversions take a plan.',
    summary: 'Make every campaign decision connect to the outcome your business actually needs.',
    body: 'Before increasing ad spend, check the foundations: a specific audience, focused keywords, compelling creative, a relevant landing page and conversion tracking that works. Review search terms regularly and separate high-intent traffic from curiosity clicks. Optimise towards qualified enquiries or sales, not clicks alone.',
    image: homeImages.ads,
  },
  {
    id: 'stories',
    topic: 'Content',
    readTime: '4 min read',
    title: 'Good content gives every story a job.',
    summary: 'A consistent voice across reels, blogs, campaigns and everyday conversations.',
    body: 'Useful content should educate, build trust or help someone make a decision. Choose a few content pillars, adapt the message to each platform and keep the brand voice recognisable. A single strong idea can become a short video, carousel, blog article and email, without copying the same format everywhere.',
    image: homeImages.content,
  },
  {
    id: 'measure',
    topic: 'Analysis',
    readTime: '4 min read',
    title: 'Measure what moves the business.',
    summary: 'Turn campaign reports into clear decisions, sharper experiments and better next steps.',
    body: 'A useful report connects activity to outcomes. Look beyond reach and impressions: examine qualified leads, conversion rate, cost per acquisition, return on ad spend and the journey between them. Compare performance over time, note what changed and choose one practical experiment for the next cycle. Data is valuable when it changes a decision.',
    image: homeImages.analytics,
  },
]
