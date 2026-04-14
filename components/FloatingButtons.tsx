import { siteConfig } from '@/lib/site-data'

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a href={`https://wa.me/${siteConfig.whatsapp}`} className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">W</a>
      <a href={`tel:+${siteConfig.phoneRaw}`} className="w-12 h-12 rounded-full bg-secondary-400 text-primary-900 flex items-center justify-center">☎</a>
    </div>
  )
}
