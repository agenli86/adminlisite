export interface SiteSettings {
  id: string
  site_name: string
  logo_url: string | null
  favicon_url: string | null
  phone: string
  phone_raw: string
  whatsapp: string
  email: string | null
  address: string
  slogan: string
  working_hours: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  og_image: string | null
  canonical_url: string
  footer_about: string | null
  created_at: string
  updated_at: string
}

export interface Menu {
  id: string
  title: string
  url: string
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  children?: Menu[]
}

export interface Slider {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image_url: string | null
  button1_text: string | null
  button1_url: string | null
  button2_text: string | null
  button2_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HomepageSection {
  id: string
  section_key: string
  title: string | null
  subtitle: string | null
  content: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Tab {
  id: string
  title: string
  content: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  testimonials?: TabTestimonial[]
}

export interface TabTestimonial {
  id: string
  tab_id: string
  name: string
  location: string | null
  comment: string
  sort_order: number
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  location: string | null
  comment: string
  rating: number
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  slug: string
  short_description: string | null
  content: string | null
  icon: string | null
  image_url: string | null
  features: string[] | null
  is_featured: boolean
  is_active: boolean
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  og_image: string | null
  canonical_url: string | null
  created_at: string
  updated_at: string
  faqs?: ServiceFaq[]
}

export interface ServiceFaq {
  id: string
  service_id: string
  question: string
  answer: string
  sort_order: number
  created_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  image_url: string | null
  category: string | null
  read_time: string | null
  is_featured: boolean
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  og_image: string | null
  canonical_url: string | null
  created_at: string
  updated_at: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AboutPage {
  id: string
  hero_title: string | null
  hero_description: string | null
  main_title: string | null
  main_content: string | null
  mission_title: string | null
  mission_content: string | null
  vision_title: string | null
  vision_content: string | null
  stats: any | null
  features: any | null
  meta_title: string | null
  meta_description: string | null
  og_image: string | null
  canonical_url: string | null
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  subject: string | null
  message: string
  is_read: boolean
  is_starred: boolean
  created_at: string
}

export interface QuoteRequest {
  id: string
  name: string
  phone: string
  email: string | null
  service: string | null
  floor_count: number | null
  address: string | null
  message: string | null
  is_read: boolean
  is_starred: boolean
  created_at: string
}

export interface CtaSection {
  id: string
  section_key: string
  title: string | null
  description: string | null
  button1_text: string | null
  button1_url: string | null
  button2_text: string | null
  button2_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
