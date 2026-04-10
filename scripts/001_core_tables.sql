-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  industry TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'Admin',
  status TEXT DEFAULT 'active',
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  language TEXT DEFAULT 'en',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  icon TEXT,
  pricing_basic DECIMAL(10,2),
  pricing_pro DECIMAL(10,2),
  pricing_enterprise DECIMAL(10,2),
  features TEXT[],
  active BOOLEAN DEFAULT TRUE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  industry TEXT,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in-progress',
  priority TEXT DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  deadline DATE,
  budget DECIMAL(15,2) DEFAULT 0,
  spent DECIMAL(15,2) DEFAULT 0,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  thumbnail TEXT,
  category TEXT,
  technologies TEXT[],
  live_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  status TEXT DEFAULT 'draft',
  category TEXT,
  tags TEXT[],
  content TEXT,
  excerpt TEXT,
  thumbnail TEXT,
  meta_title TEXT,
  meta_description TEXT,
  read_time INTEGER DEFAULT 5,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  description TEXT,
  features TEXT[],
  highlighted BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  items JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  sender_name TEXT,
  sender_email TEXT,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site config table
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, key)
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "services_public_read" ON services FOR SELECT USING (active = TRUE);
CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (active = TRUE);
CREATE POLICY "pricing_plans_public_read" ON pricing_plans FOR SELECT USING (active = TRUE);
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (featured = TRUE);
CREATE POLICY "site_config_public_read" ON site_config FOR SELECT USING (TRUE);

-- Authenticated user policies
CREATE POLICY "companies_auth_all" ON companies FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "profiles_auth_select" ON profiles FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "profiles_auth_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "services_auth_all" ON services FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "clients_auth_all" ON clients FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "projects_auth_all" ON projects FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "blog_posts_auth_all" ON blog_posts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "testimonials_auth_all" ON testimonials FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "pricing_plans_auth_all" ON pricing_plans FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "invoices_auth_all" ON invoices FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "leads_auth_all" ON leads FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "tickets_auth_all" ON tickets FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "chat_messages_auth_all" ON chat_messages FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "site_config_auth_all" ON site_config FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "contact_auth_all" ON contact_submissions FOR ALL TO authenticated USING (TRUE);

-- Public insert for contact and chat
CREATE POLICY "contact_public_insert" ON contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "chat_public_insert" ON chat_messages FOR INSERT WITH CHECK (TRUE);

-- Profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    'Admin'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
