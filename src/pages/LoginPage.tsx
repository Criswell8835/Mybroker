import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/PasswordField";
import { PublicShell } from "@/components/PublicShell";
import { loginErrorMessage } from "@/src/lib/auth-messages";
import { supabase } from "@/src/lib/supabase";

const fieldClass =
  "mt-2 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const requested = (location.state as { from?: string } | null)?.from;
  const next = requested?.startsWith("/app") ? requested : "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(loginErrorMessage(signInError));
        return;
      }
      navigate(next, { replace: true });
    } catch {
      setError("Could not reach the account service. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function onForgot(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setNotice(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setPending(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setNotice("If that email can receive mail, a reset link is on its way.");
  }

  return (
    <PublicShell>
      <section className="grid min-h-[calc(100vh-8rem)] place-items-center px-5 py-32">
        <form
          onSubmit={resetting ? onForgot : onSubmit}
          className="w-full max-w-md rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-6 py-8 sm:px-8"
        >
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">ACCOUNT</p>
          <h1 className="mt-4 text-[32px] font-normal tracking-[-0.04em] text-white">Log in</h1>
          {notice ? <p className="mt-5 text-sm text-zinc-300">{notice}</p> : null}
          <label className="mt-8 block text-sm text-zinc-400">
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
          {resetting ? null : (
            <PasswordField
              label="Password"
              name="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          )}
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          <button className="btn-primary mt-8 w-full" type="submit" disabled={pending}>
            {pending ? (resetting ? "Please wait" : "Signing in...") : resetting ? "Send reset link" : "Log in"}
          </button>
          <div className="mt-6 flex flex-col gap-3 text-sm text-zinc-500">
            <button
              type="button"
              className="w-fit text-left text-zinc-300"
              onClick={() => {
                setResetting((current) => !current);
                setError(null);
                setNotice(null);
              }}
            >
              {resetting ? "Back to log in" : "Forgot password"}
            </button>
            <p>
              New here?{" "}
              <Link to="/signup" className="text-zinc-300">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </section>
    </PublicShell>
  );
}
