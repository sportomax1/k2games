# BGG Price Tracker

Next.js/Vercel app for comparing prices across a BoardGameGeek collection.

Default BGG user: `sportomax`.

## Data sources

- Collection: `https://boardgamegeek.com/xmlapi2/collection?username=sportomax&own=1&stats=1`
- Amazon: `https://api.geekdo.com/api/amazon/textads?locale=us&objectid={BGG_ID}&objecttype=thing`
- Vendors: `https://api.geekdo.com/api/affiliateads?context=gamemarketplace&objectid={BGG_ID}&objecttype=thing&previewid=0`
- eBay: `https://api.geekdo.com/api/geekbay/items?ajax=1&objectid={BGG_ID}&objecttype=thing&pageid=1&showcount=25&sort=price`
- GeekMarket: `https://api.geekdo.com/api/market/products?ajax=1&nosession=1&objectid={BGG_ID}&objecttype=thing&pageid=1&showcount=50&stock=instock`

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import this folder in Vercel as a Next.js project. If using a monorepo, set the root directory to `bgg-price-tracker`.
