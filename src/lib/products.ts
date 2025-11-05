import { getProducts } from './actions/product.actions';
import type { IProduct } from '@/models/Product';


export async function getProductById(id: string): Promise<IProduct | undefined> {
    const allProducts = await getProducts();
    // In a real app, this would be a direct DB query `getProduct(id)`
    return allProducts.find(p => p._id.toString() === id);
}
