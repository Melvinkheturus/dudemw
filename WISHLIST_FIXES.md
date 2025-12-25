# Wishlist Bug Fixes - Summary

## Issues Fixed

### 1. ✅ Multiple Products Not Displaying in Wishlist
**Problem:** When adding multiple variants of the same product to wishlist, only one variant was displayed.

**Root Cause:** React was using `item.id` (product ID) as the key for rendering wishlist items. When multiple variants of the same product were added, they all had the same product ID, causing React to skip rendering duplicates.

**Solution:** Changed the React key from `item.id` to `${item.id}-${item.variantId || 'no-variant'}` to ensure each variant gets a unique key.

**File Changed:** `/app/src/domains/wishlist/components/WishlistPage.tsx` (Line 42)

### 2. ✅ Missing Discount Information on Wishlist Cards
**Problem:** Product cards in wishlist were not showing discount percentage and original price, even though the products had discounts on the products page.

**Root Cause:** 
- The API route was not fetching the `compare_price` field from the products table
- The pricing calculation logic in the wishlist hook was different from the ProductCard component

**Solution:**
1. Added `compare_price` field to the API query in `/app/src/app/api/wishlist/route.ts`
2. Updated the pricing calculation logic in `/app/src/domains/wishlist/hooks/useWishlist.ts` to match the ProductCard logic:
   - Use variant price as current price
   - Use product `compare_price` (or `original_price` as fallback) as MRP
   - Calculate discount percentage based on these values

**Files Changed:**
- `/app/src/app/api/wishlist/route.ts` (Line 29 - Added compare_price to query)
- `/app/src/domains/wishlist/hooks/useWishlist.ts` (Lines 37-68 - Updated pricing logic)

## Changes Made

### File 1: `/app/src/domains/wishlist/components/WishlistPage.tsx`
```tsx
// BEFORE
<div key={item.id} className="border border-gray-200...">

// AFTER  
<div key={`${item.id}-${item.variantId || 'no-variant'}`} className="border border-gray-200...">
```

### File 2: `/app/src/app/api/wishlist/route.ts`
```typescript
// ADDED compare_price to the products query
products (
  id,
  title,
  slug,
  price,
  original_price,
  compare_price,  // ← NEW
  images,
  description,
  in_stock
)
```

### File 3: `/app/src/domains/wishlist/hooks/useWishlist.ts`
```typescript
// SIMPLIFIED and ALIGNED pricing logic with ProductCard

// Current price: Use variant price (or product price as fallback)
const currentPrice = Number(variant?.price || product?.price || 0)

// MRP/Original price: Use product compare_price OR original_price
const mrp = Number(product?.compare_price || product?.original_price || 0)

// Calculate discount only if MRP exists and is higher than current price
const discount = mrp && mrp > currentPrice && currentPrice > 0
  ? Math.round(((mrp - currentPrice) / mrp) * 100)
  : 0
```

## Testing Checklist

- [ ] Add multiple variants of the same product to wishlist
- [ ] Verify all variants are displayed (not just one)
- [ ] Check that discount percentages are shown correctly
- [ ] Verify original prices (MRP) are displayed with strikethrough
- [ ] Ensure pricing matches the product cards on the products page
- [ ] Test with products that have discounts
- [ ] Test with products without discounts
- [ ] Test removing individual variants from wishlist

## Expected Behavior After Fix

1. **Multiple Products Display:** All wishlisted products and variants should now be visible in the wishlist
2. **Discount Information:** Product cards in wishlist will show:
   - Current price (bold)
   - Original price/MRP (strikethrough)
   - Discount percentage (e.g., "40% OFF" in red)
3. **Consistency:** Pricing and discount display should match the product cards on the products page

## Notes

- No database schema changes required
- All changes are frontend and API query updates
- The fix maintains backward compatibility
- The wishlist feature will now have consistent pricing display across the entire application
