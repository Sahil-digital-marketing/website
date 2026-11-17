export type ServiceIconName = 'social' | 'search' | 'ads' | 'content' | 'analytics' | 'web'

type Service = {
  title: string
  description: string
  icon: ServiceIconName
}

export const navigationLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Approach', href: '#approach' },
  { label: 'FAQ', href: '#faq' },
]

export const services: Service[] = [
  { title: 'Social Media Marketing', description: 'A considered presence. Strategy, content planning, and campaigns that give your brand a clear voice.', icon: 'social' },
  { title: 'Search Engine Optimization', description: 'Help the right people find you. Search research, technical foundations, and content built around your audience.', icon: 'search' },
  { title: 'Google Ads', description: 'Put your business in the conversation. Campaign planning, management, and optimization around your goals.', icon: 'ads' },
  { title: 'Content Marketing', description: 'Give people a reason to pay attention. Useful content and stories that make your brand matter.', icon: 'content' },
  { title: 'Analytics & Reporting', description: 'Understand what the work is doing. Clear tracking, practical reporting, and insight for your next decision.', icon: 'analytics' },
  { title: 'Website Development', description: 'A better home for your business. Responsive websites and landing pages designed around the next action.', icon: 'web' },
]

export const processSteps = [
  { title: 'Discovery', description: 'We listen first. Your business, your audience, and the challenge you want to solve.' },
  { title: 'Strategy', description: 'We agree on the direction, scope, and deliverables before the work begins.' },
  { title: 'Execution', description: 'We bring the plan to life, with clear review points and room for your feedback.' },
  { title: 'Review & refine', description: 'We review the work, share what we learn, and use it to shape the next step.' },
]

export const faqs = [
  { question: 'Who do you work with?', answer: 'Startups, local businesses, established brands, entrepreneurs, creators, and growing teams across India. The starting point is your business goal.' },
  { question: 'Can I start with a single service?', answer: 'Yes. We begin by understanding what you need and agree on a focused scope. You do not need to take every service to work with us.' },
  { question: 'How is pricing decided?', answer: 'Pricing depends on the agreed scope, deliverables, and required work. We discuss these with you before sharing a project proposal.' },
  { question: 'What does getting started look like?', answer: 'We discuss your business, goals, and requirements, then align on the services, timing, responsibilities, and next steps before work starts.' },
]
