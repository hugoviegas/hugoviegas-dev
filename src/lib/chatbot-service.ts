import darcyProjectContext from "./project-contexts/darcy.json";
import bigBangDuelProjectContext from "./project-contexts/big-bang-duel.json";
import type { LanguageCode } from "@/config/languages";

/**
 * Chatbot Service for Hugo Viegas Portfolio
 *
 * Uses multiple Google Gemini models with rotation for higher availability.
 * Models used: gemini-2.5-flash, gemini-2.0-flash
 * Rate limits: 15 questions/minute, 100 questions/day per user.
 */

// Available Gemini models for rotation (all free tier with good rate limits)
// - gemini-2.5-flash: Latest flash model, best quality
// - gemini-2.0-flash: Stable flash model, fallback
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

// Track which model to use next (rotates through models)
let currentModelIndex = 0;

/**
 * Get the next model in rotation
 */
function getNextModel(): string {
  const model = GEMINI_MODELS[currentModelIndex];
  currentModelIndex = (currentModelIndex + 1) % GEMINI_MODELS.length;
  return model;
}

// Portfolio context for the AI - comprehensive information about Hugo Viegas
export const PORTFOLIO_CONTEXT = `
You are Hugo's AI assistant on his portfolio website at hugoviegas.dev. You are knowledgeable and helpful.

IMPORTANT GUIDELINES:
- You CAN answer questions about various topics, but always try to relate back to Hugo's portfolio, skills, or experience when relevant
- Keep responses CONCISE (2-4 sentences max unless the user asks for more detail)
- Answer in the SAME LANGUAGE the user writes (Portuguese or English)
- Be friendly, professional, and conversational
- When discussing tech topics, try to mention how Hugo has experience or interest in that area
- For completely unrelated topics (politics, controversial subjects, etc.), politely redirect: "Interessante! Mas vamos falar sobre tecnologia ou meu portfólio? / Interesting! But let's talk about tech or my portfolio?"

ABOUT HUGO VIEGAS:
- Website: hugoviegas.dev
- Current Role: IT Support Specialist | System Administrator at Erin College, Dublin (Sep 2024 - Present)
- Location: Dublin, Ireland (Originally from São Paulo, Brazil)
- Contact: hugoviegas3.1@gmail.com
- LinkedIn: linkedin.com/in/hviegas
- GitHub: github.com/hugoviegas
- Languages: Portuguese (Native), English (C1 Proficiency)

EDUCATION:
- BSc (Honours) in Computing - Software Engineering at CCT College Dublin (Sep 2024 - Aug 2025) - Expected First Class Honours
- Technologist Degree in Analysis and Systems Development from UNICNEC, Brazil (Mar 2018 - Jul 2021)

PROFESSIONAL EXPERIENCE:
1. IT Support Specialist | System Administrator at Erin College, Dublin (Sep 2024 - Present)
   - Technical support for 120+ users in educational environment
   - Google Workspace enterprise administration (user accounts, security groups, organizational units)
   - Active Directory user management, permissions, Group Policy configurations
   - Network services configuration ensuring campus-wide connectivity
   - Security policy implementation following best practices
   - Technical documentation and user guides creation

2. IT Systems Support Specialist at ETAL Prestação de Serviços, Brazil (May 2020 - Jun 2022)
   - Windows Server support for 50+ employees
   - Developed custom JavaScript automation (Node.js, Express.js) reducing timesheet processing from 4 days to about 1 day (90% reduction)
   - Built full-stack application integrating on-premise systems with Google Workspace APIs
   - Created AppSheet applications on Google Sheets for internal process optimization
   - Technical documentation and standard operating procedures

3. Digital Designer | Web Developer at DabliumMusic, Brazil (Jan 2019 - Feb 2020)
   - Web development using HTML, CSS, JavaScript
   - Visual identity and brand development
   - Web hosting management and technical maintenance

TECHNICAL SKILLS:
Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Three.js, React Three Fiber
Backend: Node.js, Express.js, Python
Databases: MySQL, SQL, Supabase
Cloud & Tools: Google Workspace Administration, Google Apps Script, AppSheet, Vercel
System Admin: Active Directory, Windows Server, Linux, Group Policy
Design: UI/UX principles, responsive design, Figma basics

FEATURED PROJECTS:
1. D'Arcy McGee's Irish Pub Website (darcymcgeespub.com)
   - Hugo's first official website for the business, focused on the online menu and Saturday-night live shows
   - Included an admin workflow for practical menu updates
   - The restaurant later closed; the portfolio demo preserves the work with fictional data

2. Business Process Automation System
   - Custom JavaScript solution with Google Sheets and AppSheet integration
   - Reduced critical business processes by 90%
   - Technologies: JavaScript, Google Apps Script, AppSheet

3. Modern E-Commerce Platform
   - Full-stack solution with authentication, payment processing, admin dashboard
   - Built with React, Node.js, Express, SQL, Stripe

4. Project Management Dashboard
   - Collaborative task management with real-time updates
   - Built with React, TypeScript, Tailwind CSS, Supabase

PERSONAL JOURNEY (interesting story to share):
- Started tinkering with technology at age 8 with his first phone (downloading .jar games, customizing settings)
- At 11, won a regional Lego robotics championship and reached nationals
- Self-taught video/image editing, built first laptop from savings at 17
- Created a small videomaker studio with brother and friend in 2021
- Moved to Ireland in pursuit of better opportunities and English immersion
- Spent 2 years in hospitality accelerating fluency before returning to IT
- Currently balancing full-time IT work with Computer Science degree

KEY ACHIEVEMENTS:
- 90% process time reduction through JavaScript automation
- High first-call resolution rates in technical support
- First-Class academic results at CCT College Dublin
- International experience bridging Brazil and Ireland cultures
- Built real client website (D'Arcy McGee's) using AI tools and UX principles

WHAT HUGO IS LOOKING FOR:
- Front-end or Full-stack developer positions
- Values curiosity, product sense, and ability to turn complex processes into elegant solutions
- Open to remote, hybrid, or on-site arrangements
- Available for freelance work and full-time opportunities

THIS PORTFOLIO WEBSITE (hugoviegas.dev):
- Built with React, TypeScript, Tailwind CSS, Vite
- Features 3D elements using Three.js and React Three Fiber
- Interactive LEGO-themed design elements
- Star Wars inspired animations (X-Wing background, lightsaber)
- Bilingual support (Portuguese and English)
- This AI chatbot powered by Google Gemini

Remember to keep responses SHORT and ENGAGING. Always be helpful even on general topics, but gently guide the conversation toward Hugo's skills and portfolio.
`;

