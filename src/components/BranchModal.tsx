import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Check, Bike, Store } from 'lucide-react';
import { useBranch } from '../lib/branch/BranchContext';
import type { OrderType } from '../lib/api/types';

interface BranchModalProps {
  isOpen: boolean;
  /** When false, the modal can't be dismissed without picking a branch. */
  dismissable: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
}

export default function BranchModal({
  isOpen,
  dismissable,
  onClose,
  onSelect,
  orderType,
  onOrderTypeChange,
}: BranchModalProps) {
  const { branches, branchId } = useBranch();
  const isPickup = orderType === 'takeaway';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissable ? onClose : undefined}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-[#242424] border border-white/5 rounded-3xl overflow-hidden shadow-2xl text-zinc-100"
          >
            {dismissable && (
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/70 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/5 z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="p-8 md:p-10">
              <div className="w-14 h-14 rounded-full bg-primary-peach/10 border border-primary-peach/20 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-primary-peach" />
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Choose your branch
              </h2>
              <p className="text-zinc-400 text-sm font-light mb-6 leading-relaxed">
                Select the Guru outlet you’d like to order from. You can change this anytime.
              </p>

              {/* Delivery vs pickup */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 border border-white/5 rounded-2xl mb-6">
                {([
                  { type: 'delivery' as OrderType, label: 'Delivery', Icon: Bike },
                  { type: 'takeaway' as OrderType, label: 'Pickup', Icon: Store },
                ]).map(({ type, label, Icon }) => {
                  const active = orderType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onOrderTypeChange(type)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        active ? 'bg-primary-peach text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  );
                })}
              </div>

              <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider mb-3">
                {isPickup ? 'Pick up from' : 'Deliver from'}
              </p>

              <div className="space-y-3">
                {branches.map((branch) => {
                  const active = branch.id === branchId;
                  return (
                    <button
                      key={branch.id}
                      onClick={() => onSelect(branch.id)}
                      className={`w-full text-left px-5 py-4 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        active
                          ? 'bg-primary-peach/10 border-primary-peach/50'
                          : 'bg-zinc-950 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Building2
                          className={`w-5 h-5 shrink-0 ${
                            active ? 'text-primary-peach' : 'text-zinc-500'
                          }`}
                        />
                        <span>
                          <span className="block text-sm text-white font-semibold leading-snug">
                            {branch.name}
                          </span>
                          <span className="block text-zinc-500 text-xs font-light">
                            {branch.area}
                          </span>
                        </span>
                      </span>
                      {active && (
                        <span className="w-6 h-6 rounded-full bg-primary-peach flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-black" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
