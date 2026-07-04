import type { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, resolving conflicts (later wins).
 * The single source of truth for composing className props across the design system.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build up-to-two-character initials from a full name (e.g. "Ada Lovelace" → "AL"). */
export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((token) => token[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Ensure a URL is absolute with an https scheme; returns undefined for empty values. */
export const ensureHttps = (
  url: string | null | undefined,
): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

/** Format an ISO date string as "DD MMM YYYY" (e.g. "05 Jun 2025"); null when absent/invalid. */
export const formatDate = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const date = parseISO(value.split("T")[0]);
  if (!isValid(date)) return null;
  return format(date, "dd MMM yyyy");
};

/** Disable future dates in a date picker. */
export const disableFutureDates = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

type ApiValidationIssue = {
  field?: string;
  message?: string;
  msg?: string;
  loc?: Array<string | number>;
};

/**
 * Extract a human-readable message from an Axios error, falling back to a default.
 * Handles plain string payloads (`message` or FastAPI's `detail`) as well as
 * field-level validation arrays from either shape.
 */
export const getErrorMessage = (error: Error, fallback: string): string => {
  const axiosError = error as AxiosError<{
    message?: string | ApiValidationIssue[];
    detail?: string | ApiValidationIssue[];
  }>;
  const data = axiosError.response?.data;
  const text = data?.detail ?? data?.message;
  if (typeof text === "string" && text) return text;
  if (Array.isArray(text) && text.length > 0) {
    return (
      text
        .map((issue) => issue?.msg ?? issue?.message ?? "")
        .filter(Boolean)
        .join(", ") || fallback
    );
  }
  return fallback;
};

/**
 * Export an array of records to a downloadable CSV file.
 * @param data    Array of objects to export
 * @param filename File name without the .csv extension
 * @param headers Optional custom column labels keyed by field
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: Record<string, string>,
): void {
  if (data.length === 0) return;

  const keys = Object.keys(data[0]);
  const headerRow = headers
    ? keys.map((key) => headers[key] || key).join(",")
    : keys.join(",");

  const rows = data.map((item) =>
    keys
      .map((key) => {
        const value = item[key];
        const stringValue =
          value === null || value === undefined ? "" : String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(","),
  );

  const csvContent = [headerRow, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
