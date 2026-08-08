import { ReactNode } from "react";
import clsx from "clsx";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden",
        className
      )}
    >
      {children}
    </section>
  );
}