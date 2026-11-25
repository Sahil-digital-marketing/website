import { contactLinks } from './landing'

export type GrowthPackage = {
  id: 'basic' | 'popular' | 'premium'
  name: string
  description: string
  includes: string[]
}

// Monthly package contents transcribed from the supplied Digital Growth graphic.
export const growthPackages: GrowthPackage[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'A consistent social presence with the essentials in place.',
    includes: [
      '8 social media posts',
      '1 social platform',
      'Captions and hashtags',
      'Content calendar',
      'Monthly performance report',
      'Social profile optimization',
      'Email support',
    ],
  },
  {
    id: 'popular',
    name: 'Popular',
    description: 'More content formats and a plan for engaging your audience.',
    includes: [
      '12 social media posts',
      '2–3 edited reels',
      '2 social platforms',
      'Content strategy and calendar',
      'Basic SEO guidance',
      'Monthly analytics report',
      'Audience engagement strategy',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'A broader monthly plan across content, search and paid campaigns.',
    includes: [
      '20 social media posts',
      '5–6 edited reels',
      '3 social platforms',
      'Advanced SEO',
      'Google Ads management',
      'Content strategy and analytics',
      'Audience growth strategy',
      'Competitor analysis',
      'Dedicated support',
    ],
  },
]

export const growthPlanNote = 'All three packages are monthly plans. Google Ads budget is charged separately. Final scope and monthly fees are confirmed in your quote.'

export function growthQuoteHref(packageName?: string) {
  const message = packageName
    ? `Hi SAHIL, I'd like a quote for the ${packageName} Digital Growth monthly plan.`
    : "Hi SAHIL, I'd like to discuss a Digital Growth monthly plan."
  return `${contactLinks.whatsappHref}?text=${encodeURIComponent(message)}`
}
