-- AM Enterprises Full Database Schema
-- This script creates all tables needed for the 22-module admin panel + public site

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- COMPANIES TABLE (Multi-company support)
-- ===========================================
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

-- ===========================================
-- PROFILES TABLE (User profiles linked to auth.users)
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'Client' CHECK (role IN ('Admin', 'Manager', 'Dev', 'Client')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  language TEXT DEFAULT 'en',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SITE CONFIG (Dynamic homepage content)
-- ===========================================
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, key)
);

-- ===========================================
-- CLIENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'overdue')),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  industry TEXT,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PROJECTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
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

-- ===========================================
-- PROJECT TASKS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SERVICES TABLE
-- ===========================================
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

-- ===========================================
-- INVOICES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('paid', 'pending', 'overdue', 'draft')),
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  items JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- LEADS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  source TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TICKETS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TICKET MESSAGES TABLE (for chat)
-- ===========================================
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name TEXT,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CHAT MESSAGES (Public live chat)
-- ===========================================
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

-- ===========================================
-- BLOG POSTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  category TEXT,
  tags TEXT[],
  content TEXT,
  excerpt TEXT,
  thumbnail TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  read_time INTEGER DEFAULT 5,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TESTIMONIALS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CONTRACTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'expired', 'pending')),
  start_date DATE,
  end_date DATE,
  value DECIMAL(15,2) DEFAULT 0,
  template TEXT,
  signed BOOLEAN DEFAULT FALSE,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- KNOWLEDGE ARTICLES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  content TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ACTIVITIES TABLE (Activity log)
-- ===========================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target TEXT,
  target_type TEXT,
  target_id UUID,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PROPOSALS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  services JSONB DEFAULT '[]',
  total DECIMAL(15,2) DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SUBSCRIPTIONS TABLE (SaaS module)
-- ===========================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start DATE,
  current_period_end DATE,
  usage_projects INTEGER DEFAULT 0,
  usage_storage_mb INTEGER DEFAULT 0,
  usage_team_members INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CAMPAIGNS TABLE (Marketing automation)
-- ===========================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('email', 'social', 'seo')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2) DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- BACKUPS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('full', 'incremental', 'database')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  size_mb INTEGER DEFAULT 0,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PRICING PLANS TABLE (for public site)
-- ===========================================
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

-- ===========================================
-- PROCESS STEPS TABLE (for public site timeline)
-- ===========================================
CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  step_number INTEGER NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admin can see all profiles in their company
CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('Admin', 'Manager')
      AND p.company_id = profiles.company_id
    )
  );

-- Public read policies for public site content
CREATE POLICY "services_public_read" ON services FOR SELECT USING (active = TRUE);
CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (active = TRUE);
CREATE POLICY "pricing_plans_public_read" ON pricing_plans FOR SELECT USING (active = TRUE);
CREATE POLICY "process_steps_public_read" ON process_steps FOR SELECT USING (TRUE);
CREATE POLICY "site_config_public_read" ON site_config FOR SELECT USING (TRUE);
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (featured = TRUE);

-- Chat messages - anyone can insert (for public chat)
CREATE POLICY "chat_messages_insert" ON chat_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "chat_messages_read_own" ON chat_messages FOR SELECT USING (session_id IS NOT NULL);

-- Authenticated user policies for admin operations
CREATE POLICY "services_auth_all" ON services FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "blog_posts_auth_all" ON blog_posts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "testimonials_auth_all" ON testimonials FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "clients_auth_all" ON clients FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "projects_auth_all" ON projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "project_tasks_auth_all" ON project_tasks FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "invoices_auth_all" ON invoices FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "leads_auth_all" ON leads FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "tickets_auth_all" ON tickets FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "ticket_messages_auth_all" ON ticket_messages FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "chat_messages_auth_all" ON chat_messages FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "contracts_auth_all" ON contracts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "knowledge_articles_auth_all" ON knowledge_articles FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "activities_auth_all" ON activities FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "proposals_auth_all" ON proposals FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "subscriptions_auth_all" ON subscriptions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "campaigns_auth_all" ON campaigns FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "backups_auth_all" ON backups FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "pricing_plans_auth_all" ON pricing_plans FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "process_steps_auth_all" ON process_steps FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "site_config_auth_all" ON site_config FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "companies_auth_all" ON companies FOR ALL USING (auth.uid() IS NOT NULL);

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- PROFILE CREATION TRIGGER (on auth.users insert)
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'Client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- ENABLE REALTIME
-- ===========================================
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE pricing_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE ticket_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
