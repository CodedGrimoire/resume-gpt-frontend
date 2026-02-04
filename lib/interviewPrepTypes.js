/**
 * TypeScript-like interfaces for Interview Prep data structure
 * These ensure structured, type-safe responses from the backend
 */

/**
 * @typedef {Object} TopicCategory
 * @property {string} category - Category name (e.g., "Technical Skills", "System Design")
 * @property {string[]} topics - Array of topics to prepare
 */

/**
 * @typedef {Object} Question
 * @property {string} question - The interview question
 * @property {string} answer - Personalized suggested answer
 * @property {string[]} keyPoints - Key points to cover in the answer
 * @property {string[]} [followUpQuestions] - Potential follow-up questions
 * @property {string} [difficulty] - Difficulty level (Beginner, Intermediate, Advanced)
 */

/**
 * @typedef {Object} ProjectQuestion
 * @property {string} projectName - Name of the project from resume
 * @property {string} question - Question about the project
 * @property {string} answer - Suggested answer
 * @property {string[]} keyPoints - Key technical points to mention
 */

/**
 * @typedef {Object} InterviewPrepData
 * @property {string} targetRole - Target job role
 * @property {string} [seniority] - Estimated seniority level
 * @property {string} [difficulty] - Overall difficulty (Beginner, Intermediate, Advanced)
 * @property {string} [timeEstimate] - Estimated prep time (e.g., "2-3 days")
 * @property {TopicCategory[]} topicsToPrepare - Topics grouped by category
 * @property {Question[]} hrQuestions - HR/Behavioral questions
 * @property {Question[]} technicalQuestions - Technical questions
 * @property {ProjectQuestion[]} projectQuestions - Project-specific questions
 * @property {string[]} quickTips - Quick preparation tips
 * @property {string[]} [redFlags] - Common red flags to avoid
 */

export const InterviewPrepTypes = {
  // This file serves as documentation for the expected data structure
  // The actual types are enforced by the backend response
};
