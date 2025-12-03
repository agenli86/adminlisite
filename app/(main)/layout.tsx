import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import AnnouncementBar from '@/components/AnnouncementBar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      {/* CTA ve Footer arası boşluk + Duyuru bandı */}
      <div className="mt-8">
        <AnnouncementBar />
      </div>
      <Footer />
      <FloatingButtons />
    </>
  )
}
