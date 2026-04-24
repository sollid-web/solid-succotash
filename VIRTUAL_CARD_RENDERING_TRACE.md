# Virtual Card UI Rendering Trace

## Overview
This document traces the complete rendering flow of the virtual card UI starting from the dashboard page, including all components involved and their DOM mounting hierarchy.

---

## 1. Entry Point: Dashboard Page

### File: `frontend/src/app/dashboard/page.tsx`
**Component:** `DashboardPage` (default export)
**Type:** Client Component (`"use client"`)

**Responsibility:**
- Fetches wallet, investments, and transactions data from API
- Renders portfolio overview with stats cards
- Displays "💳 Virtual Card" quick link section

**Virtual Card Link (Line 215-225):**
```tsx
<div className="mb-6 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">💳 Virtual Card</h3>
      <p className="text-sm text-gray-600 mt-1">Activate your digital card or view details</p>
    </div>
    <Link href="/dashboard/card" className="px-4 py-2 bg-gradient-to-r from-[#0f1c30] to-[#00a896] text-white font-semibold rounded-lg hover:shadow-lg hover:brightness-110 transition-all">
      View Card →
    </Link>
  </div>
</div>
```

**Mounts to DOM:** ✅ Yes - This section is rendered directly in the dashboard.

---

## 2. Layout Wrapper

### File: `frontend/src/app/dashboard/layout.tsx`
**Component:** `DashboardLayout` (default export)
**Type:** Server Component

**Responsibility:**
- Wraps all dashboard pages with the `DashboardShell` layout
- Provides consistent header, sidebar, and navigation

**Renders:**
```tsx
<DashboardShell>{children}</DashboardShell>
```

**Children:** VirtualCardPage (from `/dashboard/card`)

**Mounts to DOM:** ✅ Yes - Provides the page layout structure.

---

## 3. Dashboard Shell Component

### File: `frontend/src/app/dashboard/_components/DashboardShell.tsx`
**Component:** `DashboardShell`
**Type:** Client Component (`"use client"`)

**Responsibility:**
- Provides the sidebar and header navigation
- Wraps the page content
- Handles authentication and session state

**Mounts to DOM:** ✅ Yes - Renders the layout shell structure.

---

## 4. Virtual Card Page

### File: `frontend/src/app/dashboard/card/page.tsx`
**Component:** `VirtualCardPage` (default export)
**Type:** Client Component (`"use client"`)

**Responsibility:**
- Main page component for the virtual card view
- Uses `useVirtualCard()` hook to fetch card data
- Handles loading and error states
- Routes to appropriate view based on card status

**Hook:** `useVirtualCard()`
- Fetches card data from `/api/virtual-cards/`
- Returns: `{ card, loading, error, refetch }`

**View Selection Logic (Lines 610-614):**
```tsx
if (loading) return <LoadingView />;
if (error) return <ErrorView />;
if (!card) return <RequestCardView onRequested={refetch} />;
if (card.status === "pending") return <PendingCardView onRefresh={refetch} />;
return <ActiveCardView card={card} refetch={refetch} />;
```

**Mounts to DOM:** ✅ Yes - This is the page component.

---

## 5. Conditional Sub-Views (Based on Card Status)

### 5a. RequestCardView (Card Not Requested)
**Type:** Inline function in `VirtualCardPage`
**Responsibility:** Display request form for new virtual card
**Mounts to DOM:** ✅ Yes (when `!card`)

### 5b. PendingCardView (Card Pending Approval)
**Type:** Inline function in `VirtualCardPage`
**Responsibility:** Display pending status
**Mounts to DOM:** ✅ Yes (when `card.status === "pending"`)

### 5c. ActiveCardView (Card Active)
**Type:** Inline function in `VirtualCardPage`
**Responsibility:** Display active card with all interactive features
**Mounts to DOM:** ✅ Yes (when card is active/approved)

---

## 6. ActiveCardView - The Main Card Display

### Location: `frontend/src/app/dashboard/card/page.tsx` (Lines 280-610)
**Type:** Inline function component
**Parent:** `VirtualCardPage`

**Uses Hook:** `useBiometricAuth()` for security features
**Returns:** Biometric state, password modal, PIN modal handlers

**Key Sub-Components/Sections:**

#### 6.1 Card Flip Animation Container (Lines 337-424)
```tsx
<div style={{ perspective: "1500px" }} onClick={() => { if (!isFrozen) setIsFlipped((f) => !f); }}>
  <motion.div  // From framer-motion
    className="relative w-full h-full cursor-pointer select-none"
    style={{ transformStyle: "preserve-3d" }}
    initial={false}
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
```

