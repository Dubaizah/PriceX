# PriceX Complete Testing Tutorial

**Server Running:** http://localhost:3000

---

## PART 1: PUBLIC/USER FEATURES

### 1. Home Page (http://localhost:3000)
- [ ] **Hero Section** - Animated background with gradient orbs, zigzag grid pattern, floating dots, stock ticker
- [ ] **Search Bar** - Main search input with voice search icon
- [ ] **Features Grid** - 6 feature cards (AI Search, Price History, Smart Alerts, Trusted Reviews, Real-Time, Global)
- [ ] **Stats Section** - Users, Products, Retailers, Countries counters
- [ ] **Popular Categories** - 8 category cards with images and counts
- [ ] **Footer** - Links, social icons, copyright

### 2. Search (http://localhost:3000/search)
- [ ] **Search Input** - Type a product name to search
- [ ] **Filter Sidebar** - Category, Price Range, Store, Rating filters
- [ ] **Sort Options** - Price (Low/High), Relevance, Newest, Popular
- [ ] **Results Grid** - Product cards with images, prices, deals score
- [ ] **Pagination** - Load more products

### 3. Simple Search (http://localhost:3000/simple-search)
- [ ] **Basic Search** - Simple one-input search interface
- [ ] **Quick Results** - Instant search results display

### 4. Categories (http://localhost:3000/categories)
- [ ] **Category Grid** - Browse all product categories
- [ ] **Category Cards** - Icon, name, product count
- [ ] **Click Navigation** - Click to view products in category

### 5. Deals (http://localhost:3000/deals)
- [ ] **Deal Cards** - Hot deals with discount percentages
- [ ] **Deal Score** - Algorithm rating for each deal
- [ ] **Countdown Timers** - Limited time offers
- [ ] **Store Logos** - Retailer branding

### 6. Cashback (http://localhost:3000/cashback)
- [ ] **Cashback Offers** - List of stores with cashback percentages
- [ ] **Store Search** - Find specific stores
- [ ] **Category Filter** - Filter by category
- [ ] **Claim Buttons** - Navigate to store for cashback

### 7. Compare (http://localhost:3000/compare)
- [ ] **Add Products** - Select products to compare (up to 4)
- [ ] **Comparison Table** - Side-by-side price/features comparison
- [ ] **Price History** - Mini chart for each product
- [ ] **Remove Products** - Remove items from comparison

### 8. Price History (http://localhost:3000/price-history/[id])
- [ ] **Price Chart** - Interactive line chart showing price over time
- [ ] **Time Range Selector** - 7 days, 30 days, 90 days, 1 year
- [ ] **Statistics** - Average, highest, lowest prices
- [ ] **Deal Indicators** - Best time to buy markers

### 9. Alerts (http://localhost:3000/alerts)
- [ ] **Alert List** - Your price drop alerts
- [ ] **Create Alert** - Set target price for products
- [ ] **Alert Status** - Active/Triggered/Expired states

---

## PART 2: AUTHENTICATION

### 10. Login (http://localhost:3000/login)
- [ ] **Login Form** - Email and password fields
- [ ] **Remember Me** - Checkbox for persistent login
- [ ] **Forgot Password** - Password reset flow
- [ ] **Social Login** - Google, Facebook buttons (UI only)
- [ ] **Register Link** - Navigate to registration

### 11. Register (http://localhost:3000/register)
- [ ] **Registration Form** - Name, email, mobile, password
- [ ] **GDPR Consent** - Marketing, analytics, third-party toggles
- [ ] **Terms Acceptance** - Terms and conditions checkbox
- [ ] **Success Message** - Registration confirmation

---

## PART 3: USER ACCOUNT (After Login)

### 12. User Profile (Navigation)
- [ ] **My Alerts** - View and manage price alerts
- [ ] **My Deals** - Saved deals and favorites
- [ ] **Price History** - Tracked products
- [ ] **Cashback Earnings** - View cashback balance
- [ ] **Settings** - Account preferences

