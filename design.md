# Website Architecture & Design System Spec — "guru"

This design documentation guides the development of the modern, high-conversion ordering platform for **Guru**, located at **9 H1 D Park, WAPDA Town Lahore** (Call: 0306 1114878). 

---

## 1. Brand Identity & Visual System

Shifting away from the bright yellow styling used in the early landing page draft, the official website adopts the elegant **premium, midnight slate texture and muted pinkish/coral tones** directly extracted from your authentic physical menus.

### Color Palette Spec
* **Primary Midnight Background:** `#121416` (Deep textured charcoal slate variant)
* **Brand Highlight / Accent Accent:** `#c89384` (The beautiful muted coral-rose gold tone used in menu text titles like "Takeaway & Delivery Available")
* **Secondary Text Muted Glow:** `#bfa399` (Soft desert-sand rose tone for structural navigation elements)
* **Pure Light Contrasts:** `#ffffff` for principal hero titles and `#e2e4e6` for standard body reading items.
* **Border Accents:** `rgba(200, 147, 132, 0.15)` for clean container framing without messy UI grids.

### Typography Rules
* **Hero Headings:** Large sans-serif font geometry (`Helvetica Neue`, `Inter`, or `Outfit`), stylized with strong semi-condensed letter weights to preserve the modern premium cafe feeling.
* **Subheadings & Script Text:** Elegant editorial serif alternatives used selectively for highlight statements (similar to the *"Refreshing Rivers!"* script style present in the menu graphics).

---

## 2. Page Hierarchy & Component Layout

### A. Dynamic Sticky Header Navigation
* **Left Section:** The crisp square black logo framing **`guru`** in minimalist low-case typography with an explicit thin `#c89384` accent line.
* **Center Section:** Clean text navigation anchors: `HOME`, `MENU`, `ABOUT US`, `CONTACT`.
* **Right Section:** A persistent high-contrast **`ORDER NOW`** smart action pill using the signature brand accent color.

### B. High-Conversion Hero Banner
* **Tagline Announcement:** *"Premium Culinary Blend"* styled in small tracking uppercase format.
* **Main Header:** *"Brewed to perfection"* (with *Perfection* dynamically highlighted in the rose-coral tone color).
* **Context Paragraph:** *"Experience the finest blend of culinary passion, premium coffee, and sensational flavors right in the heart of WAPDA Town, Lahore."*
* **Dual Calls-to-Action:** 1. Primary Fill button: `START ONLINE ORDER` (Triggers instantaneous viewport scroll directly into interactive categorization).
    2. Outline button: `VIEW FULL MENU` (Launches an optimized digital catalog drawer or a PDF viewer).

### C. The Smart Interactive Order System (Category-First Flow)
Users navigate items efficiently through a responsive **Horizontal Category Slider** that docks automatically to the top of the viewport upon browsing:
1.  **Breakfast & Desi Table:** *Halwa Puri Platter (Rs. 795), Masala Morning Thali (Rs. 895), Egg N' Hash Brown Wrap (Rs. 795)*
2.  **Premium Coffee (Hot & Cold):** *Spanish Shot (R: 675 / L: 775), Caramel Latte, Midnight Americano (Rs. 595)*
3.  **Premium Iced Blends & Shakes:** *Cookie Cloud, Frozen Cocoa Dream, Lotus Biscoff Shake (Rs. 895)*
4.  **Fruity Sodas & Chilled Rivers:** *Bubble Burst Sodas (Rs. 395), Smoothies (Rs. 695), Mojito Lemonades*
5.  **Main Bowls & Fish:** *Sizzle Fish Steak (Rs. 1795), Chicken Chowmein (Rs. 995), Chicken Chilli Dry (Rs. 995)*
6.  **Hand-Crafted Dairy Scoops & Desserts:** *Rollz Ice Cream (Rs. 395), Brownie With Icecream (Rs. 695), Waffles & Pancakes*

---

## 3. Advanced Digital UX Strategies

### Multi-Option Sizing Matrix
For coffee drinks (`Regular` vs `Large`) and hand-crafted ice cream scoops (`S / M / L`), the interface renders inline selection pill buttons directly inside the ordering modal block to prevent pricing ambiguity and ease decision making.

### Visual Modals for Food Customization
Clicking any item triggers a clean tray modal containing crisp real food imagery, detailed descriptive captions (e.g., *"Served with 2 golden fried puris paired with chanay, flavorful aloo bhujia, achar, and halwa"*), and quick modifiers such as add-on extra dip sauces (`+ Rs. 100`).

### Clean Floating Sticky Cart Indicator
A minimalistic order tray locks to the lower-right side of the viewport detailing the item count and real-time subtotal, encouraging frictionless cart checkout completions.

---

## 4. Technical Stack Recommendations
* **Frontend Engine:** Tailwind CSS combined with Next.js (React) or Vue 3 to achieve fast animation states, instantaneous reactive state counters, and lightning-fast page loading.
* **Media Treatment:** Use crisp transparent WebP images for food renders alongside smooth CSS background blurs (`backdrop-filter: blur()`) to duplicate the premium, depth-of-field overlay aesthetic from your draft layout.