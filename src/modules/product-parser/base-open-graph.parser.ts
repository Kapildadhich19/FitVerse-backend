import type { ParsedProduct, ProductParser, ProductParserContext } from "./types.js";
import {
  asString,
  asStringArray,
  findOffer,
  findProductJsonLd,
  getMetaContent,
  getTitle,
  normalizeImages,
  parsePrice,
  requireProductTitle
} from "./parser-utils.js";

export class GenericOpenGraphParser implements ProductParser {
  readonly source: string = "generic";

  canParse(_url: URL) {
    return true;
  }

  async parse(context: ProductParserContext): Promise<ParsedProduct> {
    return this.parseWithSource(context, this.source);
  }

  protected parseWithSource(context: ProductParserContext, source: string): ParsedProduct {
    const productJsonLd = findProductJsonLd(context.html);
    const offer = findOffer(productJsonLd);
    const title = asString(productJsonLd?.name) ?? getMetaContent(context.html, "og:title") ?? getTitle(context.html);
    const brandValue = productJsonLd?.brand;
    const brand =
      asString(brandValue) ??
      (brandValue && typeof brandValue === "object" ? asString((brandValue as Record<string, unknown>).name) : null) ??
      getMetaContent(context.html, "product:brand");
    const description =
      asString(productJsonLd?.description) ??
      getMetaContent(context.html, "og:description") ??
      getMetaContent(context.html, "description");
    const images = normalizeImages(
      [...asStringArray(productJsonLd?.image), getMetaContent(context.html, "og:image")].filter(
        (image): image is string => Boolean(image)
      ),
      context.url
    );
    const price = parsePrice(offer?.price ?? getMetaContent(context.html, "product:price:amount"));
    const currency = asString(offer?.priceCurrency) ?? getMetaContent(context.html, "product:price:currency");

    return {
      title: requireProductTitle(title, source),
      brand,
      category: asString(productJsonLd?.category) ?? null,
      gender: null,
      description,
      images,
      sizes: [],
      colors: [],
      price,
      currency: currency?.toUpperCase() ?? null,
      source,
      sourceUrl: context.url.toString()
    };
  }
}
