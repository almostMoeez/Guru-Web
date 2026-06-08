import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, Flame, Check, X, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, change: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
}

export default function CartOverlay({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartOverlayProps) {
  const [checkoutStep, setCheckoutStep] = useState<number>(0); // 0 = Idle, 1 = Customer Info, 2 = Preparing, 3 = Completed
  const [activeBrewStep, setActiveBrewStep] = useState<number>(0);

  // Customer Information states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [riderNote, setRiderNote] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper to calculate total price of an individual item slice including modifications
  const getItemSinglePrice = (item: CartItem) => {
    const modificationsPrice = item.selectedConfig
      ? Object.values(item.selectedConfig).reduce((sum, config) => sum + (config.extraPrice || 0), 0)
      : 0;
    return item.menuItem.price + modificationsPrice;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + getItemSinglePrice(item) * item.quantity, 0);
  const tax = subtotal * 0.09; // 9% tax
  const total = subtotal + tax;

  const brewProgressSteps = [
    { label: 'Verifying Culinary Selection', desc: 'Confirming ingredients and kitchen slot reservation.' },
    { label: 'Artisanal Preparation', desc: 'Pulling fresh elite espresso and hand-decorating pastries.' },
    { label: 'Brewed to Perfection', desc: 'Thermal sealing your luxury beverage or gourmet culinary plate.' },
    { label: 'Assembled & Packaged', desc: 'Secured under air-locked dome. Ready for courier.' }
  ];

  // Auto-scroll lock when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (checkoutStep === 2) {
      interval = setInterval(() => {
        setActiveBrewStep((prev) => {
          if (prev >= brewProgressSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setCheckoutStep(3); // Complete
            }, 1500);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [checkoutStep]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!customerPhone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (customerPhone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!customerAddress.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep(1); // Customer Info form first
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setCheckoutStep(2); // Start brewing
    setActiveBrewStep(0);
  };

  const handleResetCart = () => {
    onClearCart();
    setCheckoutStep(0);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setRiderNote('');
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Right Sliding Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 md:pl-16">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#1c1c1c] border-l border-white/5 flex flex-col justify-between h-full shadow-2xl relative"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 animate-none">
                    <ShoppingBag className="w-5 h-5 text-primary-peach" />
                    Your Selection
                  </h3>
                  <p className="text-zinc-500 text-xs font-light">Premium Culinary Experience</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Content Container */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {checkoutStep === 0 && (
                    <motion.div
                      key="selected-list"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm font-semibold">Your selection is empty</p>
                            <p className="text-zinc-600 text-xs mt-1 max-w-[220px]">
                              Add delicious items from our premium menu to begin.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cartItems.map((item) => {
                            const unitPrice = getItemSinglePrice(item);
                            const itemTotalPrice = unitPrice * item.quantity;

                            return (
                              <div
                                key={item.cartId}
                                className="flex items-start justify-between gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                              >
                                <div className="flex items-start gap-3">
                                  {/* Thumbnail container */}
                                  <div className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center p-1 overflow-hidden shrink-0">
                                    <img
                                      src={item.menuItem.image}
                                      alt={item.menuItem.name}
                                      referrerPolicy="no-referrer"
                                      className="rounded-full w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="space-y-0.5">
                                    <h4 className="text-white text-sm font-semibold leading-snug">
                                      {item.menuItem.name}
                                    </h4>
                                    
                                    {/* Render Selected Customizations Inline */}
                                    {item.selectedConfig && Object.keys(item.selectedConfig).length > 0 && (
                                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                        {Object.entries(item.selectedConfig).map(([optName, choice]) => (
                                          <span
                                            key={optName}
                                            className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-400 font-mono"
                                          >
                                            {choice.name}
                                            {choice.extraPrice && choice.extraPrice > 0
                                              ? ` (+$${choice.extraPrice})`
                                              : ''}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-zinc-500 text-xs font-light">Qty: {item.quantity}</span>
                                      <span className="text-zinc-800 block text-xs">|</span>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                                          className="text-zinc-500 hover:text-white p-0.5 transition-colors cursor-pointer"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                                          className="text-zinc-500 hover:text-white p-0.5 transition-colors cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-zinc-350 text-xs font-mono font-medium">
                                    ${itemTotalPrice.toFixed(0)}
                                  </span>
                                  <button
                                    onClick={() => onRemoveItem(item.cartId)}
                                    className="text-zinc-600 hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Remove product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {checkoutStep === 1 && (
                    <motion.div
                      key="customer-info"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <h4 className="text-white text-base font-bold uppercase tracking-wider">
                          Customer Logistics
                        </h4>
                        <p className="text-zinc-500 text-xs font-light">
                          Provide details for our premium delivery runner.
                        </p>
                      </div>

                      <form onSubmit={handleConfirmOrder} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                            Full Name <span className="text-primary-peach">*</span>
                          </label>
                          <input
                            id="customer-name-input"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="e.g., Moeez Ahmad"
                            className={`w-full bg-zinc-950 border ${
                              errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 hover:border-white/10 focus:border-primary-peach'
                            } rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-650`}
                          />
                          {errors.name && (
                            <p className="text-rose-400 text-[10px] font-medium mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                            Phone Number <span className="text-primary-peach">*</span>
                          </label>
                          <input
                            id="customer-phone-input"
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="e.g., +92 300 1234567"
                            className={`w-full bg-zinc-950 border ${
                              errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 hover:border-white/10 focus:border-primary-peach'
                            } rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-650`}
                          />
                          {errors.phone && (
                            <p className="text-rose-400 text-[10px] font-medium mt-1">{errors.phone}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                            Delivery Address <span className="text-primary-peach">*</span>
                          </label>
                          <textarea
                            id="customer-address-input"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            placeholder="e.g., House 23-A, Block H, Gulberg III, Lahore"
                            rows={3}
                            className={`w-full bg-zinc-950 border ${
                              errors.address ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 hover:border-white/10 focus:border-primary-peach'
                            } rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-650 resize-none`}
                          />
                          {errors.address && (
                            <p className="text-rose-400 text-[10px] font-medium mt-1">{errors.address}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                            Rider Note <span className="text-zinc-600 font-light lowercase">(optional)</span>
                          </label>
                          <input
                            id="rider-note-input"
                            type="text"
                            value={riderNote}
                            onChange={(e) => setRiderNote(e.target.value)}
                            placeholder="e.g., Ring bell twice / Leave at gate"
                            className="w-full bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-primary-peach rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-650"
                          />
                        </div>

                        {/* Order Summary Preview Inside Form */}
                        <div className="p-4 rounded-2xl bg-zinc-950/85 border border-white/5 mt-6 space-y-2.5">
                          <div className="flex justify-between text-xs text-zinc-500 font-mono">
                            <span>Basket Items({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                            <span className="text-white">${subtotal.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-zinc-500 font-mono">
                            <span>Surcharge + Tax:</span>
                            <span className="text-white">${tax.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-white/5 pt-2 flex justify-between text-xs text-white uppercase font-bold">
                            <span>Total Due:</span>
                            <span className="text-primary-peach font-mono">${total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(0)}
                            className="flex-1 py-3 bg-zinc-950 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-semibold text-xs tracking-wider rounded-full transition-all duration-300 uppercase cursor-pointer text-center"
                          >
                            Back
                          </button>
                          
                          <button
                            id="confirm-brew-btn"
                            type="submit"
                            className="flex-[2] py-3 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-wider rounded-full transition-all duration-300 uppercase cursor-pointer text-center"
                          >
                            CONFIRM & BREW
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {checkoutStep === 2 && (
                    <motion.div
                      key="preparing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-6 text-center"
                    >
                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-primary-peach/10 border border-primary-peach/30 flex items-center justify-center animate-pulse">
                          <Flame className="w-8 h-8 text-primary-peach animate-pulse" />
                        </div>
                        <div className="absolute -inset-1 bg-primary-peach/5 rounded-full blur-lg" />
                      </div>

                      <h4 className="text-white text-base font-bold mb-1 uppercase tracking-wider">
                        GURU IS BREWING
                      </h4>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-6">
                        PROGRESS: {activeBrewStep * 25 + 25}%
                      </p>

                      <div className="w-full space-y-4 max-w-sm">
                        {brewProgressSteps.map((step, idx) => {
                          const isDone = idx < activeBrewStep;
                          const isCurrent = idx === activeBrewStep;
                          return (
                            <div
                              key={idx}
                              className={`flex gap-3 transition-all duration-300 ${
                                isDone || isCurrent ? 'opacity-100' : 'opacity-20'
                              }`}
                            >
                              <div className="flex flex-col items-center shrink-0">
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                                    isDone
                                      ? 'bg-primary-peach border-primary-peach text-black'
                                      : isCurrent
                                      ? 'border-primary-peach text-primary-peach animate-pulse'
                                      : 'border-zinc-850 text-zinc-600'
                                  }`}
                                >
                                  {isDone ? '✓' : idx + 1}
                                </div>
                                {idx < brewProgressSteps.length - 1 && (
                                  <div
                                    className={`w-px h-6 my-1 ${
                                      isDone ? 'bg-primary-peach' : 'bg-zinc-800'
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="text-left">
                                <h5 className="text-zinc-200 text-xs font-bold">
                                  {step.label}
                                </h5>
                                <p className="text-zinc-500 text-[10px] font-light leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {checkoutStep === 3 && (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
                        <Check className="w-6 h-6" />
                      </div>

                      <h4 className="text-white text-lg font-bold mb-2">Order Decanted!</h4>
                      <p className="text-zinc-400 text-xs font-light max-w-xs leading-relaxed mb-6">
                        Your luxury selection will be dispatched under GURU’s master standards from the Gulberg delivery center.
                      </p>

                      <div className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 mb-6 text-left space-y-2.5 font-mono text-[11px] text-zinc-500">
                        <div className="text-white font-bold pb-2 border-b border-white/5 text-[10px] tracking-wider uppercase">
                          SUMMONS CARD VOUCHER
                        </div>
                        <div className="flex justify-between">
                          <span>Invoice Tag:</span>
                          <span className="text-white font-semibold">GRU-918B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recipient Name:</span>
                          <span className="text-white font-semibold truncate max-w-[150px]">{customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contact Phone:</span>
                          <span className="text-white font-semibold">{customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Destination:</span>
                          <span className="text-white font-semibold truncate max-w-[155px]" title={customerAddress}>{customerAddress}</span>
                        </div>
                        {riderNote.trim() && (
                          <div className="flex justify-between">
                            <span>Runner Note:</span>
                            <span className="text-white font-semibold truncate max-w-[155px]" title={riderNote}>{riderNote}</span>
                          </div>
                        )}
                        <div className="h-px bg-white/5 my-1" />
                        <div className="flex justify-between">
                          <span>Est. Courier Waiting:</span>
                          <span className="text-primary-peach font-semibold">Under 25 Mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Paid:</span>
                          <span className="text-white font-semibold">${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleResetCart}
                        className="w-full py-3.5 bg-primary-peach hover:bg-primary-peach-dark text-black font-bold text-xs tracking-wider rounded-full transition-all duration-300 uppercase cursor-pointer"
                      >
                        BREW NEW ORDER
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Checkout summaries (Sticky Footer) */}
              {cartItems.length > 0 && checkoutStep === 0 && (
                <div className="px-6 py-6 border-t border-white/5 bg-[#141414] space-y-4 shrink-0">
                  <div className="space-y-2 text-sm font-medium">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Tax (9%)</span>
                      <span className="text-white font-mono">${tax.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-white/5 my-2" />
                    <div className="flex justify-between text-white font-bold text-base">
                      <span>Total</span>
                      <span className="text-primary-peach font-mono">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartCheckout}
                    className="w-full py-3.5 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-[0.15em] rounded-full transition-all duration-300 active:scale-95 cursor-pointer uppercase text-center"
                  >
                    CHECKOUT NOW
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
