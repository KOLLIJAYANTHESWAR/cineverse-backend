/**
 * Global error handler
 * MUST be the last middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Something went wrong",
  });
};
