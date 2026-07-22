import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}