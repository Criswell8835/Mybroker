const emailConfirmationSetting =
  "Authentication → Providers → Email → Confirm email";

export const emailConfirmationRequiredMessage = `A session was not created because email confirmation is still required. Turn off ${emailConfirmationSetting} in Supabase, then create the account again.`;

export function signupErrorMessage(error: { message: string }): string {
  const message = error.message.toLowerCase();
  if (
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("user already exists") ||
    message.includes("already exists")
  ) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many attempts. Wait a moment and try again.";
  }
  if (message.includes("invalid") && message.includes("email")) {
    return "Enter a valid email address.";
  }
  if (message.includes("password")) {
    return "Use at least 8 characters.";
  }
  if (message.includes("network") || message.includes("fetch") || message.includes("failed to fetch")) {
    return "Could not reach the account service. Try again.";
  }
  return "The account could not be created. Try again.";
}

export function loginErrorMessage(error: { message: string }): string {
  const message = error.message.toLowerCase();
  if (message.includes("invalid login") || message.includes("invalid credentials")) {
    return "Email or password is incorrect.";
  }
  if (message.includes("email not confirmed")) {
    return `This account is waiting on email confirmation. Turn off ${emailConfirmationSetting} in Supabase for immediate sign-in.`;
  }
  if (message.includes("network") || message.includes("fetch") || message.includes("failed to fetch")) {
    return "Could not reach the account service. Try again.";
  }
  return "Could not log in. Check the email and password and try again.";
}
