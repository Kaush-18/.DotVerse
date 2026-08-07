import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto w-full px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
      {children}
    </div>
  );
}