import { logger } from "../../infrastructure/logger/logger.js";
import { fetchProductHtml } from "./product-fetcher.js";
import { parserFactory } from "./parser-factory.js";
import type { ParsedProduct } from "./types.js";

export const productParserService = {
  async parse(urlInput: string): Promise<ParsedProduct> {
    const url = new URL(urlInput);
    const parser = parserFactory.getParser(url);
    const html = await fetchProductHtml(url);
    const product = await parser.parse({ url, html });

    logger.info({ source: product.source, hostname: url.hostname }, "Product parsed");
    return product;
  }
};
