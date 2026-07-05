import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { MenuItem, SelectedConfig } from '../types';
import { formatPKR } from '../lib/currency';

interface CustomizationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  /** When editing an existing cart line, pre-select its current options. */
  initialConfig?: SelectedConfig | null;
  onConfirm: (item: MenuItem, selectedConfig: SelectedConfig) => void;
}

export default function CustomizationOverlay({
  isOpen,
  onClose,
  menuItem,
  initialConfig,
  onConfirm,
}: CustomizationOverlayProps) {
  const isEditing = Boolean(initialConfig);
  const [selectedConfig, setSelectedConfig] = useState<SelectedConfig>({});

  // Initialize selections: from the existing config when editing, otherwise the
  // first available choice for each option.
  useEffect(() => {
    if (menuItem && menuItem.customizationOptions) {
      const config: SelectedConfig = {};
      menuItem.customizationOptions.forEach((option) => {
        if (option.choices && option.choices.length > 0) {
          const preset = initialConfig?.[option.name];
          const first = option.choices[0];
          config[option.name] = preset
            ? {
                name: preset.name,
                extraPrice: preset.extraPrice || 0,
                modifierItemId: preset.modifierItemId,
              }
            : {
                name: first.name,
                extraPrice: first.extraPrice || 0,
                modifierItemId: first.modifierItemId,
              };
        }
      });
      setSelectedConfig(config);
    }
  }, [menuItem, initialConfig]);

  if (!menuItem || !menuItem.customizationOptions) return null;

  const handleChoiceSelect = (
    optionName: string,
    choiceName: string,
    extraPrice?: number,
    modifierItemId?: string,
  ) => {
    setSelectedConfig((prev) => ({
      ...prev,
      [optionName]: {
        name: choiceName,
        extraPrice: extraPrice || 0,
        modifierItemId,
      },
    }));
  };

  // Calculate dynamic price based on selections
  const extraPriceTotal = Object.values(selectedConfig).reduce<number>(
    (acc, val) => acc + ((val as { extraPrice?: number }).extraPrice || 0),
    0
  );
  const finalPrice = menuItem.price + extraPriceTotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-lg bg-[#242424] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-15 text-zinc-100 font-sans"
          >
            {/* Header with image */}
            <div className="relative h-48 w-full shrink-0">
              <img
                src={menuItem.image}
                alt={menuItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-black/40 to-black/20" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/5"
                aria-label="Close customization"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Heading Info */}
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-primary-peach text-[9px] uppercase font-mono tracking-widest block mb-1">
                  CUSTOM DESIGN
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
                  {menuItem.name}
                </h3>
              </div>
            </div>

            {/* Scrollable Customization Fields */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed mb-4">
                {menuItem.description}
              </p>

              {menuItem.customizationOptions.map((option) => {
                const selectedChoice = selectedConfig[option.name]?.name;

                return (
                  <div key={option.name} className="space-y-3 pb-5 border-b border-white/5 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                        {option.name} {option.required && <span className="text-primary-peach">*</span>}
                      </h4>
                      {selectedChoice && (
                        <span className="text-[10px] font-semibold text-primary-peach/80 uppercase tracking-wider bg-primary-peach/5 border border-primary-peach/10 px-2 py-0.5 rounded">
                          Selected: {selectedChoice}
                        </span>
                      )}
                    </div>

                    {/* Choices Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {option.choices.map((choice) => {
                        const isSelected = selectedChoice === choice.name;
                        return (
                          <button
                            key={choice.name}
                            onClick={() => handleChoiceSelect(option.name, choice.name, choice.extraPrice, choice.modifierItemId)}
                            className={`px-4 py-3 rounded-full flex items-center justify-between text-left text-xs transition-all duration-250 cursor-pointer border ${
                              isSelected
                                ? 'bg-primary-peach border-primary-peach text-black font-semibold'
                                : 'bg-zinc-950 border-white/5 hover:border-white/15 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span className="truncate">{choice.name}</span>
                            <span className="shrink-0 font-mono text-[10px] ml-2">
                              {choice.extraPrice && choice.extraPrice > 0
                                ? `+${formatPKR(choice.extraPrice)}`
                                : 'Standard'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price & Add To Order Sticky Footer */}
            <div className="p-4 sm:p-6 md:p-8 border-t border-white/5 bg-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 shrink-0 z-10">
              <div className="space-y-0.5 flex items-baseline justify-between sm:block">
                <span className="text-zinc-500 text-[10px] font-mono tracking-wider uppercase block">
                  Total Price
                </span>
                <span className="text-xl md:text-2xl font-bold text-white font-mono leading-none">
                  {formatPKR(finalPrice)}
                </span>
              </div>

              <button
                onClick={() => {
                  onConfirm(menuItem, selectedConfig);
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-primary-peach hover:bg-primary-peach-dark text-black font-bold text-xs tracking-wider rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase shadow-lg shadow-primary-peach/5"
              >
                <Check className="w-4 h-4 shrink-0" />
                {isEditing ? 'Save Changes' : 'Add Customized Selection'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
