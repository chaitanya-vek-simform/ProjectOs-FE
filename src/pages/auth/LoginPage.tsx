import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/common/auth-layout/auth-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/useAuth";
import { useLogin } from "@/hooks/auth/mutations";
import { getErrorMessage } from "@/lib/utils";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";

const auth = LABELS.AUTH;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate: signIn, isPending } = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: auth.DEMO_EMAIL, password: auth.DEMO_PASSWORD },
  });

  const onSubmit = (values: LoginFormValues) => {
    signIn(values, {
      onSuccess: (tokens) => {
        login(tokens);
        navigate(ROUTES.DASHBOARD, { replace: true });
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, auth.LOGIN_ERROR));
      },
    });
  };

  return (
    <AuthLayout
      title={auth.WELCOME_TITLE}
      tagline={auth.TAGLINE}
      footer={
        <div className="space-y-2">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-indigo-400 hover:text-indigo-300"
          >
            {auth.FORGOT_PASSWORD_LINK}
          </Link>
          <p>
            {auth.NO_ACCOUNT_PROMPT}{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {auth.REGISTER_LINK}
            </Link>
          </p>
        </div>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  {auth.EMAIL_LABEL}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="border-white/20 bg-white/10! text-white placeholder-slate-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  {auth.PASSWORD_LABEL}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="border-white/20 bg-white/10! text-white placeholder-slate-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {auth.SIGNING_IN}
              </>
            ) : (
              auth.SIGN_IN
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}

export default LoginPage;
