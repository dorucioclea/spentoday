import type { PageLoad } from "./$types"

type ShopProduct = {
  name: string
  image: string
  price: string
}

// type Shop = {
//   seo: {
//     title: string
//     description: string
//   }
//   products: ShopProduct[]
// }

/*

Page need:
- shop name, description/short bio, seo
- shop banners
- shop informational pages link
- shop top level categories
- several (4) most popular products
- several (4) most new products  

*/

export const load = (async ({ url }) => {
  // const shop = params.shop;

  // shop.spentoday.com
  const domain = url.hostname

  return { domain: domain }
}) satisfies PageLoad