const DARCY_QUERY_TERMS =
  /\bd['’]?arcy\b|\birish pub\b|\brestaurant website\b|\bmenu\b|\bevents?\b|\blive shows?\b|\bportfolio demo\b/i;

const BIG_BANG_DUEL_QUERY_TERMS =
  /\bbig bang duel\b|\bduel\b|\bguest entry\b|\bguest access\b|\bgoogle sign(?:-?in)?\b|\bsolo experience\b|\bIA\b.*\bgame\b|\bAI\b.*\bgame\b|\bplayer account\b|\baccount journey\b|\bclasse\b|\bclasses\b|\bcartas\b|\bcards?\b|\bprogresso\b|\bprogression\b/i;

function isDarcyRelatedQuery(message: string): boolean {
  return DARCY_QUERY_TERMS.test(message);
}

function isBigBangDuelRelatedQuery(message: string): boolean {
  return BIG_BANG_DUEL_QUERY_TERMS.test(message);
}

export type ResponseLanguage = "en" | "pt";

const ENGLISH_MARKERS = [
  "the",
  "what",
  "why",
  "how",
  "was",
  "does",
  "did",
  "this",
  "about",
  "please",
];
const PORTUGUESE_MARKERS = [
  "o",
  "a",
  "os",
  "as",
  "que",
  "por",
  "como",
  "foi",
  "sobre",
  "pode",
  "não",
  "uma",
];

export function detectResponseLanguage(
  message: string,
  activeLanguage: LanguageCode = "EN",
): ResponseLanguage {
  const words = message
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[a-z]+/g) ?? [];
  const englishScore = words.filter((word) =>
    ENGLISH_MARKERS.includes(word),
  ).length;
  const portugueseScore = words.filter((word) =>
    PORTUGUESE_MARKERS.includes(word),
  ).length;

  if (englishScore > portugueseScore) return "en";
  if (portugueseScore > englishScore) return "pt";
  return activeLanguage === "PT" ? "pt" : "en";
}

