-- Add parent names and event details columns
ALTER TABLE invitations
ADD COLUMN bride_parents text,
ADD COLUMN groom_parents text,
ADD COLUMN show_akad boolean DEFAULT true,
ADD COLUMN akad_date date,
ADD COLUMN akad_time time,
ADD COLUMN akad_venue text,
ADD COLUMN show_resepsi boolean DEFAULT true,
ADD COLUMN resepsi_date date,
ADD COLUMN resepsi_time time,
ADD COLUMN resepsi_venue text;
