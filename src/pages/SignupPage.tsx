import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthScreen } from "@/src/pages/LoginPage";
import { supabase } from "@/src/lib/supabase";

export function SignupPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: displayName.trim() },
      },
    });
    setPending(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      navigate("/app", { replace: true });
      return;
    }
    setNotice("Check your email to confirm the account, then log in.");
  }

  return (
    <AuthScreen
      title="Sign up"
      error={error}
      notice={notice}
      pending={pending}
      submitLabel="Create account"
      onSubmit={onSubmit}
      email={email}
      password={password}
      onEmail={setEmail}
      onPassword={setPassword}
      displayName={displayName}
      onDisplayName={setDisplayName}
      footer={
        <Link to="/login" className="text-zinc-300">
          Log in
        </Link>
      }
    />
  );
}
