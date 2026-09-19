import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 12 && digits.length !== 13) {
    return value;
  }

  const country = digits.slice(0, 2);
  const ddd = digits.slice(2, 4);
  const number = digits.slice(4);
  const numberFormatted =
    number.length === 9
      ? `${number.slice(0, 5)}-${number.slice(5)}`
      : `${number.slice(0, 4)}-${number.slice(4)}`;

  return `+${country} (${ddd}) ${numberFormatted}`;
}