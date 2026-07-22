import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition",
        "focus:border-[#D71920] focus:ring-2 focus:ring-red-100",
        className
      )}
      {...props}
    />
  );
}