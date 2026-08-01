export interface Offer {
  buyParams?: string;
  price?: number;
  priceFormatted?: string;
  type: 'buy' | 'subscription';
}
