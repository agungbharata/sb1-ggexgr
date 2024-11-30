-- Add status column to invitations table
ALTER TABLE invitations 
ADD COLUMN status varchar(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));

-- Update existing records to published
UPDATE invitations SET status = 'published' WHERE status = 'draft';
