-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Create enum for valid roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Add constraint to ensure role is valid
ALTER TABLE profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Create policy to restrict role updates to admins only
CREATE POLICY "Only admins can update roles"
ON profiles
FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
))
WITH CHECK (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Set initial admin (replace with your user's ID)
UPDATE profiles 
SET role = 'admin'::user_role 
WHERE id = auth.uid(); -- This will be executed as superuser
