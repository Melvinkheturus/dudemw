# Guest ID Cookie Issue - Fix Documentation

## 🐛 Issue
Error in Vercel logs: "DELETE - No guest ID found, attempting to delete without guest filter"

Despite guest_id being present in the Supabase database, the server-side API routes were unable to read it from cookies.

## 🔍 Root Cause Analysis

1. **Cookie Reading Method**: The original code was manually parsing cookies by concatenating all cookies into a string. This approach was fragile in production environments.

2. **Cookie Setting Timing**: The guest_id cookie wasn't always set before API calls were made.

3. **Cookie Attributes**: The cookie might not have had proper SameSite attributes for cross-site requests in production.

## ✅ Solutions Implemented

### 1. Improved Cookie Reading in API Routes

**Changed From:**
```typescript
const cookieStore = await cookies()
const allCookies = cookieStore.getAll()
const cookieString = allCookies.map(c => `${c.name}=${c.value}`).join('; ')
const guestId = getGuestIdFromCookie(cookieString)
```

**Changed To:**
```typescript
const cookieStore = await cookies()
const guestIdCookie = cookieStore.get('guest_id')
const guestId = guestIdCookie?.value
```

This directly accesses the cookie by name using Next.js's built-in API, which is more reliable.

### 2. Better Error Handling in DELETE Route

**Before:** Silently attempted deletion without guest_id filter

**After:** Returns proper error response to the client:
```typescript
if (!guestId) {
    console.error('DELETE - No guest ID found in cookies')
    console.error('Available cookies:', cookieStore.getAll().map(c => c.name))
    return NextResponse.json(
        { error: 'Guest ID not found. Please refresh the page and try again.' },
        { status: 400 }
    )
}
```

### 3. Enhanced Guest ID Cookie Management

**Updated `/app/src/lib/utils/guest.ts`:**

- Cookie is now checked FIRST (source of truth)
- Cookie is always re-set on every call to ensure it's present
- Added proper `SameSite=Lax` attribute for better compatibility
- Added better logging for debugging

```typescript
// Check cookie first (source of truth)
const cookieMatch = document.cookie.match(new RegExp(`(^| )${GUEST_ID_COOKIE}=([^;]+)`))
let guestId = cookieMatch ? cookieMatch[2] : null

// Always ensure cookie is set
document.cookie = `${GUEST_ID_COOKIE}=${guestId}; path=/; max-age=${maxAge}; SameSite=Lax`
```

### 4. Early Guest ID Initialization

**Added to `/app/src/domains/wishlist/hooks/useWishlist.ts`:**

```typescript
// Initialize guest ID early (before any API calls)
useEffect(() => {
    if (!user && typeof window !== 'undefined') {
        // Ensure guest ID is created and cookie is set
        getOrCreateGuestId()
    }
}, [user])
```

This ensures the guest_id cookie is set as soon as the wishlist hook mounts.

## 📝 Files Modified

1. `/app/src/app/api/wishlist/route.ts`
   - Updated GET, POST, and DELETE handlers
   - Improved cookie reading
   - Better error handling

2. `/app/src/app/api/wishlist/sync/route.ts`
   - Updated cookie reading method

3. `/app/src/lib/utils/guest.ts`
   - Improved cookie management
   - Added SameSite attribute
   - Cookie is now always re-set to ensure persistence

4. `/app/src/domains/wishlist/hooks/useWishlist.ts`
   - Added early guest ID initialization

## 🧪 Testing Checklist

### For Guest Users:
- [ ] Add items to wishlist
- [ ] Refresh the page - items should persist
- [ ] Remove items from wishlist - should work without errors
- [ ] Check browser DevTools > Application > Cookies - `guest_id` cookie should be present
- [ ] Check Network tab - DELETE requests should succeed with 200 status

### For Logged-in Users:
- [ ] Wishlist operations should continue working normally
- [ ] No guest_id cookie should be present (user_id used instead)

### Error Scenarios:
- [ ] If guest_id cookie is somehow missing, user should see proper error message
- [ ] Error logs should show available cookies for debugging

## 🔧 Debugging Tips

If the issue persists, check:

1. **Browser Console:**
   ```javascript
   // Check if cookie is set
   document.cookie.split(';').find(c => c.includes('guest_id'))
   ```

2. **Network Tab:**
   - Look at the DELETE request
   - Check if cookies are being sent
   - Check response status and error message

3. **Server Logs (Vercel):**
   - Look for "Available cookies:" log
   - Verify guest_id is in the list

4. **Supabase:**
   - Verify guest_id values in wishlist_items table
   - Check if they match the cookie value

## 🚀 Deployment Notes

- No environment variables changed
- No database migrations required
- Changes are backward compatible
- Existing wishlist data will continue to work

## 📊 Expected Behavior After Fix

1. ✅ Guest users can add/remove wishlist items without errors
2. ✅ guest_id cookie persists across page refreshes
3. ✅ Proper error messages if cookie is missing
4. ✅ Better debugging information in logs
5. ✅ No more "No guest ID found" errors in production