---

## PART 4: ADMIN PANEL

### 13. Admin Dashboard (http://localhost:3000/admin)
- [ ] **Admin Login** - Use admin credentials
- [ ] **Dashboard Overview** - System stats cards
- [ ] **Stats Cards:**
  - Total Users
  - Active Users
  - Locked Accounts
  - New Today
  - Login Attempts
  - Security Violations

- [ ] **Sidebar Navigation:**
  - Dashboard
  - Users (User management table)
  - Admins (Admin management)
  - Audit Logs (Security events)
  - Settings

- [ ] **Recent Users Section** - Latest user list with status
- [ ] **Security Events** - Recent login/activity logs

### 14. Admin Users Tab
- [ ] **User Table** - List all users
- [ ] **User Actions** - View, Edit, Lock, Delete
- [ ] **Search Users** - Find by name/email
- [ ] **Filter by Status** - Active, Locked, etc.

### 15. Admin Audit Logs Tab
- [ ] **Log Table** - Action history
- [ ] **Columns:** Action, User, IP Address, Timestamp, Status
- [ ] **Success/Failed Indicators** - Color-coded status

---

## PART 5: MOBILE & PWA FEATURES

### 16. Mobile Responsiveness
- [ ] **Responsive Header** - Hamburger menu on mobile
- [ ] **Mobile Navigation** - Bottom nav or hamburger menu
- [ ] **Touch-Friendly** - Buttons sized for mobile
- [ ] **Grid Adjustments** - 1-2 columns on mobile

### 17. PWA Features
- [ ] **Install Prompt** - Add to home screen option
- [ ] **Offline Mode** - View cached content offline
- [ ] **Dark Mode** - System preference detection

---

## PART 6: UI/UX FEATURES

### 18. Theme & Design
- [ ] **Dark Mode** - Toggle in header (if available)
- [ ] **Light Mode** - Clean light theme
- [ ] **Yellow Accent** - PriceX brand color throughout
- [ ] **Animations** - Smooth page transitions

### 19. Localization
- [ ] **Language Switcher** - Change language (header)
- [ ] **RTL Support** - Right-to-left languages
- [ ] **Currency Selector** - Change display currency

### 20. Performance
- [ ] **Fast Loading** - Pages load quickly
- [ ] **Lazy Loading** - Images load as you scroll
- [ ] **Turbopack** - Fast development builds

---

## TESTING CHECKLIST

| Feature | Page | Status |
|---------|------|--------|
| Home Hero | / | [ ] |
| Search | /search | [ ] |
| Simple Search | /simple-search | [ ] |
| Categories | /categories | [ ] |
| Deals | /deals | [ ] |
| Cashback | /cashback | [ ] |
| Compare | /compare | [ ] |
| Price History | /price-history/1 | [ ] |
| Alerts | /alerts | [ ] |
| Login | /login | [ ] |
| Register | /register | [ ] |
| Admin Dashboard | /admin | [ ] |
| User Management | /admin (Users tab) | [ ] |
| Audit Logs | /admin (Audit tab) | [ ] |

---

## HOW TO TEST

1. **Start Server:** Already running at http://localhost:3000
2. **Open Browser:** Go to http://localhost:3000
3. **Follow Order:** Test each page in the order above
4. **Check Each Item:** Mark [x] as you verify each feature
5. **Note Issues:** Document any bugs or missing features

### Testing Admin:
- Navigate to http://localhost:3000/admin
- Login with admin credentials
- Test all admin tabs and features

### Testing Authentication:
- Go to /login and /register
- Test the registration and login flows

---

## TROUBLESHOOTING

**Server not running?** Run: `cd pricex && npm run dev`

**Port in use?** Kill process on port 3000 or use different port

**Missing data?** This is a demo - data is mock/sample data

---

*Last Updated: Testing in progress*
