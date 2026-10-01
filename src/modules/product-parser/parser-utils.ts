import { AppError } from "../../shared/errors/app-error.js";

type JsonRecord = Record<string, unknown>;

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

export function getMetaContent(html: string, key: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escapedKey}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escapedKey}["'][^>]*>`, "i")
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);

    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  return null;
}

export function getTitle(html: string) {
  const match = /<title[^>]*>(.*?)<\/title>/is.exec(html);
  return match?.[1] ? decodeHtml(match[1].replace(/\s+/g, " ")) : null;
}

function collectJsonLdNodes(value: unknown): JsonRecord[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectJsonLdNodes);
  }

  const record = value as JsonRecord;
  const graph = record["@graph"];
  const graphNodes = Array.isArray(graph) ? graph.flatMap(collectJsonLdNodes) : [];

  return [record, ...graphNodes];
}

export function extractJsonLd(html: string) {
  const matches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis);
  const nodes: JsonRecord[] = [];

  for (const match of matches) {
    const rawJson = match[1]?.trim();

    if (!rawJson) {
      continue;
    }

    try {
      nodes.push(...collectJsonLdNodes(JSON.parse(rawJson)));
    } catch {
      continue;
    }
  }

  return nodes;
}

export function findProductJsonLd(html: string) {
  return extractJsonLd(html).find((node) => {
    const type = node["@type"];
    return type === "Product" || (Array.isArray(type) && type.includes("Product"));
  });
}

export function asString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function asStringArray(value: unknown) {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") {
        return [item];
      }

      if (item && typeof item === "object" && "url" in item && typeof item.url === "string") {
        return [item.url];
      }

      return [];
    });
  }

  if (typeof value === "object" && "url" in value && typeof value.url === "string") {
    return [value.url];
  }

  return [];
}

export function normalizeImages(images: string[], baseUrl: URL) {
  return [...new Set(images)]
    .map((image) => {
      try {
        return new URL(image, baseUrl).toString();
      } catch {
        return null;
      }
    })
    .filter((image): image is string => Boolean(image));
}

export function parsePrice(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

export function findOffer(product: JsonRecord | undefined) {
  const offers = product?.offers;

  if (Array.isArray(offers)) {
    return offers.find((offer): offer is JsonRecord => Boolean(offer) && typeof offer === "object");
  }

  if (offers && typeof offers === "object") {
    return offers as JsonRecord;
  }

  return undefined;
}

export function requireProductTitle(title: string | null, source: string) {
  if (!title) {
    throw new AppError(422, `Unable to parse product title from ${source}`, "PRODUCT_PARSE_FAILED");
  }

  return title;
}
