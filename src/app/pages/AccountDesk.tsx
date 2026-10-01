import { useState } from "react";
import { Link } from "react-router-dom";
import { faqItems } from "@/lib/faq";
import { useDeskState } from "@/src/app/state/DeskState";
import { StatusPill } from "@/src/app/ui/StatusPill";
import { supabase } from "@/src/lib/supabase";

const steps = ["Personal information", "Identity document", "Live selfie", "Review status"];

const kycCopy: Record<string, string> = {
  not_started: "Not started",
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
  resubmission_required: "Rejected",
};

export function ProfileDesk({
  name,
  email,
  country,
  userId,
  onSaved,
}: {
  name: string;
  email: string;
  country: string;
  userId: string;
  onSaved: (name: string) => void;
}) {
  const [draft, setDraft] = useState(name);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function save() {
    const next = draft.trim();
    if (next.length < 2 || next.length > 80) {
      setMessage("Name must be 2–80 characters.");
      return;
    }
    setPending(true);
    const { error } = await supabase.from("profiles").update({ display_name: next }).eq("id", userId);
    setPending(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    onSaved(next);
    setMessage("Name saved on your profile.");
  }

  return (
    <section className="max-w-xl rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
      <h2 className="text-[15px] text-white">Profile</h2>
      <label className="mt-4 block text-[12px] text-zinc-500">
        Name
        <input className="desk-field mt-1" value={draft} onChange={(event) => setDraft(event.target.value)} />
      </label>
      <Field label="Email" value={email || "Not on file"} />
      <Field label="Country" value={country} />
      <Field label="Phone" value="Not on file" />
      <Field label="Account ID" value={userId} />
      <button type="button" className="desk-action desk-action-buy mt-4" disabled={pending} onClick={() => void save()}>
        {pending ? "Saving" : "Save name"}
      </button>
      {message ? <p className="mt-3 text-[12px] text-zinc-400">{message}</p> : null}
      <p className="mt-3 text-[11px] leading-5 text-zinc-600">Email, country, and phone are shown as stored. Only the profile name can be changed from this desk.</p>
    </section>
  );
}

export function VerificationDesk({ kycStatus }: { kycStatus: string }) {
  const [step, setStep] = useState(kycStatus === "verified" ? 3 : kycStatus === "pending" ? 3 : 0);
  const label = kycCopy[kycStatus] ?? "Not started";

  return (
    <section className="max-w-2xl rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] text-white">Verification</h2>
        <StatusPill value={label} />
      </div>
      <p className="mt-2 text-[12px] leading-5 text-zinc-500">Identity review is separate from sign-in. This page does not collect or store documents.</p>
      <ol className="mt-5 grid gap-2 sm:grid-cols-4">
        {steps.map((item, index) => (
          <li key={item} className={index <= step ? "rounded-md border border-orange/30 px-3 py-2 text-[12px] text-orange" : "rounded-md border border-white/10 px-3 py-2 text-[12px] text-zinc-500"}>
            <span className="block text-[10px] tracking-[0.14em]">0{index + 1}</span>
            {item}
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-md border border-white/[0.05] p-4 text-[13px] text-zinc-300">
        {kycStatus === "verified"
          ? "This profile is marked verified."
          : "Document upload and selfie capture are not open. Moving the stepper does not submit a review."}
      </div>
      {kycStatus !== "verified" ? (
        <div className="mt-4 flex gap-2">
          <button type="button" className="desk-action" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Back</button>
          <button type="button" className="desk-action desk-action-buy" disabled={step === steps.length - 1} onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Continue</button>
        </div>
      ) : null}
    </section>
  );
}

export function SecurityDesk() {
  return (
    <div className="grid max-w-3xl gap-3">
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Password</h2>
        <p className="mt-2 text-[13px] leading-6 text-zinc-400">Password changes are not open from this desk. Sign-in still uses the existing account password.</p>
      </section>
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Two-factor authentication</h2>
        <p className="mt-2 text-[13px] text-zinc-400">Not connected.</p>
      </section>
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Active sessions</h2>
        <div className="mt-3 flex items-center justify-between text-[13px]">
          <span className="text-zinc-200">This browser</span>
          <StatusPill value="Active" />
        </div>
      </section>
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Login history</h2>
        <p className="mt-2 text-[13px] text-zinc-400">Current session only. Older sign-ins are not listed here.</p>
      </section>
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Security notifications</h2>
        <p className="mt-2 text-[13px] text-zinc-400">Sign-in notices are not armed from this screen yet.</p>
      </section>
    </div>
  );
}

export function SettingsDesk() {
  const { notices, setNotices, confirmTicket, setConfirmTicket } = useDeskState();
  const sections = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "trading", label: "Trading preferences" },
    { id: "risk", label: "Risk preferences" },
    { id: "subscription", label: "Subscription" },
    { id: "sessions", label: "Sessions" },
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)]">
      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
        {sections.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="block whitespace-nowrap rounded-md px-3 py-2 text-[13px] text-zinc-400 hover:bg-white/[0.04] hover:text-white">
            {item.label}
          </a>
        ))}
      </nav>
      <div className="space-y-3">
        <section id="profile" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Profile</h2>
          <p className="mt-2 text-[13px] text-zinc-400">Name and account details live on the profile page.</p>
          <Link to="/app/profile" className="mt-3 inline-flex text-[13px] text-orange">Open profile</Link>
        </section>
        <section id="notifications" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Notifications</h2>
          <label className="mt-3 flex items-center gap-2 text-[13px] text-zinc-300">
            <input type="checkbox" checked={notices} onChange={() => setNotices(!notices)} />
            Show desk notices in this session
          </label>
        </section>
        <section id="trading" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Trading preferences</h2>
          <label className="mt-3 flex items-center gap-2 text-[13px] text-zinc-300">
            <input type="checkbox" checked={confirmTicket} onChange={() => setConfirmTicket(!confirmTicket)} />
            Ask before preparing a preview ticket
          </label>
          <p className="mt-2 text-[12px] text-zinc-600">This preference stays in the session. Tickets still do not execute.</p>
        </section>
        <section id="appearance" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Appearance</h2>
          <p className="mt-2 text-[13px] text-zinc-400">The desk uses the dark theme.</p>
        </section>
        <section id="risk" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Risk preferences</h2>
          <p className="mt-2 text-[13px] text-zinc-400">Position size, daily loss, and volatility limits are set on each AI strategy.</p>
          <Link to="/app/ai-trading" className="mt-3 inline-flex text-[13px] text-orange">Open AI Trading</Link>
        </section>
        <section id="subscription" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Subscription</h2>
          <p className="mt-2 text-[13px] text-zinc-400">View the current plan, compare Free, Pro, and Advanced, and manage access.</p>
          <Link to="/app/subscription" className="mt-3 inline-flex text-[13px] text-orange">Open subscription</Link>
        </section>
        <section id="sessions" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Sessions</h2>
          <p className="mt-2 text-[13px] text-zinc-400">This browser is the only session shown. Older sign-ins are not listed.</p>
        </section>
        <section id="security" className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h2 className="text-[15px] text-white">Security</h2>
          <p className="mt-2 text-[13px] text-zinc-400">Password changes and two-factor authentication are not connected from this desk.</p>
          <Link to="/app/security" className="mt-3 inline-flex text-[13px] text-orange">Open security</Link>
        </section>
      </div>
    </div>
  );
}

