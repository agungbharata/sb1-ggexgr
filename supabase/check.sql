-- Periksa struktur tabel
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles';

-- Periksa isi tabel profiles
SELECT * FROM profiles;

-- Periksa trigger
SELECT tgname, pg_get_triggerdef(oid) 
FROM pg_trigger 
WHERE tgrelid = 'profiles'::regclass;
