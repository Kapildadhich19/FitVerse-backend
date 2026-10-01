import type { ParsedProduct, ProductParserContext } from "../types.js";
import { GenericOpenGraphParser } from "../base-open-graph.parser.js";

export class ZaraParser extends GenericOpenGraphParser {
  override readonly source = "zara";

  override canParse(url: URL) {
    return /(^|\.)zara\.com$/i.test(url.hostname);
  }

  override async parse(context: ProductParserContext): Promise<ParsedProduct> {
    return this.parseWithSource(context, this.source);
  }
}
