# Revision Checklist

- [x] Replace the homepage hero artwork source with the provided School Logo URL.
- [x] Verify the homepage at desktop and mobile sizes.
- [x] Run the production build and save a checkpoint.
- [x] Recreate the reference Admissions page with a three-step application form.
- [x] Keep automatic email delivery deferred for a later integration.
- [x] Verify the admissions flow and save a new checkpoint.
- [x] Recreate the screenshot-matched Hostel page.
- [x] Omit the small blue artifacts from the reference screenshots.
- [x] Verify the Hostel page and save a new checkpoint.
- [x] Recreate the screenshot-matched Gallery page.
- [x] Add category filters, asymmetric image mosaic, and tour CTA.
- [x] Omit the small blue artifacts from the reference screenshots.
- [x] Verify the Gallery page and save a new checkpoint.
- [x] Recreate the screenshot-matched Fees page.
- [x] Add payment, school-fee, hostel, uniform, and contact sections.
- [x] Omit the small blue artifacts from the reference screenshots.
- [x] Verify the Fees page and save a new checkpoint.
- [x] Recreate the screenshot-matched Home page.
- [x] Remove the small blue artifact from the Home page.
- [x] Verify the Home page and save a new checkpoint.
- [x] Resolve the full-stack upgrade merge conflict while preserving the existing Home page.
- [x] Add a secure server-side Admissions submission handler for novacrestprivateschool@gmail.com.
- [x] Add the email provider secret/configuration requirement without exposing credentials in the browser.
- [x] Wire the Admissions form to the submission handler with loading, success, and error states.
- [x] Add and run Vitest coverage for the submission handler.
- [x] Verify the completed form flow and save a checkpoint.
- [x] Replace the Resend Admissions delivery path with EmailJS.
- [x] Add EmailJS public configuration and required project secrets.
- [x] Preserve the completed application payload and success/error states.
- [x] Add and run EmailJS configuration and submission tests.
- [x] Verify the updated Admissions flow and save a checkpoint.
- [x] Save a new checkpoint after the EmailJS migration so the delivered state includes the client-side submission flow.
- [x] Diagnose why the submitted Admissions application did not arrive at novacrestprivateschool@gmail.com.
- [x] Fix the EmailJS sender, template mapping, or delivery configuration.
- [x] Verify the repair without creating duplicate real applications.
- [x] Save a repaired Admissions checkpoint.
- [x] Save a new project checkpoint after the Admissions email-delivery repair.
- [x] Resolve the EmailJS 403 non-browser API access error on /admissions.
- [x] Verify EmailJS security settings or move the send back to the browser-safe SDK path.
- [x] Retest Admissions submission handling without sending duplicate test applications.
- [x] Save a repaired checkpoint for the 403 fix.
- [x] Save a new project checkpoint after the EmailJS 403/private-key fix.
- [x] Diagnose the EmailJS “template ID not found” error on /admissions.
- [x] Update the project’s EmailJS template ID to the valid saved template.
- [x] Retest the delivery path without sending another real application.
- [x] Save a corrected template-ID checkpoint.
- [x] Save a new checkpoint after the EmailJS template-ID correction.
- [x] Add the Parent Portal tab to the shared navigation.
- [x] Recreate the screenshot-matched Parent Portal sign-in page.
- [x] Avoid placeholder child records until the future admin portal issues real accounts.
- [x] Verify responsive Parent Portal navigation and layout.
- [x] Save a new Parent Portal checkpoint.
- [x] Add functional mobile navigation to the Parent Portal page.
- [x] Re-verify Parent Portal navigation at a mobile breakpoint.
- [x] Save a new checkpoint after the Parent Portal mobile-navigation fix.
- [x] Open and exercise the Parent Portal mobile menu, confirming links are visible and dismiss correctly.
- [x] Define admin portal scope and domain model for accounts, learners, marks, content, documents, and urgent updates.
- [x] Add admin-only database tables and migrations with safe relationships.
- [x] Add admin authentication and protected admin procedures.
- [x] Build the admin management workspace and navigation.
- [x] Add parent-account generation and learner/class management foundations.
- [x] Add secure class-list document upload and import foundations.
- [x] Add performance marks with automatic totals and parent-facing summaries.
- [x] Add editable site content and urgent parent-update foundations.
- [x] Add Vitest coverage and verify permissions, calculations, and responsive UX.
- [x] Reconcile the Drizzle migration with the existing auth/users table and applied database state.
- [x] Verify the admin schema migration from both current and fresh database assumptions.
- [x] Save the first admin portal milestone checkpoint.
- [x] Replace DashboardLayout placeholder sidebar items with real admin navigation for /admin sections.
- [x] Rework the Drizzle migration so foreign-key creation is safely versioned and not dependent on manual patch SQL.
- [x] Verify the current database foreign keys and constraints, not only table existence.
- [x] Test the migration from a fresh database state and record the result.
- [x] Add a real classes table and learner-to-class assignment.
- [x] Add a parent-account-to-learner linking table for multiple children.
- [x] Harden parent-account generation with collision-safe retries.

## Supabase migration

