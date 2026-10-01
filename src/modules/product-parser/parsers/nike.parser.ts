import type { ParsedProduct, ProductParserContext } from "../types.js";
import { GenericOpenGraphParser } from "../base-open-graph.parser.js";

export class NikeParser extends GenericOpenGraphParser {
  override readonly source = "nike";

  override canParse(url: URL) {
    return /(^|\.)nike\.com$/i.test(url.hostname);
  }

  override async parse(context: ProductParserContext): Promise<ParsedProduct> {
    return this.parseWithSource(context, this.source);
  }
}
