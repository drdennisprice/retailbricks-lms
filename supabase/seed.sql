-- Seed: insert the two launch courses
INSERT INTO public.courses (slug, title, description, price_aud, published)
VALUES
  (
    'visual-merchandising-for-profit',
    'Visual Merchandising for Profit',
    'Transform your store layout and displays into a selling machine. Practical techniques used by top-performing retailers to increase basket size and conversion rate.',
    97.00,
    false
  ),
  (
    'meta-ads-masterclass',
    'Meta Ads Masterclass',
    'Stop burning ad spend. Learn how to build, test, and scale Meta ad campaigns that actually return a profit for your retail business.',
    97.00,
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- After seeding, set your admin role:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
