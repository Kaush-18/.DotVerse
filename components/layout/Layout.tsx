import { ReactNode } from "react";

interface LayoutProps{
    children:ReactNode;
}

export default function Layout({children}:LayoutProps){

    return(

<div
  className="
    mx-auto
    w-full
    max-w-[1680px]
    px-8
    lg:px-12
    xl:px-16
    2xl:px-20
  "
>
  {children}
</div>

    );

}