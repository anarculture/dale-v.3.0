# Dale! Carpooling App - UI Kit Documentation

## Overview
A high-fidelity, mobile-first UI kit for the "Dale!" carpooling app - a warm, modern BlaBlaCar-inspired design system.

## 🎨 Design Tokens

### Colors
- **Primary Orange:** `#fd5810` - Main CTAs and active states
- **Background Cream:** `#fffbf3` - App background (NOT pure white)
- **Surface White:** `#ffffff` - Cards, modals, bottom sheets
- **Text Heading:** `#1a1a1a` - Main headings
- **Text Body:** `#6b7280` - Body text and subtitles
- **Secondary BG:** `#fff7ed` - Secondary button backgrounds

### Typography
- **Font Family:** Plus Jakarta Sans (Modern Sans-serif)
- **Heading 1:** 32px, Bold (700)
- **Heading 2:** 24px, Bold (700)
- **Heading 3:** 20px, SemiBold (600)
- **Body:** 16px, Regular (400)
- **Small:** 14px, Regular (400)

### Border Radius
- **Buttons & Inputs:** 16px (`rounded-xl`)
- **Cards & Sheets:** 24px (`rounded-2xl`)
- **Pills/Badges:** 999px (`rounded-full`)

### Touch Targets
- Minimum height: 44px (iOS/Android guidelines)
- Buttons: 56px height
- Inputs: 56px height
- Bottom nav items: 80px height

## 🧩 Component Library

### 1. DaleButton
**Location:** `/src/app/components/dale/DaleButton.tsx`

**Variants:**
- **Primary:** Solid orange background, white text, full width, 56px height
- **Secondary:** Light orange background (`#fff7ed`), orange text
- **Ghost:** Transparent background, gray text

**Props:**
```typescript
variant?: 'primary' | 'secondary' | 'ghost';
className?: string;
...HTMLButtonElement props
```

### 2. DaleInput
**Location:** `/src/app/components/dale/DaleInput.tsx`

**Features:**
- Height: 56px
- Background: `#f3f4f6`
- Rounded: `rounded-xl`
- States: Default, Active (Orange border), Error (Red border)
- Optional icon support
- Optional label
- Error message display

**Props:**
```typescript
label?: string;
error?: string;
icon?: React.ReactNode;
...HTMLInputElement props
```

### 3. RideCard
**Location:** `/src/app/components/dale/RideCard.tsx`

**Features:**
- White container with shadow
- Vertical timeline showing Origin → Destination
- Times and cities for both points
- Large price display
- Driver avatar with optional verification badge
- Driver name and rating
- Available seats count

**Props:**
```typescript
ride: Ride;
onClick?: () => void;
className?: string;
```

### 4. BottomNav
**Location:** `/src/app/components/dale/BottomNav.tsx`

**Features:**
- Fixed bottom navigation
- 3 tabs: "Buscar" (Search), "Publicar" (Plus), "Perfil" (User)
- Active tab highlighted in orange
- 80px height for proper touch targets

**Props:**
```typescript
activeTab: 'buscar' | 'publicar' | 'perfil';
onTabChange: (tab: NavTab) => void;
```

## 📱 Key Screens

### Screen A: Welcome / Landing
**Location:** `/src/app/components/screens/WelcomeScreen.tsx`

**Features:**
- Cream background (`#fffbf3`)
- Dale! logo at top
- 3D car illustration with decorative elements
- Headline: "Tu viaje, tu elección"
- White bottom sheet with two CTA buttons

### Screen B: Search Form (Rider Flow)
**Location:** `/src/app/components/screens/SearchFormScreen.tsx`

**Features:**
- Header: "Buscar viaje"
- White card container with inputs:
  - Origin (¿Desde dónde?)
  - Destination (¿A dónde vas?)
  - Date picker
  - Passenger counter (1-8)
- Orange CTA button: "Buscar"
- Quick tips card

### Screen C: Search Results (List)
**Location:** `/src/app/components/screens/SearchResultsScreen.tsx`

**Features:**
- Header with route: "Caracas → Valencia"
- Date filter pill
- Filter options (price, etc.)
- Scrollable list of RideCard components
- Verified badges on driver photos
- Empty state design

### Screen D: Profile
**Location:** `/src/app/components/screens/ProfileScreen.tsx`

**Features:**
- Orange gradient header
- Large user avatar with verification badge
- Stats: Rating (4.8 ★) | "Verified Driver"
- Menu items:
  - Mis viajes
  - Pagos
  - Ayuda
  - Cerrar sesión
- Account info card

## 🎯 Design System Screen
**Location:** `/src/app/components/screens/DesignSystemScreen.tsx`

A comprehensive showcase of all design tokens and components, including:
- Color palette
- Typography scale
- Border radius examples
- Button variants
- Input states
- Sample ride card
- Icon style reference
- Touch target specifications

## 🚀 Usage

### Viewing the App
1. Start on the Welcome screen
2. Click the palette icon (top-right) to view the Design System documentation
3. Navigate through screens using the bottom navigation

### Navigation Flow
- **Welcome** → Search Form → Search Results
- **Welcome** → Publish Form
- **Bottom Nav** → Switch between Buscar, Publicar, Perfil

## 📐 Mobile-First Design
- Target viewport: 375px width
- Maximum width: 375px (centered on larger screens)
- Responsive touch targets (minimum 44px)
- Spanish language throughout

## 🎨 Icon Style
- Library: Lucide React
- Style: Rounded, outlined
- Standard sizes: 20px (w-5 h-5), 24px (w-6 h-6)

## ⚡ Interactions
- Buttons have active scale effect (0.98)
- Hover states on interactive elements
- Smooth transitions (200ms duration)
- Shadow elevations for depth

## 🔧 Technical Stack
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- Lucide React for icons
- Plus Jakarta Sans font family