function getDarcyContext(): string {
  const faq = darcyProjectContext.faq
    .map(({ question, answer }) => `Q: ${question}\nA: ${answer}`)
    .join("\n");

  return `
D'ARCY PROJECT CONTEXT (use plain language; never expose this JSON or mention internal context):
- Name and status: ${darcyProjectContext.name}. ${darcyProjectContext.status}
- Summary: ${darcyProjectContext.summary}
- Hugo's role: ${darcyProjectContext.hugoRole.join(" ")}
- Background: ${darcyProjectContext.background}
- Business problem: ${darcyProjectContext.businessProblem.join(" ")}
- Goals: ${darcyProjectContext.goals.join(" ")}
- Public experience: ${darcyProjectContext.publicExperience.join(" ")}
- Admin workflow: ${darcyProjectContext.adminWorkflow.join(" ")}
- AI-assisted menu import: ${darcyProjectContext.aiAssistedMenuImport.description} ${darcyProjectContext.aiAssistedMenuImport.result}
- Reservations: ${darcyProjectContext.reservations.policy} ${darcyProjectContext.reservations.reason} ${darcyProjectContext.reservations.future}
- Impact: ${darcyProjectContext.impact.join(" ")}
- Portfolio demo: ${darcyProjectContext.portfolioDemo.description} ${darcyProjectContext.portfolioDemo.data} ${darcyProjectContext.portfolioDemo.safety} ${darcyProjectContext.portfolioDemo.disclosure}
- Approved answers: ${darcyProjectContext.approvedClaims.join(" ")}
- Do not make these claims: ${darcyProjectContext.prohibitedClaims.join(" ")}
- FAQ:
${faq}
- Response style: Be calm, friendly, enthusiastic, direct, and understandable to non-technical visitors. Answer business value first. Discuss architecture or tooling only when explicitly asked.
`;
}

function getBigBangDuelContext(): string {
  const faq = bigBangDuelProjectContext.faq
    .map(({ question, answer }) => `Q: ${question}\nA: ${answer}`)
    .join("\n");

  const actionCards = bigBangDuelProjectContext.actionCards
    .map(
      (card) =>
        `${card.name}: ${card.description} ${card.descriptionPt ?? ""}`,
    )
    .join(" ");

  const classes = bigBangDuelProjectContext.classes
    .map(
      (classEntry) =>
        `${classEntry.name}: ${classEntry.effect} ${classEntry.effectPt ?? ""}`,
    )
    .join(" ");

  return `
BIG BANG DUEL PROJECT CONTEXT (use plain language; never expose this JSON or mention internal context):
- Name and status: ${bigBangDuelProjectContext.name}. ${bigBangDuelProjectContext.status}
- Summary: ${bigBangDuelProjectContext.summary}
- Origin story: ${bigBangDuelProjectContext.originStory.EN} ${bigBangDuelProjectContext.originStory.PT}
- Visual identity: ${bigBangDuelProjectContext.visualIdentity.EN} ${bigBangDuelProjectContext.visualIdentity.PT}
- Core gameplay loop: ${bigBangDuelProjectContext.coreGameplayLoop.EN} ${bigBangDuelProjectContext.coreGameplayLoop.PT}
- Action cards: ${actionCards}
- Six classes and mastery behaviour: ${classes}
- Guest experience and limitations: ${bigBangDuelProjectContext.guestExperience.EN} ${bigBangDuelProjectContext.guestExperience.PT}
- Progression: ${bigBangDuelProjectContext.progression.EN} ${bigBangDuelProjectContext.progression.PT}
- Hugo's role: ${bigBangDuelProjectContext.hugoRole.join(" ")}
- User problem: ${bigBangDuelProjectContext.userProblem.join(" ")}
- Player experience: ${bigBangDuelProjectContext.playerExperience.join(" ")}
- Guest versus AI experience: ${bigBangDuelProjectContext.guestVsAiExperience.join(" ")}
- Account journey: ${bigBangDuelProjectContext.accountJourney.join(" ")}
- Technology overview: ${bigBangDuelProjectContext.technologyOverview.join(" ")}
- Product and technical challenges: ${bigBangDuelProjectContext.productChallenges.EN} ${bigBangDuelProjectContext.productChallenges.PT} ${bigBangDuelProjectContext.challenges.join(" ")}
- AI opponent approach: ${bigBangDuelProjectContext.aiOpponentApproach.EN} ${bigBangDuelProjectContext.aiOpponentApproach.PT}
- Current project status: ${bigBangDuelProjectContext.currentProjectStatus.EN} ${bigBangDuelProjectContext.currentProjectStatus.PT}
- Future direction: ${bigBangDuelProjectContext.futureDirection.EN} ${bigBangDuelProjectContext.futureDirection.PT}
- Demonstrable capabilities: ${bigBangDuelProjectContext.demonstrableCapabilities.join(" ")}
- Approved answers: ${bigBangDuelProjectContext.allowedClaims.join(" ")}
- Do not make these claims: ${bigBangDuelProjectContext.prohibitedClaims.join(" ")} ${bigBangDuelProjectContext.forbiddenDetails.join(" ")}
- FAQ:
${faq}
- Response style: Be practical, direct, and friendly. Use clear product language for non-technical visitors. Answer in the same language as the user asks, and keep explanations short unless the user asks for more depth. Discuss technology only at a high level when asked and never expose code, credentials, Firebase details, user data, or unreleased features.
`;
}

