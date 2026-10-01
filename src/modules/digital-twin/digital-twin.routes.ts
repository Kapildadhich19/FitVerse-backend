import { Router } from "express";

import { validateBody } from "../../shared/http/validate-request.js";
import { requireAuth } from "../../shared/middleware/require-auth.js";
import {
  completeDigitalTwin,
  getDigitalTwin,
  saveAppearance,
  saveMeasurements,
  saveProfile
} from "./digital-twin.controller.js";
import {
  appearanceSchema,
  completeDigitalTwinSchema,
  measurementsSchema,
  profileSchema
} from "./digital-twin.schemas.js";

export const digitalTwinRouter = Router();

digitalTwinRouter.use(requireAuth);
digitalTwinRouter.get("/", getDigitalTwin);
digitalTwinRouter.put("/profile", validateBody(profileSchema), saveProfile);
digitalTwinRouter.put("/measurements", validateBody(measurementsSchema), saveMeasurements);
digitalTwinRouter.put("/appearance", validateBody(appearanceSchema), saveAppearance);
digitalTwinRouter.put("/complete", validateBody(completeDigitalTwinSchema), completeDigitalTwin);
