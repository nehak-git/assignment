# ShopWise - E-commerce Single Page Application

A fully functional Single Page Application (SPA) built with React, TypeScript, Tailwind CSS, and shadcn/ui. This application fetches data from the FakeStoreAPI and displays products across multiple dynamic pages with routing, loading/error states, reusable components, and clean UI/UX.

## Technology Selection

### Why React + Vite + TypeScript?

1. **React**: Industry-standard library for building user interfaces with component-based architecture
2. **Vite**: Modern build tool that provides instant HMR and optimized production builds
3. **TypeScript**: Adds type safety, better IDE support, and catches errors at compile time
4. **Tailwind CSS v4**: Utility-first CSS framework for rapid, responsive styling
5. **shadcn/ui**: Beautiful, accessible component library built on Radix UI primitives

### API Selected

**FakeStoreAPI** (https://fakestoreapi.com)
- Free, no authentication required
- Provides realistic e-commerce data (products, categories, ratings)
- RESTful endpoints for products and categories

## Folder Structure

```
src/
├── api/                    # API service layer
│   ├── index.ts
│   └── products.ts         # FakeStoreAPI integration with Axios
├── components/
│   ├── common/             # Reusable components
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Footer.tsx
│   │   ├── Loader.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSkeleton.tsx
│   │   ├── SearchAndFilter.tsx
│   │   └── index.ts
│   ├── ui/                 # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   └── tooltip.tsx
│   └── Layout.tsx          # Main layout wrapper
├── context/                # React Context for global state
│   ├── AppContext.tsx      # Favorites, theme, filters
│   └── index.ts
├── hooks/                  # Custom React hooks
│   ├── useFavorites.ts
│   ├── useProducts.ts      # API data fetching hooks
│   ├── useTheme.ts
│   └── index.ts
├── lib/
│   └── utils.ts            # Utility functions (cn helper)
├── pages/                  # Page components
│   ├── FavoritesPage.tsx
│   ├── HomePage.tsx
│   ├── NotFoundPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── ProductsPage.tsx
│   └── index.ts
├── types/                  # TypeScript type definitions
│   ├── product.ts
│   └── index.ts
├── App.tsx                 # Main app with routing
├── index.css               # Tailwind CSS + theme variables
└── main.tsx                # Entry point
```

## Pages Overview

### Page 1: Home Page (`/`)
- Hero section with welcome message
- Feature highlights (why shop with us)
- Featured products (top-rated items)
- Call-to-action sections
- Navigation to other pages

### Page 2: Products List Page (`/products`)
- Full product catalog in responsive grid
- Search bar with real-time filtering
- Category filter dropdown
- Sort options (price, rating, name)
- Loading skeletons during fetch
- Empty state when no results

### Page 3: Product Detail Page (`/products/:id`)
- Large product image
- Full product information (title, description, price)
- Rating with review count
- Category badge
- Add to favorites button
- Share functionality
- Back navigation

### Bonus Page: Favorites Page (`/favorites`)
- Shows all favorited products
- Persisted in localStorage
- Empty state with call-to-action

## Components Used

### Reusable Components
| Component | Description |
|-----------|-------------|
| `Navbar` | Responsive navigation with active states, mobile menu, favorites count |
| `Footer` | Site footer with credits and links |
| `ProductCard` | Product display card with image, title, price, rating, favorite toggle |
| `ProductCardSkeleton` | Loading placeholder for product cards |
| `Loader` | Spinning loader with optional text |
| `ErrorMessage` | Error display with retry button |
| `EmptyState` | Empty state display with action button |
| `SearchAndFilter` | Search input, category filter, sort dropdown |

### shadcn/ui Components
- Button, Card, Badge, Input, Select, Separator, Skeleton, Switch, Tooltip, Sonner (toast)

## Routing Explanation

Using **React Router v7** for client-side routing:

```tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />           // Home
    <Route path="products" element={<ProductsPage />} />  // List
    <Route path="products/:id" element={<ProductDetailPage />} /> // Detail with URL param
    <Route path="favorites" element={<FavoritesPage />} />
    <Route path="*" element={<NotFoundPage />} />    // 404
  </Route>
</Routes>
```

**Key Features:**
- Nested routing with shared layout (Navbar/Footer)
- URL parameters for product detail (`/products/3`)
- 404 handling for unknown routes
- Active link highlighting in navigation

## API Integration Explanation

### Service Layer (`src/api/products.ts`)
```typescript
// Axios instance with base configuration
const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
});

// API methods
api.getProducts()           // GET /products
api.getProductById(id)      // GET /products/:id
api.getCategories()         // GET /products/categories
api.getProductsByCategory() // GET /products/category/:name
```

### Custom Hooks (`src/hooks/useProducts.ts`)
```typescript
// Hook returns data, loading, error states
const { data, isLoading, error, refetch } = useProducts();
const { data: product } = useProduct(productId);
const { data: categories } = useCategories();
```

### Error Handling
- Network errors → User-friendly message
- 404 errors → "Resource not found"
- 500 errors → "Server error"
- Timeout → "Network error"

## State Management

### Global State (React Context)
```typescript
// AppContext provides:
- favorites: number[]        // Favorited product IDs
- toggleFavorite(id)         // Add/remove favorite
- isDark: boolean            // Dark mode state
- toggleTheme()              // Toggle dark/light mode
- filters: ProductFilters    // Search, category, sort
- filterAndSortProducts()    // Apply filters to products
```

### Local Storage Persistence
- Favorites saved to `shopwise_favorites`
- Theme preference saved to `shopwise_theme`

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Responsive grid (1-4 columns based on viewport)
- Mobile navigation menu
- Touch-friendly targets

### User Experience
- Loading skeletons (not spinners) for better perceived performance
- Toast notifications for actions
- Smooth hover animations on cards
- Clear error states with retry options
- Empty states with helpful guidance

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Bonus Features Implemented

| Feature | Description |
|---------|-------------|
| Search Bar | Real-time search across title, description, category |
| Category Filter | Filter products by category |
| Sort Options | Sort by price (asc/desc), rating, name |
| Dark Mode Toggle | System preference detection + manual toggle |
| Add to Favorites | Heart icon toggle, persisted in localStorage |
| Toast Notifications | Success feedback using Sonner |
| Skeleton Loading | Smooth loading states |
| Share Functionality | Native share API with clipboard fallback |

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd assignment

# Install dependencies
bun install
# or: npm install

# Start development server
bun dev
# or: npm run dev

# Build for production
bun run build
# or: npm run build
```

### Available Scripts
| Script | Description |
|--------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |

## Challenges & Solutions

### Challenge 1: TypeScript Strict Mode
**Problem:** Strict TypeScript configuration caused many type errors.
**Solution:** Created comprehensive type definitions in `src/types/` and used proper type guards.

### Challenge 2: State Persistence
**Problem:** Favorites and theme needed to persist across sessions.
**Solution:** Implemented localStorage persistence with proper error handling in Context.

### Challenge 3: API Error Handling
**Problem:** Different error types needed different user messages.
**Solution:** Created centralized error handler in API layer with specific messages per error type.

### Challenge 4: Responsive Design
**Problem:** Grid layout needed to adapt to many screen sizes.
**Solution:** Used Tailwind's responsive prefixes with a mobile-first approach.

### Challenge 5: Dark Mode with shadcn/ui
**Problem:** Theme switching needed to work with Tailwind CSS v4.
**Solution:** Used CSS custom properties with `.dark` class toggle, following shadcn/ui conventions.

## Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI Library |
| TypeScript | 5.9 | Type Safety |
| Vite | 7.3 | Build Tool |
| React Router | 7.13 | Routing |
| Tailwind CSS | 4.1 | Styling |
| shadcn/ui | Latest | Component Library |
| Axios | 1.13 | HTTP Client |
| Lucide React | 0.563 | Icons |
| Sonner | Latest | Toast Notifications |

## Project Report Summary

This SPA demonstrates proficiency in:
- Modern React development with hooks and context
- TypeScript for type-safe code
- Tailwind CSS for responsive styling
- Component architecture and reusability
- API integration with proper error handling
- State management with React Context
- Client-side routing with React Router
- Accessibility best practices
- Performance optimization (lazy loading images, skeleton states)

---

**Author:** Built as a frontend development assignment  
**API:** FakeStoreAPI (https://fakestoreapi.com)  
**Framework:** React + Vite + TypeScript + Tailwind CSS + shadcn/ui
