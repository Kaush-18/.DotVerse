import { getProducts } from "@/services/products";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const products = await getProducts();


    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);


    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
