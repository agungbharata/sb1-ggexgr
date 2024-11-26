-- Drop existing objects first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY,
    email text,
    whatsapp text,
    username text,
    full_name text,
    avatar_url text,
    role text DEFAULT 'user'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT fk_user
        FOREIGN KEY (id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        split_part(NEW.email, '@', 1),
        '',
        CASE 
            WHEN NEW.email = 'admin@weddinggas.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$;

-- Trigger after user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial admin if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'admin@weddinggas.com'
    ) THEN
        -- Note: You'll need to set this password manually through Supabase dashboard
        INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
        VALUES ('admin@weddinggas.com', '', NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END
$$;
