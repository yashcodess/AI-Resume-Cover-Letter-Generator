import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client, checking localStorage first, then .env for fallback
const getGenAIClient = () => {
  const localKey = localStorage.getItem('gemini_api_key');
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = localKey || envKey;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    throw new Error('Gemini API key is not configured. Please click the Settings (⚙️) icon to connect your key.');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Runs a structured JSON match analysis comparing a resume and job description.
 * @param {string} resumeText - Candidate's resume text.
 * @param {string} jobDescription - Target job requirements.
 * @returns {Promise<Object>} Formatted Match Analysis object.
 */
export async function analyzeResumeMatch(resumeText, jobDescription) {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          matchingSkills: {
            type: 'array',
            description: 'Skills explicitly or implicitly present in both resume and job description',
            items: { type: 'string' }
          },
          missingSkills: {
            type: 'array',
            description: 'Core skills or technologies requested in the job description but missing from the resume',
            items: { type: 'string' }
          },
          strengths: {
            type: 'array',
            description: 'Bullet points detailing how the candidate matches the job description well',
            items: { type: 'string' }
          },
          weaknesses: {
            type: 'array',
            description: 'Bullet points detailing significant gaps or areas where the candidate falls short',
            items: { type: 'string' }
          },
          improvementSuggestions: {
            type: 'array',
            description: 'Specific recommendations grouped by resume section',
            items: {
              type: 'object',
              properties: {
                section: { type: 'string', description: 'The section of the resume (e.g., Summary, Experience, Skills)' },
                suggestion: { type: 'string', description: 'Actionable advice on how to improve this section' }
              },
              required: ['section', 'suggestion']
            }
          },
          resumeMatchScore: {
            type: 'integer',
            description: 'A percentage score representing candidate-job skill and experience match (0-100)'
          },
          atsScore: {
            type: 'integer',
            description: 'A percentage compatibility score based on formatting, scanning readability, and structure (0-100)'
          },
          atsExplanation: {
            type: 'string',
            description: 'A short explanation (1-2 sentences) of why this ATS compatibility score was assigned'
          },
          scoreBefore: {
            type: 'integer',
            description: 'An estimated score of the resume alignment BEFORE suggestions are applied (0-100)'
          },
          scoreAfter: {
            type: 'integer',
            description: 'An estimated score of the resume alignment AFTER suggestions are applied (0-100)'
          }
        },
        required: [
          'matchingSkills', 
          'missingSkills', 
          'strengths', 
          'weaknesses', 
          'improvementSuggestions', 
          'resumeMatchScore', 
          'atsScore', 
          'atsExplanation', 
          'scoreBefore', 
          'scoreAfter'
        ]
      }
    }
  });

  const prompt = `
    Analyze the alignment between the candidate's resume and the job description.
    
    Resume:
    """
    ${resumeText}
    """
    
    Job Description:
    """
    ${jobDescription}
    """
    
    Perform a detailed analysis and fill out the JSON response schema. Be fair, objective, and search for equivalent synonyms (e.g. 'React.js' matches 'React').
  `;

  const result = await callGeminiWithRetry(model, prompt);
  const responseText = result.response.text();
  return JSON.parse(responseText);
}

/**
 * Generates a tailored Markdown version of the candidate's resume.
 * @param {string} resumeText - Candidate's resume text.
 * @param {string} jobDescription - Target job requirements.
 * @returns {Promise<string>} Tailored resume in Markdown format.
 */
