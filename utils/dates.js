/**
 * Date utility functions for stock data analysis
 * Provides formatted dates for API calls and user display
 */

/**
 * Formats a Date object to YYYY-MM-DD string format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("Invalid date provided to formatDate");
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Gets a date that is N days ago from current date
 * @param {number} n - Number of days to subtract from current date
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
function getDateNDaysAgo(n) {
  if (typeof n !== "number" || n < 0) {
    throw new Error("Days parameter must be a non-negative number");
  }

  const date = new Date();

  // Handle weekends - if today is Monday and we want 1 day ago,
  // we should get Friday's date instead of Sunday
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate actual days to subtract including weekends
  let daysToSubtract = n;

  // If we're asking for recent dates and it would land on a weekend,
  // adjust to get the last business day
  if (n <= 3) {
    const targetDay = (dayOfWeek - n) % 7;
    if (targetDay === 0) {
      // Sunday
      daysToSubtract = n + 2; // Go back to Friday
    } else if (targetDay === -1 || targetDay === 6) {
      // Saturday
      daysToSubtract = n + 1; // Go back to Friday
    }
  }

  date.setDate(date.getDate() - daysToSubtract);
  return formatDate(date);
}

/**
 * Gets the last N business days (excluding weekends)
 * @param {number} n - Number of business days to get
 * @returns {string[]} Array of formatted date strings
 */
function getLastNBusinessDays(n) {
  if (typeof n !== "number" || n <= 0) {
    throw new Error("Number of days must be a positive number");
  }

  const dates = [];
  const currentDate = new Date();
  let daysFound = 0;
  let daysBack = 0;

  while (daysFound < n) {
    daysBack++;
    const checkDate = new Date(currentDate);
    checkDate.setDate(currentDate.getDate() - daysBack);

    // Skip weekends (0 = Sunday, 6 = Saturday)
    const dayOfWeek = checkDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(formatDate(checkDate));
      daysFound++;
    }
  }

  return dates.reverse(); // Return in chronological order
}

/**
 * Date configuration for stock API calls
 * Uses business days to ensure we get valid market data
 */
export const dates = {
  // Get the last 3 business days for trend analysis
  startDate: getDateNDaysAgo(5), // Go back further to ensure we have business days
  endDate: getDateNDaysAgo(1), // Yesterday's data

  // Alternative: get specific business days
  businessDays: getLastNBusinessDays(3),

  // Utility functions for external use
  formatDate,
  getDateNDaysAgo,
  getLastNBusinessDays,
};

// For debugging/logging
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  console.log("📅 Date Configuration:", {
    startDate: dates.startDate,
    endDate: dates.endDate,
    businessDays: dates.businessDays,
  });
}
