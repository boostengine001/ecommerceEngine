
'use server';

import dbConnect from '../db';
import Product, { type IProduct } from '@/models/Product';
import Category, { type ICategory } from '@/models/Category';

export interface SearchResults {
  products: IProduct[];
  categories: ICategory[];
}

export async function search(query: string): Promise<SearchResults> {
  if (!query) {
    return { products: [], categories: [] };
  }

  await dbConnect();

  const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const searchRegex = new RegExp(escapedQuery, 'i');

  const productsPromise = Product.find({
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { 'variants.sku': searchRegex },
    ],
  }).populate('category').limit(10).exec();

  const categoriesPromise = Category.find({
    $or: [{ name: searchRegex }, { description: searchRegex }],
  }).limit(5).exec();

  const [products, categories] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}
