import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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
import { useForgotPassword } from "@/hooks/auth/mutations";
import { getErrorMessage } from "@/lib/utils";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth";

const auth = LABELS.AUTH;

function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const { mutate: sendResetEmail, isPending } = useForgotPassword();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    sendResetEmail(values, {
      onSuccess: () => setSubmitted(true),
      onError: (error) => {
        toast.error(getErrorMessage(error, auth.FORGOT_PASSWORD_ERROR));
      },
    });
  };

  return (
    <AuthLayout
      title={auth.FORGOT_PASSWORD_TITLE}
      tagline={auth.FORGOT_PASSWORD_TAGLINE}
      footer={
        <Link
          to={ROUTES.LOGIN}
          className="text-indigo-400 hover:text-indigo-300"
        >
          {auth.BACK_TO_LOGIN}
        </Link>
      }
    >
      {submitted ? (
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold text-white">
            {auth.FORGOT_PASSWORD_SUCCESS_TITLE}
          </h2>
          <p className="text-sm text-slate-400">
            {auth.FORGOT_PASSWORD_SUCCESS_BODY}
          </p>
        </div>
      ) : (
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
                  {auth.SENDING_RESET_LINK}
                </>
              ) : (
                auth.SEND_RESET_LINK
              )}
            </Button>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
