# EmailJS delivery debugging findings

- The reported failure was HTTP 403 from EmailJS: API access from non-browser environments was disabled.
- The signed-in EmailJS account security page was opened at https://dashboard.emailjs.com/admin/account/security.
- The setting “Allow EmailJS API for non-browser applications” was enabled and the account-level Save Changes action was clicked with user confirmation.
- The page now reports both API settings checkboxes as checked, including “Use Private Key (recommended)”.
- The project submission path uses the server-side EmailJS REST request with `service_id`, `template_id`, `user_id`, and `template_params`.
- The parent/guardian email field is included and mapped to `email`, `guardian_email`, and `reply_to` for the EmailJS template.
