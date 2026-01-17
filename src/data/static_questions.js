// Static High-Quality Question Database
// For subjects that require memorization and theory-based questions

export const STATIC_QUESTIONS = {
  english: {
    "Reading Comprehension": [
      {
        question: "In the passage 'The rapid advancement of technology has transformed the way we communicate, work, and live. However, this digital revolution has also brought challenges such as privacy concerns and social isolation.' What is the main theme?",
        options: [
          "Technology has only positive impacts",
          "Digital revolution brings both benefits and challenges",
          "Privacy is not important in modern times",
          "Social isolation is caused by poor communication"
        ],
        correct: 1,
        explanation: "The passage clearly states that technology has transformed life positively but also brought challenges, indicating a balanced view of both benefits and drawbacks.",
        difficulty: "medium",
        trend: "2026_Probable",
        concept: "Main Idea Identification"
      },
      {
        question: "The word 'transformed' in the context of the passage most nearly means:",
        options: ["Destroyed", "Changed completely", "Improved slightly", "Complicated"],
        correct: 1,
        explanation: "'Transformed' means to change in form, appearance, or structure completely, which fits the context of how technology has changed our lives.",
        difficulty: "easy",
        concept: "Vocabulary in Context"
      },
      {
        question: "Based on the passage, which of the following can be inferred about the author's attitude toward technology?",
        options: [
          "Completely positive",
          "Entirely negative", 
          "Balanced and realistic",
          "Indifferent"
        ],
        correct: 2,
        explanation: "The author presents both positive aspects (transformation of life) and negative aspects (privacy concerns, social isolation), showing a balanced perspective.",
        difficulty: "hard",
        trend: "2026_Probable",
        concept: "Author's Tone and Attitude"
      },
      {
        question: "In academic writing, which transition word best shows contrast?",
        options: ["Furthermore", "However", "Therefore", "Similarly"],
        correct: 1,
        explanation: "'However' is a contrasting transition word that introduces an opposing or different idea from what was previously stated.",
        difficulty: "easy",
        trend: "2026_Probable",
        concept: "Transition Words"
      }
    ],

    "Vocabulary": [
      {
        question: "Choose the word that best completes the sentence: 'The scientist's _______ research led to groundbreaking discoveries.'",
        options: ["Meticulous", "Careless", "Hasty", "Superficial"],
        correct: 0,
        explanation: "'Meticulous' means showing great attention to detail, which would lead to quality research and discoveries.",
        difficulty: "medium",
        trend: "2026_Probable",
        concept: "Context Clues"
      },
      {
        question: "The antonym of 'abundant' is:",
        options: ["Plentiful", "Scarce", "Numerous", "Ample"],
        correct: 1,
        explanation: "'Scarce' means existing in small quantities; insufficient. It is the opposite of 'abundant' which means existing in large quantities.",
        difficulty: "easy",
        concept: "Antonyms"
      }
    ]
  },

  "general test": {
    "General Knowledge": [
      {
        question: "Who is known as the 'Father of the Indian Constitution'?",
        options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
        correct: 1,
        explanation: "Dr. B.R. Ambedkar is known as the 'Father of the Indian Constitution' for his pivotal role as the chairman of the drafting committee.",
        difficulty: "easy",
        trend: "2026_Probable",
        concept: "Indian Polity",
        isPYQ: true,
        year: "2023"
      },
      {
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        explanation: "Mars is called the 'Red Planet' due to iron oxide (rust) on its surface, giving it a reddish appearance.",
        difficulty: "easy",
        concept: "Astronomy"
      },
      {
        question: "The headquarters of the United Nations is located in:",
        options: ["Geneva", "New York", "Paris", "London"],
        correct: 1,
        explanation: "The UN headquarters is located in New York City, USA, established in 1945.",
        difficulty: "easy",
        trend: "2026_Probable",
        concept: "International Organizations"
      },
      {
        question: "Which Indian city is known as the 'Silicon Valley of India'?",
        options: ["Hyderabad", "Pune", "Bangalore", "Chennai"],
        correct: 2,
        explanation: "Bangalore (Bengaluru) is called the 'Silicon Valley of India' due to its prominence in the IT industry.",
        difficulty: "medium",
        concept: "Indian Cities"
      }
    ],

    "Current Affairs (National)": [
      {
        question: "The G20 Summit 2023 was held in which Indian city?",
        options: ["Mumbai", "New Delhi", "Bengaluru", "Hyderabad"],
        correct: 1,
        explanation: "The G20 Summit 2023 was held in New Delhi, India, with India holding the G20 presidency.",
        difficulty: "easy",
        concept: "Current Affairs",
        isPYQ: true,
        year: "2024"
      },
      {
        question: "Which mission successfully landed on the Moon's South Pole in 2023?",
        options: ["Chandrayaan-2", "Chandrayaan-3", "Mangalyaan", "Aditya-L1"],
        correct: 1,
        explanation: "Chandrayaan-3 successfully landed on the Moon's South Pole in August 2023, making India the fourth country to land on the Moon.",
        difficulty: "medium",
        concept: "Space Technology",
        trend: "2026_Probable"
      },
      {
        question: "Which Indian state recently became the first to implement the Uniform Civil Code?",
        options: ["Uttar Pradesh", "Gujarat", "Uttarakhand", "Himachal Pradesh"],
        correct: 2,
        explanation: "Uttarakhand became the first state in India to implement the Uniform Civil Code in 2024.",
        difficulty: "medium",
        concept: "Current Affairs",
        trend: "2026_Probable",
        isPYQ: true,
        year: "2024"
      }
    ],

    "Logical and Analytical Reasoning": [
      {
        question: "If all roses are flowers and some flowers are red, which conclusion is definitely true?",
        options: [
          "All roses are red",
          "Some roses are red", 
          "No roses are red",
          "Some roses may be red"
        ],
        correct: 3,
        explanation: "From the given statements, we cannot definitively conclude that roses are red or not red. Some roses may be red is the only logical conclusion.",
        difficulty: "medium",
        concept: "Logical Reasoning"
      },
      {
        question: "In a certain code, DELHI is written as CCIDD. How will MUMBAI be written?",
        options: ["LTLAZH", "MVNAZH", "LTLAAH", "MVLAAH"],
        correct: 0,
        explanation: "Each letter is replaced by the letter that comes one position before it in the alphabet. M→L, U→T, M→L, B→A, A→Z, I→H.",
        difficulty: "hard",
        concept: "Coding-Decoding"
      },
      {
        question: "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "46"],
        correct: 1,
        explanation: "The differences are 4, 6, 8, 10, so the next difference should be 12. 30 + 12 = 42.",
        difficulty: "medium",
        concept: "Number Series"
      }
    ],

    "Numerical Ability": [
      {
        question: "If 25% of a number is 75, what is 40% of the same number?",
        options: ["100", "120", "150", "180"],
        correct: 1,
        explanation: "If 25% = 75, then 100% = 300. Therefore, 40% of 300 = 120.",
        difficulty: "medium",
        concept: "Percentage"
      },
      {
        question: "The average of 5 numbers is 27. If one number is excluded, the average becomes 25. The excluded number is:",
        options: ["35", "37", "39", "41"],
        correct: 0,
        explanation: "Sum of 5 numbers = 27 × 5 = 135. Sum of 4 numbers = 25 × 4 = 100. Excluded number = 135 - 100 = 35.",
        difficulty: "hard",
        concept: "Average"
      },
      {
        question: "A train travels 240 km in 4 hours. What is its speed in m/s?",
        options: ["60 m/s", "16.67 m/s", "20 m/s", "15 m/s"],
        correct: 1,
        explanation: "Speed = 240 km / 4 hours = 60 km/h. Converting to m/s: 60 × (1000/3600) = 16.67 m/s.",
        difficulty: "medium",
        concept: "Speed and Distance"
      }
    ]
  },

  physics: {
    "Motion in a Straight Line": [
      {
        question: "A car accelerates from rest at 2 m/s² for 10 seconds. What is the distance covered?",
        options: ["20 m", "100 m", "200 m", "400 m"],
        correct: 1,
        explanation: "Using s = ut + ½at², where u = 0, a = 2 m/s², t = 10 s. s = 0 + ½(2)(10)² = 100 m.",
        difficulty: "medium",
        concept: "Kinematics",
        isPYQ: true,
        year: "2023"
      },
      {
        question: "The velocity-time graph of a uniformly accelerated motion is:",
        options: ["A straight line parallel to time axis", "A straight line with positive slope", "A parabola", "A hyperbola"],
        correct: 1,
        explanation: "For uniformly accelerated motion, velocity increases linearly with time, giving a straight line with positive slope.",
        difficulty: "easy",
        concept: "Graphs of Motion"
      }
    ],

    "Current Electricity": [
      {
        question: "The resistance of a wire is 10 Ω. If it is stretched to double its length, the new resistance will be:",
        options: ["5 Ω", "10 Ω", "20 Ω", "40 Ω"],
        correct: 3,
        explanation: "When length doubles, area becomes half. R = ρl/A, so new resistance = ρ(2l)/(A/2) = 4ρl/A = 4R = 40 Ω.",
        difficulty: "hard",
        concept: "Resistance",
        isPYQ: true,
        year: "2024"
      }
    ]
  },

  chemistry: {
    "Chemical Bonding": [
      {
        question: "Which of the following has the highest ionic character?",
        options: ["NaCl", "MgO", "AlF₃", "CaO"],
        correct: 1,
        explanation: "MgO has the highest ionic character due to the large difference in electronegativity between Mg²⁺ and O²⁻ ions.",
        difficulty: "medium",
        concept: "Ionic Character",
        isPYQ: true,
        year: "2023"
      }
    ]
  },

  mathematics: {
    "Limits and Derivatives": [
      {
        question: "The derivative of sin(x) with respect to x is:",
        options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
        correct: 0,
        explanation: "The derivative of sin(x) is cos(x). This is a fundamental derivative formula.",
        difficulty: "easy",
        concept: "Basic Derivatives",
        isPYQ: true,
        year: "2023"
      }
    ]
  }
};

// Helper function to get random questions from a chapter
export function getRandomQuestions(subject, chapter, count = 30) {
  const questions = STATIC_QUESTIONS[subject]?.[chapter] || [];
  if (questions.length === 0) return [];
  
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
}

// Helper function to get high-priority questions for prediction mode
export function getPredictionModeQuestions(subject, chapter, count = 30) {
  const questions = STATIC_QUESTIONS[subject]?.[chapter] || [];
  const highPriority = questions.filter(q => q.trend === '2026_Probable' || q.difficulty === 'Hard');
  
  if (highPriority.length >= count) {
    return highPriority.slice(0, count);
  }
  
  // If not enough high-priority questions, mix with regular questions
  const remaining = questions.filter(q => !highPriority.includes(q));
  const mixed = [...highPriority, ...remaining.slice(0, count - highPriority.length)];
  
  return mixed.sort(() => Math.random() - 0.5);
}