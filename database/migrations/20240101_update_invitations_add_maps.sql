-- Add Google Maps fields for Akad and Resepsi
ALTER TABLE invitations
ADD COLUMN akad_maps_url text,
ADD COLUMN akad_maps_embed text,
ADD COLUMN resepsi_maps_url text,
ADD COLUMN resepsi_maps_embed text;

-- Drop old Google Maps columns
ALTER TABLE invitations
DROP COLUMN google_maps_url,
DROP COLUMN google_maps_embed;
