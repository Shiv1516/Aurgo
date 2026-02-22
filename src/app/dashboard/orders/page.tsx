"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderAPI } from '@/lib/api';
import { formatCurrency, formatDate, getOrderStatusColor } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Package, Eye, ArrowRight, ExternalLink, CreditCard, Truck } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders({ limit: 50 }).then(res => setOrders(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Order History</h1>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Managed Acquisitions & Logistics</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
        {orders.length === 0 ? (
          <div className="py-20 text-center opacity-50">
            <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-gray-200" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Acquisitions Yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order: any) => (
                  <tr key={order._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-6">
                      <p className="text-xs font-black text-dark uppercase">{order.orderNumber}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-dark rounded-xl flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-dark uppercase line-clamp-1">{order.lot?.title || 'Lot Asset'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Collection</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <p className="text-sm font-black text-dark">{formatCurrency(order.totalAmount)}</p>
                    </td>
                    <td className="py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest w-fit inline-flex items-center gap-1 ${getOrderStatusColor(order.paymentStatus)}`}>
                          <CreditCard className="h-2.5 w-2.5" /> {order.paymentStatus}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest w-fit inline-flex items-center gap-1 ${getOrderStatusColor(order.shippingStatus)}`}>
                          <Truck className="h-2.5 w-2.5" /> {order.shippingStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/dashboard/orders/${order._id}`}
                          className="p-2 bg-gray-50 text-dark hover:bg-gold hover:text-white rounded-xl transition-all"
                          title="View Dossier"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {order.paymentStatus === 'pending' && (
                          <Link 
                            href={`/checkout/${order._id}`}
                            className="bg-dark text-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/10 hover:bg-gold hover:text-white transition-all"
                          >
                            Finalize Payment
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}