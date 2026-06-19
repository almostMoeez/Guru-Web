import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
// Legacy hero retained for reference — replaced by the new restaurant homepage.
// import Hero from './components/Hero';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import OurStory from './components/OurStory';
import FindUs from './components/FindUs';
import CartOverlay, { CheckoutInfo } from './components/CartOverlay';
import CustomizationOverlay from './components/CustomizationOverlay';
import AuthModal from './components/AuthModal';
import BranchModal from './components/BranchModal';
import { MenuItem, CartItem, SelectedConfig, CustomizationChoice } from './types';
import { useMenu } from './hooks/useMenu';
import { useAddresses } from './hooks/useAddresses';
import { useAuth } from './lib/auth/AuthContext';
import { useBranch } from './lib/branch/BranchContext';
import { createOrder } from './lib/api/orders';
import { updateProfile, createAddress } from './lib/api/users';
import { DEFAULT_BRANCH_ID } from './lib/config';
import type { CreateOrderItem, CreateOrderPayload } from './lib/api/types';
import logoImg from './assets/images/logo.png';

// Stable custom cartId generator for personalized options identification
const generateCartId = (itemId: string, config?: SelectedConfig) => {
  if (!config || Object.keys(config).length === 0) {
    return itemId;
  }
  const sortedKeys = Object.keys(config).sort();
  const serializeString = sortedKeys
    .map((k) => `${k}:${config[k].name}`)
    .join('|');
  return `${itemId}-${serializeString}`;
};

// Section ↔ URL path mapping
const SECTION_PATHS: Record<string, string> = {
  home: '/',
  menu: '/menu',
  story: '/story',
  contact: '/contact',
};

const PATH_SECTIONS: Record<string, string> = {
  '/': 'home',
  '/menu': 'menu',
  '/story': 'story',
  '/contact': 'contact',
};

const SECTION_TITLES: Record<string, string> = {
  home: 'Guru — Brewed to Perfection',
  menu: 'Menu — Guru',
  story: 'Our Story — Guru',
  contact: 'Contact Us — Guru',
};

