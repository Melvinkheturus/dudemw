drop table if exists cms_pages;

create table cms_pages (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table cms_pages enable row level security;

create policy "Public pages are viewable by everyone"
  on cms_pages for select
  using ( status = 'published' );

create policy "Admins can view all pages"
  on cms_pages for select
  using ( true );

create policy "Admins can insert pages"
  on cms_pages for insert
  with check ( true );

create policy "Admins can update pages"
  on cms_pages for update
  using ( true );

-- Initial Seed Data with Block Structure
insert into cms_pages (slug, title, status, content) values
(
  'returns', 
  'Returns Policy', 
  'published',
  '[
    {"id": "1", "type": "heading", "value": "Returns & Exchanges"},
    {"id": "2", "type": "paragraph", "value": "We offer easy returns within 7 days of delivery. Products must be unused, unwashed, and in original packaging with tags attached."},
    {"id": "3", "type": "heading", "value": "Eligibility"},
    {"id": "4", "type": "list", "items": ["Item must be unused", "Original tags required", "Invoice included"]}
  ]'::jsonb
),
(
  'faq', 
  'Frequently Asked Questions', 
  'published',
  '[
    {"id": "1", "type": "heading", "value": "Common Questions"},
    {"id": "2", "type": "faq", "items": [
      {"q": "How long does shipping take?", "a": "Standard delivery takes 5-7 business days."},
      {"q": "Do you offer free shipping?", "a": "Yes, on orders above ₹999."}
    ]}
  ]'::jsonb
),
(
  'shipping-policy', 
  'Shipping Policy', 
  'published',
  '[
    {"id": "1", "type": "heading", "value": "Shipping Information"},
    {"id": "2", "type": "paragraph", "value": "We ship across India via trusted courier partners."}
  ]'::jsonb
),
(
  'refund-policy', 
  'Refund Policy', 
  'published',
  '[
    {"id": "1", "type": "heading", "value": "Refund Process"},
    {"id": "2", "type": "paragraph", "value": "Refunds are processed within 5-7 days of receiving the return."}
  ]'::jsonb
),
(
  'about-us', 
  'About Us', 
  'published',
  '[
    {"id": "1", "type": "heading", "value": "Our Story"},
    {"id": "2", "type": "paragraph", "value": "Dude Mens Wear was founded in 2020 with a mission to provide quality menswear."}
  ]'::jsonb
);
