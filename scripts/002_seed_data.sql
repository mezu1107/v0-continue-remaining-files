-- Seed Data for AM Enterprises

-- Insert default company
INSERT INTO companies (id, name, logo, industry, address, email, phone, currency, timezone)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'AM Enterprises',
  '/logo.png',
  'Technology',
  '123 Tech Street, Silicon Valley, CA',
  'contact@amenterprises.tech',
  '+1 (555) 123-4567',
  'USD',
  'America/Los_Angeles'
) ON CONFLICT (id) DO NOTHING;

-- Insert services
INSERT INTO services (name, category, description, icon, pricing_basic, pricing_pro, pricing_enterprise, features, active, company_id, sort_order) VALUES
('Web Development', 'Development', 'Custom web applications built with modern technologies like React, Next.js, and Node.js.', 'Globe', 2999, 5999, 14999, ARRAY['Responsive Design', 'SEO Optimization', 'Performance Tuning', 'API Integration', '24/7 Support'], TRUE, '00000000-0000-0000-0000-000000000001', 1),
('Mobile App Development', 'Development', 'Native and cross-platform mobile applications for iOS and Android.', 'Smartphone', 4999, 9999, 24999, ARRAY['iOS & Android', 'Push Notifications', 'Offline Support', 'App Store Submission', 'Maintenance'], TRUE, '00000000-0000-0000-0000-000000000001', 2),
('UI/UX Design', 'Design', 'User-centered design that creates intuitive and engaging digital experiences.', 'Palette', 1999, 3999, 9999, ARRAY['User Research', 'Wireframing', 'Prototyping', 'Design System', 'Usability Testing'], TRUE, '00000000-0000-0000-0000-000000000001', 3),
('Cloud Solutions', 'Infrastructure', 'Scalable cloud infrastructure setup and migration on AWS, GCP, or Azure.', 'Cloud', 3999, 7999, 19999, ARRAY['Cloud Migration', 'Auto-scaling', 'Security Setup', 'Cost Optimization', 'Monitoring'], TRUE, '00000000-0000-0000-0000-000000000001', 4),
('AI & Machine Learning', 'AI', 'Intelligent solutions powered by cutting-edge AI and ML technologies.', 'Brain', 5999, 14999, 39999, ARRAY['Custom Models', 'Data Analysis', 'Chatbots', 'Automation', 'Integration'], TRUE, '00000000-0000-0000-0000-000000000001', 5),
('DevOps & CI/CD', 'Infrastructure', 'Streamline your development workflow with automated pipelines and infrastructure.', 'GitBranch', 2499, 4999, 12999, ARRAY['Pipeline Setup', 'Docker/Kubernetes', 'Monitoring', 'Security Scanning', 'Documentation'], TRUE, '00000000-0000-0000-0000-000000000001', 6),
('E-commerce Solutions', 'Development', 'Complete e-commerce platforms with payment integration and inventory management.', 'ShoppingCart', 3499, 6999, 17999, ARRAY['Payment Gateway', 'Inventory System', 'Order Management', 'Analytics', 'Mobile Commerce'], TRUE, '00000000-0000-0000-0000-000000000001', 7),
('Cybersecurity', 'Security', 'Comprehensive security audits and implementation to protect your digital assets.', 'Shield', 4999, 9999, 24999, ARRAY['Security Audit', 'Penetration Testing', 'Compliance', 'Training', 'Incident Response'], TRUE, '00000000-0000-0000-0000-000000000001', 8);

-- Insert pricing plans
INSERT INTO pricing_plans (name, price_monthly, price_yearly, description, features, highlighted, active, company_id, sort_order) VALUES
('Starter', 299, 2990, 'Perfect for small businesses and startups', ARRAY['Up to 3 Projects', '5GB Storage', 'Email Support', 'Basic Analytics', 'Standard Security'], FALSE, TRUE, '00000000-0000-0000-0000-000000000001', 1),
('Professional', 799, 7990, 'Ideal for growing companies', ARRAY['Up to 10 Projects', '50GB Storage', 'Priority Support', 'Advanced Analytics', 'Enhanced Security', 'API Access', 'Custom Integrations'], TRUE, TRUE, '00000000-0000-0000-0000-000000000001', 2),
('Enterprise', 1999, 19990, 'For large organizations with custom needs', ARRAY['Unlimited Projects', 'Unlimited Storage', '24/7 Dedicated Support', 'Custom Analytics', 'Enterprise Security', 'Full API Access', 'Custom Development', 'SLA Guarantee'], FALSE, TRUE, '00000000-0000-0000-0000-000000000001', 3);

