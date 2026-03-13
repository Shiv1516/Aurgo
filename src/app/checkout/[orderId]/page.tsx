"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { orderAPI, paymentAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Package, 
  Clock, 
  AlertCircle,
  LayoutGrid
} from "lucide-react";

import CheckoutForm from "@/components/common/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getSocket } from "@/lib/socket";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const STEPS = [
  { id: 'address', label: 'Shipping', icon: MapPin },
  { id: 'shipping', label: 'Delivery', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/login");
      return;
    }
    orderAPI
      .getById(params.orderId as string)
      .then((res) => setOrder(res.data.data))
      .catch(() => toast.error("Order not found"))
      .finally(() => setIsLoading(false));
  }, [params.orderId, isAuthenticated, router, isLoading]);

  useEffect(() => {
    if (!order?._id) return;
    
    const socket = getSocket();
    socket.on('notification', (data: any) => {
      if (data.type === 'payment_confirmed' && data.order === order._id) {
        setOrder((prev: any) => ({ ...prev, paymentStatus: 'paid', status: 'confirmed' }));
        toast.success("Payment confirmed real-time!");
        setTimeout(() => handlePaymentSuccess(), 2000);
      }
    });

    return () => {
      socket.off('notification');
    };
  }, [order?._id]);

  const initiatePayment = async () => {
    try {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      const isPlaceholder = !publishableKey || 
                           publishableKey.includes("your_stripe") || 
                           publishableKey === "pk_test_placeholder";

      if (isPlaceholder) {
        await paymentAPI.confirmPayment(order._id, 'pi_mock_' + Date.now());
        handlePaymentSuccess();
        return;
      }

      const res = await paymentAPI.createPaymentIntent(order._id);
      setClientSecret(res.data.clientSecret);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to initiate payment");
    }
  };

  const handlePaymentSuccess = () => {
    router.push(`/dashboard/orders/${order._id}?success=true`);
  };

  const calculateInsurance = () => order?.hammerPrice * 0.01; // 1% insurance
  const getShippingCost = () => {
    if (shippingMethod === 'express') return 45;
    if (shippingMethod === 'pickup') return 0;
    return order?.shippingCost || 25;
  };

  const totalCalculated = () => {
    let total = order?.totalAmount || 0;
    // Add logic for insurance and custom shipping if needed
    if (insuranceEnabled) total += calculateInsurance();
    return total;
  };

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-gray-500">Order not found</p></div>;

  return (
    <div className="bg-background min-h-screen">
      {/* Premium Checkout Header */}
      <div className="bg-navy pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full gold-gradient opacity-10 skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
             <span className="h-px w-12 bg-gold/50" />
             <span className="text-gold font-black uppercase tracking-[0.4em] text-sm">Secure Transaction</span>
             <span className="h-px w-12 bg-gold/50" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            Complete your <span className="text-gold italic font-serif last:normal-case">Acquisition</span>
          </h1>
          
          {/* Progress Tracker */}
          <div className="max-w-2xl mx-auto flex items-center justify-between relative mt-16 px-4">
             <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 z-0" />
             {STEPS.map((step, i) => {
               const Icon = step.icon;
               const isActive = currentStep >= i;
               return (
                 <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-gold border-gold text-navy shadow-[0_0_20px_rgba(201,168,76,0.5)]' : 'bg-navy border-white/20 text-white/40'}`}>
                       <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm font-black uppercase tracking-widest mt-4 transition-colors ${isActive ? 'text-gold' : 'text-white/20'}`}>{step.label}</span>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Checkout Flow */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                   <div className="card p-8 rounded-[2.5rem]">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-2xl font-black text-navy uppercase tracking-tight flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gold" /> Destination <span className="text-gray-300 font-serif normal-case italic">Details</span>
                         </h3>
                         <button className="text-sm font-black uppercase tracking-widest text-burgundy hover:text-navy transition-colors">Add New Address</button>
                      </div>
                      
                      <div className="space-y-4">
                         {user?.addresses?.map((addr, i) => (
                           <div 
                             key={i}
                             onClick={() => setSelectedAddress(i)}
                             className={`group relative p-6 rounded-3xl border-2 transition-all cursor-pointer ${selectedAddress === i ? 'border-gold bg-gold/5' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
                           >
                              <div className="flex items-start gap-4">
                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${selectedAddress === i ? 'border-gold' : 'border-gray-200'}`}>
                                    {selectedAddress === i && <div className="w-2 h-2 bg-gold rounded-full" />}
                                 </div>
                                 <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-1">
                                       <p className="font-black text-navy uppercase text-sm tracking-widest">{addr.label}</p>
                                       {addr.isDefault && <span className="text-sm text-gold font-black uppercase tracking-[0.2em] bg-white py-1 px-3 rounded-full border border-gold/20">Default</span>}
                                    </div>
                                    <p className="text-base text-gray-500 leading-relaxed max-w-sm">
                                       {addr.street}<br />
                                       {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                                    </p>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                      
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="w-full mt-10 bg-navy text-white text-sm font-black uppercase tracking-[0.3em] py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gold hover:text-navy transition-all group"
                      >
                         Continue to Shipping <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                   </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                   <div className="card p-8 rounded-[2.5rem]">
                      <h3 className="text-2xl font-black text-navy uppercase tracking-tight flex items-center gap-3 mb-8">
                         <Truck className="h-5 w-5 text-gold" /> Logistics <span className="text-gray-300 font-serif normal-case italic">Selection</span>
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                         {[
                           { id: 'standard', label: 'Standard Handling', desc: 'Secure transit (5-9 business days)', price: order?.shippingCost || 25 },
                           { id: 'express', label: 'Priority White Glove', desc: 'Climate controlled (2-4 business days)', price: 120 },
                           { id: 'pickup', label: 'Gallery Collection', desc: 'Private collection at our Paris rooms', price: 0 },
                         ].map((m) => (
                           <div 
                             key={m.id}
                             onClick={() => setShippingMethod(m.id)}
                             className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${shippingMethod === m.id ? 'border-gold bg-gold/5' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${shippingMethod === m.id ? 'border-gold' : 'border-gray-200'}`}>
                                    {shippingMethod === m.id && <div className="w-2 h-2 bg-gold rounded-full" />}
                                 </div>
                                 <span className="font-black text-navy text-base">{m.price === 0 ? 'Free' : formatCurrency(m.price)}</span>
                              </div>
                              <p className="font-black text-navy uppercase text-sm tracking-widest mb-1">{m.label}</p>
                              <p className="text-sm text-gray-500 italic">{m.desc}</p>
                           </div>
                         ))}
                      </div>

                      {/* Insurance Toggle */}
                      <div className="mt-8 p-6 bg-white border border-gray-100 rounded-3xl flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex items-center justify-center">
                               <ShieldCheck className="h-6 w-6 text-burgundy" />
                            </div>
                            <div>
                               <p className="font-black text-navy uppercase text-sm tracking-widest">Asset Protection Insurance</p>
                               <p className="text-sm text-gray-400">Total value coverage against any transit incident</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setInsuranceEnabled(!insuranceEnabled)}
                           className={`w-14 h-8 rounded-full transition-all relative ${insuranceEnabled ? 'bg-burgundy' : 'bg-gray-200'}`}
                         >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${insuranceEnabled ? 'left-7' : 'left-1'}`} />
                         </button>
                      </div>

                      <div className="flex gap-4 mt-10">
                        <button 
                          onClick={() => setCurrentStep(0)}
                          className="flex-1 bg-gray-50 text-gray-400 text-sm font-black uppercase tracking-[0.3em] py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                        >
                           <ChevronLeft className="h-4 w-4" /> Go Back
                        </button>
                        <button 
                          onClick={() => setCurrentStep(2)}
                          className="flex-[2] bg-navy text-white text-sm font-black uppercase tracking-[0.3em] py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gold hover:text-navy transition-all group"
                        >
                           Final Review <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                   </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                   <div className="card p-8 rounded-[2.5rem]">
                      <h3 className="text-2xl font-black text-navy uppercase tracking-tight flex items-center gap-3 mb-8">
                         <CreditCard className="h-5 w-5 text-gold" /> Settlement <span className="text-gray-300 font-serif normal-case italic">Finalisation</span>
                      </h3>
                      
                      {order.paymentStatus === "paid" ? (
                        <div className="bg-green-50 border border-green-200 rounded-[2rem] p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                               <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h4 className="text-2xl font-black text-green-800 uppercase tracking-tighter mb-2">Payment Consolidate</h4>
                            <p className="text-green-600 text-base italic">This acquisition has been successfully settled.</p>
                        </div>
                      ) : clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <CheckoutForm
                            orderId={order._id}
                            totalAmount={totalCalculated()}
                            onSuccess={handlePaymentSuccess}
                          />
                        </Elements>
                      ) : (
                        <div className="space-y-6">
                           <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                              <div className="flex items-start gap-4 mb-4">
                                 <AlertCircle className="h-5 w-5 text-burgundy shrink-0 mt-0.5" />
                                 <p className="text-sm text-gray-500 leading-relaxed italic">
                                    By proceeding, you acknowledge the binding nature of this acquisition. All transaction data is secured via end-to-end 256-bit encryption. Total includes all premiums, taxes, and selected logistics.
                                 </p>
                              </div>
                           </div>
                           {/* Visual Mock Card if Stripe is not configured */ }
                           {(!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
                             process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes("your_stripe")) && (
                             <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 space-y-4">
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Sandbox Mode</span>
                                 <div className="flex gap-1">
                                    <div className="w-6 h-4 bg-gray-100 rounded" />
                                    <div className="w-6 h-4 bg-gray-100 rounded" />
                                    <div className="w-6 h-4 bg-gray-100 rounded" />
                                 </div>
                               </div>
                               <div className="h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4">
                                  <span className="text-gray-400 font-mono">4242 4242 4242 4242</span>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4">
                                     <span className="text-gray-400 font-mono">12 / 26</span>
                                  </div>
                                  <div className="h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4">
                                     <span className="text-gray-400 font-mono">***</span>
                                  </div>
                               </div>
                             </div>
                           )}

                           <button
                             onClick={initiatePayment}
                             className="w-full bg-navy text-white text-sm font-black uppercase tracking-[0.4em] py-6 rounded-[2rem] hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-2"
                           >
                             {(!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
                               process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes("your_stripe")) ? 'Simulate Secure Payment' : 'Release Final Payment'}
                           </button>
                           <button 
                              onClick={() => setCurrentStep(1)}
                              className="w-full text-sm font-black uppercase tracking-widest text-gray-400 hover:text-navy transition-colors"
                           >
                              Modify Logistics
                           </button>
                        </div>
                      )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Acquisition Summary Sidebar */}
          <div className="lg:col-span-4 h-fit sticky top-24">
             <div className="card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-navy/5 border-gray-100">
                <div className="bg-navy p-8 text-white">
                   <p className="text-sm font-black uppercase tracking-[0.3em] text-gold mb-1">Acquisition Meta</p>
                   <h4 className="text-xl font-black uppercase tracking-tighter leading-tight">{order.lot?.title || 'Masterpiece'}</h4>
                   <p className="text-sm text-white/40 mt-2 font-mono">{order.orderNumber}</p>
                </div>
                
                <div className="p-8 space-y-6 bg-white">
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-400 font-bold uppercase tracking-widest">Hammer Price</span>
                         <span className="text-navy font-black">{formatCurrency(order.hammerPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-400 font-bold uppercase tracking-widest">Buyer&apos;s Premium</span>
                         <span className="text-navy font-black">{formatCurrency(order.buyersPremium)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-400 font-bold uppercase tracking-widest">VAT / Export Duty</span>
                         <span className="text-navy font-black">{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-4 border-t border-gray-50">
                         <span className="text-gray-400 font-bold uppercase tracking-widest">Selected Delivery</span>
                         <span className="text-navy font-black">{formatCurrency(getShippingCost())}</span>
                      </div>
                      {insuranceEnabled && (
                        <div className="flex justify-between text-sm">
                           <span className="text-gray-400 font-bold uppercase tracking-widest">Protection (1%)</span>
                           <span className="text-burgundy font-black">{formatCurrency(calculateInsurance())}</span>
                        </div>
                      )}
                   </div>

                   <div className="pt-6 border-t-2 border-dashed border-gray-100 mt-6">
                      <div className="flex justify-between items-end mb-1">
                         <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-300">Total Commitment</p>
                         <div className="text-right">
                            <p className="text-4xl font-black text-navy uppercase tracking-tighter leading-none mb-1">
                               {formatCurrency(totalCalculated())}
                            </p>
                            <p className="text-sm text-gold font-bold uppercase tracking-widest">All Duties Included</p>
                         </div>
                      </div>
                   </div>
                </div>
                
                {/* Visual Trust Indicators */}
                <div className="bg-gray-50/50 p-6 flex items-center justify-between border-t border-gray-100">
                   <div className="flex flex-col items-center gap-1">
                      <Shield className="h-4 w-4 text-gold" />
                      <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Certified</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <Clock className="h-4 w-4 text-gold" />
                      <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Tracking</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <LayoutGrid className="h-4 w-4 text-gold" />
                      <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Escrow</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