**Mounts to DOM:** ✅ Yes - This is the animated 3D card element itself.

#### 6.2 Card Front Face (Lines 425-480)
- Header with WolvCapital + VISA logo
- Chip (gold gradient div)
- Contactless icon (SVG)
- Card number display
- Cardholder name
- Expiry date
- MasterCard logo
- Frozen overlay (conditionally)

**Mounts to DOM:** ✅ Yes - The visual representation of the card front.

#### 6.3 Card Back Face (Lines 482-505)
- Signature line
- CVV display (masked or visible based on security state)

**Mounts to DOM:** ✅ Yes - The visual representation of the card back.

#### 6.4 Balance Section (Lines 510-519)
```tsx
<div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-5 flex justify-between items-center">
  <div>Card Balance: {money(Number(card.balance) || 0)}</div>
  <div>Purchase Amount: {money(Number(card.purchase_amount) || 0)}</div>
</div>
```

**Mounts to DOM:** ✅ Yes - Information display below the card.

#### 6.5 Action Buttons Grid (Lines 521-544)
Four interactive buttons:
- 📋 Copy Number
- ❄️/🔥 Freeze Card
- 👁️/🙈 Show/Hide CVV
- 🔢/🔒 Full Number

**Mounts to DOM:** ✅ Yes - Grid of action buttons.

#### 6.6 Card Details Copy Grid (Lines 546-573)
Clickable rows showing:
- Card Number (masked/full)
- Expiry Date
- CVV (masked/visible)
- Cardholder Name

**Mounts to DOM:** ✅ Yes - Detailed information rows.

#### 6.7 Toast Component (Line 585)
```tsx
<Toast message={toast} show={toastVisible} />
```

**Mounts to DOM:** ✅ Yes (conditionally - when `toastVisible` is true)

#### 6.8 CreatePinModal Component (Lines 587-593)
Inline modal for setting card PIN

**Mounts to DOM:** ✅ Yes (conditionally - when `showCreatePinModal` is true)

#### 6.9 PasswordModal Component (Lines 595-601)
Inline modal for password verification

**Mounts to DOM:** ✅ Yes (conditionally - when `showPasswordModal` is true)

#### 6.10 Freeze Confirmation Modal (Lines 603-618)
Inline modal to confirm card freeze

**Mounts to DOM:** ✅ Yes (conditionally - when `showFreezeModal` is true)

---

## 7. Hook Dependencies

### useVirtualCard Hook
**File:** `frontend/src/hooks/useVirtualCard.ts`
**Purpose:** Fetches and manages virtual card data

