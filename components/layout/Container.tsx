import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1600px] px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20",
        className
      )}
    >
      {children}
    </div>
  );
}