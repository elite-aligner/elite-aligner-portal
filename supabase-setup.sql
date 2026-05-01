-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  case_type TEXT NOT NULL,
  description TEXT,
  treatment_duration TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_name TEXT
);

-- Create storage bucket for case images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('case-images', 'case-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on cases table
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all approved cases
CREATE POLICY "View approved cases" ON cases
  FOR SELECT USING (status = 'approved');

-- Policy: Users can view their own cases regardless of status
CREATE POLICY "View own cases" ON cases
  FOR SELECT USING (auth.uid() = created_by);

-- Policy: Users can insert their own cases
CREATE POLICY "Insert own cases" ON cases
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Policy: Users can update their own cases
CREATE POLICY "Update own cases" ON cases
  FOR UPDATE USING (auth.uid() = created_by);

-- Policy: Users can delete their own cases
CREATE POLICY "Delete own cases" ON cases
  FOR DELETE USING (auth.uid() = created_by);

-- Storage policies for case-images bucket
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'case-images');

CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'case-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow owner delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'case-images' AND auth.uid() = owner
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
