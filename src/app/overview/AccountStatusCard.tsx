import { Link } from "react-router-dom";

const kycLabel: Record<string, string> = {
  not_started: "Not Started",
  pending: "In Review",
  verified: "Verified",
  rejected: "Not Approved",
  resubmission_required: "Needs Update",
};

export function AccountStatusCard({
  accountStatus,
  kycStatus,
}: {
  accountStatus: string;
  kycStatus: string;
}) {
  return (
    <article className="desk-card rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-5 sm:p-6">
      <h2 className="text-[18px] tracking-[-0.03em] text-white">Account</h2>
      <dl className="mt-5 space-y-4 text-[13px]">
        <div className="flex items-center justify-between">
          <dt className="text-zinc-500">Account Status</dt>
          <dd className="text-white">{accountStatus}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-zinc-500">Identity Verification</dt>
          <dd className="text-white">{kycLabel[kycStatus] ?? "Not Started"}</dd>
        </div>
      </dl>
      <Link to="/app/verification" className="mt-6 inline-flex text-[13px] text-orange">
        Complete Verification
      </Link>
      <p className="mt-3 text-[12px] leading-5 text-zinc-600">
        Verification is separate from sign-in. This desk stays open while it is not started.
      </p>
    </article>
  );
}
