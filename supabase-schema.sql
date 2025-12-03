-- =====================================================
-- ADANA ASANSÖR KİRALAMA - VERİTABANI ŞEMASI
-- Supabase Dashboard > SQL Editor > New Query
-- Yapıştır ve RUN butonuna bas
-- =====================================================

-- 1. SITE AYARLARI
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'Adana Asansör Kiralama',
  logo_url TEXT,
  favicon_url TEXT,
  phone VARCHAR(50) DEFAULT '0 (537) 409 24 06',
  phone_raw VARCHAR(20) DEFAULT '905374092406',
  whatsapp VARCHAR(20) DEFAULT '905374092406',
  email VARCHAR(255),
  address TEXT DEFAULT 'Çukurova / Adana',
  slogan TEXT DEFAULT 'Adana''da Güvenli ve Hızlı Asansörlü Taşımacılık',
  working_hours TEXT DEFAULT '7/24 Hizmetinizdeyiz',
  meta_title TEXT DEFAULT 'Adana Asansör Kiralama | Kiralık Asansör, Ev Taşıma Asansörü',
  meta_description TEXT DEFAULT 'Adana asansör kiralama hizmeti. Ev taşıma asansörü, mobil asansör kiralama, eşya taşıma asansörü.',
  meta_keywords TEXT DEFAULT 'Adana asansör kiralama, kiralık asansör, ev taşıma asansörü',
  og_image TEXT,
  canonical_url VARCHAR(255) DEFAULT 'https://adanaasansorkiralama.com',
  footer_about TEXT DEFAULT 'Adana''da güvenli ve hızlı asansörlü taşımacılık hizmeti.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MENÜLER
CREATE TABLE menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SLIDER
CREATE TABLE sliders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  button1_text VARCHAR(100),
  button1_url VARCHAR(255),
  button2_text VARCHAR(100),
  button2_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ANASAYFA İÇERİKLERİ
CREATE TABLE homepage_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TAB ALANLARI (Anasayfa tabları)
CREATE TABLE tabs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TAB YORUMLARI
CREATE TABLE tab_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id UUID REFERENCES tabs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  comment TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MÜŞTERİ YORUMLARI
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  comment TEXT NOT NULL,
  rating INT DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HİZMETLER
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  content TEXT,
  icon VARCHAR(100),
  image_url TEXT,
  features JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. HİZMET SSS
CREATE TABLE service_faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BLOG YAZILARI
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  category VARCHAR(100),
  read_time VARCHAR(20),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SSS (Sıkça Sorulan Sorular)
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. GALERİ
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. HAKKIMIZDA SAYFASI
CREATE TABLE about_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title VARCHAR(255),
  hero_description TEXT,
  main_title VARCHAR(255),
  main_content TEXT,
  mission_title VARCHAR(255),
  mission_content TEXT,
  vision_title VARCHAR(255),
  vision_content TEXT,
  stats JSONB,
  features JSONB,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. İLETİŞİM MESAJLARI (Gelen Kutusu)
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TEKLİF TALEPLERİ
CREATE TABLE quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  service VARCHAR(255),
  floor_count INT,
  address TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CTA (Call to Action) ALANLARI
CREATE TABLE cta_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  button1_text VARCHAR(100),
  button1_url VARCHAR(255),
  button2_text VARCHAR(100),
  button2_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ADMIN KULLANICILARI
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VARSAYILAN VERİLER
-- =====================================================

-- Site ayarları
INSERT INTO site_settings (id, site_name, phone, phone_raw, whatsapp, address, slogan)
VALUES (gen_random_uuid(), 'Adana Asansör Kiralama', '0 (537) 409 24 06', '905374092406', '905374092406', 'Çukurova / Adana', 'Adana''da Güvenli ve Hızlı Asansörlü Taşımacılık');

-- Menüler
INSERT INTO menus (title, url, parent_id, sort_order) VALUES
('Anasayfa', '/', NULL, 1),
('Hakkımızda', '/hakkimizda', NULL, 2),
('Hizmetler', '/hizmetler', NULL, 3),
('Blog', '/blog', NULL, 4),
('SSS', '/sss', NULL, 5),
('Galeri', '/galeri', NULL, 6),
('İletişim', '/iletisim', NULL, 7);