-- Insert process steps
INSERT INTO process_steps (title, description, icon, step_number, company_id) VALUES
('Discovery', 'We start by understanding your business goals, target audience, and project requirements through in-depth consultation.', 'Search', 1, '00000000-0000-0000-0000-000000000001'),
('Planning', 'Our team creates a comprehensive project roadmap, technical architecture, and timeline aligned with your objectives.', 'Map', 2, '00000000-0000-0000-0000-000000000001'),
('Design', 'We craft beautiful, user-centered designs with wireframes and prototypes for your approval before development.', 'Palette', 3, '00000000-0000-0000-0000-000000000001'),
('Development', 'Our engineers build your solution using cutting-edge technologies and best practices for scalability and performance.', 'Code', 4, '00000000-0000-0000-0000-000000000001'),
('Testing', 'Rigorous QA testing ensures your product is bug-free, secure, and performs flawlessly across all devices.', 'CheckCircle', 5, '00000000-0000-0000-0000-000000000001'),
('Launch', 'We deploy your solution and provide ongoing support to ensure a smooth launch and continued success.', 'Rocket', 6, '00000000-0000-0000-0000-000000000001');

-- Insert testimonials
INSERT INTO testimonials (client_name, client_title, client_company, content, rating, featured, active, company_id) VALUES
('Sarah Johnson', 'CEO', 'TechStart Inc.', 'AM Enterprises transformed our vision into reality. Their team delivered a stunning web application that exceeded our expectations. The attention to detail and technical expertise is unmatched.', 5, TRUE, TRUE, '00000000-0000-0000-0000-000000000001'),
('Michael Chen', 'CTO', 'InnovateCorp', 'Working with AM Enterprises was a game-changer for our company. Their mobile app solution increased our customer engagement by 300%. Highly recommended!', 5, TRUE, TRUE, '00000000-0000-0000-0000-000000000001'),
('Emily Rodriguez', 'Founder', 'GrowthLabs', 'The UI/UX design team at AM Enterprises created an intuitive interface that our users love. Our conversion rate improved significantly after the redesign.', 5, TRUE, TRUE, '00000000-0000-0000-0000-000000000001'),
('David Thompson', 'Director of IT', 'GlobalRetail', 'The cloud migration project was executed flawlessly. AM Enterprises saved us 40% on infrastructure costs while improving performance.', 5, FALSE, TRUE, '00000000-0000-0000-0000-000000000001'),
('Lisa Park', 'Product Manager', 'FinanceHub', 'Their AI solutions helped us automate processes that used to take hours. The ROI has been incredible. AM Enterprises truly understands modern technology.', 5, FALSE, TRUE, '00000000-0000-0000-0000-000000000001');

