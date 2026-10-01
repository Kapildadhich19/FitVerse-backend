import { GenericOpenGraphParser } from "./base-open-graph.parser.js";
import { AmazonParser } from "./parsers/amazon.parser.js";
import { FlipkartParser } from "./parsers/flipkart.parser.js";
import { HmParser } from "./parsers/hm.parser.js";
import { MyntraParser } from "./parsers/myntra.parser.js";
import { NikeParser } from "./parsers/nike.parser.js";
import { ZaraParser } from "./parsers/zara.parser.js";
import type { ProductParser } from "./types.js";

export class ParserFactory {
  private readonly parsers: ProductParser[];
  private readonly fallbackParser = new GenericOpenGraphParser();

  constructor() {
    this.parsers = [
      new AmazonParser(),
      new FlipkartParser(),
      new MyntraParser(),
      new ZaraParser(),
      new HmParser(),
      new NikeParser()
    ];
  }

  getParser(url: URL) {
    return this.parsers.find((parser) => parser.canParse(url)) ?? this.fallbackParser;
  }
}

export const parserFactory = new ParserFactory();
