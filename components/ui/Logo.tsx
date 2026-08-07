import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-3xl font-black tracking-tight select-none"
    >
      <span className="text-primary">.</span>
      <span>DotVerse</span>
    </Link>
  );
}