-- Alt menüler (Hizmetler altına)
INSERT INTO menus (title, url, parent_id, sort_order)
SELECT 'Mobilya Taşıma', '/hizmetler/mobilya-tasima', id, 1 FROM menus WHERE title = 'Hizmetler';
INSERT INTO menus (title, url, parent_id, sort_order)
SELECT 'Moloz Taşıma', '/hizmetler/moloz-tasima', id, 2 FROM menus WHERE title = 'Hizmetler';
INSERT INTO menus (title, url, parent_id, sort_order)
SELECT 'İnşaat Malzemesi Taşıma', '/hizmetler/insaat-malzemesi-tasima', id, 3 FROM menus WHERE title = 'Hizmetler';

-- Slider
INSERT INTO sliders (title, subtitle, description, button1_text, button1_url, button2_text, button2_url, sort_order) VALUES
('Adana Asansör Kiralama', '7/24 Hizmetinizdeyiz', 'Adana''da ev, ofis, inşaat ve mobilya taşımada asansör kiralama hizmeti. Güvenli ve hızlı asansörlü taşımacılık.', 'Hemen Ara', 'tel:+905374092406', 'WhatsApp Teklif Al', 'https://wa.me/905374092406', 1);

-- Anasayfa bölümleri
INSERT INTO homepage_sections (section_key, title, subtitle, content) VALUES
('main_article', 'Adana Asansör Kiralama Hizmeti', NULL, '<p><strong>Adana asansör kiralama</strong> hizmeti, modern taşımacılık sektörünün vazgeçilmez bir parçası haline gelmiştir...</p>'),
('services_section', 'Öne Çıkan Hizmetlerimiz', 'Adana''da her türlü taşıma ihtiyacınız için profesyonel asansör kiralama çözümleri sunuyoruz.', NULL),
('testimonials_section', 'Müşteri Yorumları', 'Müşterilerimizin memnuniyeti bizim için en önemli başarı göstergesidir.', NULL),
('blog_section', 'Blog Yazılarımız', 'Asansör kiralama ve taşımacılık hakkında faydalı bilgiler edinin.', NULL);

-- Tablar
INSERT INTO tabs (title, content, sort_order) VALUES
('Eşya Taşıma Asansörü', 'Eşya taşıma asansörü, özellikle yüksek katlı binalarda taşınma işlemlerini kolaylaştırmak için tasarlanmış özel bir mobil asansör sistemidir.', 1),
('Mobil Asansör', 'Mobil asansör, taşınabilir yapısıyla farklı lokasyonlarda kullanılabilen esnek bir taşıma çözümüdür.', 2),
('Nakliye Asansörü', 'Nakliye asansörü, profesyonel taşımacılık hizmetlerinin vazgeçilmez bir parçasıdır.', 3);

-- Müşteri Yorumları
INSERT INTO testimonials (name, location, comment, rating, is_featured, sort_order) VALUES
('Ahmet Yılmaz', 'Sarıçam / Adana', 'Ev taşımamızda asansör kiralama hizmeti aldık. 8. kata kadar tüm eşyalarımız sorunsuz taşındı.', 5, true, 1),
('Fatma Demir', 'Seyhan / Adana', 'Mobilyalarımız merdivenden geçmiyordu. Asansörlü taşımacılık sayesinde hiçbir çizik olmadan taşındı.', 5, true, 2),
('Mehmet Kara', 'Çukurova / Adana', 'İnşaat malzemelerini 12. kata çıkarmak zorundaydık. Mobil asansör kiralama ile işimizi saatler içinde bitirdik.', 5, true, 3);

