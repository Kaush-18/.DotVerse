"use client";


import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import PageReveal from "@/components/animations/PageReveal";


export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();


  const orderNumber = searchParams.get("order");


  useEffect(() => {
    if (!orderNumber) {
      router.replace("/shop");
    }
  }, [orderNumber, router]);


  if (!orderNumber) {
    return null;
  }


  return (
    <PageReveal>
      <Navbar />


      <main className="min-h-[calc(100vh-80px)] bg-[#07040d] px-6 py-24 text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">


          {/* Success icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10">
            <span className="text-4xl text-violet-400">
              ✓
            </span>
          </div>


          {/* Heading */}
          <h1 className="mt-8 text-4xl font-bold md:text-5xl">
            ORDER CONFIRMED
          </h1>


          <p className="mt-4 max-w-xl text-white/60">
            Thank you for shopping with DotVerse.
            Your order has been successfully placed.
          </p>


          {/* Order card */}
          <div className="mt-10 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-violet-400">
              Order Number
            </p>
            <p className="mt-2 text-2xl font-bold">{orderNumber}</p>
          </div>
          
          <button
            onClick={() => router.push("/shop")}
            className="mt-10 rounded-full bg-violet-600 px-8 py-4 font-medium transition hover:bg-violet-500"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    </PageReveal>
  );
}
