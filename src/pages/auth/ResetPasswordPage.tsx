import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { AuthLayout } from "@/components/common/auth-layout/auth-layout";
import { PasswordInput } from "@/components/common/password-input/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResetPassword } from "@/hooks/auth/mutations";
import { getErrorMessage } from "@/lib/utils";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth";

const auth = LABELS.AUTH;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: resetPassword, isPending } = useResetPassword();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <AuthLayout title={auth.RESET_PASSWORD_INVALID_LINK_TITLE} tagline="">
        <div className="space-y-4 text-center">
          <p className="text-sm text-slate-400">
            {auth.RESET_PASSWORD_INVALID_LINK_BODY}
          </p>
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500">
            <Link to={ROUTES.FORGOT_PASSWORD}>{auth.REQUEST_NEW_LINK}</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast.success(auth.RESET_PASSWORD_SUCCESS);
          navigate(ROUTES.LOGIN, { replace: true });
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, auth.RESET_PASSWORD_ERROR));
        },
      },
    );
  };

  return (
    <AuthLayout
      title={auth.RESET_PASSWORD_TITLE}
      tagline={auth.RESET_PASSWORD_TAGLINE}
      footer={
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-indigo-400 hover:text-indigo-300"
        >
          {auth.REQUEST_NEW_LINK}
        </Link>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  {auth.NEW_PASSWORD_LABEL}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    className="border-white/20 bg-white/10! text-white placeholder-slate-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  {auth.PASSWORD_COMPLEXITY}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  {auth.CONFIRM_PASSWORD_LABEL}
                </FormLabel>
                <FormControl>
                  <PasswordInput
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
                {auth.RESETTING_PASSWORD}
              </>
            ) : (
              auth.RESET_PASSWORD_SUBMIT
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
