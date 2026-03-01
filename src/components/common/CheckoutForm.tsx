'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';

interface CheckoutFormProps {
  orderId: string;
  totalAmount: number;
  onSuccess: () => void;
}

export default function CheckoutForm({ orderId, totalAmount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/orders/${orderId}?success=true`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Payment successful!');
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <PaymentElement />
      </div>
      
      <button
        disabled={isProcessing || !stripe || !elements}
        className="btn-primary w-full !py-4 text-lg disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay Now`}
      </button>
      
      <p className="text-[10px] text-center text-gray-500 flex items-center justify-center gap-1">
        <Shield className="h-3 w-3" /> Secure payment powered by Stripe.
      </p>
    </form>
  );
}