function getProjectContext(projectId?: string, message?: string): string {
  if (projectId === "darcy" || (!projectId && message && isDarcyRelatedQuery(message))) {
    return getDarcyContext();
  }
  if (
    projectId === "big-bang-duel" ||
    (!projectId && message && isBigBangDuelRelatedQuery(message))
  ) {
    return getBigBangDuelContext();
  }
  return "";
}

export interface ChatRequestOptions {
  activeLanguage?: LanguageCode;
  projectId?: string;
}

// Rate limiting storage keys
const RATE_LIMIT_MINUTE_KEY = "chatbot_rate_minute";
const RATE_LIMIT_DAY_KEY = "chatbot_rate_day";

// Rate limits - with multi-model rotation and fallback
// Each model has approximately: 15 RPM, 1500 RPD (free tier)
// With 2 models and fallback, effective availability is higher
// Using conservative limits: 15 RPM, 100 RPD to stay well within API limits
const RATE_LIMIT_PER_MINUTE = 15;
const RATE_LIMIT_PER_DAY = 100;

interface RateLimitData {
  count: number;
  timestamp: number;
}

/**
 * Check if user has exceeded rate limits
 * @returns Object with allowed status and remaining counts
 */
export function checkRateLimit(): {
  allowed: boolean;
  minuteRemaining: number;
  dayRemaining: number;
  resetMinute: number;
  resetDay: number;
} {
  const now = Date.now();
  const oneMinute = 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;

  // Get minute rate data
  const minuteDataStr = localStorage.getItem(RATE_LIMIT_MINUTE_KEY);
  let minuteData: RateLimitData = minuteDataStr
    ? JSON.parse(minuteDataStr)
    : { count: 0, timestamp: now };

  // Reset minute counter if more than a minute has passed
  if (now - minuteData.timestamp > oneMinute) {
    minuteData = { count: 0, timestamp: now };
  }

  // Get day rate data
  const dayDataStr = localStorage.getItem(RATE_LIMIT_DAY_KEY);
  let dayData: RateLimitData = dayDataStr
    ? JSON.parse(dayDataStr)
    : { count: 0, timestamp: now };

  // Reset day counter if more than a day has passed
  if (now - dayData.timestamp > oneDay) {
    dayData = { count: 0, timestamp: now };
  }

  const minuteRemaining = Math.max(0, RATE_LIMIT_PER_MINUTE - minuteData.count);
  const dayRemaining = Math.max(0, RATE_LIMIT_PER_DAY - dayData.count);
  const resetMinute = Math.max(
    0,
    Math.ceil((oneMinute - (now - minuteData.timestamp)) / 1000),
  );
  const resetDay = Math.max(
    0,
    Math.ceil((oneDay - (now - dayData.timestamp)) / 3600000),
  ); // hours

  return {
    allowed: minuteRemaining > 0 && dayRemaining > 0,
    minuteRemaining,
    dayRemaining,
    resetMinute,
    resetDay,
  };
}

/**
 * Increment rate limit counters
 */
