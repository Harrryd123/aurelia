# AURELIA — Premium Shopify-style Landing Page (v3)

Isme kya add hua:
- **Real product photos** — reference image se hi actual product crops
  nikaal ke `images/` folder me daale hain (hero set + 5 bestseller
  products). Ab koi placeholder SVG nahi hai.
- **Customer Favorites section add ki gayi** — 5 products (Nourishing
  Face Oil, Hydrating Toner, Radiance Serum, Nourishing Cream,
  Balancing Cleanser) real photo, price, rating stars aur bestseller
  badge ke saath — bilkul reference banner jaisa.
- **Premium animations**: scroll-reveal fade-up on every section,
  floating hero image, hover zoom on product photos, sliding
  "Add to Bag" button on hover, marquee announcement bar, animated
  cart drawer + badge, smooth mobile menu.
- **Cash on Delivery (COD)** payment option add ki gayi cart
  checkout me (Prepaid vs COD radio) — announcement bar aur footer
  me bhi COD mention hai.
- **Fully responsive** — mobile, tablet, desktop sab par tested
  layout (hamburger menu, horizontal-scroll product cards on
  mobile, stacked footer).

## Files

```
index.html
style.css
script.js
images/
  hero-products.jpg
  product-oil.jpg
  product-toner.jpg
  product-serum.jpg
  product-cream.jpg
  product-cleanser.jpg
```

Sab same folder me rakhna, `images/` subfolder ke saath — koi aur
subfolder nahi. Poora folder GitHub/Vercel/Shopify assets me
upload kar sakte ho.

## Kaise chalayein

`index.html` ko seedha browser me double-click karke khol lo, ya
GitHub Pages / Vercel / Netlify par deploy kar do.

## Apni real product photography lagana

Jab aapke paas actual studio photos ho jaayein, bas `images/`
folder ki respective file ko replace kar dena (same filename
rakhna) — `product-oil.jpg`, `product-toner.jpg`, etc. Koi HTML/CSS
change karne ki zaroorat nahi.

## Cart ko real checkout se connect karna

Abhi cart + COD selection sirf front-end demo hai (page reload pe
reset ho jata hai). Real orders/payment ke liye Shopify checkout ya
Razorpay/Stripe backend integrate karna hoga — bata dena, wo alag
se set up kar denge.