-- Insert blog posts
INSERT INTO blog_posts (title, slug, author_name, status, category, tags, content, excerpt, read_time, company_id, published_at) VALUES
('The Future of Web Development: Trends to Watch in 2024', 'future-web-development-2024', 'Alex Morgan', 'published', 'Technology', ARRAY['Web Development', 'Trends', 'React', 'Next.js'], '<h2>Introduction</h2><p>The web development landscape is constantly evolving. In this article, we explore the key trends shaping the future of web development in 2024 and beyond.</p><h2>1. AI-Powered Development</h2><p>Artificial intelligence is revolutionizing how we build web applications. From code generation to automated testing, AI tools are becoming essential for modern developers.</p><h2>2. Edge Computing</h2><p>Edge computing brings computation closer to users, reducing latency and improving performance. Frameworks like Next.js are leading this shift with edge functions.</p><h2>3. WebAssembly</h2><p>WebAssembly continues to gain traction, enabling high-performance applications in the browser that were previously impossible.</p>', 'Explore the key trends shaping web development in 2024, from AI-powered tools to edge computing and WebAssembly.', 8, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),
('Building Scalable Mobile Apps with React Native', 'scalable-mobile-apps-react-native', 'Jessica Lee', 'published', 'Mobile', ARRAY['React Native', 'Mobile Development', 'JavaScript'], '<h2>Why React Native?</h2><p>React Native has become one of the most popular frameworks for building cross-platform mobile applications. In this guide, we share our best practices for building scalable apps.</p><h2>Architecture Patterns</h2><p>A solid architecture is the foundation of any scalable application. We recommend using patterns like Redux for state management and clean architecture principles.</p><h2>Performance Optimization</h2><p>Performance is crucial for mobile apps. Learn techniques for optimizing rendering, reducing bundle size, and improving startup time.</p>', 'Learn best practices for building scalable, high-performance mobile applications using React Native and modern architecture patterns.', 12, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 days'),
('Mastering UI/UX Design: A Complete Guide', 'mastering-ui-ux-design', 'Chris Taylor', 'published', 'Design', ARRAY['UI/UX', 'Design', 'User Experience'], '<h2>The Importance of Good Design</h2><p>Great design is not just about aesthetics—it is about creating experiences that users love. This comprehensive guide covers everything you need to know about UI/UX design.</p><h2>User Research</h2><p>Understanding your users is the first step to great design. Learn methods for conducting effective user research and creating user personas.</p><h2>Design Systems</h2><p>Design systems ensure consistency across your product. We explore how to create and maintain a design system that scales with your team.</p>', 'A comprehensive guide to creating exceptional user experiences through thoughtful UI/UX design principles and practices.', 15, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days'),
('Cloud Architecture Best Practices for 2024', 'cloud-architecture-best-practices', 'Ryan Martinez', 'published', 'Cloud', ARRAY['Cloud', 'AWS', 'Architecture', 'DevOps'], '<h2>Modern Cloud Architecture</h2><p>Cloud architecture has evolved significantly. In this article, we share best practices for building robust, scalable cloud infrastructure.</p><h2>Microservices vs Monolith</h2><p>The microservices debate continues. We discuss when to use each approach and how to make the transition.</p><h2>Security First</h2><p>Security should be built into your architecture from day one. Learn about zero-trust architecture and other security patterns.</p>', 'Discover the best practices for designing and implementing modern cloud architecture that scales with your business.', 10, '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days');

-- Insert site config for dynamic content
INSERT INTO site_config (company_id, key, value) VALUES
('00000000-0000-0000-0000-000000000001', 'hero', '{"headline": "Building Digital Excellence", "subheadline": "We create innovative software solutions that transform businesses and drive growth.", "stats": [{"value": 150, "label": "Projects Completed", "suffix": "+"}, {"value": 50, "label": "Happy Clients", "suffix": "+"}, {"value": 12, "label": "Team Members"}, {"value": 99, "label": "Client Satisfaction", "suffix": "%"}]}'),
('00000000-0000-0000-0000-000000000001', 'contact', '{"email": "contact@amenterprises.tech", "phone_pk": "+92 317 371 2950", "phone_uk": "+44 77 17229638", "address": "123 Tech Street, Silicon Valley, CA", "whatsapp_pk": "923173712950", "whatsapp_uk": "447717229638"}'),
('00000000-0000-0000-0000-000000000001', 'social', '{"twitter": "https://twitter.com/amenterprises", "linkedin": "https://linkedin.com/company/amenterprises", "github": "https://github.com/amenterprises", "instagram": "https://instagram.com/amenterprises"}'),
('00000000-0000-0000-0000-000000000001', 'seo', '{"title": "AM Enterprises - Digital Excellence", "description": "AM Enterprises creates innovative software solutions including web development, mobile apps, UI/UX design, cloud solutions, and AI integration.", "keywords": "software development, web development, mobile apps, AI, cloud solutions"}');

-- Insert sample projects for portfolio
INSERT INTO projects (name, client_id, company_id, status, priority, progress, description, featured, thumbnail, category, technologies, live_url) VALUES
('E-Commerce Platform Redesign', NULL, '00000000-0000-0000-0000-000000000001', 'done', 'high', 100, 'Complete redesign of a major e-commerce platform with improved UX and performance.', TRUE, '/portfolio/ecommerce.jpg', 'E-Commerce', ARRAY['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'], 'https://example.com'),
('Healthcare Mobile App', NULL, '00000000-0000-0000-0000-000000000001', 'done', 'high', 100, 'HIPAA-compliant mobile application for patient management and telemedicine.', TRUE, '/portfolio/healthcare.jpg', 'Healthcare', ARRAY['React Native', 'Node.js', 'MongoDB', 'WebRTC'], 'https://example.com'),
('AI-Powered Analytics Dashboard', NULL, '00000000-0000-0000-0000-000000000001', 'done', 'high', 100, 'Real-time analytics platform with machine learning insights for business intelligence.', TRUE, '/portfolio/analytics.jpg', 'AI/ML', ARRAY['Python', 'TensorFlow', 'React', 'AWS'], 'https://example.com'),
('FinTech Payment Gateway', NULL, '00000000-0000-0000-0000-000000000001', 'done', 'medium', 100, 'Secure payment processing system with fraud detection capabilities.', TRUE, '/portfolio/fintech.jpg', 'FinTech', ARRAY['Go', 'Kubernetes', 'Redis', 'PostgreSQL'], 'https://example.com'),
('SaaS Project Management Tool', NULL, '00000000-0000-0000-0000-000000000001', 'in-progress', 'high', 75, 'Collaborative project management platform with real-time updates and integrations.', TRUE, '/portfolio/saas.jpg', 'SaaS', ARRAY['Next.js', 'Supabase', 'Tailwind', 'Framer Motion'], 'https://example.com'),
('IoT Smart Home System', NULL, '00000000-0000-0000-0000-000000000001', 'done', 'medium', 100, 'Connected home automation system with voice control and energy monitoring.', TRUE, '/portfolio/iot.jpg', 'IoT', ARRAY['Rust', 'MQTT', 'React', 'AWS IoT'], 'https://example.com');
