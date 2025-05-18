import { Product } from "@/models/product.model";
import { Price } from "@/models/price.model";
import connectToDatabase from "@/lib/db";

export interface ProductWithPrice {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  metadata: Record<string, string>;
  prices: {
    id: string;
    currency: string;
    unit_amount: number | null;
    interval: string | null;
    interval_count: number | null;
    type: string;
    description: string | null;
  }[];
}

export async function getActiveProductsWithPrices(): Promise<ProductWithPrice[]> {
  await connectToDatabase();

  // Get all active products
  const products = await Product.find({ active: true }).lean();

  // Get all active prices for these products
  const productIds = products.map(product => product.id);
  const prices = await Price.find({ 
    product_id: { $in: productIds }, 
    active: true 
  }).lean();

  // Map prices to their respective products
  const productsWithPrices = products.map(product => {
    const productPrices = prices.filter(price => price.product_id === product.id);
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      metadata: product.metadata,
      prices: productPrices.map(price => ({
        id: price.id,
        currency: price.currency,
        unit_amount: price.unit_amount,
        interval: price.interval,
        interval_count: price.interval_count,
        type: price.type,
        description: price.description,
      })),
    };
  });

  // Only return products that have at least one price
  return productsWithPrices.filter(product => product.prices.length > 0);
}
