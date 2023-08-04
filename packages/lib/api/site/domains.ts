export type ShopDomain =
  | {
      domain: string
      gotStatus: true
      verifications?: {
        type: string
        domain: string
        value: string
      }[]
    }
  | {
      domain: string
      gotStatus: false
      verifications: undefined
    }