-- Hizmetler
INSERT INTO services (title, slug, short_description, icon, is_featured, sort_order, features) VALUES
('Mobilya Taşıma', 'mobilya-tasima', 'Ağır ve büyük mobilyalarınızı asansör yardımıyla güvenle taşıyoruz.', 'cube', true, 1, '["Koltuk takımı", "Yatak odası", "Yemek odası", "Koruyucu ambalaj"]'),
('Moloz Taşıma', 'moloz-tasima', 'İnşaat ve tadilat sonrası oluşan molozları hızlı ve güvenli şekilde tahliye ediyoruz.', 'trash', true, 2, '["Hızlı tahliye", "Temiz çalışma", "Çevre dostu", "Uygun fiyat"]'),
('İnşaat Malzemesi Taşıma', 'insaat-malzemesi-tasima', 'Ağır inşaat malzemelerini yüksek katlara güvenle çıkarıyoruz.', 'building', true, 3, '["Tuğla, çimento", "Seramik, fayans", "Kum, çakıl", "İşçi güvenliği"]');

-- Blog yazıları
INSERT INTO blogs (title, slug, excerpt, category, read_time, is_featured) VALUES
('Asansör Kiralama Kaçıncı Kata Kadar Çıkar?', 'asansor-kiralama-kacinci-kata-kadar-cikar', 'Mobil asansör kiralama hizmetleri ile kaçıncı kata kadar çıkabileceğinizi öğrenin.', 'Rehber', '5 dk', true),
('Ev Taşıma Asansörü ile Taşınmanın Avantajları', 'ev-tasima-asansoru-avantajlari', 'Ev taşıma asansörü kullanarak taşınmanın neden daha güvenli ve ekonomik olduğunu keşfedin.', 'İpuçları', '4 dk', true),
('Adana''da Kiralık Asansör Fiyatlarını Neler Belirler?', 'adana-kiralik-asansor-fiyatlari', 'Adana''da asansör kiralama fiyatlarını etkileyen faktörleri öğrenin.', 'Fiyatlandırma', '6 dk', true);

-- SSS
INSERT INTO faqs (question, answer, sort_order) VALUES
('Asansör kiralama kaçıncı kata kadar yapılabiliyor?', 'Mobil asansör sistemlerimiz genellikle 12-15. kata kadar güvenli bir şekilde hizmet verebilmektedir.', 1),
('Kiralık asansör fiyatları nasıl hesaplanır?', 'Fiyatlar; kat yüksekliği, taşınacak eşya miktarı, lokasyon ve hizmet süresine göre belirlenir.', 2),
('Ev taşıma asansörü için dairede ne hazırlık yapmalıyım?', 'Taşınacak eşyaların pencere yakınına getirilmesi ve bina yönetiminden izin alınması önerilir.', 3),
('Asansörlü nakliye hizmeti sigortalı mı?', 'Evet, tüm taşıma hizmetlerimiz sigorta kapsamındadır.', 4),
('Mobil asansör kiralama için minimum süre var mı?', 'Minimum kiralama süremiz 2-3 saattir.', 5),
('Hangi eşyalar asansörle taşınabilir?', 'Mobilya, beyaz eşya, inşaat malzemeleri ve 500 kg''a kadar her türlü yük taşınabilir.', 6),
('Hava durumu taşımayı etkiler mi?', 'Şiddetli rüzgar ve yağmurda güvenlik nedeniyle operasyon ertelenebilir.', 7),
('Adana''nın hangi ilçelerine hizmet veriyorsunuz?', 'Adana''nın tüm ilçelerine hizmet vermekteyiz.', 8),
('Aynı gün hizmet alabilir miyim?', 'Uygunluk durumuna göre aynı gün hizmet mümkündür.', 9),
('Asansör kurulumu ne kadar sürer?', 'Kurulum genellikle 15-30 dakika sürmektedir.', 10);

-- Galeri
INSERT INTO gallery (title, description, image_url, sort_order) VALUES
('Çukurova 10. Kat Taşımacılık', 'Ev taşıma asansörü ile mobilya taşıma', '/images/gallery/1.jpg', 1),
('Seyhan Apartman Projesi', 'İnşaat malzemesi taşıma', '/images/gallery/2.jpg', 2),
('Yüreğir Villa Taşıması', 'Büyük mobilya ve beyaz eşya taşıma', '/images/gallery/3.jpg', 3);

