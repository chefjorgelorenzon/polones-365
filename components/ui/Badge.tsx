import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Badge({
  children,
}: Props) {
  return (
    <div className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
      {children}
    </div>
  );
}