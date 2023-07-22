// place files you want to import through the `$lib` alias in this folder.

import { PUBLIC_API_URL } from "$env/static/public"

/**
 *  Add Spentoday API base to url:
 *  /v1/shops -> domain-of-api.com/v1/shops
 */
export const api = (route: string) => new URL(route, PUBLIC_API_URL)
