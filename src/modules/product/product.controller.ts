import type { RequestHandler } from "express";

import { asyncHandler } from "../../shared/http/async-handler.js";
import type { AuthenticatedRequest } from "../../shared/middleware/authenticated-request.js";
import type { CreateProductInput, ParseProductInput } from "./product.schemas.js";
import { productService } from "./product.service.js";

export const listProducts: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const products = await productService.list(authRequest.user.id);
  response.json({ products });
});

export const createProduct: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const product = await productService.create(authRequest.user.id, request.body as CreateProductInput);
  response.status(201).json({ product });
});

export const parseProduct: RequestHandler = asyncHandler(async (request, response) => {
  const authRequest = request as AuthenticatedRequest;
  const input = request.body as ParseProductInput;
  const product = await productService.parse(authRequest.user.id, input.url);
  response.status(201).json(product);
});