**State Management:**
```tsx
const [card, setCard] = useState<VirtualCard | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**API Call:** `GET /api/virtual-cards/`

### useBiometricAuth Hook
**File:** `frontend/src/hooks/useBiometricAuth.ts`
**Purpose:** Handles biometric authentication and card detail security

**State Management:**
```tsx
const [securityUnlocked, setSecurityUnlocked] = useState(false);
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [passwordError, setPasswordError] = useState("");
const [isVerifying, setIsVerifying] = useState(false);
const [showCreatePinModal, setShowCreatePinModal] = useState(false);
```

**Features:**
- Biometric authentication (WebAuthn)
- Password fallback
- 60-second auto-lock timer
- Card PIN creation

---

## 8. Alternative Card Components (Not Used in Main Page)

### File: `frontend/src/components/VirtualCard/VirtualCard.jsx`
**Status:** Defined but not currently imported or used in the main card page
**Could be:** Alternative implementation or legacy component

### File: `frontend/src/components/VirtualCardWidget.tsx`
**Status:** Alternative widget for displaying card in other contexts
**Used in:** May be used on dashboard or other pages
**Uses:** `FlipCard` component

---

## 9. Additional Imported Libraries

- **framer-motion:** For 3D card flip animation
  ```tsx
  import { motion } from "framer-motion";
  ```
  
- **Next.js Link:** For navigation
  ```tsx
  import Link from "next/link";
  ```

---

## Complete Rendering Tree

```
DashboardLayout (Server Component)
├── DashboardShell (Client Component)
│   └── /dashboard/card/page.tsx
│       └── VirtualCardPage (Client Component) ← Entry Point
│           ├── useVirtualCard() Hook (fetches data)
│           └── Conditional Views:
│               ├── LoadingView (if loading)
│               ├── ErrorView (if error)
│               ├── RequestCardView (if !card)
│               ├── PendingCardView (if pending)
│               └── ActiveCardView ✅ MAIN CARD UI
│                   ├── useBiometricAuth() Hook
│                   ├── Toast Component (conditionally mounted)
│                   ├── CreatePinModal Component (conditionally mounted)
│                   ├── PasswordModal Component (conditionally mounted)
│                   ├── Freeze Modal Component (conditionally mounted)
│                   └── Card 3D Flip Container (motion.div with Framer Motion)
│                       ├── Card Front Face (absolutely positioned)
│                       │   ├── Header (WolvCapital + VISA)
│                       │   ├── Chip Icon (gold gradient)
│                       │   ├── Contactless Icon (SVG)
│                       │   ├── Card Number Display
│                       │   ├── Cardholder Name
│                       │   ├── Expiry Date
│                       │   ├── Visa Infinite Logo
│                       │   └── Frozen Overlay (conditionally)
│                       └── Card Back Face (absolutely positioned)
│                           ├── Signature Line
│                           └── CVV Display (masked or visible)
│                   ├── Balance Display Section
│                   ├── Action Buttons Grid (4 buttons)
│                   └── Card Details Copy Grid (4 rows)
```

---

## Which Components are Actually Mounted in DOM?

### ✅ ALWAYS MOUNTED:
1. **DashboardShell** - Layout wrapper
2. **ActiveCardView** (when card status is active/approved)
3. **motion.div** (Framer Motion 3D card container)
4. **Card Front Face div** - Always rendered
5. **Card Back Face div** - Always rendered (hidden by CSS transform)
6. **Balance Display Section**
7. **Action Buttons Grid**
8. **Card Details Copy Grid**

### ✅ CONDITIONALLY MOUNTED (Based on State):
1. **Toast Component** - When `toastVisible === true`
2. **CreatePinModal** - When `showCreatePinModal === true`
3. **PasswordModal** - When `showPasswordModal === true`
4. **Freeze Modal** - When `showFreezeModal === true`
5. **Frozen Overlay** - When `isFrozen === true`

### ❌ NOT MOUNTED:
1. **VirtualCard.jsx** - Legacy component, not imported
2. **CardActions.jsx** - Not used in main card page
3. **CardTransactions.jsx** - Not visible in main card page
4. **VirtualCardWidget.tsx** - Used in different contexts (not on `/dashboard/card`)

---

## DOM Hierarchy Summary

**The actual mounted DOM element for the card itself is:**

```
<motion.div>
  <div> ← Card Front (backfaceVisibility: hidden)
    (child elements for card design)
  </div>
  <div> ← Card Back (backfaceVisibility: hidden, transform: rotateY(180deg))
    (CVV and signature info)
  </div>
  [Conditionally] <div> ← Frozen Overlay
</motion.div>
```

**The motion.div is what applies the 3D flip animation via Framer Motion:**
- Initial state: `rotateY: 0`
- Flipped state: `rotateY: 180`
- Animation: Spring physics (stiffness: 260, damping: 20)

---

## State Management Flow

1. **Page Load:**
   - `VirtualCardPage` loads, calls `useVirtualCard()`
   - API request to `/api/virtual-cards/` triggers

2. **Data Received:**
   - `card` state is set with virtual card data
   - Renders `ActiveCardView`

3. **User Interaction:**
   - Click card → toggles `isFlipped` state
   - Click action button → toggles security/detail visibility
   - Freeze button → calls `/api/cards/freeze/` API
   - PIN modal → submits to create PIN

4. **Security State:**
   - `useBiometricAuth()` manages `securityUnlocked`
   - Auto-locks after 60 seconds
   - Hides sensitive details on lock

---

## API Endpoints Used

- `GET /api/virtual-cards/` - Fetch user's virtual card(s)
- `POST /api/virtualcards/` - Request new card (from RequestCardView)
- `POST /api/cards/freeze/` - Freeze/unfreeze card
- `POST /api/card-pin/verify/` - Verify card PIN (in useBiometricAuth)
- `POST /api/card-pin/create/` - Create new card PIN (in CreatePinModal)

---

## Styling Approach

- **Framework:** Tailwind CSS (utility classes)
- **Animation:** Framer Motion (3D transforms)
- **Inline Styles:** Perspective, backfaceVisibility, gradients, transforms
- **CSS Modules:** VirtualCard.module.css (for legacy component)

---

## Key Takeaways

1. **Main Card Component:** `ActiveCardView` function inside `/dashboard/card/page.tsx`
2. **Card Visual:** `motion.div` with Framer Motion animation (3D flip effect)
3. **State Management:** Centralized in `VirtualCardPage` with hooks
4. **Security:** `useBiometricAuth()` hook manages card detail protection
5. **DOM Mount:** The actual 3D card is a `motion.div` from Framer Motion within ActiveCardView
6. **Modals:** Conditionally mounted Portal-like divs for PIN, password, and freeze dialogs
