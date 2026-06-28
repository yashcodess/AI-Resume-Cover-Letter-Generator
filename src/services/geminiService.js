import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client if API key is present
const getGenAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please create a .env file and set VITE_GEMINI_API_KEY.');
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
    model: 'gemini-1.5-flash',
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
          }
        },
        required: ['matchingSkills', 'missingSkills', 'strengths', 'weaknesses', 'improvementSuggestions']
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

  const result = await model.generateContent(prompt);
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
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

  const result = await model.generateContent(prompt);
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
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

  const result = await model.generateContent(prompt);
  return result.response.text();
}
