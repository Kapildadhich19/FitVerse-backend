import type { CreateProductInput } from "./product.schemas.js";
import { productRepository } from "./product.repository.js";
import { productParserService } from "../product-parser/product-parser.service.js";

export const productService = {
  list(userId: string) {
    return productRepository.listByUser(userId);
  },

  create(userId: string, input: CreateProductInput) {
    return productRepository.create({
      userId,
      source: "manual",
      sourceUrl: input.sourceUrl,
      title: input.title,
      brand: input.brand ?? null,
      category: null,
      gender: null,
      description: null,
      imageUrl: input.imageUrl ?? null,
      images: input.imageUrl ? [input.imageUrl] : [],
      sizes: [],
      colors: [],
      price: input.priceCents ? input.priceCents / 100 : null,
      priceCents: input.priceCents ?? null,
      currency: input.currency ?? null
    });
  },

  async parse(userId: string, url: string) {
    const parsedProduct = await productParserService.parse(url);
    const imageUrl = parsedProduct.images[0] ?? null;
    const priceCents = parsedProduct.price === null ? null : Math.round(parsedProduct.price * 100);

    const product = await productRepository.create({
      userId,
      sourceUrl: parsedProduct.sourceUrl,
      source: parsedProduct.source,
      title: parsedProduct.title,
      brand: parsedProduct.brand,
      category: parsedProduct.category,
      gender: parsedProduct.gender,
      description: parsedProduct.description,
      imageUrl,
      images: parsedProduct.images,
      sizes: parsedProduct.sizes,
      colors: parsedProduct.colors,
      price: parsedProduct.price,
      priceCents,
      currency: parsedProduct.currency
    });

    return {
      ...parsedProduct,
      id: product.id
    };
  }
};
