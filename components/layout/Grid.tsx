import { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
}

export default function Grid({ children }: GridProps) {
  return (
    <div
    className="
    grid
    items-center
    gap-16
    
    grid-cols-[42%_58%]
    
    grid-cols-1
    "
    >
      {children}
    </div>
  );
}