-- Add published_at column to invitations table
ALTER TABLE invitations 
ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;

-- Set published_at for existing published invitations
UPDATE invitations 
SET published_at = created_at 
WHERE status = 'published' AND published_at IS NULL;
