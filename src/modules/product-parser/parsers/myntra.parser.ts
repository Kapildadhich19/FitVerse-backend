import type { ParsedProduct, ProductParserContext } from "../types.js";
import { GenericOpenGraphParser } from "../base-open-graph.parser.js";

export class MyntraParser extends GenericOpenGraphParser {
  override readonly source = "myntra";

  override canParse(url: URL) {
    return /(^|\.)myntra\.com$/i.test(url.hostname);
  }

  override async parse(context: ProductParserContext): Promise<ParsedProduct> {
    return this.parseWithSource(context, this.source);
  }
}
