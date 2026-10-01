import { AppError } from "../../shared/errors/app-error.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }
};