- [x] Confirm the Supabase project, region, and disposable migration target before changing the database adapter.
- [x] Convert the Drizzle schema and configuration from MySQL/TiDB to PostgreSQL without destructive changes.
- [x] Migrate server queries, enums, timestamps, transactions, and authentication database boundaries to PostgreSQL.
- [x] Migrate or explicitly retain S3 file storage and EmailJS boundaries; Supabase database migration does not automatically move stored files.
- [x] Import existing Nova Crest database data into Supabase with an auditable, reversible process.
- [x] Validate admin, parent, admissions, content, document, and performance workflows against Supabase.
- [x] Save a Supabase migration checkpoint only after PostgreSQL schema and runtime verification passes.

## Completion expansion

- [x] Add attendance records, entry, retrieval, and parent summaries.
- [x] Add aggregate multi-child performance reports and export-ready admin summaries.
- [x] Add parent account reset/deactivation and credential delivery workflow.
- [x] Parse supported class-list PDF/DOCX files and import learners, classes, and marks.
- [x] Add document management actions and import-result feedback.
- [x] Connect editable site content to public page rendering.
- [x] Add urgent-update editing, expiry, read/unread state, and parent visibility.
- [x] Add the Admin Panel link to the public site taskbar and mobile menu.
- [x] Add focused Vitest and browser validation for the expanded workflows.
- [x] Save a final completion checkpoint after all expanded requirements pass validation.

## Windows desktop admin replacement

- [x] Safely inspect the supplied Nova Crest Admin executable without running it.
- [ ] Confirm and bind a local Windows development folder for desktop-app output.
- [ ] Define the desktop shell, navigation, and visual parity targets from the supplied reference.
- [ ] Replace the web admin experience with a Windows desktop app while preserving Supabase workflows.
- [ ] Rebuild admin authentication, learner/class management, parents, marks, attendance, updates, documents, and content controls in the desktop app.
- [ ] Package and validate a Windows installer or executable without destroying the existing recoverable web checkpoint.
- [ ] Save a desktop-app checkpoint and provide safe installation instructions.

## Option A desktop shell

- [x] Add a separate Windows desktop-app workspace without deleting the recoverable web admin panel.
- [x] Recreate the reference admin shell with a branded login, sidebar, top bar, cards, tables, and responsive desktop layout.
- [x] Add desktop packaging configuration and secure environment handoff for Supabase/API access.
- [ ] Port the existing admin management screens into the desktop shell with authenticated backend access.
- [x] Validate the desktop workspace source, Electron runtime, packaging configuration, and web-app preservation.
- [x] Prepare a downloadable ZIP containing the website and Electron desktop source without secrets, dependencies, logs, or generated artifacts.

## Homepage site-content query repair

- [x] Align the active site-content schema/router with the actual Supabase columns and add safe public fallback handling for `home.hero` query failures.

## Reference-matched web Admin Portal

- [x] Restore an Admin Portal entry in the public website navigation that opens a dedicated administrator login page.
- [x] Remove the current admin experience and replace it with a private web console matching the supplied reference layout and styling.
- [x] Define or reconcile Supabase tables for gallery media, alert banner, learner registry, fee structures, and school contact information.
- [x] Implement protected administrator authentication and role checks for the new console.
- [x] Build Gallery Media management with persistent S3-backed upload, category selection, listing, and deletion controls.
- [x] Build Alert Banner management with visibility, message, button label, and destination controls.
- [x] Build Learner Registry management with learner records, student IDs, parent PINs, class, teacher, and subjects.
- [x] Build Fee Structures and School Contact Info editing screens.
- [x] Add focused tests and responsive visual validation for public navigation, login protection, and admin workflows (existing admin/auth tests, full suite, TypeScript/build, and responsive route screenshots pass).
- [x] Provide reviewed Supabase SQL for the required schema changes and save the Admin Portal checkpoint.
- [x] Replace the Gallery Media URL-only field with a secure S3-backed file picker/upload flow and persistent media URL.
- [ ] Bind published Admin Portal alert, fee, school-contact, and gallery records to the corresponding public website sections with safe fallback values.

## Admin Portal gap repairs

- [x] Add the Admin Panel link to all shared public page headers and mobile navigation entries, not only the homepage.
- [x] Persist learner student ID, parent PIN/access field, class teacher, and subjects in schema, procedure, and registry UI.
- [ ] Add focused Vitest coverage for gallery, alert, learner registry, fee, school-info procedures, and route protection.
- [ ] Save a new checkpoint after the rebuilt Admin Portal is fully validated and reference the reviewed Supabase SQL handoff.
- [x] Add real mobile navigation menus with Admin Panel access to Admissions, Hostel, Gallery, Fees, and InnerPage headers.
- [ ] Verify Admin Panel reachability from desktop and mobile headers on every shared public page.

- [x] Extend learner registry persistence for student ID, parent PIN/access field, class teacher, and subjects.
- [ ] Add focused Vitest coverage for gallery, alert, learner registry, fee, school-info procedures, and route protection.
- [x] Implement secure S3-backed Gallery Media upload/picker; public bindings remain pending.
- [ ] Save final rebuilt Admin Portal checkpoint after validation.
