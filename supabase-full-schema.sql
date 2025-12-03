-- =====================================================
-- ADANA ASANSÖR KİRALAMA - TAM VERİTABANI ŞEMASI
-- Supabase Dashboard > SQL Editor > New Query
-- Tamamını yapıştır ve RUN butonuna bas
-- =====================================================

-- =====================================================
-- 1. SITE AYARLARI
-- =====================================================
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  site_name character varying(255) DEFAULT 'Adana Asansör Kiralama',
  logo_url text,
  favicon_url text,
  phone character varying(50) DEFAULT '0 (537) 409 24 06',
  phone_raw character varying(20) DEFAULT '905374092406',
  whatsapp character varying(20) DEFAULT '905374092406',
  email character varying(255),
  address text DEFAULT 'Çukurova / Adana',
  slogan text DEFAULT 'Adana''da Güvenli ve Hızlı Asansörlü Taşımacılık',
  working_hours text DEFAULT '7/24 Hizmetinizdeyiz',
  meta_title text DEFAULT 'Adana Asansör Kiralama | Kiralık Asansör, Ev Taşıma Asansörü',
  meta_description text DEFAULT 'Adana asansör kiralama hizmeti. Ev taşıma asansörü, mobil asansör kiralama, eşya taşıma asansörü.',
  meta_keywords text DEFAULT 'Adana asansör kiralama, kiralık asansör, ev taşıma asansörü',
  og_image text,
  canonical_url character varying(255) DEFAULT 'https://adanaasansorkiralama.com',
  footer_about text DEFAULT 'Adana''da güvenli ve hızlı asansörlü taşımacılık hizmeti.',
  footer_copyright text,
  social_facebook character varying(255),
  social_instagram character varying(255),
  social_twitter character varying(255),
  social_youtube character varying(255),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 2. SAYFA AYARLARI (Hero bölümleri için) - YENİ
-- =====================================================
CREATE TABLE public.page_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_key character varying(50) NOT NULL UNIQUE,
  page_name character varying(100) NOT NULL,
  hero_title character varying(255),
  hero_subtitle text,
  hero_image text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT page_settings_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 3. MENÜLER
-- =====================================================
CREATE TABLE public.menus (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  url character varying(255) NOT NULL,
  parent_id uuid,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT menus_pkey PRIMARY KEY (id),
  CONSTRAINT menus_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.menus(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. SLIDER
-- =====================================================
CREATE TABLE public.sliders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  subtitle text,
  description text,
  image_url text,
  button1_text character varying(100),
  button1_url character varying(255),
  button2_text character varying(100),
  button2_url character varying(255),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sliders_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 5. HİZMETLER
-- =====================================================
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  slug character varying(255) NOT NULL UNIQUE,
  short_description text,
  content text,
  icon character varying(100),
  image_url text,
  features jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  meta_keywords text,
  og_image text,
  canonical_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 6. HİZMET SSS
-- =====================================================
CREATE TABLE public.service_faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_faqs_pkey PRIMARY KEY (id),
  CONSTRAINT service_faqs_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE
);

-- =====================================================
-- 7. BLOG
-- =====================================================
CREATE TABLE public.blogs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  slug character varying(255) NOT NULL UNIQUE,
  excerpt text,
  content text,
  image_url text,
  category character varying(100),
  read_time character varying(50),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  meta_keywords text,
  og_image text,
  canonical_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blogs_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 8. SSS (Genel)
-- =====================================================
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 9. GALERİ
-- =====================================================
CREATE TABLE public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  description text,
  image_url text NOT NULL,
  category character varying(100),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 10. MÜŞTERİ YORUMLARI
-- =====================================================
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  location character varying(255),
  comment text NOT NULL,
  rating integer DEFAULT 5,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 11. TABLAR (Anasayfa)
-- =====================================================
CREATE TABLE public.tabs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  content text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tabs_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 12. TAB YORUMLARI
-- =====================================================
CREATE TABLE public.tab_testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tab_id uuid,
  name character varying(255) NOT NULL,
  location character varying(255),
  comment text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tab_testimonials_pkey PRIMARY KEY (id),
  CONSTRAINT tab_testimonials_tab_id_fkey FOREIGN KEY (tab_id) REFERENCES public.tabs(id) ON DELETE CASCADE
);

-- =====================================================
-- 13. ANASAYFA BÖLÜMLERİ
-- =====================================================
CREATE TABLE public.homepage_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_key character varying(100) NOT NULL UNIQUE,
  title text,
  subtitle text,
  content text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT homepage_sections_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 14. CTA BÖLÜMLERİ
-- =====================================================
CREATE TABLE public.cta_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_key character varying(100) NOT NULL UNIQUE,
  title text,
  description text,
  button1_text character varying(100),
  button1_url character varying(255),
  button2_text character varying(100),
  button2_url character varying(255),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cta_sections_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 15. HAKKIMIZDA SAYFASI
