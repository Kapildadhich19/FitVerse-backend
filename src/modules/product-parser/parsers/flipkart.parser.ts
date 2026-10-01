import type { ParsedProduct, ProductParserContext } from "../types.js";
import { GenericOpenGraphParser } from "../base-open-graph.parser.js";

export class FlipkartParser extends GenericOpenGraphParser {
  override readonly source = "flipkart";

  override canParse(url: URL) {
    return /(^|\.)flipkart\.com$/i.test(url.hostname);
  }

  override async parse(context: ProductParserContext): Promise<ParsedProduct> {
    return this.parseWithSource(context, this.source);
  }
}
