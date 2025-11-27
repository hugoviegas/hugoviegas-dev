/**
 * Chatbot Service for Hugo Viegas Portfolio
 * 
 * Uses Google Gemini-2.5-Flash-Lite API to answer questions about Hugo's portfolio.
 * Includes rate limiting: 4 questions/minute, 30 questions/day per user.
 */

// Portfolio context for the AI - includes information about Hugo Viegas
export const PORTFOLIO_CONTEXT = `
You are a helpful assistant for Hugo Viegas's portfolio website. You can ONLY answer questions about Hugo and his portfolio. For any other topics, politely decline with: "Desculpe, só posso responder dúvidas sobre o Hugo Viegas e seu portfólio."

About Hugo Viegas:
- Name: Hugo Viegas
- Current Role: IT Support Specialist | System Administrator at Erin College, Dublin (Sep 2024 - Present)
- Location: Dublin, Ireland (Originally from Brazil)
- Email: hugoviegas3.1@gmail.com
- LinkedIn: linkedin.com/in/hviegas
- GitHub: github.com/hugoviegas
- Languages: Portuguese (Native), English (C1 Proficiency)

Education:
- BSc (Honours) in Computing - Software Engineering at CCT College Dublin (Sep 2024 - Aug 2025) - Expected First Class Honours
- Technologist Degree in Analysis and Systems Development from UNICNEC, Brazil (Mar 2018 - Jul 2021)

Work Experience:
1. IT Support Specialist | System Administrator at Erin College, Dublin (Sep 2024 - Present)
   - Technical support for 120+ users
   - Google Workspace enterprise management
   - Active Directory administration
   - Network services configuration
   - Security policy implementation

2. IT Systems Support Specialist at ETAL Prestação de Serviços (May 2020 - Jun 2022)
   - Windows Server support for 50+ employees
   - Developed JavaScript automation reducing processing time by 90%
   - Built full-stack application integrating on-premise systems with Google Workspace APIs

3. Digital Designer | Web Developer at DabliumMusic (Jan 2019 - Feb 2020)
   - Web development using HTML, CSS, JavaScript
   - Visual identity and brand development

Technical Skills:
- Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, Python
- Databases: MySQL, SQL
- Cloud & Tools: Google Workspace Administration, Google Apps Script, AppSheet
- System Administration: Active Directory, Windows Server, Linux
- Other: Three.js, React Three Fiber (3D web graphics)

Projects:
1. D'Arcy McGee's Irish Pub Website - Professional restaurant website with modern responsive design
2. Business Process Automation System - JavaScript solution with Google Sheets integration (90% time reduction)
3. Modern E-Commerce Platform - Full-stack React/Node.js solution
4. Project Management Dashboard - Collaborative task management with TypeScript and Supabase

Key Achievements:
- 90% process reduction through JavaScript automation
- High first-call resolution rates
- International experience (Brazil and Ireland)
- Combining academic study with professional IT practice

Current Focus:
- Software Development and System Architecture
- Full-stack web development
- Cloud Computing and Network Fundamentals
- Information Security

Availability: Available for work - response time within 24 hours

Remember: 
- Answer in the same language the user writes to you (Portuguese or English)
- Be friendly, professional, and helpful
- Only answer questions about Hugo Viegas and his portfolio
- For off-topic questions, respond: "Desculpe, só posso responder dúvidas sobre o Hugo Viegas e seu portfólio." (if Portuguese) or "Sorry, I can only answer questions about Hugo Viegas and his portfolio." (if English)
`;

// Rate limiting storage keys
const RATE_LIMIT_MINUTE_KEY = 'chatbot_rate_minute';
const RATE_LIMIT_DAY_KEY = 'chatbot_rate_day';

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
  
  const minuteRemaining = Math.max(0, 4 - minuteData.count);
  const dayRemaining = Math.max(0, 30 - dayData.count);
  const resetMinute = Math.max(0, Math.ceil((oneMinute - (now - minuteData.timestamp)) / 1000));
  const resetDay = Math.max(0, Math.ceil((oneDay - (now - dayData.timestamp)) / 3600000)); // hours
  
  return {
    allowed: minuteRemaining > 0 && dayRemaining > 0,
    minuteRemaining,
    dayRemaining,
    resetMinute,
    resetDay
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
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Send a message to the Gemini API and get a response
 * @param message User's message
 * @param history Previous conversation history
 * @returns AI response
 */
export async function sendChatMessage(
  message: string, 
  history: ChatMessage[] = []
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return 'O chatbot não está configurado. Por favor, configure a API key do Gemini. / The chatbot is not configured. Please set up the Gemini API key.';
  }
  
  // Check rate limits
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    if (rateLimit.minuteRemaining === 0) {
      return `Você atingiu o limite de perguntas por minuto. Aguarde ${rateLimit.resetMinute} segundos. / You've reached the per-minute question limit. Please wait ${rateLimit.resetMinute} seconds.`;
    }
    return `Você atingiu o limite diário de 30 perguntas. O limite será resetado em aproximadamente ${rateLimit.resetDay} horas. / You've reached the daily limit of 30 questions. The limit will reset in approximately ${rateLimit.resetDay} hours.`;
  }
  
  try {
    // Build conversation context
    const conversationHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    const requestBody = {
      contents: [
        // System context as first message
        {
          role: 'user',
          parts: [{ text: PORTFOLIO_CONTEXT }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido! Estou pronto para responder perguntas sobre Hugo Viegas e seu portfólio. / Understood! I\'m ready to answer questions about Hugo Viegas and his portfolio.' }]
        },
        // Previous conversation history
        ...conversationHistory,
        // Current message
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('No response from API');
    }
    
    // Increment rate limit on successful response
    incrementRateLimit();
    
    return responseText;
  } catch (error) {
    console.error('Chatbot error:', error);
    return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente. / Sorry, an error occurred while processing your message. Please try again.';
  }
}
