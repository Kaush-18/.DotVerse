import type { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`
        mx-auto
        w-full
        max-w-[1440px]
        px-5
        sm:px-6
        md:px-8
        lg:px-10
        xl:px-12
        2xl:px-16
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}