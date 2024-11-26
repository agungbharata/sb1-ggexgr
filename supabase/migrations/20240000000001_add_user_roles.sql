-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Add role column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create policy to allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Create policy to allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

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
