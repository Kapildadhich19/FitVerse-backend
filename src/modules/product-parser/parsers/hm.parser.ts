import type { ParsedProduct, ProductParserContext } from "../types.js";
import { GenericOpenGraphParser } from "../base-open-graph.parser.js";

export class HmParser extends GenericOpenGraphParser {
  override readonly source = "hm";

  override canParse(url: URL) {
    return /(^|\.)hm\.com$/i.test(url.hostname) || /(^|\.)www2\.hm\.com$/i.test(url.hostname);
  }

  override async parse(context: ProductParserContext): Promise<ParsedProduct> {
    return this.parseWithSource(context, this.source);
  }
}
