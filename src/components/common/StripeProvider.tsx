'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeProviderProps {
  children: React.ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  const [stripeKey, setStripeKey] = useState<string | null>(null);

  useEffect(() => {
    setStripeKey(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null);
  }, []);

  if (!stripeKey) {
    return <>{children}</>;
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
