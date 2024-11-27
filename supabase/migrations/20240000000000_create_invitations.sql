-- Drop existing tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.gifts CASCADE;
DROP TABLE IF EXISTS public.galleries CASCADE;

-- Create invitations table
CREATE TABLE public.invitations (
    -- Primary key and user reference
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Basic wedding information
    bride_names TEXT NOT NULL,
    groom_names TEXT NOT NULL,
    date TEXT,
    time TEXT,
    venue TEXT,
    
    -- Invitation text content
    opening_text TEXT DEFAULT 'Bersama keluarga mereka',
    invitation_text TEXT DEFAULT 'Mengundang kehadiran Anda',
    message TEXT,
    
    -- URLs and slugs
    slug TEXT NOT NULL UNIQUE,
    custom_slug TEXT,
    custom_url TEXT,
    
    -- Photos and media
    cover_photo TEXT,
    bride_photo TEXT,
    groom_photo TEXT,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Location information
    google_maps_url TEXT,
    google_maps_embed TEXT,
    
    -- Additional features
    social_links JSONB DEFAULT '[]'::JSONB,
    bank_accounts JSONB DEFAULT '[]'::JSONB,
    
    -- Theme and customization
    theme TEXT DEFAULT 'default',
    font_family TEXT DEFAULT 'default',
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#ffffff',
    
    -- Music and background
    background_music TEXT,
    background_image TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Additional metadata
    status TEXT DEFAULT 'draft',
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    max_guests INTEGER,
    rsvp_enabled BOOLEAN DEFAULT true,
    comments_enabled BOOLEAN DEFAULT true
);

-- Create guests table
CREATE TABLE public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    attendance_status TEXT DEFAULT 'pending',
    number_of_guests INTEGER DEFAULT 1,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create comments table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create gifts table
CREATE TABLE public.gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    amount DECIMAL,
    message TEXT,
    gift_type TEXT,
    bank_name TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create galleries table
CREATE TABLE public.galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX invitations_user_id_idx ON public.invitations(user_id);
CREATE INDEX invitations_slug_idx ON public.invitations(slug);
CREATE INDEX invitations_status_idx ON public.invitations(status);
CREATE INDEX invitations_created_at_idx ON public.invitations(created_at);
CREATE INDEX guests_invitation_id_idx ON public.guests(invitation_id);
CREATE INDEX comments_invitation_id_idx ON public.comments(invitation_id);
CREATE INDEX gifts_invitation_id_idx ON public.gifts(invitation_id);
CREATE INDEX galleries_invitation_id_idx ON public.galleries(invitation_id);

-- Enable Row Level Security
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for invitations
CREATE POLICY "Users can view own invitations" 
    ON public.invitations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invitations" 
    ON public.invitations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations" 
    ON public.invitations FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own invitations" 
    ON public.invitations FOR DELETE 
    USING (auth.uid() = user_id);

CREATE POLICY "Public can view published invitations" 
    ON public.invitations FOR SELECT 
    USING (is_published = true);

-- Create RLS Policies for guests
CREATE POLICY "Users can view guests of own invitations"
    ON public.guests FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.invitations
        WHERE id = invitation_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can manage guests of own invitations"
    ON public.guests FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.invitations
        WHERE id = invitation_id AND user_id = auth.uid()
    ));

-- Create RLS Policies for comments
CREATE POLICY "Users can view comments of own invitations"
    ON public.comments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.invitations
        WHERE id = invitation_id AND user_id = auth.uid()
    ));

CREATE POLICY "Public can view approved comments"
    ON public.comments FOR SELECT
    USING (is_approved = true);

CREATE POLICY "Public can insert comments"
    ON public.comments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can manage comments of own invitations"
    ON public.comments FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.invitations
        WHERE id = invitation_id AND user_id = auth.uid()
    ));

-- Create RLS Policies for gifts
CREATE POLICY "Users can manage gifts of own invitations"
    ON public.gifts FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.invitations
        WHERE id = invitation_id AND user_id = auth.uid()
    ));

-- Create RLS Policies for galleries
CREATE POLICY "Users can manage galleries of own invitations"
    ON public.galleries FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.invitations
        WHERE id = invitation_id AND user_id = auth.uid()
    ));

CREATE POLICY "Public can view galleries"
    ON public.galleries FOR SELECT
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_invitations
    BEFORE UPDATE ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_guests
    BEFORE UPDATE ON public.guests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_comments
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_gifts
    BEFORE UPDATE ON public.gifts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_galleries
    BEFORE UPDATE ON public.galleries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.invitations
    SET view_count = view_count + 1
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for view count
CREATE TRIGGER increment_views
    AFTER INSERT ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_view_count();
