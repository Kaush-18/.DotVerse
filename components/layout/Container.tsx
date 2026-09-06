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
        `
          mx-auto
          w-full
          max-w-[1440px]

          px-5

          sm:px-8

          md:px-10

          lg:px-12

          xl:px-[clamp(64px,5vw,72px)]
        `,
        className
      )}
    >
      {children}
    </div>
  );
}