import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Loader2, AlertCircle, RefreshCw, Lock, Bike, Store } from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import { fetchMyOrders } from '../lib/api/orders';
import { ApiError } from '../lib/api/client';
import { formatPKR } from '../lib/currency';
import type { ApiOrder } from '../lib/api/types';

interface OrderHistoryPageProps {
  onRequireAuth: () => void;
  /** Resolve a menu item id to its name for nicer line items. */
  itemNameById: Record<string, string>;
  onBrowseMenu: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  placed: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  accepted: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  preparing: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  out_for_delivery: 'text-primary-peach bg-primary-peach/10 border-primary-peach/20',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  cancelled: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export default function OrderHistoryPage({
  onRequireAuth,
  itemNameById,
  onBrowseMenu,
}: OrderHistoryPageProps) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchMyOrders(controller.signal)
      .then((list) => setOrders(Array.isArray(list) ? list : []))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : 'Could not load your orders.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [isAuthenticated, nonce]);

  return (
    <section className="pt-28 pb-24 bg-[#1c1c1c] min-h-screen relative border-t border-white/5">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-peach/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Order History</h2>
        <p className="text-zinc-400 text-sm font-light mb-10">Your past and current orders.</p>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-peach/10 border border-primary-peach/20 flex items-center justify-center text-primary-peach">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-zinc-300 text-sm font-semibold">Please sign in to view your orders</p>
            <button
              onClick={onRequireAuth}
              className="mt-1 px-6 py-3 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-wider rounded-full uppercase cursor-pointer"
            >
              Sign In
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-primary-peach animate-spin" />
            <p className="text-zinc-500 text-sm font-light">Loading your orders…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-zinc-300 text-sm font-semibold">Couldn’t load your orders</p>
            <p className="text-zinc-500 text-xs max-w-sm">{error}</p>
            <button
              onClick={() => setNonce((n) => n + 1)}
              className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 border border-white/10 hover:border-primary-peach/40 text-zinc-300 hover:text-white text-xs font-semibold tracking-wider uppercase cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <p className="text-zinc-300 text-sm font-semibold">No orders yet</p>
              <p className="text-zinc-600 text-xs mt-1">Your orders will show up here once you place one.</p>
            </div>
            <button
              onClick={onBrowseMenu}
              className="mt-1 px-6 py-3 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-wider rounded-full uppercase cursor-pointer"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const statusKey = String(order.status).toLowerCase();
              const isPickup = order.orderType === 'takeaway';
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
                  className="bg-[#242424] border border-white/5 rounded-3xl p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white font-bold text-sm">
                        GRU-{String(order.id).slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-zinc-500 text-xs font-light mt-0.5">{formatDate(order.orderTime)}</p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        STATUS_COLORS[statusKey] ?? 'text-zinc-400 bg-white/5 border-white/10'
                      }`}
                    >
                      {statusKey.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 mb-4">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between gap-3 text-xs">
                        <span className="text-zinc-300 min-w-0">
                          <span className="text-primary-peach font-semibold">{item.quantity}×</span>{' '}
                          {itemNameById[String(item.menuItemId)] ?? `Item #${item.menuItemId}`}
                        </span>
                        <span className="text-zinc-400 font-mono shrink-0">
                          {formatPKR(Number(item.priceAtOrder) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="inline-flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                      {isPickup ? <Store className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                      {isPickup ? 'Pickup' : 'Delivery'}
                    </span>
                    <span className="text-white font-bold text-sm font-mono">
                      {formatPKR(order.totalPrice)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
