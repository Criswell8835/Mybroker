import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const requested = (location.state as { from?: string } | null)?.from;
  const next = requested?.startsWith("/app") ? requested : "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate(next, { replace: true });
  }

  return (
    <AuthScreen
      title="Log in"
      error={error}
      pending={pending}
      submitLabel="Log in"
      onSubmit={onSubmit}
      email={email}
      password={password}
      onEmail={setEmail}
      onPassword={setPassword}
      footer={
        <Link to="/signup" className="text-zinc-300">
          Create an account
        </Link>
      }
    />
  );
}

export function AuthScreen({
  title,
  error,
  pending,
  submitLabel,
  onSubmit,
  email,
  password,
  onEmail,
  onPassword,
  displayName,
  onDisplayName,
  notice,
  footer,
}: {
  title: string;
  error: string | null;
  pending: boolean;
  submitLabel: string;
  onSubmit: (event: FormEvent) => void;
  email: string;
  password: string;
  onEmail: (value: string) => void;
  onPassword: (value: string) => void;
  displayName?: string;
  onDisplayName?: (value: string) => void;
  notice?: string | null;
  footer: ReactNode;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canTogglePassword = Boolean(onDisplayName);

  return (
    <main className="grid min-h-full place-items-center px-6 py-24">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="text-[11px] tracking-[0.26em] text-zinc-500">{title}</p>
        {notice ? <p className="mt-6 text-sm text-zinc-300">{notice}</p> : null}
        {onDisplayName ? (
          <label className="mt-8 block text-sm text-zinc-400">
            Name
            <input
              value={displayName}
              onChange={(event) => onDisplayName(event.target.value)}
              autoComplete="name"
              className="mt-2 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none"
            />
          </label>
        ) : null}
        <label className="mt-5 block text-sm text-zinc-400">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => onEmail(event.target.value)}
            autoComplete="email"
            className="mt-2 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none"
          />
        </label>
        <label className="mt-5 block text-sm text-zinc-400">
          Password
          {canTogglePassword ? (
            <span className="relative mt-2 block">
              <input
                type={passwordVisible ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(event) => onPassword(event.target.value)}
                autoComplete="new-password"
                className="signup-password w-full rounded-full border border-white/10 bg-white/[0.03] py-3 text-zinc-100 outline-none"
              />
              <button
                type="button"
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => setPasswordVisible((visible) => !visible)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                aria-pressed={passwordVisible}
                className="signup-password-toggle"
              >
                {passwordVisible ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </span>
          ) : (
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => onPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none"
            />
          )}
        </label>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        <button className="btn-primary mt-8 w-full" type="submit" disabled={pending}>
          {pending ? "Please wait" : submitLabel}
        </button>
        <p className="mt-6 text-sm text-zinc-500">{footer}</p>
      </form>
    </main>
  );
}
