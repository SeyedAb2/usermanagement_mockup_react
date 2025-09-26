export const USER_TYPE_LABEL = { farmer: "کشاورز", seller: "فروشنده", service: "خدمات‌دهنده" } ;
export type UserKind = keyof typeof USER_TYPE_LABEL; // 'farmer' | 'seller' | 'service'

