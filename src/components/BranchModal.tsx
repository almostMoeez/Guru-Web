import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Check } from 'lucide-react';
import { useBranch } from '../lib/branch/BranchContext';

interface BranchModalProps {
  isOpen: boolean;
  /** When false, the modal can't be dismissed without picking a branch. */
  dismissable: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function BranchModal({
  isOpen,
  dismissable,
  onClose,
  onSelect,
}: BranchModalProps) {
  const { branches, branchId } = useBranch();

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
                <MapPin className="w-6 h-6 text-primary-peach" />
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Choose your branch
              </h2>
              <p className="text-zinc-400 text-sm font-light mb-7 leading-relaxed">
                Select the Guru outlet you’d like to order from. You can change this anytime.
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
                        <MapPin
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
