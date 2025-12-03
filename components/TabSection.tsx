'use client'

import { useState } from 'react'

const tabs = [
  {
    id: 'esya-tasima',
    title: 'Eşya Taşıma Asansörü',
    content: `Eşya taşıma asansörü, özellikle yüksek katlı binalarda taşınma işlemlerini kolaylaştırmak için tasarlanmış özel bir mobil asansör sistemidir. Bu sistem sayesinde ağır ve hacimli eşyalarınız, merdiven kullanılmadan doğrudan pencere veya balkondan güvenle taşınır. Koltuk takımları, yatak odası mobilyaları, buzdolabı, çamaşır makinesi ve diğer büyük ev eşyaları için ideal bir çözümdür. Eşya taşıma asansörü ile taşınma süresi kısalır, eşya hasarı riski minimuma iner ve işçilik maliyetleri düşer.`,
    testimonials: [
      {
        name: 'Ayşe Korkmaz',
        location: 'Yüreğir / Adana',
        text: '7. kata taşınırken eşya taşıma asansörü kullandık. Tüm mobilyalarımız çizilmeden, kırılmadan taşındı. Kesinlikle tavsiye ederim!',
      },
      {
        name: 'Ali Çelik',
        location: 'Seyhan / Adana',
        text: 'Büyük bir koltuk takımımız vardı ve merdivenden kesinlikle geçmiyordu. Asansör sayesinde dakikalar içinde yukarı çıktı.',
      },
    ],
  },
  {
    id: 'mobil-asansor',
    title: 'Mobil Asansör',
    content: `Mobil asansör, taşınabilir yapısıyla farklı lokasyonlarda kullanılabilen esnek bir taşıma çözümüdür. Özellikle Adana'da yapı sektöründe ve evden eve nakliyat işlemlerinde yaygın olarak tercih edilmektedir. Mobil asansör kiralama hizmeti, hem bireysel kullanıcılar hem de inşaat firmaları için ekonomik bir seçenek sunar. Yüksek taşıma kapasitesi, güvenlik sistemleri ve kolay kurulum özellikleriyle öne çıkan mobil asansörler, 12-15. kata kadar hizmet verebilmektedir.`,
    testimonials: [
      {
        name: 'Mustafa Öztürk',
        location: 'Çukurova / Adana',
        text: 'İnşaat malzemelerini 10. kata çıkarmak için mobil asansör kiraladık. İşimizi yarı yarıya azalttı, harika bir hizmet!',
      },
      {
        name: 'Zeynep Arslan',
        location: 'Sarıçam / Adana',
        text: 'Ofis taşıması için mobil asansör kullandık. Bilgisayarlar, dosya dolapları her şey güvenle taşındı.',
      },
    ],
  },
  {
    id: 'nakliye-asansoru',
    title: 'Nakliye Asansörü',
    content: `Nakliye asansörü, profesyonel taşımacılık hizmetlerinin vazgeçilmez bir parçasıdır. Evden eve nakliyat, ofis taşıma ve depo taşımacılığında kullanılan bu sistem, geleneksel taşıma yöntemlerine göre çok daha hızlı ve güvenlidir. Nakliye asansörü ile yapılan taşımalarda eşya hasarı riski minimum seviyeye iner, taşıma süresi kısalır ve genel maliyetler düşer. Adana'da nakliye asansörü kiralama hizmeti veren firmamız, deneyimli operatörleri ve modern ekipmanlarıyla kaliteli hizmet sunmaktadır.`,
    testimonials: [
      {
        name: 'Hakan Yıldız',
        location: 'Kozan / Adana',
        text: 'Depo taşımamızda nakliye asansörü kullandık. Onlarca koli ve ağır malzeme saatler içinde taşındı. Çok memnunuz.',
      },
      {
        name: 'Elif Şahin',
        location: 'Ceyhan / Adana',
        text: 'Evden eve nakliyatta asansör kullanmak büyük kolaylık sağladı. Eşyalarımız sapasağlam geldi.',
      },
    ],
  },
]

const TabSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Hizmet Detayları</h2>
          <p className="section-subtitle">Asansör kiralama hizmetlerimiz hakkında detaylı bilgi alın.</p>
        </div>

        {/* Tab Headers */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-primary-800 mb-4">{currentTab.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-8">{currentTab.content}</p>

            {/* Testimonials within Tab */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-lg font-semibold text-primary-700 mb-4">Müşteri Deneyimleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTab.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 italic mb-3">"{testimonial.text}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-secondary-400 rounded-full flex items-center justify-center">
                        <span className="text-primary-900 font-bold text-sm">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-primary-800 text-sm block">{testimonial.name}</span>
                        <span className="text-xs text-gray-500">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TabSection