const getInitialSection = (): string =>
  PATH_SECTIONS[window.location.pathname] ?? 'home';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>(getInitialSection);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isBranchOpen, setIsBranchOpen] = useState<boolean>(false);

  const { items: menuItems, categories, loading: menuLoading, loadingHint: menuLoadingHint, error: menuError, reload: reloadMenu } = useMenu();
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const { addresses, reload: reloadAddresses } = useAddresses(isAuthenticated);
  const { branchId, branch, hasSelected: hasBranch, selectBranch } = useBranch();

  // Prompt for a branch the first time the user lands on the menu page.
  useEffect(() => {
    if (activeSection === 'menu' && !hasBranch) {
      setIsBranchOpen(true);
    }
  }, [activeSection, hasBranch]);

  // Sync page title on mount.
  useEffect(() => {
    document.title = SECTION_TITLES[activeSection] ?? 'Guru';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back / forward.
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const section = event.state?.section ?? PATH_SECTIONS[window.location.pathname] ?? 'home';
      setActiveSection(section);
      document.title = SECTION_TITLES[section] ?? 'Guru';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Map of item ID to aggregate count (sum of all configurations for menu state rendering)
  const itemQuantities = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.menuItem.id] = (acc[item.menuItem.id] || 0) + item.quantity;
    return acc;
  }, {});

  const handleNavigate = (sectionId: string) => {
    const path = SECTION_PATHS[sectionId] ?? '/';
    const title = SECTION_TITLES[sectionId] ?? 'Guru';
    if (window.location.pathname !== path) {
      window.history.pushState({ section: sectionId }, '', path);
    }
    document.title = title;
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item (for both standard and customizable)
  const handleAddToOrder = (item: MenuItem, selectedConfig?: SelectedConfig) => {
    const cartId = generateCartId(item.id, selectedConfig);
    setCartItems((prevItems) => {
      const existing = prevItems.find((p) => p.cartId === cartId);
      if (existing) {
        return prevItems.map((p) =>
          p.cartId === cartId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [
        ...prevItems,
        {
          cartId,
          menuItem: item,
          quantity: 1,
          selectedConfig,
        },
      ];
    });
    // Note: Do NOT auto open the cart here to satisfy user requirements.
  };

  // Confirm custom configurations handler from the customize screen
  const handleConfirmCustomization = (item: MenuItem, selectedConfig: SelectedConfig) => {
    handleAddToOrder(item, selectedConfig);
    setCustomizingItem(null);
  };

  // Quantity controllers used by card sliders
  const handleIncrementItem = (itemId: string) => {
    setCartItems((prevItems) => {
      // Find the first occurrence matching the menu item ID to increment
      const match = prevItems.find((p) => p.menuItem.id === itemId);
      if (match) {
        return prevItems.map((p) =>
          p.cartId === match.cartId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return prevItems;
    });
  };

  const handleDecrementItem = (itemId: string) => {
    setCartItems((prevItems) => {
      const match = prevItems.find((p) => p.menuItem.id === itemId);
      if (match) {
        return prevItems
          .map((p) =>
            p.cartId === match.cartId ? { ...p, quantity: p.quantity - 1 } : p
          )
          .filter((p) => p.quantity > 0);
      }
      return prevItems;
    });
  };

  const handleRemoveAllByItemId = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((p) => p.menuItem.id !== itemId));
  };

  // Cart overlay specific unique controllers by cartId
  const handleUpdateQuantity = (cartId: string, change: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((p) => {
          if (p.cartId === cartId) {
            const newQty = p.quantity + change;
            return { ...p, quantity: newQty };
          }
          return p;
        })
        .filter((p) => p.quantity > 0);
    });
  };

  const handleUpdateNote = (cartId: string, note: string) => {
    setCartItems((prevItems) =>
      prevItems.map((p) => (p.cartId === cartId ? { ...p, note } : p)),
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prevItems) => prevItems.filter((p) => p.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Save profile (if changed), persist the address, then place the order.
  const handlePlaceOrder = async (info: CheckoutInfo) => {
    // 1. Save name/phone to the profile if they're new or changed. Best-effort:
    //    a failure here shouldn't block the order.
    const profileChanged =
      info.firstName !== (user?.firstName ?? '') ||
      info.lastName !== (user?.lastName ?? '') ||
      info.phone !== (user?.phone ?? '');
    if (profileChanged) {
      try {
        await updateProfile({
          firstName: info.firstName,
          lastName: info.lastName,
          phone: info.phone,
        });
        await refreshProfile();
      } catch {
        /* keep going — the order itself is what matters */
      }
    }

    // 2. Resolve the delivery address id: either an existing one or a new one
    //    we save now (so it's available next time).
    let deliveryAddressId = info.selectedAddressId ?? undefined;
    if (!deliveryAddressId && info.newAddress) {
      const created = await createAddress({
        ...info.newAddress,
        // Make the first saved address the default.
        isDefault: addresses.length === 0,
      });
      deliveryAddressId = created.id;
      reloadAddresses();
    }

    // 3. Build and place the order.
    const orderItems: CreateOrderItem[] = cartItems.map((item) => {
      const modifierItemIds = item.selectedConfig
        ? (Object.values(item.selectedConfig) as CustomizationChoice[])
            .map((choice) => choice.modifierItemId)
            .filter((id): id is string => Boolean(id))
        : [];
      return {
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        ...(modifierItemIds.length ? { modifierItemIds } : {}),
      };
    });

    // The backend has no per-item note field, so fold each item's special
    // request into the order-level specialInstructions.
    const itemRequests = cartItems
      .filter((item) => item.note && item.note.trim())
      .map((item) => `${item.menuItem.name}: ${item.note!.replace(/\s+/g, ' ').trim()}`);

    const specialInstructions = [
      `Name: ${info.firstName} ${info.lastName}`,
      `Phone: ${info.phone}`,
      info.riderNote ? `Rider note: ${info.riderNote}` : '',
      itemRequests.length ? `Item requests: ${itemRequests.join('; ')}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const payload: CreateOrderPayload = {
      branchId: branchId ?? DEFAULT_BRANCH_ID,
      orderType: 'delivery',
      ...(deliveryAddressId ? { deliveryAddressId } : {}),
      specialInstructions,
      orderItems,
    };

    return createOrder(payload);
  };

  return (
    <div id="guru-app" className="relative bg-[#1c1c1c] min-h-screen text-zinc-100 selection:bg-primary-peach selection:text-black flex flex-col justify-between">
      <div>
        {/* Sticky Top Header Navigation */}
        <Header
          onCartClick={() => setIsCartOpen(true)}
          cartCount={cartCount}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onAuthClick={() => setIsAuthOpen(true)}
          branchName={branch?.name ?? null}
          onBranchClick={() => setIsBranchOpen(true)}
        />

        {/* Dynamic Pages depending on active selection — animated transitions */}
        <main className="pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {activeSection === 'home' && (
                <HomePage
                  onExploreMenu={() => handleNavigate('menu')}
                  onFindUs={() => handleNavigate('contact')}
                  onViewStory={() => handleNavigate('story')}
                  onChooseBranch={() => setIsBranchOpen(true)}
                  branchName={branch?.name ?? null}
                />
              )}

              {/* Legacy hero — kept for reference, replaced by HomePage above.
              {activeSection === 'home' && (
                <Hero
                  onExploreMenu={() => handleNavigate('menu')}
                  onFindUs={() => handleNavigate('contact')}
                />
              )} */}

              {activeSection === 'menu' && (
                <Menu
                  items={menuItems}
                  categories={categories}
                  loading={menuLoading}
                  loadingHint={menuLoadingHint}
                  error={menuError}
                  onReload={reloadMenu}
                  onAddToOrder={handleAddToOrder}
                  onIncrementItem={handleIncrementItem}
                  onDecrementItem={handleDecrementItem}
                  onRemoveAllByItemId={handleRemoveAllByItemId}
                  onOpenCustomizer={(item) => setCustomizingItem(item)}
                  itemQuantities={itemQuantities}
                  branchName={branch?.name ?? null}
                  onChangeBranch={() => setIsBranchOpen(true)}
                />
              )}

              {activeSection === 'story' && <OurStory />}

              {activeSection === 'contact' && <FindUs />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Slideover Cart Overlay Drawer */}
      <CartOverlay
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateNote={handleUpdateNote}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        isAuthenticated={isAuthenticated}
        onRequireAuth={() => setIsAuthOpen(true)}
        onPlaceOrder={handlePlaceOrder}
        defaultFirstName={user?.firstName ?? ''}
        defaultLastName={user?.lastName ?? ''}
        defaultPhone={user?.phone ?? ''}
        savedAddresses={addresses}
      />

      {/* Shared Customization Modal Dialog */}
      <CustomizationOverlay
        isOpen={customizingItem !== null}
        onClose={() => setCustomizingItem(null)}
        menuItem={customizingItem}
        onConfirm={handleConfirmCustomization}
      />

      {/* Email + OTP Login Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Branch Selection Modal */}
      <BranchModal
        isOpen={isBranchOpen}
        dismissable={hasBranch}
        onClose={() => setIsBranchOpen(false)}
        onSelect={(id) => {
          selectBranch(id);
          setIsBranchOpen(false);
        }}
      />

      {/* Footer conforming to mock layout */}
      <footer id="app-footer" className="bg-[#141414] py-12 border-t border-white/5 relative z-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center cursor-pointer"
          >
            <img src={logoImg} alt="Guru Logo" className="h-8 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
          </div>

          {/* Center Copy */}
          <div className="text-zinc-500 font-mono text-[10px] md:text-xs tracking-wider text-center md:text-left select-none uppercase">
            © 2024 GURU. ALL RIGHTS RESERVED.
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-6 text-[11px] font-semibold text-zinc-400 select-none tracking-widest uppercase">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('home')}>Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('home')}>Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('contact')}>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
