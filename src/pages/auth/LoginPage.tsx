import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/useAuth";
import { useLogin } from "@/hooks/auth/mutations";
import { getErrorMessage } from "@/lib/utils";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";

const auth = LABELS.AUTH;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate: signIn, isPending } = useLogin();
  const [email, setEmail] = useState<string>(auth.DEMO_EMAIL);
  const [password, setPassword] = useState<string>(auth.DEMO_PASSWORD);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    signIn(
      { email, password },
      {
        onSuccess: (tokens) => {
          login(tokens);
          navigate(ROUTES.DASHBOARD, { replace: true });
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, auth.LOGIN_ERROR));
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="w-full max-w-md px-8">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white">
            <Zap className="h-5 w-5" />
            <span className="text-lg font-bold tracking-tight">
              {auth.BRAND}
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            {auth.WELCOME_TITLE}
          </h1>
          <p className="text-slate-400">{auth.TAGLINE}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                {auth.EMAIL_LABEL}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10! px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                {auth.PASSWORD_LABEL}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10! px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              {isPending ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  {auth.SIGNING_IN}
                </>
              ) : (
                auth.SIGN_IN
              )}
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-slate-500">
            {auth.DEMO_HINT}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
