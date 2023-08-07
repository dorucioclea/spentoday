export const login = "/login"
export const register = "/register"
export const accountForgot = "/account/forgot"
export const accountConfirm = "/account/confirm"
export const accountConfirmSuccess = "/account/confirm-success"
export const accountSettings = "/account/settings"
export const accountDelete = "/account/settings/delete"

export const dashboard = "/dashboard"

export const shop = (shopId: string) => `/shop/${shopId}`
export const shopCategories = (shopId: string) => `/shop/${shopId}/categories`
export const shopDomains = (shopId: string) => `/shop/${shopId}/domains`
export const shopOrders = (shopId: string) => `/shop/${shopId}/orders`
export const shopPages = (shopId: string) => `/shop/${shopId}/pages`
export const shopSettings = (shopId: string) => `/shop/${shopId}/settings`
export const shopProduct = (shopId: string, productId: string) =>
  `/shop/${shopId}/products/${productId}`
