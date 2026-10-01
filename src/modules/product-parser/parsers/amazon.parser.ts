import type { ParsedProduct, ProductParserContext } from "../types.js";
import { GenericOpenGraphParser } from "../base-open-graph.parser.js";

export class AmazonParser extends GenericOpenGraphParser {
  override readonly source = "amazon";

  override canParse(url: URL) {
    return /(^|\.)amazon\./i.test(url.hostname);
  }

  override async parse(context: ProductParserContext): Promise<ParsedProduct> {
    return this.parseWithSource(context, this.source);
  }
}
