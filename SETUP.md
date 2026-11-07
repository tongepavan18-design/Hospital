# Ashirvad Hospital — Starter MVP

This is a responsive React web app starter for a clinic. It runs on mobile and laptop browsers.

## 1. Install prerequisites
- Install Node.js LTS from https://nodejs.org/
- Install VS Code.
- Extract this ZIP, then open the `ashirvad-hospital` folder in VS Code.

## 2. Run locally
Open VS Code Terminal in this folder and run:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173).

## 3. Try the demo
- Open Patients → Add patient.
- Open Doctors → Add doctor (replace the placeholder doctor names).
- Open Appointments → Book appointment.
- Create a prescription and a bill.
- Change language from the top-right selector.
- Demo data is stored in this browser's localStorage only.

## 4. Connect Supabase
1. Create a new project at https://supabase.com/.
2. Open SQL Editor → New query.
3. Copy all contents of `supabase/schema.sql`, run it.
4. In Supabase Project Settings → API, copy Project URL and anon/public key.
5. Copy `.env.example` to a new file named `.env` in the project root.
6. Put your URL and anon key in `.env`.
7. Stop and restart the Vite server.

IMPORTANT: The current UI is a local demo and does not yet read/write Supabase. The SQL schema is the database foundation. Do not enter real patient data until authentication, role-based write policies, patient-level access rules, storage policies, backups, audit logging, and legal/privacy review are completed and tested.

## 5. Before real hospital launch
- Replace sample doctor names and add the hospital's verified address, phone, hours, and registration details.
- Add secure staff login and role management.
- Add strict RLS policies for each role; never use a service-role key in frontend code.
- Add private storage buckets for prescriptions and reports with signed URLs.
- Add backups, audit trails, session timeout, access revocation, and tested restore procedure.
- Validate prescription layout and clinical workflow with the treating doctor.
- Have the system reviewed for applicable Indian healthcare, privacy, and record-retention requirements.

## Current MVP capabilities
- Responsive dashboard and navigation
- Patient registration and search
- Doctor directory
- Appointment booking with token
- Prescription entry
- Billing and payment status
- English / Hindi / Marathi UI labels
- Browser-local demo persistence

## Not yet implemented
- Real cloud sync and authentication
- Patient self-service online booking portal
- WhatsApp/SMS integration
- PDF prescription export and lab report uploads
- Automated backups and production security policies