export function HelpDesk() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const groups = ["All", "Account", "Trading", "Money", "Verification"];
  const articles = faqItems.map((item, index) => ({
    ...item,
    group: ["Account", "Money", "Trading", "Money", "Trading", "Trading", "Trading", "Trading", "Trading", "Verification"][index] ?? "Account",
  }));
  const rows = articles.filter((item) => {
    const grouped = group === "All" || item.group === group;
    const needle = query.trim().toLowerCase();
    return grouped && (!needle || `${item.question} ${item.answer}`.toLowerCase().includes(needle));
  });

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="space-y-3 border-b border-white/[0.05] px-4 py-3">
        <h2 className="text-[15px] text-white">Help Center</h2>
        <input className="desk-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides" aria-label="Search guides" />
        <div className="flex gap-2 overflow-x-auto">
          {groups.map((item) => (
            <button key={item} type="button" className={item === group ? "desk-action desk-action-buy" : "desk-action"} onClick={() => setGroup(item)}>
              {item}
            </button>
          ))}
        </div>
      </header>
      <ul>
        {rows.map((item) => (
          <li key={item.id} className="border-t border-white/[0.04] px-4 py-3">
            <p className="text-[11px] tracking-[0.14em] text-zinc-600">{item.group.toUpperCase()}</p>
            <p className="mt-1 text-[14px] text-white">{item.question}</p>
            <p className="mt-1 text-[13px] leading-6 text-zinc-400">{item.answer}</p>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? <p className="px-4 py-6 text-[13px] text-zinc-500">No guides match.</p> : null}
    </section>
  );
}

export function SupportDesk({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="grid max-w-3xl gap-3">
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Contact support</h2>
        <p className="mt-2 text-[13px] text-zinc-400">This note stays on the screen. It is not sent.</p>
        <p className="mt-3 text-[12px] text-zinc-500">From {email || "this account"}</p>
        <textarea className="desk-field mt-3 h-28 py-2" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="How can we help?" />
        <button
          type="button"
          className="desk-action desk-action-buy mt-3"
          onClick={() => {
            if (message.trim().length < 4) return;
            setSent(true);
          }}
        >
          Keep note
        </button>
        {sent ? <p className="mt-3 text-[12px] text-zinc-400">Saved in this view only.</p> : null}
      </section>
      <Link to="/app/help" className="text-[13px] text-orange">Open the help center</Link>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="text-[12px] text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-[13px] text-zinc-200">{value}</p>
    </div>
  );
}
