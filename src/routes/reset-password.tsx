import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — LUMINA" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Not signed in");
      return;
    }
    setLoading(true);
    try {
      const raw = localStorage.getItem("lumina:users");
      const users = raw ? JSON.parse(raw) : {};
      if (users[user.id]) {
        users[user.id].password = password;
        localStorage.setItem("lumina:users", JSON.stringify(users));
      }
      toast.success("Password updated");
      navigate({ to: "/account" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <div className="container-edge py-16 lg:py-24 max-w-md mx-auto">
        <h1 className="display-xl text-ink mb-3">Reset password</h1>
        <p className="text-muted-foreground mb-8">Enter a new password for your account.</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            minLength={6}
            placeholder="New password"
            className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
          />
          <PillButton variant="ink" size="lg" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Update password"}
          </PillButton>
        </form>
      </div>
    </SiteLayout>
  );
}
