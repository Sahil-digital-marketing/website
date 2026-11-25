export type WebsitePackage = {
  id: string
  tier: 'Basic' | 'Standard' | 'Premium'
  price: number
  audience: string
  includes: string[]
}

export type WebsiteCategory = {
  id: string
  title: string
  description: string
  packages: WebsitePackage[]
}

export const pricingNote = 'Prices may vary based on project complexity, features and integrations. Final scope and pricing are confirmed before work begins.'
export const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`

// Package scope and prices transcribed from the supplied Price Sheet.pdf.
export const websiteCategories: WebsiteCategory[] = [
  {
    id: 'landing', title: 'Landing pages',
    description: 'One focused page for a launch, campaign or first business presence. Give visitors a clear reason to take the next step.',
    packages: [
      { id: 'landing-basic', tier: 'Basic', price: 5000, audience: 'Startups and first launches', includes: ['Clean one-page design', 'Mobile and desktop friendly', 'Contact / enquiry form'] },
      { id: 'landing-standard', tier: 'Standard', price: 7500, audience: 'Lead-generation campaigns', includes: ['Modern interface design', 'Lead-capture form', 'Basic SEO setup'] },
      { id: 'landing-premium', tier: 'Premium', price: 10000, audience: 'Brands that need a distinctive first impression', includes: ['Custom, branded design', 'WhatsApp integration', 'Basic analytics'] },
    ],
  },
  {
    id: 'business', title: 'Business websites',
    description: 'A working home for your business, with customer accounts, secure data and the tools to manage day-to-day enquiries.',
    packages: [
      { id: 'business-basic', tier: 'Basic', price: 15000, audience: 'Small businesses', includes: ['Professional, responsive design', 'User sign-up and sign-in', 'One-time password authentication by email / SMS', 'Basic secure backend', 'Database setup and management', 'Basic admin access'] },
      { id: 'business-standard', tier: 'Standard', price: 18000, audience: 'Growing businesses', includes: ['Everything in Basic', 'Advanced backend: connected services and business logic', 'Separate admin and user access', 'Real-time database updates', 'Dashboard for orders, enquiries and users', 'Data security and backup'] },
      { id: 'business-premium', tier: 'Premium', price: 21000, audience: 'Established brands', includes: ['Everything in Standard', 'Advanced integrations, such as payments and CRM', 'Email, SMS and WhatsApp notifications', 'Activity logs and analytics', 'Rate limiting and data encryption', 'Architecture designed to scale'] },
    ],
  },
  {
    id: 'ecommerce', title: 'E-commerce websites',
    description: 'An online store built around your catalogue, customers and orders, with room to add payments and automation as you grow.',
    packages: [
      { id: 'ecommerce-basic', tier: 'Basic', price: 15000, audience: 'New and small stores', includes: ['Modern, responsive website', 'Up to 20 products', 'Product categories and search', 'Shopping cart', 'WhatsApp ordering', 'Basic admin for products and orders', 'Secure hosting and SSL (HTTPS)', 'Basic server protection'] },
      { id: 'ecommerce-standard', tier: 'Standard', price: 18000, audience: 'Growing stores', includes: ['Everything in Basic', 'Up to 50 products', 'Customer sign-up and login', 'Customer database', 'Online payments: UPI, cards and net banking', 'Order placement and order history', 'Password reset', 'Secure authentication and data protection'] },
      { id: 'ecommerce-premium', tier: 'Premium', price: 21000, audience: 'Stores ready for automation and growth', includes: ['Everything in Standard', 'Up to 100 products', 'Mobile OTP sign-up and login', 'OTP verification with security limits', 'Advanced admin dashboard', 'Inventory and stock management', 'Coupons and discounts', 'Email order notifications', 'Automated database backups', 'Enhanced server security: rate limiting and monitoring'] },
    ],
  },
]

export function findWebsitePackage(id: string | null) {
  for (const category of websiteCategories) {
    const item = category.packages.find((entry) => entry.id === id)
    if (item) return { ...item, category: category.title }
  }
  return undefined
}

