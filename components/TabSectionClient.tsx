'use client'

import { useState } from 'react'

interface Tab {
  id: string
  title: string
  content: string
}

interface TabTestimonial {
  id: string
  tab_id: string
  name: string
  location: string
  comment: string
}

export default function TabSectionClient({ tabs, tabTestimonials }: { tabs: Tab[], tabTestimonials: TabTestimonial[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')

  const activeTabData = tabs.find(t => t.id === activeTab)
  const activeTestimonials = tabTestimonials.filter(t => t.tab_id === activeTab)

  if (tabs.length === 0) return null

  return (
    <section className="py-16 bg-primary-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary-100'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTabData && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-gray-700 text-lg mb-6">{activeTabData.content}</p>
              
              {/* Tab Testimonials */}
              {activeTestimonials.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">Müşteri Deneyimleri</h4>
                  <div className="space-y-4">
                    {activeTestimonials.map((testimonial) => (
                      <div key={testimonial.id} className="flex gap-4 items-start">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-semibold">{testimonial.name}</span> - {testimonial.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
