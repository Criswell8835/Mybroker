import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CountryField } from "@/components/CountryField";
import { PasswordField } from "@/components/PasswordField";
import { PublicShell } from "@/components/PublicShell";
import { emailConfirmationRequiredMessage, signupErrorMessage } from "@/src/lib/auth-messages";
import { supabase } from "@/src/lib/supabase";

const fieldClass =
  "mt-2 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (trimmedName.length < 2) {
      setError("Enter your name.");
      return;
    }
    if (trimmedName.length > 80) {
      setError("Use 80 characters or fewer for your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!country) {
      setError("Select a country.");
      return;
    }
    setPending(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { display_name: trimmedName, country },
        },
      });
      if (signUpError) {
        setError(signupErrorMessage(signUpError));
        return;
      }
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setError("An account with this email already exists. Try logging in instead.");
        return;
      }
      if (!data.session) {
        setError(emailConfirmationRequiredMessage);
        return;
      }
      navigate("/app", { replace: true });
    } catch {
      setError("Could not reach the account service. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicShell>
      <section className="grid min-h-[calc(100vh-8rem)] place-items-center px-5 py-32">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-6 py-8 sm:px-8"
        >
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">ACCOUNT</p>
          <h1 className="mt-4 text-[32px] font-normal tracking-[-0.04em] text-white">Create Account</h1>
          <p className="mt-3 text-[13px] leading-6 text-zinc-500">
            Identity checks are not part of this form.
          </p>
          <label className="mt-8 block text-sm text-zinc-400">
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className={fieldClass}
            />
          </label>
          <label className="mt-5 block text-sm text-zinc-400">
            Country
            <CountryField value={country} onChange={setCountry} />
          </label>
          <label className="mt-5 block text-sm text-zinc-400">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className={fieldClass}
            />
          </label>
          <PasswordField
            label="Password"
            name="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm Password"
            name="confirm-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          <button className="btn-primary mt-8 w-full" type="submit" disabled={pending}>
            {pending ? "Creating Account..." : "Create Account"}
          </button>
          <p className="mt-6 text-sm text-zinc-500">
            Already registered?{" "}
            <Link to="/login" className="text-zinc-300">
              Log In
            </Link>
          </p>
        </form>
      </section>
    </PublicShell>
  );
}
