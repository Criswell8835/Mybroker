import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  name: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="mt-5 block text-sm text-zinc-400">
      {label}
      <span className="relative mt-2 block">
        <input
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="signup-password w-full rounded-full border border-white/10 bg-white/[0.03] py-3 text-zinc-100 outline-none"
        />
        <button
          type="button"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="signup-password-toggle"
        >
          {visible ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
        </button>
      </span>
    </label>
  );
}
