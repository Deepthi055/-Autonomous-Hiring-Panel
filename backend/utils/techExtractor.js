/**
 * Tech Extractor Utility - Extracts technology stacks from resume text
 */

const commonTechKeywords = {
  // Programming Languages
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'swift', 'kotlin', 'php', 'scala', 'perl', 'r', 'matlab', 'html', 'css'
  ],
  // Frontend Frameworks
  frontend: [
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'gatsby', 'jquery',
    'bootstrap', 'tailwind', 'material-ui', 'redux', 'context api', 'hooks'
  ],
  // Backend Frameworks
  backend: [
    'express', 'node.js', 'django', 'flask', 'spring', 'rails', 'laravel',
    'fastapi', 'nestjs', 'hapi', 'koa', 'asp.net', 'graphql', 'rest api'
  ],
  // Databases
  databases: [
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
    'oracle', 'dynamodb', 'cassandra', 'firebase', 'supabase', 'prisma'
  ],
  // Cloud & DevOps
  cloud: [
    'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'docker',
    'kubernetes', 'jenkins', 'travis ci', 'github actions', 'terraform', 'ansible',
    'circleci', 'gitlab ci', 'nginx', 'apache'
  ],
  // Tools & Others
  tools: [
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack',
    'postman', 'insomnia', 'webpack', 'vite', 'npm', 'yarn', 'pip', 'maven',
    'gradle', 'eslint', 'prettier', 'jest', 'mocha', 'cypress', 'selenium'
  ],
  // Data Science & ML
  dataScience: [
    'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy', 'scikit-learn',
    'jupyter', 'spark', 'hadoop', 'tableau', 'power bi', 'data studio'
  ]
};

/**
 * Extract technologies from text
 * @param {string} text - Resume text
 * @returns {object} - Object with categorized technologies
 */
function extractTechStack(text) {
  if (!text) {
    return { found: [], categories: {} };
  }

  const lowerText = text.toLowerCase();
  const found = [];
  const categories = {};

  // Search for each category
  for (const [category, keywords] of Object.entries(commonTechKeywords)) {
    const matched = [];
    
    for (const keyword of keywords) {
      // Use word boundary matching to avoid partial matches
      const regex = new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (regex.test(lowerText)) {
        matched.push(keyword);
        if (!found.includes(keyword)) {
          found.push(keyword);
        }
      }
    }

    if (matched.length > 0) {
      categories[category] = matched;
    }
  }

  return {
    found,
    categories,
    count: found.length
  };
}

/**
 * Get unique technologies from array of texts
 * @param {Array} texts - Array of text strings
 * @returns {object} - Object with categorized technologies
 */
function extractFromMultiple(texts) {
  const combined = texts.join(' ');
  return extractTechStack(combined);
}

/**
 * Filter technologies by category
 * @param {object} techStack - Result from extractTechStack
 * @param {string} category - Category to filter
 * @returns {Array} - Technologies in that category
 */
function filterByCategory(techStack, category) {
  if (!techStack || !techStack.categories) {
    return [];
  }
  return techStack.categories[category] || [];
}

/**
 * Check if specific technology exists
 * @param {object} techStack - Result from extractTechStack
 * @param {string} tech - Technology to check
 * @returns {boolean} - Whether technology was found
 */
function hasTechnology(techStack, tech) {
  if (!techStack || !techStack.found) {
    return false;
  }
  return techStack.found.includes(tech.toLowerCase());
}

module.exports = {
  extractTechStack,
  extractFromMultiple,
  filterByCategory,
  hasTechnology,
  commonTechKeywords
};
