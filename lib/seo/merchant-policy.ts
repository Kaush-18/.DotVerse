const INDIA_COUNTRY_CODE = "IN";
const DAYS = "DAY";

export const merchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: INDIA_COUNTRY_CODE,
  returnPolicyCategory:
    "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
} as const;

export const offerShippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: 0,
    currency: "INR",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: INDIA_COUNTRY_CODE,
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 7,
      unitCode: DAYS,
    },
  },
} as const;
