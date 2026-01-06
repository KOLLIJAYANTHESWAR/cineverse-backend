import express from "express";
import {
  getPersonDetails,
  searchPeopleController,
  getPopularPeople,
} from "./person.controller.js";

const router = express.Router();

/**
 * Search people
 */
router.get("/search", searchPeopleController);

/**
 * Popular actors / directors
 */
router.get("/popular", getPopularPeople);

/**
 * Person details
 */
router.get("/:id", getPersonDetails);

export default router;
