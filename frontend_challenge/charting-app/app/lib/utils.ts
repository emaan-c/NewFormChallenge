import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines multiple class names with tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatter utility
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
} 