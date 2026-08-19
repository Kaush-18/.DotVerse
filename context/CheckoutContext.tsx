"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type CheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

type CheckoutContextType = {
  formData: CheckoutForm;
  setFormData: (data: CheckoutForm) => void;
  clearCheckout: () => void;
};

const defaultCheckout: CheckoutForm = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  phone: "",
};

const CheckoutContext = createContext<
  CheckoutContextType | undefined
>(undefined);

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [formData, setFormData] =
    useState<CheckoutForm>(defaultCheckout);

  const clearCheckout = () => {
    setFormData(defaultCheckout);
  };

  return (
    <CheckoutContext.Provider
      value={{
        formData,
        setFormData,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider",
    );
  }

  return context;
}
