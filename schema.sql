-- Ashirvad Hospital starter schema.
-- Run in Supabase SQL Editor using a NEW project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin','doctor','receptionist')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  specialty text not null,
  consultation_fee numeric(10,2) not null default 0 check (consultation_fee >= 0),
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_code text unique not null,
  full_name text not null,
  phone text not null,
  date_of_birth date,
  age integer check (age is null or age between 0 and 125),
  gender text,
  address text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id),
  doctor_id uuid not null references public.doctors(id),
  appointment_date date not null,
  appointment_time time not null,
  token_number integer,
  status text not null default 'scheduled'
    check (status in ('scheduled','waiting','completed','cancelled','no_show')),
  visit_type text not null default 'in_person',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id),
  doctor_id uuid not null references public.doctors(id),
  appointment_id uuid references public.appointments(id),
  diagnosis text not null,
  instructions text,
  created_at timestamptz not null default now(),
  signed_by uuid references public.profiles(id)
);

create table if not exists public.prescription_items (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  medicine_name text not null,
  dosage text not null,
  duration text,
  timing text,
  quantity text
);

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id),
  appointment_id uuid references public.appointments(id),
  bill_number text unique not null,
  description text not null,
  amount numeric(10,2) not null check (amount >= 0),
  payment_status text not null default 'unpaid' check (payment_status in ('paid','unpaid','partial')),
  payment_mode text,
  created_at timestamptz not null default now()
);

create table if not exists public.lab_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id),
  report_name text not null,
  storage_path text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  table_name text not null,
  record_id text,
  created_at timestamptz not null default now()
);

-- Enable RLS. Policies below are a conservative starting point.
alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.prescriptions enable row level security;
alter table public.prescription_items enable row level security;
alter table public.bills enable row level security;
alter table public.lab_reports enable row level security;
alter table public.audit_logs enable row level security;

-- Authenticated staff can read clinic data. Production write policies must be
-- restricted by verified role and tested before importing real patient data.
create policy "staff read profiles" on public.profiles for select to authenticated using (true);
create policy "staff read doctors" on public.doctors for select to authenticated using (true);
create policy "staff read patients" on public.patients for select to authenticated using (true);
create policy "staff read appointments" on public.appointments for select to authenticated using (true);
create policy "staff read prescriptions" on public.prescriptions for select to authenticated using (true);
create policy "staff read prescription items" on public.prescription_items for select to authenticated using (true);
create policy "staff read bills" on public.bills for select to authenticated using (true);
create policy "staff read lab reports" on public.lab_reports for select to authenticated using (true);
create policy "staff read audit logs" on public.audit_logs for select to authenticated using (true);

-- NOTE: No public/anon access and no write policies are granted here.
-- Add carefully tested role-based policies before enabling real operations.
