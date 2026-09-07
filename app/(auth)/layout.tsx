import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: null,
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
