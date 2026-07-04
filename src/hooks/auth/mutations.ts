import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/services/auth/authApi";

import type {
  AuthTokens,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "@/types/auth";

export function useLogin() {
  return useMutation<AuthTokens, Error, LoginDto>({
    mutationFn: authApi.login,
  });
}

export function useRegister() {
  return useMutation<AuthTokens, Error, RegisterDto>({
    mutationFn: authApi.register,
  });
}

export function useForgotPassword() {
  return useMutation<void, Error, ForgotPasswordDto>({
    mutationFn: authApi.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordDto>({
    mutationFn: authApi.resetPassword,
  });
}
