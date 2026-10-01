import { Router } from "express";

import { validateBody } from "../../shared/http/validate-request.js";
import { requireAuth } from "../../shared/middleware/require-auth.js";
import { createProduct, listProducts, parseProduct } from "./product.controller.js";
import { createProductSchema, parseProductSchema } from "./product.schemas.js";

export const productRouter = Router();

productRouter.use(requireAuth);
productRouter.get("/", listProducts);
productRouter.post("/parse", validateBody(parseProductSchema), parseProduct);
productRouter.post("/", validateBody(createProductSchema), createProduct);
