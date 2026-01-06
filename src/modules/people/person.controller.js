import {
  fetchPersonDetails,
  searchPeople,
  fetchPopularPeople,
} from "./person.service.js";

/**
 * @desc Get person details (actor / director)
 * @route GET /api/people/:id
 */
export const getPersonDetails = async (req, res) => {
  try {
    const person = await fetchPersonDetails(req.params.id);

    res.status(200).json({
      success: true,
      data: person,
    });
  } catch (error) {
    console.error("getPersonDetails:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch person details",
    });
  }
};

/**
 * @desc Search people
 * @route GET /api/people/search
 */
export const searchPeopleController = async (req, res) => {
  try {
    const { q, page } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await searchPeople(q, page || 1);

    res.status(200).json({
      success: true,
      page: results.page,
      totalPages: results.total_pages,
      data: results.results,
    });
  } catch (error) {
    console.error("searchPeopleController:", error.message);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

/**
 * @desc Get popular people
 * @route GET /api/people/popular
 */
export const getPopularPeople = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const people = await fetchPopularPeople(page);

    res.status(200).json({
      success: true,
      page: people.page,
      totalPages: people.total_pages,
      data: people.results,
    });
  } catch (error) {
    console.error("getPopularPeople:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular people",
    });
  }
};