-- =====================================================
CREATE TABLE public.about_page (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  hero_title character varying(255),
  hero_description text,
  main_title character varying(255),
  main_content text,
  mission_title character varying(255),
  mission_content text,
  vision_title character varying(255),
  vision_content text,
  stats jsonb,
  features jsonb,
  meta_title text,
  meta_description text,
  og_image text,
  canonical_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT about_page_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 16. İLETİŞİM MESAJLARI
-- =====================================================
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  phone character varying(50) NOT NULL,
  email character varying(255),
  subject character varying(255),
  message text NOT NULL,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 17. TEKLİF TALEPLERİ
-- =====================================================
CREATE TABLE public.quote_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  phone character varying(50) NOT NULL,
  email character varying(255),
  service character varying(255),
  floor_count integer,
  address text,
  message text,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quote_requests_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 18. ADMIN KULLANICILARI
-- =====================================================
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying(255) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name character varying(255),
  role character varying(50) DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);

-- =====================================================
-- 19. DUYURULAR (Kayan Yazı)
-- =====================================================
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  text text NOT NULL,
  link character varying(255),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- =====================================================

-- Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Auth full access site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Page Settings
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read page_settings" ON public.page_settings FOR SELECT USING (true);
CREATE POLICY "Auth full access page_settings" ON public.page_settings FOR ALL USING (auth.role() = 'authenticated');

-- Menus
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Auth full access menus" ON public.menus FOR ALL USING (auth.role() = 'authenticated');

-- Sliders
ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sliders" ON public.sliders FOR SELECT USING (true);
CREATE POLICY "Auth full access sliders" ON public.sliders FOR ALL USING (auth.role() = 'authenticated');

-- Services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Auth full access services" ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- Service FAQs
ALTER TABLE public.service_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read service_faqs" ON public.service_faqs FOR SELECT USING (true);
CREATE POLICY "Auth full access service_faqs" ON public.service_faqs FOR ALL USING (auth.role() = 'authenticated');

-- Blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Auth full access blogs" ON public.blogs FOR ALL USING (auth.role() = 'authenticated');

-- FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Auth full access faqs" ON public.faqs FOR ALL USING (auth.role() = 'authenticated');

-- Gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Auth full access gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Auth full access testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Tabs
ALTER TABLE public.tabs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tabs" ON public.tabs FOR SELECT USING (true);
CREATE POLICY "Auth full access tabs" ON public.tabs FOR ALL USING (auth.role() = 'authenticated');

-- Tab Testimonials
ALTER TABLE public.tab_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tab_testimonials" ON public.tab_testimonials FOR SELECT USING (true);
CREATE POLICY "Auth full access tab_testimonials" ON public.tab_testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Homepage Sections
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read homepage_sections" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "Auth full access homepage_sections" ON public.homepage_sections FOR ALL USING (auth.role() = 'authenticated');

-- CTA Sections
ALTER TABLE public.cta_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cta_sections" ON public.cta_sections FOR SELECT USING (true);
CREATE POLICY "Auth full access cta_sections" ON public.cta_sections FOR ALL USING (auth.role() = 'authenticated');

-- About Page
ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read about_page" ON public.about_page FOR SELECT USING (true);
CREATE POLICY "Auth full access about_page" ON public.about_page FOR ALL USING (auth.role() = 'authenticated');

-- Contact Messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read contact_messages" ON public.contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete contact_messages" ON public.contact_messages FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update contact_messages" ON public.contact_messages FOR UPDATE USING (auth.role() = 'authenticated');

-- Quote Requests
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert quote" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read quote_requests" ON public.quote_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete quote_requests" ON public.quote_requests FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update quote_requests" ON public.quote_requests FOR UPDATE USING (auth.role() = 'authenticated');

-- Admin Users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth full access admin_users" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Auth full access announcements" ON public.announcements FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- VARSAYILAN VERİLER
-- =====================================================

-- Site Ayarları
INSERT INTO public.site_settings (site_name, phone, phone_raw, whatsapp, address) VALUES
('Adana Asansör Kiralama', '0 (537) 409 24 06', '905374092406', '905374092406', 'Çukurova / Adana');

-- Sayfa Ayarları
INSERT INTO public.page_settings (page_key, page_name, hero_title, hero_subtitle) VALUES
('hizmetler', 'Hizmetler', 'Hizmetlerimiz', 'Adana ve çevresinde profesyonel asansör kiralama hizmetleri sunuyoruz'),
('blog', 'Blog', 'Blog', 'Asansör kiralama ve yapı sektörü hakkında faydalı bilgiler'),
('galeri', 'Galeri', 'Galeri', 'Tamamladığımız projelerden kareler'),
('sss', 'SSS', 'Sıkça Sorulan Sorular', 'Merak ettiğiniz tüm sorulara yanıtlar'),
('iletisim', 'İletişim', 'İletişim', 'Bizimle iletişime geçin');

