/**
 * Parses the raw AI analysis response into structured data
 */

export const parseAnalysisResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return {};
  }

  const parsed = {};

  // Clean text helper
  const cleanupText = (s) => {
    return s
      .replace(/\r/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  // Split to lines helper
  const splitToLines = (block) => {
    return cleanupText(block)
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);
  };

  // Extract bullets or numbered items
  const extractBulletsOrNumbered = (block) => {
    const lines = splitToLines(block);
    const items = [];

    for (const line of lines) {
      // Remove markdown bullets, numbered prefixes, or section markers
      const cleaned = line
        .replace(/^[-•*]\s+/, '')
        .replace(/^\d+[\.\)]\s+/, '')
        .replace(/^##+\s*/, '')
        .trim();

      if (cleaned.length > 0 && !cleaned.match(/^[A-Z\s]+:$/)) {
        // Skip lines that are just section headers
        items.push(cleaned);
      }
    }

    return items;
  };

  // Extract first paragraph
  const extractFirstParagraph = (block) => {
    const txt = cleanupText(block);
    const parts = txt.split('\n\n');
    return parts[0]?.trim() || '';
  };

  // Find section helper
  const findSection = (raw, sectionName) => {
    const regex = new RegExp(
      `(^|\\n)##?\\s*${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:?\\s*(\\n|$)`,
      'i'
    );
    const match = raw.match(regex);
    if (!match) return null;

    const startIndex = match.index ?? -1;
    if (startIndex < 0) return null;

    // Find next heading after this one
    const afterStart = raw.slice(startIndex + match[0].length);
    const nextHeadingMatch = afterStart.match(/\n##?\s*[A-Z0-9 _-]+:?/i);

    const content = nextHeadingMatch
      ? afterStart.slice(0, nextHeadingMatch.index)
      : afterStart;

    return cleanupText(content);
  };

  const raw = cleanupText(rawText);

  // SCORE
  const scoreBlock =
    findSection(raw, 'SCORE') ||
    findSection(raw, 'Score') ||
    findSection(raw, 'RESUME SCORE');

  if (scoreBlock) {
    parsed.scoreText = extractFirstParagraph(scoreBlock);

    // Try to extract numeric score (e.g., 8.5/10)
    const numMatch = scoreBlock.match(/(\d+(\.\d+)?)\s*\/\s*10/i);
    if (numMatch?.[1]) {
      parsed.scoreNumber = Number(numMatch[1]);
    }
  }

  // TARGET JOB ROLE
  const targetRoleBlock =
    findSection(raw, 'TARGET JOB ROLE') ||
    findSection(raw, 'Target Job Role') ||
    findSection(raw, 'ROLE') ||
    findSection(raw, 'Role');

  if (targetRoleBlock) {
    parsed.targetRole = extractFirstParagraph(targetRoleBlock);
  }

  // BREAKDOWN
  const breakdownMatch = raw.match(/Breakdown\s*:\s*([\s\S]*?)(\n##|$)/i);
  if (breakdownMatch?.[1]) {
    parsed.breakdown = extractBulletsOrNumbered(breakdownMatch[1]);
  }

  // FEEDBACK
  const feedbackBlock =
    findSection(raw, 'FEEDBACK') ||
    findSection(raw, 'General Feedback') ||
    findSection(raw, 'GENERAL FEEDBACK');

  if (feedbackBlock) {
    parsed.feedback = cleanupText(feedbackBlock);
  }

  // ISSUES
  const issuesBlock =
    findSection(raw, 'ISSUES') ||
    findSection(raw, 'Issues') ||
    findSection(raw, 'Areas for Improvement');

  if (issuesBlock) {
    parsed.issues = extractBulletsOrNumbered(issuesBlock);
  }

  // SUGGESTIONS
  const suggestionsBlock =
    findSection(raw, 'SUGGESTIONS') ||
    findSection(raw, 'Suggestions') ||
    findSection(raw, 'Suggested Improvements');

  if (suggestionsBlock) {
    parsed.suggestions = extractBulletsOrNumbered(suggestionsBlock);
  }

  // TECHNICAL SKILLS REQUIRED
  const techSkillsBlock =
    findSection(raw, 'TECHNICAL SKILLS REQUIRED') ||
    findSection(raw, 'Technical Skills Required') ||
    findSection(raw, 'Required Technical Skills') ||
    findSection(raw, 'TECHNICAL SKILLS');

  if (techSkillsBlock) {
    parsed.technicalSkills = extractBulletsOrNumbered(techSkillsBlock);
  }

  // SOFT SKILLS REQUIRED
  const softSkillsBlock =
    findSection(raw, 'SOFT SKILLS REQUIRED') ||
    findSection(raw, 'Soft Skills Required') ||
    findSection(raw, 'Required Soft Skills') ||
    findSection(raw, 'SOFT SKILLS');

  if (softSkillsBlock) {
    parsed.softSkills = extractBulletsOrNumbered(softSkillsBlock);
  }

  // PROJECTS
  const projectsBlock =
    findSection(raw, 'PROJECTS THAT IMPRESS RECRUITERS') ||
    findSection(raw, 'Projects That Impress Recruiters') ||
    findSection(raw, 'Impressive Projects') ||
    findSection(raw, 'PROJECTS');

  if (projectsBlock) {
    parsed.projects = extractBulletsOrNumbered(projectsBlock);
  }

  // LEARNING PATHS & CERTIFICATIONS
  const certBlock =
    findSection(raw, 'LEARNING PATHS AND CERTIFICATIONS') ||
    findSection(raw, 'LEARNING PATHS & CERTIFICATIONS') ||
    findSection(raw, 'Learning Paths and Certifications') ||
    findSection(raw, 'Learning Paths & Certifications') ||
    findSection(raw, 'CERTIFICATIONS') ||
    findSection(raw, 'Certifications');

  if (certBlock) {
    parsed.certifications = extractBulletsOrNumbered(certBlock);
  }

  // JOB MARKET INSIGHT
  const marketBlock =
    findSection(raw, 'JOB MARKET INSIGHT') ||
    findSection(raw, 'Job Market Insight') ||
    findSection(raw, 'Market Insight') ||
    findSection(raw, 'JOB MARKET');

  if (marketBlock) {
    parsed.marketInsight = cleanupText(marketBlock);
  }

  return parsed;
};
