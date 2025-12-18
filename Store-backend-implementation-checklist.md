# Store-Backend Implementation Checklist

## Project Overview
Connect Store pages to fetch data from Admin Dashboard uploads stored in Supabase.

**Status Legend:**
- ⏳ Not Started
- 🔄 In Progress
- ✅ Completed
- ❌ Blocked/Issue

---

## Phase 1: Fix Service Layer (Core Foundation) 🔄

### 1.1 ProductService Methods
- ⏳ Add `getProducts()` method with filters
  - Fetch products with images, variants, categories, collections
  - Support filtering by category, collection, status, search
  - Support pagination
  - Support sorting options
  
- ⏳ Add `getProduct()` method for single product
  - Fetch complete product data
  - Include all relationships (images, variants, options, categories, collections)
  - Include inventory data
  
- ⏳ Add `getFeaturedProducts()` method
  - Fetch products marked as featured
  
- ⏳ Add `getNewArrivals()` method
  - Fetch recent products (last 30 days)
  
- ⏳ Add `getBestSellers()` method
  - Fetch products based on sales data

### 1.2 CategoryService Methods
- ⏳ Add `getCategories()` method
  - Fetch all active categories
  - Include subcategories if any
  
- ⏳ Add `getCategory()` method
  - Fetch single category by slug/id
  - Include products count

### 1.3 CollectionService Methods
- ⏳ Add `getCollections()` method
  - Fetch all active collections
  - Include product count
  
- ⏳ Add `getCollection()` method
  - Fetch single collection with products
  - Support pagination for products

### 1.4 BannerService Methods
- ⏳ Add `getActiveBanners()` method
  - Fetch banners by placement (hero, sidebar, etc.)
  - Filter by active status

---

## Phase 2: Connect Store Pages to Admin Data 🔄

### 2.1 Homepage (`DynamicHomepage.tsx`)
- ⏳ Fix homepage sections to fetch from `homepage_sections` table
- ⏳ Properly resolve products from collections
- ⏳ Add banner carousel from admin banners
- ⏳ Add featured products section
- ⏳ Add new arrivals section
- ⏳ Add best sellers section

### 2.2 Products Listing Page (`ProductsPage.tsx`)
- ⏳ Replace direct Supabase queries with `ProductService.getProducts()`
- ⏳ Implement proper filtering (category, price, etc.)
- ⏳ Implement sorting options
- ⏳ Implement pagination
- ⏳ Add loading states
- ⏳ Add error handling

### 2.3 Product Detail Page (`products/[slug]/page.tsx`)
- ⏳ Update to use `ProductService.getProduct()`
- ⏳ Ensure all product data is displayed (variants, images, options)
- ⏳ Add related products section
- ⏳ Add product tracking (views)

### 2.4 Categories Page (`categories/[slug]/page.tsx`)
- ⏳ Fetch categories from `CategoryService`
- ⏳ Display products from selected category
- ⏳ Add category filters and sorting
- ⏳ Implement breadcrumbs

### 2.5 Collections Pages
- ⏳ Create collections listing page (`/collections`)
- ⏳ Create collection detail page (`/collections/[slug]`)
- ⏳ Fetch from `CollectionService`
- ⏳ Display products in collection
- ⏳ Add collection filters

---

## Phase 3: Add Missing Store Features ⏳

### 3.1 Banners & Promotions
- ⏳ Add banner carousel on homepage
- ⏳ Add promotional banners from admin
- ⏳ Add category banners
- ⏳ Implement banner click tracking

### 3.2 Search Functionality
- ⏳ Implement global search
- ⏳ Add search suggestions
- ⏳ Add search results page
- ⏳ Add filters on search results

### 3.3 Product Features
- ⏳ Product quick view
- ⏳ Product comparison
- ⏳ Recently viewed products
- ⏳ Product recommendations

### 3.4 Category Navigation
- ⏳ Dynamic category menu from admin data
- ⏳ Mega menu with subcategories
- ⏳ Category images from admin

### 3.5 Data Consistency
- ⏳ Ensure all store pages use service layer
- ⏳ Consistent error handling across pages
- ⏳ Consistent loading states
- ⏳ Proper TypeScript types throughout

---

## Testing Checklist ⏳

### Data Flow Tests
- ⏳ Admin creates product → Store displays product
- ⏳ Admin creates category → Store shows in navigation
- ⏳ Admin creates collection → Store displays collection
- ⏳ Admin uploads banner → Store shows banner
- ⏳ Admin updates product → Store reflects changes
- ⏳ Admin deactivates product → Store hides product

### Page Tests
- ⏳ Homepage loads all sections correctly
- ⏳ Products page displays all products
- ⏳ Category pages filter correctly
- ⏳ Collection pages show correct products
- ⏳ Product detail pages show complete data
- ⏳ Search functionality works
- ⏳ Filters and sorting work

### Performance Tests
- ⏳ Page load times acceptable
- ⏳ Images load properly
- ⏳ No unnecessary re-renders
- ⏳ Efficient database queries

---

## Known Issues & Blockers ❌

### Current Issues
- ProductService.getProducts() method missing (Fixing in Phase 1)
- ProductService.getProduct() method missing (Fixing in Phase 1)
- Homepage sections not properly fetching collection products
- Direct Supabase queries instead of service layer

### Resolved Issues
(None yet - tracking as we fix)

---

## Notes & Decisions

### Architecture Decisions
- Using service layer pattern for data fetching
- Admin uses server actions, Store uses client-side services
- All data fetched from Supabase (single source of truth)
- TypeScript types generated from Supabase schema

### Performance Considerations
- Implement caching where appropriate
- Use pagination for large datasets
- Optimize images with Next.js Image component
- Use React Query for data fetching and caching

---

**Last Updated:** [Starting Phase 1]
**Next Milestone:** Complete Phase 1 - Service Layer Methods