-- Anasayfa Bölümleri
INSERT INTO public.homepage_sections (section_key, title, subtitle, content) VALUES
('main_article', 'Adana Asansör Kiralama Hizmeti', NULL, '<p>Adana asansör kiralama hizmetimiz ile eşyalarınızı güvenle taşıyoruz. Yüksek katlı binalarda taşınma işlemlerinde asansörlü taşıma sistemi kullanarak hem zamandan hem de maliyetten tasarruf etmenizi sağlıyoruz.</p><p>Profesyonel ekibimiz ve modern ekipmanlarımız ile 7/24 hizmetinizdeyiz. Ücretsiz keşif ve fiyat teklifi için hemen arayın.</p>'),
('services_section', 'Öne Çıkan Hizmetlerimiz', 'Profesyonel asansör kiralama çözümleri', NULL),
('testimonials_section', 'Müşteri Yorumları', 'Müşterilerimizin memnuniyeti bizim için önemli', NULL),
('blog_section', 'Blog Yazılarımız', 'Sektörden haberler ve faydalı bilgiler', NULL);

-- CTA Bölümü
INSERT INTO public.cta_sections (section_key, title, description, button1_text, button1_url, button2_text, button2_url) VALUES
('homepage_cta', 'Hemen Ücretsiz Fiyat Teklifi Alın', 'Adana''da asansör kiralama ihtiyacınız için 7/24 hizmetinizdeyiz. Profesyonel ekibimiz sizin için hazır.', 'Hemen Ara', 'tel:+905374092406', 'WhatsApp ile Yazın', 'https://wa.me/905374092406');

-- Hakkımızda Sayfası
INSERT INTO public.about_page (hero_title, hero_description, main_title, main_content) VALUES
('Hakkımızda Bilgiler', 'Adana''da güvenilir asansör kiralama hizmeti. Yılların deneyimi ve profesyonel ekibimizle yanınızdayız.', 
'Adana''nın Güvenilir Asansör Kiralama Firması', 
'Adana Asansör Kiralama olarak, 15 yılı aşkın süredir Adana ve çevresinde profesyonel asansörlü taşımacılık hizmeti sunmaktayız.');

-- Örnek Slider
INSERT INTO public.sliders (title, subtitle, description, button1_text, button1_url, button2_text, button2_url, sort_order) VALUES
('Adana Asansör Kiralama', 'Güvenli ve Hızlı Taşımacılık', 'Profesyonel ekibimiz ve modern ekipmanlarımızla hizmetinizdeyiz.', 'Hemen Ara', 'tel:+905374092406', 'Teklif Al', '/iletisim', 1);

-- Örnek Menüler
INSERT INTO public.menus (title, url, sort_order) VALUES
('Anasayfa', '/', 1),
('Hakkımızda', '/hakkimizda', 2),
('Hizmetler', '/hizmetler', 3),
('Blog', '/blog', 4),
('SSS', '/sss', 5),
('Galeri', '/galeri', 6),
('İletişim', '/iletisim', 7);

-- Örnek SSS
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Asansör kiralama fiyatları nasıl belirlenir?', 'Fiyatlar kat sayısı, taşınacak eşya miktarı ve mesafeye göre belirlenir. Ücretsiz keşif sonrası net fiyat verilir.', 1),
('Hangi bölgelere hizmet veriyorsunuz?', 'Adana merkez ve tüm ilçelerine (Çukurova, Seyhan, Yüreğir, Sarıçam, Ceyhan, Kozan vb.) hizmet vermekteyiz.', 2),
('Asansör kapasitesi ne kadar?', 'Asansörlerimiz 400-800 kg arası yük kapasitesine sahiptir. Ağır eşyalar için uygun ekipman mevcuttur.', 3);

-- Örnek Yorum
INSERT INTO public.testimonials (name, location, comment, rating, is_featured, sort_order) VALUES
('Ahmet Yılmaz', 'Çukurova, Adana', 'Çok profesyonel ve hızlı bir hizmet aldık. Eşyalarımız güvenle taşındı. Teşekkürler!', 5, true, 1),
('Fatma Demir', 'Seyhan, Adana', '10. kata taşınmamıza rağmen asansör sayesinde çok kolay oldu. Fiyatlar da gayet uygun.', 5, true, 2);

-- Örnek Duyurular
INSERT INTO public.announcements (text, link, sort_order) VALUES
('🎉 Yeni müşterilerimize özel %10 indirim fırsatı!', '/iletisim', 1),
('📞 7/24 Hizmetinizdeyiz - Hemen Arayın: 0537 409 24 06', 'tel:+905374092406', 2),
('🚀 Adana ve çevresine aynı gün teslimat', '/hizmetler', 3);

-- =====================================================
-- TAMAMLANDI!
-- =====================================================
