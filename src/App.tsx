import { useState, useEffect, useMemo } from 'react';
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
import WhatsAppButton from './components/WhatsAppButton';
import ProfilePage from './components/ProfilePage';
import OrderHistoryPage from './components/OrderHistoryPage';
import { MenuItem, CartItem, SelectedConfig, CustomizationChoice } from './types';
import { useMenu } from './hooks/useMenu';
import { useAddresses } from './hooks/useAddresses';
import { useAuth } from './lib/auth/AuthContext';
import { useBranch } from './lib/branch/BranchContext';
import { createOrder } from './lib/api/orders';
import { updateProfile, createAddress } from './lib/api/users';
import { selectSignatureItems } from './lib/mappers';
import { DEFAULT_BRANCH_ID } from './lib/config';
import type { CreateOrderItem, CreateOrderPayload, OrderType } from './lib/api/types';
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
  profile: '/profile',
  orders: '/orders',
};

const PATH_SECTIONS: Record<string, string> = {
  '/': 'home',
  '/menu': 'menu',
  '/story': 'story',
  '/contact': 'contact',
  '/profile': 'profile',
  '/orders': 'orders',
};

const SECTION_TITLES: Record<string, string> = {
  home: 'Guru — Brewed to Perfection',
  menu: 'Menu — Guru',
  story: 'Our Story — Guru',
  contact: 'Contact Us — Guru',
  profile: 'My Profile — Guru',
  orders: 'Order History — Guru',
};

const getInitialSection = (): string =>
  PATH_SECTIONS[window.location.pathname] ?? 'home';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>(getInitialSection);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isBranchOpen, setIsBranchOpen] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  const { groups: menuGroups, loading: menuLoading, loadingHint: menuLoadingHint, error: menuError, reload: reloadMenu } = useMenu();
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const { addresses, reload: reloadAddresses } = useAddresses(isAuthenticated);
  const { branchId, branch, hasSelected: hasBranch, selectBranch } = useBranch();

  // Prompt for a branch as soon as the app loads if one isn't selected yet —
  // on any screen, not just the menu.
  useEffect(() => {
    if (!hasBranch) {
      setIsBranchOpen(true);
    }
  }, [hasBranch]);

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

  // Featured items shown on the home page (from the live menu).
  const signatureItems = useMemo(
    () => selectSignatureItems(menuGroups, 4),
    [menuGroups],
  );

  // Menu item id -> name, used to label order-history line items.
  const itemNameById = useMemo(() => {
    const map: Record<string, string> = {};
    menuGroups.forEach((group) =>
      group.subcategories.forEach((sub) =>
        sub.items.forEach((item) => {
          map[item.id] = item.name;
        }),
      ),
    );
    return map;
  }, [menuGroups]);

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

  // Open the customizer to edit an existing cart line's options.
  const handleEditCartItem = (cartItem: CartItem) => {
    setEditingCartItem(cartItem);
    setCustomizingItem(cartItem.menuItem);
  };

  const closeCustomizer = () => {
    setCustomizingItem(null);
    setEditingCartItem(null);
  };

  // Confirm custom configurations handler from the customize screen
  const handleConfirmCustomization = (item: MenuItem, selectedConfig: SelectedConfig) => {
    if (editingCartItem) {
      // Editing an existing line: replace it (preserving quantity).
      const qty = editingCartItem.quantity;
      const newCartId = generateCartId(item.id, selectedConfig);
      setCartItems((prev) => {
        const withoutOld = prev.filter((p) => p.cartId !== editingCartItem.cartId);
        const existing = withoutOld.find((p) => p.cartId === newCartId);
        if (existing) {
          return withoutOld.map((p) =>
            p.cartId === newCartId ? { ...p, quantity: p.quantity + qty } : p,
          );
        }
        return [...withoutOld, { cartId: newCartId, menuItem: item, quantity: qty, selectedConfig }];
      });
      setEditingCartItem(null);
      setCustomizingItem(null);
      return;
    }
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

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prevItems) => prevItems.filter((p) => p.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Save profile/address for signed-in users, then place the order.
  // Guests skip the account steps — their details ride on the order itself.
  const handlePlaceOrder = async (info: CheckoutInfo) => {
    let deliveryAddressId: string | undefined;

    if (isAuthenticated) {
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

      // 2. Resolve the delivery address id. A newly entered address always wins —
      //    save it and use it — so we never fall back to a stale selected id.
      if (info.newAddress) {
        const created = await createAddress({
          ...info.newAddress,
          // Make the first saved address the default.
          isDefault: addresses.length === 0,
        });
        deliveryAddressId = created.id;
        reloadAddresses();
      } else if (info.selectedAddressId) {
        deliveryAddressId = info.selectedAddressId;
      }
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

    const specialInstructions = [
      `Name: ${info.firstName} ${info.lastName}`,
      `Phone: ${info.phone}`,
      info.riderNote ? `Special request: ${info.riderNote}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const payload: CreateOrderPayload = {
      branchId: branchId ?? DEFAULT_BRANCH_ID,
      orderType,
      paymentMethod: info.paymentMethod,
      // Pickup orders carry no delivery address.
      ...(orderType !== 'takeaway' && deliveryAddressId ? { deliveryAddressId } : {}),
      // Snapshot fields — required for guests, kept for signed-in users too.
      customerName: `${info.firstName} ${info.lastName}`.trim(),
      customerPhone: info.phone,
      ...(orderType !== 'takeaway' && info.deliveryAddressText
        ? { deliveryAddress: info.deliveryAddressText }
        : {}),
      specialInstructions,
      orderItems,
    };

    return createOrder(payload);
  };

  // overflow-x-clip: decorative blur blobs on several pages extend past the
  // viewport on small screens; without clipping here the mobile layout
  // viewport widens and the fixed header ends up narrower than the page.
  // `clip` doesn't create a scroll container, so position:sticky still works.
  return (
    <div id="guru-app" className="relative bg-[#1c1c1c] min-h-screen text-zinc-100 selection:bg-primary-peach selection:text-black flex flex-col justify-between overflow-x-clip">
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
        <main className="pt-20 md:pt-28">
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
                  signatureItems={signatureItems}
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
                  groups={menuGroups}
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

              {activeSection === 'profile' && (
                <ProfilePage onRequireAuth={() => setIsAuthOpen(true)} />
              )}

              {activeSection === 'orders' && (
                <OrderHistoryPage
                  onRequireAuth={() => setIsAuthOpen(true)}
                  itemNameById={itemNameById}
                  onBrowseMenu={() => handleNavigate('menu')}
                />
              )}
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
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onEditItem={handleEditCartItem}
        isAuthenticated={isAuthenticated}
        onPlaceOrder={handlePlaceOrder}
        defaultFirstName={user?.firstName ?? ''}
        defaultLastName={user?.lastName ?? ''}
        defaultPhone={user?.phone ?? ''}
        savedAddresses={addresses}
        branchName={branch?.name ?? null}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
      />

      {/* Shared Customization Modal Dialog */}
      <CustomizationOverlay
        isOpen={customizingItem !== null}
        onClose={closeCustomizer}
        menuItem={customizingItem}
        initialConfig={editingCartItem?.selectedConfig ?? null}
        onConfirm={handleConfirmCustomization}
      />

      {/* Email + OTP Login Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Floating WhatsApp chat button */}
      <WhatsAppButton />

      {/* Branch Selection Modal */}
      <BranchModal
        isOpen={isBranchOpen}
        dismissable={hasBranch}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
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
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold text-zinc-400 select-none tracking-widest uppercase">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('home')}>Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('home')}>Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavigate('contact')}>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