-- CTA Alanları
INSERT INTO cta_sections (section_key, title, description, button1_text, button1_url, button2_text, button2_url) VALUES
('homepage_cta', 'Hemen Ücretsiz Fiyat Teklifi Alın', 'Adana''da asansör kiralama ihtiyacınız için 7/24 hizmetinizdeyiz.', 'Hemen Ara', 'tel:+905374092406', 'WhatsApp ile Yazın', 'https://wa.me/905374092406'),
('services_cta', 'Hemen Teklif Alın', 'Asansör kiralama hizmetlerimiz hakkında detaylı bilgi ve fiyat teklifi için bize ulaşın.', 'Hemen Ara', 'tel:+905374092406', 'WhatsApp ile Yazın', 'https://wa.me/905374092406');

-- Hakkımızda sayfası
INSERT INTO about_page (hero_title, hero_description, main_title, main_content, mission_title, mission_content, vision_title, vision_content) VALUES
('Hakkımızda', 'Adana''da güvenilir asansör kiralama hizmeti. Yılların deneyimi ve profesyonel ekibimizle yanınızdayız.', 
'Adana''nın Güvenilir Asansör Kiralama Firması', 
'Adana Asansör Kiralama olarak, 15 yılı aşkın süredir Adana ve çevresinde profesyonel asansörlü taşımacılık hizmeti sunmaktayız.',
'Misyonumuz', 'Adana ve çevresinde en güvenilir, en hızlı ve en ekonomik asansör kiralama hizmetini sunmak.',
'Vizyonumuz', 'Türkiye genelinde asansörlü taşımacılık sektörünün lider markası olmak.');

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Güvenlik
-- =====================================================

-- RLS'i etkinleştir
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tab_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilsin (public read)
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read" ON menus FOR SELECT USING (true);
CREATE POLICY "Public read" ON sliders FOR SELECT USING (true);
CREATE POLICY "Public read" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Public read" ON tabs FOR SELECT USING (true);
CREATE POLICY "Public read" ON tab_testimonials FOR SELECT USING (true);
CREATE POLICY "Public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read" ON services FOR SELECT USING (true);
CREATE POLICY "Public read" ON service_faqs FOR SELECT USING (true);
CREATE POLICY "Public read" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read" ON about_page FOR SELECT USING (true);
CREATE POLICY "Public read" ON cta_sections FOR SELECT USING (true);

-- Contact ve Quote için INSERT izni (ziyaretçiler form gönderebilsin)
CREATE POLICY "Public insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON quote_requests FOR INSERT WITH CHECK (true);

-- Authenticated kullanıcılar her şeyi yapabilsin (admin panel için)
CREATE POLICY "Auth full access" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON menus FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON sliders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON homepage_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON tabs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON tab_testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON service_faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON about_page FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON quote_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON cta_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE BUCKET (Resim yükleme için)
-- =====================================================

-- Bu kısmı Supabase Dashboard > Storage > New Bucket ile yap
-- Bucket adı: images
-- Public bucket: EVET

-- =====================================================
-- TAMAMLANDI!
-- =====================================================

-- =====================================================
-- SAYFA AYARLARI (Hero bölümleri için)
-- =====================================================
CREATE TABLE IF NOT EXISTS page_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key VARCHAR(50) UNIQUE NOT NULL,
  page_name VARCHAR(100) NOT NULL,
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  hero_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read page_settings" ON page_settings FOR SELECT USING (true);
CREATE POLICY "Auth full access page_settings" ON page_settings FOR ALL USING (auth.role() = 'authenticated');

-- Varsayılan sayfalar
INSERT INTO page_settings (page_key, page_name, hero_title, hero_subtitle) VALUES
('hizmetler', 'Hizmetler', 'Hizmetlerimiz', 'Adana ve çevresinde profesyonel asansör kiralama hizmetleri sunuyoruz'),
('blog', 'Blog', 'Blog', 'Asansör kiralama ve yapı sektörü hakkında faydalı bilgiler'),
('galeri', 'Galeri', 'Galeri', 'Tamamladığımız projelerden kareler'),
('sss', 'SSS', 'Sıkça Sorulan Sorular', 'Merak ettiğiniz tüm sorulara yanıtlar'),
('iletisim', 'İletişim', 'İletişim', 'Bizimle iletişime geçin')
ON CONFLICT (page_key) DO NOTHING;
