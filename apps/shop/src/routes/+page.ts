// import { Api } from '$lib';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// for moving
const Api: any = '';

type ShopProduct = {
  name: string;
  image: string;
  price: string;
};

type Shop = {
  seo: {
    title: string;
    description: string;
  };
  products: ShopProduct[];
};

/*

Page need:
- shop name, description/short bio, seo
- shop banners
- shop informational pages link
- shop top level categories
- several (4) most popular products
- several (4) most new products  

*/

export const load = (async ({ url, fetch, params }) => {
  // const shop = params.shop;

  // shop.spentoday.com
  const domen = url.host;

  // fetch shop metadata and products
  const response = await Api.callPublic(fetch, `/api/shop/${domen}`);

  if (!response || !response.ok) throw redirect(302, '/');

  const json = (await response.json()) as Shop;

  return { shop: json };
}) satisfies PageLoad;
