const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  /**
   * Generates a multi-level explanation for a concept.
   * @param {string} topic - The concept to explain.
   * @param {string} level - 'child-like', 'academic', or 'expert'.
   * @returns {Promise<Object>} - Explanation content.
   */
  async generateExplanation(topic, level = "academic") {
    const prompts = {
      "child-like": `Explain "${topic}" to a 10-year-old using simple analogies and engaging stories. Avoid jargon.`,
      "academic": `Explain "${topic}" at a university level. Include key theories, technical definitions, and real-world applications.`,
      "expert": `Provide a deep technical dive into "${topic}" for a professional. Discuss edge cases, optimization, complex architectures, and advanced nuances.`
    };

    const prompt = `
      ${prompts[level]}
      
      Format the response as a structured JSON object:
      {
        "title": "Clear Title",
        "content": "Detailed explanation with markdown formatting for bold and lists",
        "analogy": "A memorable analogy if applicable",
        "key_takeaways": ["point 1", "point 2"],
        "difficulty": "${level}"
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));
    } catch (error) {
      console.error("Gemini Explanation Error:", error);
      throw new Error("Failed to generate explanation");
    }
  }

  /**
   * Generates adaptive quiz questions based on the user's mastery.
   */
  async generateQuiz(topic, masteryLevel) {
    const prompt = `
      Generate a set of 3 challenging quiz questions for the topic "${topic}".
      Current user mastery: ${masteryLevel}%.
      
      Questions should be:
      1. Conceptual (True/False or Multiple Choice)
      2. Problem-solving (Scenario-based)
      3. Deep reasoning (Open-ended)
      
      Format as JSON:
      {
        "questions": [
          {
            "id": "q1",
            "type": "mcq",
            "question": "...",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "...",
            "difficulty": "number 1-10"
          },
          ...
        ]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json/g, "").replace(/```/g, ""));
    } catch (error) {
      console.error("Gemini Quiz Error:", error);
      throw new Error("Failed to generate quiz");
    }
  }

  /**
   * Analyzes user response for misconceptions.
   */
  async detectMisconceptions(topic, userResponse) {
    const prompt = `
      Topic: "${topic}"
      User says: "${userResponse}"
      
      Analyze this response. Are there any fundamental misconceptions? 
      If yes, identify them and provide a gentle correction.
      
      Format as JSON:
      {
        "has_misconception": boolean,
        "misconception_details": "string",
        "correction": "string",
        "confusion_score_increase": number (0-1)
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json/g, "").replace(/```/g, ""));
    } catch (error) {
      console.error("Gemini Misconception Error:", error);
      return { has_misconception: false };
    }
  }
}

module.exports = new GeminiService();
