-- =====================================================
-- ADANA ASANSÖR KİRALAMA - KOMPLE VERİTABANI
-- Supabase Dashboard > SQL Editor > New Query
-- Tamamını yapıştır ve RUN butonuna bas
-- =====================================================

-- =====================================================
-- 1. TABLOLAR
-- =====================================================

-- Site Ayarları
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  site_name character varying(255) DEFAULT 'Site Adı',
  slogan text,
  logo_url text,
  favicon_url text,
  footer_logo_url text,
  phone character varying(50),
  phone_raw character varying(20),
  whatsapp character varying(20),
  email character varying(255),
  address text,
  working_hours text,
  meta_title text,
  meta_description text,
  meta_keywords text,
  og_image text,
  canonical_url character varying(255),
  footer_about text,
  footer_copyright text,
  social_facebook character varying(255),
  social_instagram character varying(255),
  social_twitter character varying(255),
  social_youtube character varying(255),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

-- Sayfa Ayarları
CREATE TABLE IF NOT EXISTS public.page_settings (
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

-- Menüler
CREATE TABLE IF NOT EXISTS public.menus (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  url character varying(255) NOT NULL,
  parent_id uuid,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT menus_pkey PRIMARY KEY (id)
);

-- Slider
CREATE TABLE IF NOT EXISTS public.sliders (
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

-- Hizmetler
CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  slug character varying(255) NOT NULL UNIQUE,
  short_description text,
  content text,
  icon character varying(100),
  image_url text,
  features jsonb,
  meta_title text,
  meta_description text,
  meta_keywords text,
  og_image text,
  canonical_url character varying(255),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- Hizmet SSS
CREATE TABLE IF NOT EXISTS public.service_faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_faqs_pkey PRIMARY KEY (id)
);

-- Blog
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  slug character varying(255) NOT NULL UNIQUE,
  excerpt text,
  content text,
  image_url text,
  category character varying(100),
  tags text[],
  read_time character varying(50),
  meta_title text,
  meta_description text,
  og_image text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blogs_pkey PRIMARY KEY (id)
);

-- Galeri
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255),
  image_url text NOT NULL,
  category character varying(100),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
);

-- SSS
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category character varying(100),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);

-- Müşteri Yorumları
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  location character varying(255),
  comment text NOT NULL,
  rating integer DEFAULT 5,
  image_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- Anasayfa Bölümleri
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_key character varying(50) NOT NULL UNIQUE,
  title character varying(255),
  subtitle text,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT homepage_sections_pkey PRIMARY KEY (id)
);

-- CTA Bölümleri
CREATE TABLE IF NOT EXISTS public.cta_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_key character varying(50) NOT NULL UNIQUE,
  title character varying(255),
  description text,
  button1_text character varying(100),
  button1_url character varying(255),
  button2_text character varying(100),
  button2_url character varying(255),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cta_sections_pkey PRIMARY KEY (id)
);

-- Hakkımızda
CREATE TABLE IF NOT EXISTS public.about_page (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  hero_title character varying(255),
  hero_subtitle text,
  hero_image text,
  content text,
  mission text,
  vision text,
  values_list jsonb,
  team_members jsonb,
  stats jsonb,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT about_page_pkey PRIMARY KEY (id)
);

-- Tablar
CREATE TABLE IF NOT EXISTS public.tabs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying(255) NOT NULL,
  icon character varying(100),
  content text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tabs_pkey PRIMARY KEY (id)
);

-- Tab Yorumları
CREATE TABLE IF NOT EXISTS public.tab_testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tab_id uuid,
  name character varying(255) NOT NULL,
  comment text NOT NULL,
  rating integer DEFAULT 5,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tab_testimonials_pkey PRIMARY KEY (id)
);

-- İletişim Mesajları
CREATE TABLE IF NOT EXISTS public.contact_messages (
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

-- Teklif Talepleri
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  phone character varying(50) NOT NULL,
  email character varying(255),
  service character varying(255),
  floor_count integer,
  address text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quote_requests_pkey PRIMARY KEY (id)
);

