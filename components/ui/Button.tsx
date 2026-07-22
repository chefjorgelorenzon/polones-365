import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  href?: string;
}

export default function Button({
  children,
  variant = "primary",
  href,
  className,
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-[#D71920] text-white hover:bg-[#B91319]",

    secondary:
      "bg-zinc-900 text-white hover:bg-zinc-800",

    outline:
      "border border-zinc-300 bg-white hover:bg-zinc-100",
  };

  const classes = cn(
    "inline-flex h-12 items-center justify-center rounded-xl px-6 font-bold transition-all duration-200",
    styles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}