This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## SEO Configuration

This project is optimized for search engines with focus on Korean keywords:

### Target Keywords

- 스타티어표 (StarCraft tier list)
- 엑셀방송 (Excel broadcast)
- 스타크래프트 (StarCraft)
- 숲 엑셀 (Forest Excel)
- 프로게이머 랭킹 (Pro gamer rankings)

### SEO Features Implemented

1. **Meta Tags & Open Graph**

   - Comprehensive meta tags for all pages
   - Open Graph tags for social media sharing
   - Twitter Cards support

2. **Structured Data (Schema.org)**

   - WebSite schema for homepage
   - BreadcrumbList for navigation
   - SportsEvent schema for rankings

3. **Technical SEO**

   - `robots.txt` for crawler instructions
   - Dynamic sitemap generation
   - Canonical URLs for all pages
   - Mobile-friendly viewport settings

4. **Performance**
   - Optimized images with Next.js Image component
   - Compressed responses
   - Proper caching headers

### SEO Setup Checklist

Before deploying to production:

1. **Update Google Verification Code**

   ```typescript
   // In src/app/layout.tsx
   verification: {
     google: 'your-actual-google-verification-code',
   },
   ```

2. **Add OpenGraph Images**

   - Add `/public/images/og-image.jpg` (1200x630px)
   - Add `/public/images/star-tier-og.jpg` (1200x630px)
   - Add `/public/images/starcraft-og.jpg` (1200x630px)

3. **Configure Domain**

   - Update all instances of `https://seujinsa.com` to your actual domain
   - Files to update: `src/app/layout.tsx`, `src/utils/seo.utils.ts`, `src/app/sitemap.ts`

4. **Submit to Search Engines**
   - Submit sitemap to Google Search Console
   - Submit sitemap to Bing Webmaster Tools
   - Add Google Analytics (if needed)

### SEO Utils Usage

Use the SEO utilities for consistent metadata:

```typescript
import { generateMetadata, STARCRAFT_KEYWORDS } from "@/utils/seo.utils";

export const metadata = generateMetadata({
  title: "Your Page Title",
  description: "Your page description",
  keywords: STARCRAFT_KEYWORDS,
  canonicalUrl: "/your-page-url",
});
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