export async function generateTailoredResume(resumeText, jobDescription) {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    You are an expert executive resume writer. Tailor the candidate's resume to better align with the provided job description.
    
    Instructions:
    - Rephrase achievements using action verbs and emphasize matching keywords from the job description.
    - Highlight responsibilities and accomplishments that directly demonstrate experience with the job's core requirements.
    - Do NOT hallucinate, invent, or add new experiences, jobs, credentials, or certifications. All experience details (dates, roles, companies) must remain exactly as in the original resume.
    - Structure the output in clean, professional GitHub-Flavored Markdown.
    
    Original Resume:
    """
    ${resumeText}
    """
    
    Job Description:
    """
    ${jobDescription}
    """
    
    Generate the tailored resume in Markdown format:
  `;

  const result = await callGeminiWithRetry(model, prompt);
  return result.response.text();
}

/**
 * Generates a customized cover letter in Markdown format.
 * @param {string} resumeText - Candidate's resume.
 * @param {string} jobDescription - Target job requirements.
 * @param {string} tone - Selection: Professional, Bold, Enthusiastic, Creative.
 * @param {string} length - Selection: Short, Standard, Detailed.
 * @returns {Promise<string>} Custom cover letter in Markdown format.
 */
export async function generateCoverLetter(resumeText, jobDescription, tone, length) {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    You are a professional career coach writing a tailored cover letter.
    
    Instructions:
    - Write a compelling cover letter for the candidate applying to the job description.
    - Adapt the tone to: "${tone}" (e.g. Professional = polished/diplomatic, Bold = confident/impactful, Enthusiastic = passionate/warm, Creative = storytelling/unique).
    - Adapt the length to: "${length}" (e.g. Short = ~200 words, Standard = ~350 words, Detailed = ~500 words).
    - Highlight the candidate's matching achievements and skills that fit the job.
    - Do NOT use placeholder brackets like "[Insert Name]" or "[Insert Date]"; write a ready-to-use letter. If names, dates, or company details are missing, construct a highly natural flow or use realistic context based on the inputs.
    - Structure the output in clean Markdown.
    
    Candidate Resume:
    """
    ${resumeText}
    """
    
    Job Description:
    """
    ${jobDescription}
    """
    
    Generate the cover letter in Markdown format:
  `;

  const result = await callGeminiWithRetry(model, prompt);
  return result.response.text();
}

/**
 * Extracts the HTTP status code or Gemini API error code from an error object.
 * @param {Error} error - Caught error object
 * @returns {number|null} HTTP status code or null if not found
 */
function getErrorStatusCode(error) {
  const message = error?.message || "";
  
  // Look for HTTP status codes (e.g. [503], [429], [401], etc.) inside square brackets
  const bracketMatch = message.match(/\[(\d{3})\]/);
  if (bracketMatch) {
    return parseInt(bracketMatch[1], 10);
  }

  // Look for standalone 3-digit status codes that are common HTTP status codes
  const standaloneMatch = message.match(/\b(400|401|403|404|429|500|503|504)\b/);
  if (standaloneMatch) {
    return parseInt(standaloneMatch[1], 10);
  }

  return error?.status || null;
}

/**
 * Calls Gemini model.generateContent with automatic retry on 503/429 up to 3 times.
 * Retry delays: 1s, 2s, 4s.
 */
async function callGeminiWithRetry(model, prompt) {
  let attempt = 0;
  const maxAttempts = 4; // 1 initial + 3 retries

  while (attempt < maxAttempts) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      attempt++;
      if (attempt >= maxAttempts) {
        throw error;
      }

      const statusCode = getErrorStatusCode(error);
      const isRetryable = statusCode === 503 || statusCode === 429;

      if (!isRetryable) {
        throw error;
      }

      const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
      console.warn(`Gemini API returned retryable status ${statusCode}. Retrying (attempt ${attempt}/3) in ${delay}ms...`, error);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Catch all Gemini API errors gracefully.
 * Logs the technical error only in the browser console.
 * Returns clean modern friendly messages.
 * @param {Error} error - Caught error object
 * @returns {{message: string, type: string}} Friendly message and error type
 */
export function parseGeminiError(error) {
  // 5. Log the technical error only in the browser console.
  console.error("Technical Gemini API Error:", error);

  const message = error?.message || "";
  const statusCode = getErrorStatusCode(error);

  const isNetwork = !navigator.onLine || 
                    message.toLowerCase().includes("failed to fetch") || 
                    message.toLowerCase().includes("network error") ||
                    message.toLowerCase().includes("dns") ||
                    message.toLowerCase().includes("unable to connect");

  if (isNetwork) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Unable to connect to Gemini. Check your internet connection.'
    };
  }

  switch (statusCode) {
    case 503:
      return {
        type: 'SERVICE_UNAVAILABLE',
        message: "Gemini AI service is temporarily busy. This occasionally happens during peak usage. We'll retry automatically."
      };
    case 429:
      return {
        type: 'RATE_LIMIT',
        message: 'Rate limit reached. Please wait a few moments before trying again.'
      };
    case 401:
    case 403:
      return {
        type: 'INVALID_API_KEY',
        message: 'Invalid API key. Please check your Gemini API key.'
      };
    case 500:
      return {
        type: 'INTERNAL_ERROR',
        message: 'Gemini API is currently experiencing an internal error. Please try again later.'
      };
    default:
      if (message.includes("API key is not configured")) {
        return {
          type: 'INVALID_API_KEY',
          message: 'Invalid API key. Please check your Gemini API key.'
        };
      }
      return {
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred during Gemini optimization. Please try again.'
      };
  }
}
