-- Hero Section Table
CREATE TABLE hero_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_primary_text TEXT NOT NULL,
  cta_secondary_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points TEXT[] NOT NULL DEFAULT '{}',
  button_title TEXT NOT NULL,
  modal_content TEXT NOT NULL,
  icon_emoji TEXT NOT NULL DEFAULT '🧘',
  color_scheme TEXT NOT NULL DEFAULT 'primary',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshops Table
CREATE TABLE workshops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  therapy TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policy for images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Insert default data
INSERT INTO hero_section (title, description, cta_primary_text, cta_secondary_text) VALUES 
('Heal Naturally', 'Transform your mind, body, and spirit through holistic wellness therapies', 'Start Your Journey', 'Explore Therapies');

INSERT INTO services (title, description, points, button_title, modal_content, icon_emoji, color_scheme, display_order) VALUES 
('Yoga Therapy', 'Our yoga therapy provides personalized healing for physical and emotional well-being including asanas, pranayama, and meditation.', ARRAY['1-on-1 personalized sessions', 'Flexible scheduling', 'Holistic approach'], 'Learn More', 'Yoga therapy is a comprehensive approach to healing that combines traditional yoga practices with modern therapeutic techniques. Our certified yoga therapists work with you to create personalized sessions that address your specific physical, emotional, and spiritual needs. Whether you''re dealing with chronic pain, stress, anxiety, or seeking overall wellness, our yoga therapy sessions provide a safe and supportive environment for healing and growth.', '🧘', 'primary', 1),
('Ho''opono''pono', 'Ancient Hawaiian healing technique for releasing emotional blockages and restoring inner peace through forgiveness.', ARRAY['Emotional healing', 'Forgiveness work', 'Inner peace restoration'], 'Learn More', 'Ho''opono''pono is a powerful Hawaiian practice of reconciliation and forgiveness. This ancient healing technique helps you release emotional blockages, heal relationships, and restore inner peace. Through guided sessions, you''ll learn the four key phrases that form the foundation of this practice: "I''m sorry, Please forgive me, Thank you, I love you." This transformative process helps clear negative emotions and creates space for love, peace, and healing in your life.', '💖', 'secondary', 2),
('Flower Therapy', 'Natural flower remedies to balance emotions and promote holistic healing. Explore Bach Flower remedies and more.', ARRAY['Natural remedies', 'Emotional balance', 'Holistic wellness'], 'Explore Remedies', 'Flower therapy uses the vibrational essence of flowers to restore emotional balance and promote healing. Based on the work of Dr. Edward Bach, these gentle yet powerful remedies work on an energetic level to address emotional imbalances that may be affecting your physical health. Our certified practitioners will help you identify the right flower essences for your specific needs, whether you''re dealing with fear, anxiety, grief, or seeking to enhance positive emotions like confidence and joy.', '🌸', 'accent', 3),
('Dance Therapy', 'Release emotions and reconnect with joy through mindful dance practices for healing and self-expression.', ARRAY['Emotional release through movement', 'Kids classes (3 days/week)', 'Therapeutic sessions'], 'Join Classes', 'Dance therapy is a form of expressive therapy that uses movement and dance to promote emotional, social, cognitive, and physical integration. Our sessions provide a safe space to explore emotions through movement, release tension, and reconnect with your body''s natural wisdom. Whether you''re looking for personal healing or want to enroll your child in our kids'' classes, dance therapy offers a joyful path to wellness and self-discovery.', '💃', 'accent', 4),
('Corporate Yoga', 'Workplace wellness sessions for employee engagement, posture correction, and stress reduction.', ARRAY['45-50 minute sessions', 'Team bonding', 'Groups of 50-60'], 'Book Session', 'Our corporate yoga programs are designed to enhance workplace wellness and productivity. We bring yoga directly to your office, providing employees with tools to manage stress, improve posture, and boost energy levels. Our sessions are tailored to office environments and can accommodate groups of 50-60 people. Regular corporate yoga sessions lead to reduced absenteeism, improved team morale, and better overall employee health and satisfaction.', '👥', 'primary', 5),
('Dance Choreographies', 'Professional choreography for all your special events and celebrations.', ARRAY['Weddings & Sangeet', 'Baby showers', 'Corporate events'], 'Book Choreography', 'Make your special occasions unforgettable with our professional dance choreography services. Whether it''s a wedding sangeet, baby shower, or corporate event, we create custom choreographies that match your style and skill level. Our experienced choreographers work with you to design routines that are fun, engaging, and perfectly suited to your celebration. We handle everything from song selection to final performance, ensuring your event is memorable and joyful.', '✨', 'primary', 6),
('Student Therapy', 'Specialized support focusing on goal setting, exam stress management, and manifestation techniques for student success.', ARRAY['Stress reduction & time management', 'Goal setting & manifestation', 'Personalized guidance'], 'Learn More', 'Our student therapy program is specifically designed to support students in achieving academic success while maintaining emotional well-being. We help students develop effective study habits, manage exam anxiety, set and achieve goals, and build confidence. Through a combination of mindfulness techniques, stress management strategies, and manifestation practices, students learn to navigate academic challenges with greater ease and success.', '📚', 'primary', 7);

-- Enable Row Level Security (RLS)
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
CREATE POLICY "Allow all operations" ON hero_section FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON workshops FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON reviews FOR ALL USING (true);