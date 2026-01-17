// GroqCloud API Service - Fast AI Inference for Question Generation
// Supports Llama 3, Mixtral, and other high-performance models

class GroqService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.model = import.meta.env.VITE_AI_MODEL || 'llama-3.3-70b-versatile';
    this.isAvailable = this.checkAvailability();
  }

  checkAvailability() {
    if (!this.apiKey || this.apiKey === 'your_groq_api_key_here') {
      console.warn('🔑 GroqCloud API key not configured');
      return false;
    }
    return true;
  }

  async generateQuestions(subject, chapter, count = 5, difficulty = 'medium') {
    if (!this.isAvailable) {
      throw new Error('GroqCloud API not available. Please configure your API key.');
    }

    console.log(`🚀 Generating ${count} ${difficulty} questions for ${subject} - ${chapter} using GroqCloud`);

    const prompt = this.buildQuestionPrompt(subject, chapter, count, difficulty);

    // Retry logic for better reliability
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} for GroqCloud generation`);

        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert CUET 2026 question generator. Respond with ONLY valid JSON arrays. No additional text or explanations outside the JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 3000,
            top_p: 0.9,
            stream: false
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`GroqCloud API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const generatedContent = data.choices[0]?.message?.content;

        if (!generatedContent) {
          throw new Error('No content generated from GroqCloud API');
        }

        const questions = this.parseQuestions(generatedContent, subject, chapter);
        
        if (questions.length > 0) {
          console.log(`✅ Successfully generated ${questions.length} questions on attempt ${attempt}`);
          return questions;
        } else {
          throw new Error('No valid questions parsed from response');
        }

      } catch (error) {
        console.warn(`⚠️ GroqCloud attempt ${attempt} failed:`, error.message);
        lastError = error;
        
        // Wait before retry (except on last attempt)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // All attempts failed, throw the last error
    console.error('❌ All GroqCloud attempts failed:', lastError);
    throw lastError;
  }

  buildQuestionPrompt(subject, chapter, count, difficulty) {
    const difficultyInstructions = {
      easy: 'Create basic conceptual questions suitable for beginners',
      medium: 'Create moderate difficulty questions with some calculations',
      hard: 'Create challenging questions with complex problem-solving and trap options'
    };

    return `Generate ${count} high-quality CUET 2026 multiple choice questions for:

Subject: ${subject}
Chapter: ${chapter}
Difficulty: ${difficulty}
Instructions: ${difficultyInstructions[difficulty]}

CRITICAL: Respond with ONLY a valid JSON array. No additional text, explanations, or formatting.

Requirements:
1. Each question must have exactly 4 options (A, B, C, D)
2. Include smart trap options based on common student errors
3. Provide detailed explanations with step-by-step solutions
4. Questions should match CUET 2026 exam pattern and difficulty
5. Include relevant formulas, concepts, and calculations where applicable

JSON Format (respond with ONLY this JSON, no other text):
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation with step-by-step solution",
    "concept": "Main concept being tested",
    "difficulty": "${difficulty}",
    "trapAnalysis": {
      "correctConcept": "Brief description of the correct concept",
      "commonTraps": ["Trap 1 description", "Trap 2 description", "Trap 3 description"]
    }
  }
]

Generate exactly ${count} questions in this format. Ensure valid JSON syntax with proper quotes and commas.`;
  }

  parseQuestions(content, subject, chapter) {
    try {
      // Clean the content first
      let cleanContent = content.trim();
      
      // Remove any markdown code blocks
      cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to extract JSON from the response more robustly
      const jsonMatches = cleanContent.match(/\[[\s\S]*?\]/g);
      
      if (!jsonMatches || jsonMatches.length === 0) {
        console.warn('No JSON array found in response');
        throw new Error('No valid JSON found in response');
      }

      // Try each JSON match until we find a valid one
      let questions = null;
      for (const jsonMatch of jsonMatches) {
        try {
          // Aggressive JSON cleaning pipeline
          let cleanJson = jsonMatch
            // Remove trailing commas
            .replace(/,(\s*[}\]])/g, '$1')
            // Normalize whitespace
            .replace(/\n/g, ' ')
            .replace(/\r/g, '')
            .replace(/\t/g, ' ')
            .replace(/\s+/g, ' ')
            // Fix unquoted keys
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            // Fix single quotes to double quotes
            .replace(/'/g, '"')
            // Remove any trailing commas more aggressively
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            // Fix escaped quotes in strings
            .replace(/\\"/g, '\\"')
            // Remove any non-printable characters
            .replace(/[\x00-\x1F\x7F]/g, ' ')
            .trim();

          // Additional cleaning for common AI response issues
          cleanJson = cleanJson
            // Remove any text before the first [
            .replace(/^[^[]*/, '')
            // Remove any text after the last ]
            .replace(/[^\]]*$/, '')
            // Ensure proper JSON structure
            .replace(/}\s*{/g, '},{');

          questions = JSON.parse(cleanJson);
          
          if (Array.isArray(questions) && questions.length > 0) {
            console.log(`✅ Successfully parsed ${questions.length} questions from JSON`);
            break;
          }
        } catch (parseError) {
          console.warn(`Failed to parse JSON attempt:`, parseError.message);
          continue;
        }
      }

      if (!questions) {
        // Try one more time with a different approach - extract individual question objects
        const questionObjects = cleanContent.match(/\{[^{}]*"question"[^{}]*\}/g);
        if (questionObjects && questionObjects.length > 0) {
          questions = [];
          for (const objStr of questionObjects) {
            try {
              const cleanObj = objStr
                .replace(/,(\s*})/g, '$1')
                .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
                .replace(/'/g, '"');
              const obj = JSON.parse(cleanObj);
              if (obj.question) {
                questions.push(obj);
              }
            } catch (e) {
              continue;
            }
          }
        }
      }

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        throw new Error('All JSON parsing attempts failed');
      }

      // Validate and enhance questions
      return questions.map((q, index) => {
        // Ensure all required fields exist with defaults
        const question = {
          id: q.id || `groq-${subject}-${chapter}-${Date.now()}-${index}`,
          question: this.cleanText(q.question) || `Generated question ${index + 1}`,
          options: this.validateOptions(q.options),
          correct: this.validateCorrectAnswer(q.correct),
          explanation: this.cleanText(q.explanation) || 'Explanation not provided',
          concept: this.cleanText(q.concept) || chapter,
          difficulty: this.validateDifficulty(q.difficulty),
          trapAnalysis: this.validateTrapAnalysis(q.trapAnalysis),
          source: 'groq',
          model: this.model,
          subject: subject,
          chapter: chapter,
          generatedAt: new Date().toISOString(),
          type: 'mcq'
        };

        return question;
      });

    } catch (error) {
      console.error('❌ Error parsing GroqCloud response:', error);
      console.log('Raw content preview:', content.substring(0, 500) + '...');
      
      // Return fallback questions if parsing fails
      return this.generateFallbackQuestions(subject, chapter, 5);
    }
  }

  // Helper method to clean text content
  cleanText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Helper method to validate options array
  validateOptions(options) {
    if (!Array.isArray(options) || options.length !== 4) {
      return ['Option A', 'Option B', 'Option C', 'Option D'];
    }
    return options.map(opt => this.cleanText(opt) || 'Option');
  }

  // Helper method to validate correct answer
  validateCorrectAnswer(correct) {
    const num = parseInt(correct);
    return (num >= 0 && num <= 3) ? num : 0;
  }

  // Helper method to validate difficulty
  validateDifficulty(difficulty) {
    const validDifficulties = ['easy', 'medium', 'hard'];
    return validDifficulties.includes(difficulty) ? difficulty : 'medium';
  }

  // Helper method to validate trap analysis
  validateTrapAnalysis(trapAnalysis) {
    if (!trapAnalysis || typeof trapAnalysis !== 'object') {
      return {
        correctConcept: 'Concept analysis not provided',
        commonTraps: ['Analysis not available']
      };
    }
    return {
      correctConcept: this.cleanText(trapAnalysis.correctConcept) || 'Concept analysis not provided',
      commonTraps: Array.isArray(trapAnalysis.commonTraps) 
        ? trapAnalysis.commonTraps.map(trap => this.cleanText(trap)).filter(Boolean)
        : ['Analysis not available']
    };
  }

  generateFallbackQuestions(subject, chapter, count) {
    console.log('🔄 Generating fallback questions for GroqCloud failure');
    
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `groq-fallback-${subject}-${chapter}-${Date.now()}-${i}`,
        question: `${subject} question ${i + 1} for ${chapter}. This is a fallback question generated when GroqCloud API is unavailable.`,
        options: [
          `Correct answer for question ${i + 1}`,
          `Incorrect option A for question ${i + 1}`,
          `Incorrect option B for question ${i + 1}`,
          `Incorrect option C for question ${i + 1}`
        ],
        correct: 0,
        explanation: `This is a fallback explanation for ${subject} ${chapter} question ${i + 1}. In production, this would be replaced with AI-generated content from GroqCloud.`,
        concept: chapter,
        difficulty: 'medium',
        trapAnalysis: {
          correctConcept: `Basic concept from ${chapter}`,
          commonTraps: ['Fallback trap analysis', 'API unavailable', 'Using local generation']
        },
        source: 'groq-fallback',
        model: 'fallback',
        subject: subject,
        chapter: chapter,
        generatedAt: new Date().toISOString(),
        type: 'mcq'
      });
    }
    
    return questions;
  }

  // Generate advanced question types
  async generateAssertionReasoning(subject, topic, count = 3) {
    if (!this.isAvailable) {
      throw new Error('GroqCloud API not available');
    }

    const prompt = `Generate ${count} Assertion-Reasoning questions for ${subject} - ${topic}.

Format as JSON array:
[
  {
    "assertion": "Statement A",
    "reason": "Statement R", 
    "relationship": "both_true_correct|both_true_incorrect|assertion_true_reason_false|assertion_false_reason_true",
    "explanation": "Detailed explanation of the relationship"
  }
]

Requirements:
- Test logical reasoning and concept understanding
- Include tricky relationships between assertion and reason
- Provide clear explanations for the correct relationship`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are an expert in creating Assertion-Reasoning questions for competitive exams.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      
      throw new Error('Failed to generate A-R questions');
    } catch (error) {
      console.error('❌ GroqCloud A-R Generation Error:', error);
      throw error;
    }
  }

  // Generate match the column questions
  async generateMatchColumn(subject, topic, count = 2) {
    if (!this.isAvailable) {
      throw new Error('GroqCloud API not available');
    }

    const prompt = `Generate ${count} Match the Column questions for ${subject} - ${topic}.

Format as JSON array:
[
  {
    "title": "Match the following",
    "columnA": ["Item 1", "Item 2", "Item 3", "Item 4"],
    "columnB": ["Match 1", "Match 2", "Match 3", "Match 4"],
    "correctMapping": "A-1, B-2, C-3, D-4",
    "explanation": "Explanation of correct matches"
  }
]

Requirements:
- Create meaningful associations between items
- Ensure all matches are logical and educational
- Provide clear explanations for correct mappings`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are an expert in creating Match the Column questions for competitive exams.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      
      throw new Error('Failed to generate Match Column questions');
    } catch (error) {
      console.error('❌ GroqCloud Match Column Generation Error:', error);
      throw error;
    }
  }

  // Test API connection
  async testConnection() {
    if (!this.isAvailable) {
      return {
        success: false,
        message: 'API key not configured',
        provider: 'groq'
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'user', content: 'Hello, this is a test message. Please respond with "GroqCloud API is working!"' }
          ],
          max_tokens: 50
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'GroqCloud API connected successfully',
          provider: 'groq',
          model: this.model,
          response: data.choices[0]?.message?.content || 'Test successful'
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`,
          provider: 'groq'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        provider: 'groq'
      };
    }
  }

  // Get available models
  getAvailableModels() {
    return [
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        description: 'Fast and efficient for most tasks',
        contextLength: 131072,
        speed: '560 T/sec'
      },
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B Versatile',
        description: 'More capable, excellent reasoning',
        contextLength: 131072,
        speed: '280 T/sec'
      },
      {
        id: 'openai/gpt-oss-120b',
        name: 'GPT OSS 120B',
        description: 'OpenAI open model, strong capabilities',
        contextLength: 131072,
        speed: '500 T/sec'
      },
      {
        id: 'openai/gpt-oss-20b',
        name: 'GPT OSS 20B',
        description: 'Faster OpenAI open model',
        contextLength: 131072,
        speed: '1000 T/sec'
      },
      {
        id: 'meta-llama/llama-4-scout-17b-16e-instruct',
        name: 'Llama 4 Scout 17B',
        description: 'Latest Llama 4 preview model',
        contextLength: 131072,
        speed: '750 T/sec'
      }
    ];
  }
}

// Export singleton instance
export const groqService = new GroqService();
export default GroqService;