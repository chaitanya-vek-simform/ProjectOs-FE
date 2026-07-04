import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/hooks/auth/mutations";
import { getErrorMessage } from "@/lib/utils";
import { ROLE_OPTIONS } from "@/constants/auth";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth";

const auth = LABELS.AUTH;

function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: signUp, isPending } = useRegister();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      orgName: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    const { confirmPassword: _confirmPassword, ...dto } = values;
    signUp(dto, {
      onSuccess: () => {
        toast.success(auth.REGISTER_SUCCESS);
        navigate(ROUTES.LOGIN, { replace: true });
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, auth.REGISTER_ERROR));
      },
    });
  };

  return (
    <AuthLayout
      title={auth.REGISTER_TITLE}
      tagline={auth.REGISTER_TAGLINE}
      maxWidthClassName="max-w-2xl"
      footer={
        <p>
          {auth.ALREADY_HAVE_ACCOUNT_PROMPT}{" "}
          <Link
            to={ROUTES.LOGIN}
            className="text-indigo-400 hover:text-indigo-300"
          >
            {auth.SIGN_IN_LINK}
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 items-start gap-x-4 gap-y-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    {auth.NAME_LABEL}
                  </FormLabel>
                  <FormControl>
                    <Input
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
              name="orgName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    {auth.ORG_NAME_LABEL}
                  </FormLabel>
                  <FormControl>
                    <Input
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    {auth.ROLE_LABEL}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-white/20 bg-white/10! w-full text-white">
                        <SelectValue placeholder={auth.ROLE_PLACEHOLDER} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {auth.CREATING_ACCOUNT}
              </>
            ) : (
              auth.CREATE_ACCOUNT
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}

export default RegisterPage;
