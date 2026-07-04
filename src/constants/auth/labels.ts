export const AUTH_LABELS = {
  BRAND: "ProjectOS",
  WELCOME_TITLE: "Welcome back",
  TAGLINE: "AI-Powered Project Lifecycle Operating System",
  EMAIL_LABEL: "Email",
  PASSWORD_LABEL: "Password",
  SIGN_IN: "Sign In",
  SIGNING_IN: "Signing in…",
  DEMO_HINT: "Demo: admin@simform.com / demo1234",
  DEMO_EMAIL: "admin@simform.com",
  DEMO_PASSWORD: "demo1234",
  LOGIN_ERROR: "Invalid email or password.",

  // Login footer links
  FORGOT_PASSWORD_LINK: "Forgot password?",
  NO_ACCOUNT_PROMPT: "Don't have an account?",
  REGISTER_LINK: "Create one",

  // Forgot Password page
  FORGOT_PASSWORD_TITLE: "Forgot your password?",
  FORGOT_PASSWORD_TAGLINE: "Enter your email and we'll send you a reset link.",
  SEND_RESET_LINK: "Send reset link",
  SENDING_RESET_LINK: "Sending…",
  FORGOT_PASSWORD_SUCCESS_TITLE: "Check your email",
  FORGOT_PASSWORD_SUCCESS_BODY:
    "If an account exists for that email, we've sent a link to reset your password.",
  FORGOT_PASSWORD_ERROR: "Something went wrong. Please try again.",
  BACK_TO_LOGIN: "Back to login",

  // Reset Password page
  RESET_PASSWORD_TITLE: "Reset your password",
  RESET_PASSWORD_TAGLINE: "Choose a new password for your account.",
  NEW_PASSWORD_LABEL: "New password",
  CONFIRM_PASSWORD_LABEL: "Confirm password",
  RESET_PASSWORD_SUBMIT: "Reset password",
  RESETTING_PASSWORD: "Resetting…",
  RESET_PASSWORD_SUCCESS: "Password reset successfully. Please sign in.",
  RESET_PASSWORD_ERROR: "Could not reset password. The link may have expired.",
  RESET_PASSWORD_INVALID_LINK_TITLE: "Invalid or expired link",
  RESET_PASSWORD_INVALID_LINK_BODY:
    "This password reset link is invalid or has expired. Please request a new one.",
  REQUEST_NEW_LINK: "Request a new link",

  // Register page
  REGISTER_TITLE: "Create your account",
  REGISTER_TAGLINE: "Get started with ProjectOS",
  NAME_LABEL: "Full name",
  ORG_NAME_LABEL: "Organization name",
  ROLE_LABEL: "Role",
  ROLE_PLACEHOLDER: "Select your role",
  CREATE_ACCOUNT: "Create account",
  CREATING_ACCOUNT: "Creating account…",
  REGISTER_SUCCESS: "Account created successfully. Please sign in.",
  REGISTER_ERROR: "Could not create account. Please try again.",
  ALREADY_HAVE_ACCOUNT_PROMPT: "Already have an account?",
  SIGN_IN_LINK: "Sign in",

  // Shared validation messages
  EMAIL_REQUIRED: "Email is required.",
  EMAIL_INVALID: "Enter a valid email address.",
  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_COMPLEXITY:
    "At least 8 characters, with uppercase, lowercase, a number, and a special character.",
  PASSWORD_COMPLEXITY_ERROR:
    "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  NAME_REQUIRED: "Name is required.",
  ROLE_REQUIRED: "Role is required.",
  ORG_NAME_REQUIRED: "Organization name is required.",

  // Password input visibility toggle
  SHOW_PASSWORD: "Show password",
  HIDE_PASSWORD: "Hide password",
} as const;
