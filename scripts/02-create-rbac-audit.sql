-- ============================================================
-- RBAC++ (Role-Based Access Control with Field-Level Control)
-- ============================================================

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS field_access_control CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_admin_roles CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;

-- Admin Roles Table
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  rank INTEGER NOT NULL, -- 1=Super Admin, 2=Admin, 3=Manager, 4=User
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions Table (feature-level access)
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  resource VARCHAR(100) NOT NULL, -- users, leads, invoices, etc
  permission VARCHAR(50) NOT NULL, -- view, create, edit, delete, export
  UNIQUE(role_id, resource, permission),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Field-Level Access Control
CREATE TABLE field_access_control (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  resource VARCHAR(100) NOT NULL, -- leads, invoices, users, etc
  field_name VARCHAR(100) NOT NULL, -- client_email, salary, personal_id, etc
  can_view BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, resource, field_name)
);

-- User to Role Assignment
CREATE TABLE user_admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id), -- who assigned this role
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id)
);

-- ============================================================
-- ACTIVITY AUDIT LOG (Complete Action Tracking)
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- create_lead, update_price, login, etc
  resource_type VARCHAR(100), -- users, leads, invoices, settings
  resource_id UUID, -- id of the resource being changed
  resource_name VARCHAR(255), -- human-readable name (lead name, client name)
  old_value JSONB, -- previous state
  new_value JSONB, -- new state
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success', -- success, failed
  error_message TEXT, -- if failed
  reason TEXT, -- optional: why was this change made
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retention_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '365 days'
);

-- Audit Log Indexes for fast querying
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_resource_name ON audit_logs(resource_name);

-- ============================================================
-- AI MEMORY LAYER (Company Intelligence System)
-- ============================================================

CREATE TABLE ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  memory_type VARCHAR(50) NOT NULL, -- client, proposal, campaign, behavior
  category VARCHAR(100), -- client_name, successful_pitch, best_cta, etc
  content TEXT NOT NULL, -- the actual memory/data
  metadata JSONB, -- additional context
  success_score FLOAT DEFAULT 0.5, -- 0-1, how successful this memory is
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_memory_type ON ai_memory(memory_type);
CREATE INDEX idx_ai_memory_category ON ai_memory(category);
CREATE INDEX idx_ai_memory_success ON ai_memory(success_score DESC);

-- ============================================================
-- CONVERSION OPTIMIZATION & ANALYTICS
-- ============================================================

CREATE TABLE page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url VARCHAR(500) NOT NULL,
  page_name VARCHAR(255),
  visitor_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  conversion_rate FLOAT DEFAULT 0,
  average_time_on_page FLOAT, -- seconds
  bounce_rate FLOAT,
  cta_clicks INTEGER DEFAULT 0,
  cta_name VARCHAR(255),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_url)
);

CREATE TABLE conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url VARCHAR(500),
  event_type VARCHAR(100), -- button_click, form_submit, cta_click
  event_name VARCHAR(255),
  value FLOAT, -- for revenue tracking
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversion_events_timestamp ON conversion_events(timestamp DESC);
CREATE INDEX idx_conversion_events_page ON conversion_events(page_url);

-- ============================================================
-- LEAD SOURCE INTELLIGENCE
-- ============================================================

CREATE TABLE lead_source_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100) NOT NULL, -- SEO, paid_ads, referral, direct, email
  source_detail VARCHAR(255), -- which campaign, which ad, etc
  lead_count INTEGER DEFAULT 0,
  converted_count INTEGER DEFAULT 0,
  conversion_rate FLOAT DEFAULT 0,
  cost FLOAT DEFAULT 0, -- marketing spend
  revenue FLOAT DEFAULT 0, -- from converted leads
  roi FLOAT DEFAULT 0, -- (revenue - cost) / cost
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source, source_detail)
);

-- ============================================================
-- WORKFLOW AUTOMATION SYSTEM
-- ============================================================

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL, -- record_created, record_updated, time_based, webhook
  trigger_resource VARCHAR(100), -- leads, clients, invoices, etc
  trigger_condition JSONB, -- complex conditions
  actions JSONB NOT NULL, -- array of actions to take
  enabled BOOLEAN DEFAULT TRUE,
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  last_execution TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  trigger_data JSONB,
  status VARCHAR(50), -- success, failed, pending, retrying
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);