-- Admin Kullanıcıları
CREATE TABLE IF NOT EXISTS public.admin_users (
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

-- Duyurular
CREATE TABLE IF NOT EXISTS public.announcements (
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
-- 2. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tab_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. POLİTİKALAR (Herkese tam erişim - basit)
-- =====================================================

CREATE POLICY "full_access" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.page_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.menus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.sliders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.service_faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.blogs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.homepage_sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.cta_sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.about_page FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.tabs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.tab_testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.quote_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 4. STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =====================================================
-- 5. VARSAYILAN VERİLER
-- =====================================================

-- Site ayarları
INSERT INTO public.site_settings (
  site_name, slogan, phone, phone_raw, whatsapp, address, working_hours,
  meta_title, meta_description, footer_about, footer_copyright
) VALUES (
  'Adana Asansör Kiralama',
  'Güvenli ve Hızlı Asansörlü Taşımacılık',
  '0 (537) 409 24 06',
  '905374092406',
  '905374092406',
  'Çukurova / Adana',
  '7/24 Hizmetinizdeyiz',
  'Adana Asansör Kiralama',
  'Adana asansör kiralama hizmeti.',
  'Profesyonel asansör kiralama hizmeti.',
  '© 2024 Tüm hakları saklıdır.'
);

-- Sayfa ayarları
INSERT INTO public.page_settings (page_key, page_name, hero_title, hero_subtitle) VALUES
('hizmetler', 'Hizmetler', 'Hizmetlerimiz', 'Profesyonel çözümler'),
('blog', 'Blog', 'Blog', 'Faydalı bilgiler'),
('galeri', 'Galeri', 'Galeri', 'Çalışmalarımız'),
('sss', 'SSS', 'Sıkça Sorulan Sorular', 'Merak edilenler'),
('iletisim', 'İletişim', 'İletişim', 'Bize ulaşın');

-- Menüler
INSERT INTO public.menus (title, url, sort_order) VALUES
('Anasayfa', '/', 1),
('Hakkımızda', '/hakkimizda', 2),
('Hizmetler', '/hizmetler', 3),
('Blog', '/blog', 4),
('SSS', '/sss', 5),
('Galeri', '/galeri', 6),
('İletişim', '/iletisim', 7);

-- Slider
INSERT INTO public.sliders (title, subtitle, description, button1_text, button1_url, button2_text, button2_url, sort_order) VALUES
('Adana Asansör Kiralama', 'Profesyonel Hizmet', 'Güvenli taşımacılık.', 'Hemen Ara', 'tel:+905374092406', 'WhatsApp', 'https://wa.me/905374092406', 1);

-- Anasayfa bölümleri
INSERT INTO public.homepage_sections (section_key, title, subtitle, content) VALUES
('main_article', 'Adana Asansör Kiralama Hizmeti', NULL, '<p>Profesyonel asansör kiralama hizmeti.</p>'),
('services_section', 'Hizmetlerimiz', 'Profesyonel çözümler', NULL),
('testimonials_section', 'Müşteri Yorumları', 'Memnuniyet önemli', NULL),
('blog_section', 'Blog', 'Faydalı bilgiler', NULL);

-- CTA
INSERT INTO public.cta_sections (section_key, title, description, button1_text, button1_url, button2_text, button2_url) VALUES
('homepage_cta', 'Hemen Teklif Alın', '7/24 hizmetinizdeyiz.', 'Hemen Ara', 'tel:+905374092406', 'WhatsApp', 'https://wa.me/905374092406');

-- Hakkımızda
INSERT INTO public.about_page (hero_title, hero_subtitle, content, mission, vision) VALUES
('Hakkımızda', 'Bizi tanıyın', '<p>Profesyonel hizmet.</p>', 'En iyi hizmet.', 'Sektör lideri.');

-- Örnek SSS
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Fiyatlar ne kadar?', 'Projeye göre değişir.', 1);

-- Örnek yorum
INSERT INTO public.testimonials (name, location, comment, rating, is_featured, sort_order) VALUES
('Ahmet Y.', 'Adana', 'Çok memnun kaldık!', 5, true, 1);

-- Duyurular
INSERT INTO public.announcements (text, link, sort_order, is_active) VALUES
('🎉 Yeni müşterilere %10 indirim!', '/iletisim', 1, true),
('📞 7/24 Hizmet: 0537 409 24 06', 'tel:+905374092406', 2, true);

-- =====================================================
-- TAMAMLANDI!
-- =====================================================
