import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";

export default function SignInPage() {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <SiteLayout>
        <div className="container-edge py-24 text-center">
          <h1 className="display-xl text-ink mb-4">You're signed in</h1>
          <p className="text-muted-foreground mb-8">Welcome back, {user.name}.</p>
          <Link to="/account">
            <PillButton variant="ink" size="lg">
              Go to account
            </PillButton>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        toast.success("Welcome back");
        navigate("/");
      } else {
        await signUp(name, email, password);
        toast.success("Account created");
        navigate("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <div className="container-edge py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="eyebrow text-emerald-vivid mb-3">Members</p>
          <h1 className="display-xl text-ink mb-5">
            {mode === "signin" ? "Welcome back." : "Become a Member."}
          </h1>
          <p className="text-muted-foreground max-w-md">
            Join LUMINA for early access to drops, members-only releases, free shipping, and
            editorial stories from our world.
          </p>
        </div>

        <div className="border border-border rounded-2xl p-8 bg-cloud/30">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 h-10 rounded-full text-sm font-semibold ${mode === "signin" ? "bg-ink text-white" : "bg-transparent text-ink"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 h-10 rounded-full text-sm font-semibold ${mode === "signup" ? "bg-ink text-white" : "bg-transparent text-ink"}`}
            >
              Join
            </button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
                className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Email"
              className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="Password"
              minLength={6}
              className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
            />
            <PillButton variant="ink" size="lg" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create account"}
            </PillButton>
          </form>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PillButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => signInWithGoogle().catch((e: Error) => toast.error(e.message))}
          >
            Continue with Google
          </PillButton>
        </div>
      </div>
    </SiteLayout>
  );
}
