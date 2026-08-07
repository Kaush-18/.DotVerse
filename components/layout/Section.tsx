import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Section({
  children,
  className,
}: Props) {
  return (
    <section
      className={clsx(
        "relative w-full overflow-hidden",
        className
      )}
    >
      {children}
    </section>
  );
}