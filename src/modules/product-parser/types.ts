export type ParsedProduct = {
  title: string;
  brand: string | null;
  category: string | null;
  gender: string | null;
  description: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  price: number | null;
  currency: string | null;
  source: string;
  sourceUrl: string;
};

export type ProductParserContext = {
  url: URL;
  html: string;
};

export interface ProductParser {
  readonly source: string;
  canParse(url: URL): boolean;
  parse(context: ProductParserContext): Promise<ParsedProduct>;
}
