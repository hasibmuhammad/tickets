import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// Create User
router.post("/", userController.createUser);

// Get all user
router.get("/", userController.getUsers);

// Get single user
router.get("/:id", userController.getUser);

// Update user
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
