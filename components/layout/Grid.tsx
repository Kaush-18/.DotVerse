import { ReactNode } from "react";

export default function Grid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        grid
        min-h-[calc(100vh-80px)]
        items-center
        gap-12

        lg:grid-cols-[45%_55%]
      "
    >
      {children}
    </div>
  );
}