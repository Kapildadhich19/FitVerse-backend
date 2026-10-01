import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";

export async function fetchProductHtml(url: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.PRODUCT_PARSE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FitVerseProductParser/0.1; +https://fitverse.local)",
        Accept: "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) {
      throw new AppError(response.status, `Product page returned ${response.status}`, "PRODUCT_FETCH_FAILED");
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new AppError(415, "Product URL did not return an HTML page", "PRODUCT_CONTENT_TYPE_UNSUPPORTED");
    }

    return response.text();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new AppError(504, "Product parsing timed out", "PRODUCT_PARSE_TIMEOUT");
    }

    throw new AppError(502, "Unable to fetch product page", "PRODUCT_FETCH_FAILED");
  } finally {
    clearTimeout(timeout);
  }
}
