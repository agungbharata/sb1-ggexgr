-- Create settings table
create table "public"."settings" (
    id uuid not null default uuid_generate_v4(),
    site_name text not null default 'WalimahMe',
    site_description text not null default 'Platform Undangan Pernikahan Digital',
    maintenance_mode boolean not null default false,
    registration_enabled boolean not null default true,
    max_invitations_per_user integer not null default 3,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now()),
    constraint settings_pkey primary key (id)
);

-- Create system_logs table
create table "public"."system_logs" (
    id uuid not null default uuid_generate_v4(),
    action text not null,
    description text not null,
    user_id uuid references auth.users(id),
    user_email text not null,
    ip_address text not null,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    constraint system_logs_pkey primary key (id)
);

-- Insert default settings
insert into "public"."settings" (site_name, site_description, maintenance_mode, registration_enabled, max_invitations_per_user)
values ('WalimahMe', 'Platform Undangan Pernikahan Digital', false, true, 3);

-- Create function to log system events
create or replace function log_system_event(
    action text,
    description text,
    user_id uuid,
    user_email text,
    ip_address text
) returns void as $$
begin
    insert into system_logs (action, description, user_id, user_email, ip_address)
    values (action, description, user_id, user_email, ip_address);
end;
$$ language plpgsql security definer;

-- Enable RLS for settings table
alter table "public"."settings" enable row level security;

-- Create policy for settings table (only admin can modify)
create policy "Enable read access for all users"
    on settings for select
    using (true);

create policy "Enable write access for admins only"
    on settings for all
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Enable RLS for system_logs table
alter table "public"."system_logs" enable row level security;

-- Create policy for system_logs table (only admin can view)
create policy "Enable read access for admins only"
    on system_logs for select
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

create policy "Enable insert for all authenticated users"
    on system_logs for insert
    with check (auth.uid() is not null);

-- Create trigger to update updated_at timestamp
create trigger handle_updated_at before update on settings
    for each row execute procedure moddatetime (updated_at);
