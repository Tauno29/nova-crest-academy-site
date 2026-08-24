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
- [x] Close local Windows development-folder work as superseded by the later request to remove the desktop application.
- [x] Close desktop-shell work as superseded by the later request to remove the desktop application.
- [x] Close desktop replacement work as superseded by the later request to remove the desktop application.
- [x] Close desktop management-port work as superseded by the later request to remove the desktop application.
- [x] Close Windows packaging work as superseded by the later request to remove the desktop application.
- [x] Close desktop-app checkpoint work as superseded by the later request to remove the desktop application.

## Option A desktop shell

- [x] Add a separate Windows desktop-app workspace without deleting the recoverable web admin panel.
- [x] Recreate the reference admin shell with a branded login, sidebar, top bar, cards, tables, and responsive desktop layout.
- [x] Add desktop packaging configuration and secure environment handoff for Supabase/API access.
- [x] Close desktop admin-screen porting as superseded by the later request to remove the desktop application.
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
- [x] Bind published Admin Portal alert, fee, school-contact, and gallery records to the corresponding public website sections with safe fallback values.

## Admin Portal gap repairs

- [x] Add the Admin Panel link to all shared public page headers and mobile navigation entries, not only the homepage.
- [x] Persist learner student ID, parent PIN/access field, class teacher, and subjects in schema, procedure, and registry UI.
- [x] Add focused Vitest coverage for gallery, alert, learner registry, fee, school-info procedures, and route protection.
- [x] Save a new checkpoint after the rebuilt Admin Portal is fully validated and reference the reviewed Supabase SQL handoff.
- [x] Add real mobile navigation menus with Admin Panel access to Admissions, Hostel, Gallery, Fees, and InnerPage headers.
- [x] Verify Admin Panel reachability from desktop and mobile headers on every shared public page.

- [x] Extend learner registry persistence for student ID, parent PIN/access field, class teacher, and subjects.
- [x] Add focused Vitest coverage for gallery, alert, learner registry, fee, school-info procedures, and route protection.
- [x] Implement secure S3-backed Gallery Media upload/picker and public bindings with safe fallbacks.
- [x] Save a final rebuilt Admin Portal checkpoint after validation.
- [x] Fix the `/admin` tRPC `publicSite.alert` procedure mismatch and verify the repaired route.
- [x] Inventory and remove the current Supabase/database binding from repository metadata and runtime fallback paths without deleting unknown live data.
- [x] Prepare a clean user-run Supabase SQL schema handoff for the school management tables and document the setup steps.
- [x] Validate the app’s fresh-database configuration with database variables absent and document the required new connection secret.
- [x] Fix the fresh Supabase schema script’s PostgreSQL `CREATE TYPE IF NOT EXISTS` syntax error; the corrected rerunnable script is ready for execution in the new Supabase project.
- [x] Include the existing public gallery image assets in the Admin Gallery Media manager without duplicating managed database records.
- [x] Make database-managed gallery uploads deletable from the Admin Portal; deletion removes the database reference, while original public reference assets remain protected.
- [x] Show a clearly visible delete button beside every database-managed uploaded gallery image in the Admin Portal.
- [x] Add persistent hide/delete controls for the original public gallery assets so every gallery card has an adjacent delete button and deleted assets disappear from the public gallery.
- [x] Make Admin Panel Lock Exit clear the admin session and return to the admin login page for a fresh sign-in.
- [x] Display the current live site-alert banner text prominently in the Admin Portal Alert Banner editor.
- [x] Show the effective homepage alert fallback text and settings in the Admin Alert Banner editor when no saved alert record exists.
- [x] Add a Learner Portal tab to all public navigation and create a simple page with Student ID and PIN fields only.
- [x] Connect registered learner Student IDs and hashed PINs to secure Learner Portal sign-in with learner-scoped access.
- [x] Add isolation, invalid-credential, and learner-session Vitest coverage for the new portal sign-in flow.
- [x] Add Vitest tests for learner.login rejecting wrong Student ID and wrong PIN.
- [x] Add Vitest tests for learner.portal proving results are scoped to ctx.learnerId and cannot return another learner’s performance or attendance records.
- [x] Fix Admin Learners registration rejecting legitimate one-character surnames, while preserving required-field validation.
- [x] Add a visible surname field to the Admin Learners registration form and bind it to surname state.
- [x] Exercise successful one-character surname creation through the Admin Learners form and add matching regression coverage.
- [x] Add UI/form-level regression coverage proving the visible surname field populates surname state and reaches admin.learners.create.
- [x] Add a rendered Admin Learners UI test that types a one-character surname and asserts the create mutation payload.
- [x] Include client UI tests in Vitest discovery and verify the test count increases.
- [x] Exercise the Admin Learners one-character surname submission in the browser and confirm success.
- [x] Add lightweight learner portal sections for performance, behavior, tests, exams, and term reports.
- [x] Add protected Admin Registry edit and delete actions for registered learners.
- [x] Add learner record fields and safe database migration SQL for behavior and term reports if required.
- [x] Add regression tests and responsive verification for learner portal sections and admin learner management.
- [x] Add rendered Learner Portal coverage for performance, behavior, test marks, exam marks, and term-report sections, including empty states.
- [x] Verify the Learner Portal section test is discovered and increases the Vitest count.
- [x] Make each registered learner card clickable and route to a dedicated learner-management detail view.
- [x] Add protected learner detail retrieval and management inputs for portal-facing records.
- [x] Build editable Admin sections for performance, behavior, test marks, exam marks, and term reports.
- [x] Add regression tests and responsive verification for learner-card navigation and detail management.
- [x] Add protected update/delete procedures for existing performance entries so administrators can correct test and exam marks.
- [x] Split the learner detail editor into clear Performance, Test Marks, and Exam Marks panels with existing-record edit/delete controls.
- [x] Add regression tests for editing and deleting an existing learner mark from the dedicated learner-management view.
- [x] Push the latest Nova Crest Academy site code to a private GitHub repository without secrets or generated artifacts.
- [x] Verify the GitHub remote contains the latest checkpointed site commit.
- [x] Audit tracked GitHub contents for secrets, environment files, credentials, build outputs, logs, and temporary scripts.
- [x] Verify the GitHub repository file tree contains the intended project files and excludes generated artifacts.
- [x] Prepare a Netlify-compatible build for the Nova Crest frontend and backend routes without publishing.
- [x] Add Netlify SPA fallback and serverless API routing configuration compatible with the current tRPC/Express entrypoint.
- [x] Document required Netlify environment variables and external-service setup without committing secrets.
- [x] Validate the Netlify-ready build, tests, and configuration, then save a checkpoint.
- [x] Add regression coverage for Netlify build settings, API rewrite, SPA fallback, and function entrypoint configuration.
- [x] Route `/manus-storage/*` through the Netlify API function so managed gallery assets remain accessible after deployment.
- [x] Reconcile the complete current project tree with GitHub, including Netlify deployment files, and push any missing changes.
- [x] Verify the GitHub branch matches local HEAD and contains no tracked secrets or generated artifacts.
- [x] Run the Netlify serverless API function locally against the production-style frontend build.
- [x] Exercise safe API, authentication-rejection, and storage-proxy paths without real email sends or production mutations.
- [x] Record and repair any serverless-specific issues, then rerun the full local validation suite.