-- ============================================================
-- AI PROMPTS & PROMPT STUDIO
-- ============================================================

CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- proposal, email, social, content, etc
  prompt_text TEXT NOT NULL,
  variables JSONB, -- e.g., {client_name, industry, budget}
  version INTEGER DEFAULT 1,
  is_latest BOOLEAN DEFAULT TRUE,
  performance_score FLOAT DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  a_b_test_id UUID, -- if part of A/B test
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES ai_prompts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  prompt_text TEXT NOT NULL,
  performance_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(prompt_id, version_number)
);

CREATE TABLE prompt_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_a_id UUID NOT NULL REFERENCES ai_prompts(id),
  prompt_b_id UUID NOT NULL REFERENCES ai_prompts(id),
  test_name VARCHAR(255),
  performance_a FLOAT DEFAULT 0,
  performance_b FLOAT DEFAULT 0,
  winner_id UUID, -- the winning prompt
  status VARCHAR(50) DEFAULT 'running', -- running, completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PREDICTIONS & ML MODELS
-- ============================================================

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type VARCHAR(100), -- lead_conversion, churn_risk, contact_timing, upsell
  resource_type VARCHAR(100), -- leads, clients, invoices
  resource_id UUID,
  prediction_value FLOAT, -- 0-1 probability
  prediction_reason TEXT, -- explain the prediction
  suggested_action TEXT, -- what to do about this prediction
  confidence_score FLOAT, -- 0-1
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validated BOOLEAN DEFAULT FALSE,
  actual_outcome VARCHAR(50) -- success, failure (for model improvement)
);

CREATE INDEX idx_predictions_resource ON predictions(resource_type, resource_id);
CREATE INDEX idx_predictions_type ON predictions(prediction_type);

-- ============================================================
-- AI AGENTS (Multi-Agent System)
-- ============================================================

CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Sales AI, Marketing AI, Finance AI, Support AI
  agent_type VARCHAR(100) NOT NULL,
  model VARCHAR(100), -- gpt-4, claude-3, etc
  system_prompt TEXT,
  specialization TEXT, -- areas of expertise
  enabled BOOLEAN DEFAULT TRUE,
  performance_metrics JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ACTIVITY FEED / REAL-TIME NOTIFICATIONS
-- ============================================================

CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(100), -- lead_updated, proposal_sent, invoice_paid
  title VARCHAR(255),
  description TEXT,
  resource_type VARCHAR(100),
  resource_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_feed_user_unread ON activity_feed(user_id, read);

-- ============================================================
-- Indexes for Performance
-- ============================================================

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_field_access_control_role_id ON field_access_control(role_id);
CREATE INDEX idx_user_admin_roles_user_id ON user_admin_roles(user_id);

-- ============================================================
-- Insert Default Roles
-- ============================================================

INSERT INTO admin_roles (name, description, rank) VALUES
  ('Super Admin', 'Full system access, audit logs, all features', 1),
  ('Admin', 'Can create, edit, delete across all modules', 2),
  ('Manager', 'Can read/edit own department, limited audit viewing', 3),
  ('User', 'Read-only access to assigned resources', 4)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Insert Default Permissions for Super Admin
-- ============================================================

INSERT INTO role_permissions (role_id, resource, permission)
SELECT id, resource, permission FROM (
  SELECT 'users'::text AS resource, permission FROM (VALUES ('view'), ('create'), ('edit'), ('delete'), ('export')) AS t(permission)
  UNION ALL
  SELECT 'leads'::text, permission FROM (VALUES ('view'), ('create'), ('edit'), ('delete'), ('export')) AS t(permission)
  UNION ALL
  SELECT 'invoices'::text, permission FROM (VALUES ('view'), ('create'), ('edit'), ('delete'), ('export')) AS t(permission)
  UNION ALL
  SELECT 'reports'::text, permission FROM (VALUES ('view'), ('create'), ('edit'), ('delete'), ('export')) AS t(permission)
) resources
CROSS JOIN (SELECT id FROM admin_roles WHERE name = 'Super Admin') roles
ON CONFLICT DO NOTHING;