export function incrementRateLimit(): void {
  const now = Date.now();
  const oneMinute = 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;

  // Update minute counter
  const minuteDataStr = localStorage.getItem(RATE_LIMIT_MINUTE_KEY);
  let minuteData: RateLimitData = minuteDataStr
    ? JSON.parse(minuteDataStr)
    : { count: 0, timestamp: now };

  if (now - minuteData.timestamp > oneMinute) {
    minuteData = { count: 1, timestamp: now };
  } else {
    minuteData.count++;
  }
  localStorage.setItem(RATE_LIMIT_MINUTE_KEY, JSON.stringify(minuteData));

  // Update day counter
  const dayDataStr = localStorage.getItem(RATE_LIMIT_DAY_KEY);
  let dayData: RateLimitData = dayDataStr
    ? JSON.parse(dayDataStr)
    : { count: 0, timestamp: now };

  if (now - dayData.timestamp > oneDay) {
    dayData = { count: 1, timestamp: now };
  } else {
    dayData.count++;
  }
  localStorage.setItem(RATE_LIMIT_DAY_KEY, JSON.stringify(dayData));
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

/**
 * Send a message to the Gemini API and get a response
 * Uses model rotation for higher availability
 * @param message User's message
 * @param history Previous conversation history
 * @returns AI response
 */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = [],
  options: ChatRequestOptions = {},
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return "O chatbot não está configurado. Por favor, configure a API key do Gemini. / The chatbot is not configured. Please set up the Gemini API key.";
  }

  // Check rate limits
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    if (rateLimit.minuteRemaining === 0) {
      return `Você atingiu o limite de perguntas por minuto. Aguarde ${rateLimit.resetMinute} segundos. / You've reached the per-minute question limit. Please wait ${rateLimit.resetMinute} seconds.`;
    }
    return `Você atingiu o limite diário de ${RATE_LIMIT_PER_DAY} perguntas. O limite será resetado em aproximadamente ${rateLimit.resetDay} horas. / You've reached the daily limit of ${RATE_LIMIT_PER_DAY} questions. The limit will reset in approximately ${rateLimit.resetDay} hours.`;
  }

  // Try each model in rotation, with fallback to next if one fails
  const modelsToTry = [...GEMINI_MODELS];
  const startModel = getNextModel();
  const startIndex = modelsToTry.indexOf(
    startModel as (typeof GEMINI_MODELS)[number],
  );

  // Reorder to start from current rotation position
  const orderedModels = [
    ...modelsToTry.slice(startIndex),
    ...modelsToTry.slice(0, startIndex),
  ];

  for (const model of orderedModels) {
    try {
      const response = await tryModelRequest(apiKey, model, message, history, options);
      if (response) {
        // Increment rate limit on successful response
        incrementRateLimit();
        return response;
      }
    } catch (error) {
      console.warn(`Model ${model} failed, trying next...`, error);
      continue;
    }
  }

  return "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente. / Sorry, an error occurred while processing your message. Please try again.";
}

/**
 * Try to get a response from a specific model
 */
async function tryModelRequest(
  apiKey: string,
  model: string,
  message: string,
  history: ChatMessage[],
  options: ChatRequestOptions,
): Promise<string | null> {
  const responseLanguage = detectResponseLanguage(message, options.activeLanguage);
  const languageInstruction =
    responseLanguage === "pt"
      ? "Answer only in Portuguese. Do not include an English translation."
      : "Answer only in English. Do not include a Portuguese translation.";
  const projectContext = getProjectContext(options.projectId, message);

  // Build conversation context
  const conversationHistory = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const requestBody = {
    contents: [
      // System context as first message
      {
        role: "user",
        parts: [
          {
            text: `${PORTFOLIO_CONTEXT}${projectContext}\n\nRESPONSE LANGUAGE FOR THIS REQUEST: ${languageInstruction}`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Olá! Sou o assistente do Hugo no site hugoviegas.dev. Posso te ajudar com informações sobre o portfólio, habilidades técnicas, ou conversar sobre tecnologia em geral. Como posso ajudar? / Hi! I'm Hugo's assistant at hugoviegas.dev. I can help you with portfolio info, technical skills, or chat about tech in general. How can I help?",
          },
        ],
      },
      // Previous conversation history
      ...conversationHistory,
      // Current message
      {
        role: "user",
        parts: [{ text: message }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 800, // Balanced for concise but complete responses
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Gemini API error (${model}):`, errorData);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  // Extract response text
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!responseText) {
    throw new Error("No response from API");
  }

  return responseText;
}
