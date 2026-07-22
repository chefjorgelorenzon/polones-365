import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: ReactNode;
}

export default function Heading({
  title,
  subtitle,
}: Props) {
  return (
    <>
      <h2 className="text-4xl font-black tracking-tight text-zinc-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
          {subtitle}
        </p>
      )}
    </>
  );
}
