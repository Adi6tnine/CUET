// English Question Generators - PRO LEVEL with DYNAMIC GRAMMAR ENGINE
// Exam-grade questions with infinite grammar variations and smart traps

export const englishGenerators = {
  "Grammar": [
    {
      name: "dynamicTenseEngine",
      concept: "Tense Correction",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        // Dynamic Grammar Engine - Template System
        const subjects = ["He", "She", "They", "The students", "My friend", "The teacher"];
        const baseVerbs = ["go", "write", "study", "complete", "finish", "start"];
        const timeIndicators = [
          { time: "yesterday", tense: "past", helper: "" },
          { time: "tomorrow", tense: "future", helper: "will" },
          { time: "now", tense: "present", helper: "is/are" },
          { time: "every day", tense: "present", helper: "" },
          { time: "next week", tense: "future", helper: "will" },
          { time: "last month", tense: "past", helper: "" }
        ];
        const objects = ["to school", "a letter", "for exams", "the project", "the work", "the assignment"];
        
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const verb = baseVerbs[Math.floor(Math.random() * baseVerbs.length)];
        const timeIndicator = timeIndicators[Math.floor(Math.random() * timeIndicators.length)];
        const object = objects[Math.floor(Math.random() * objects.length)];
        
        // Generate correct verb form based on tense and subject
        let correctVerb;
        switch(timeIndicator.tense) {
          case "past":
            correctVerb = verb + "ed"; // Simple past (works for regular verbs)
            if (verb === "go") correctVerb = "went";
            if (verb === "write") correctVerb = "wrote";
            break;
          case "future":
            correctVerb = "will " + verb;
            break;
          case "present":
            if (timeIndicator.time === "now") {
              correctVerb = (subject === "He" || subject === "She") ? "is " + verb + "ing" : "are " + verb + "ing";
            } else {
              correctVerb = (subject === "He" || subject === "She") ? verb + "s" : verb;
            }
            break;
        }
        
        // TRAP ENGINE - Common Tense Errors
        const trapOptions = [
          verb,                                    // Trap B: Base form (no tense applied)
          verb + "ing",                           // Trap C: Always use -ing form
          (subject === "He" || subject === "She") ? verb + "s" : verb + "ed" // Trap D: Wrong tense choice
        ];
        
        const sentence = `${subject} _____ ${object} ${timeIndicator.time}.`;
        const options = [correctVerb, ...trapOptions];
        
        return {
          question: `Choose the correct verb form to complete the sentence:\n"${sentence}"`,
          options,
          correct: 0,
          explanation: `Time indicator "${timeIndicator.time}" requires ${timeIndicator.tense} tense.\nCorrect answer: ${correctVerb}\n\nTense Traps:\n- Option B: Base form ignores time indicator\n- Option C: Incorrect -ing form usage\n- Option D: Wrong tense for the time indicator`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Verb tense must match time indicators in the sentence",
            commonTraps: ["Ignoring time indicators", "Overusing -ing forms", "Tense confusion"]
          }
        };
      }
    },

    {
      name: "prepositionEngine",
      concept: "Preposition Usage",
      difficulty: "hard",
      highWeightage: true,
      generate() {
        // Dynamic Preposition Templates
        const prepositionRules = [
          {
            context: "time",
            templates: [
              { phrase: "_____ Monday", correct: "on", traps: ["in", "at", "by"] },
              { phrase: "_____ 3 o'clock", correct: "at", traps: ["on", "in", "by"] },
              { phrase: "_____ the morning", correct: "in", traps: ["on", "at", "by"] },
              { phrase: "_____ night", correct: "at", traps: ["in", "on", "by"] }
            ]
          },
          {
            context: "place",
            templates: [
              { phrase: "_____ the table", correct: "on", traps: ["in", "at", "under"] },
              { phrase: "_____ the box", correct: "in", traps: ["on", "at", "under"] },
              { phrase: "_____ home", correct: "at", traps: ["in", "on", "to"] },
              { phrase: "_____ school", correct: "at", traps: ["in", "on", "to"] }
            ]
          },
          {
            context: "movement",
            templates: [
              { phrase: "go _____ the market", correct: "to", traps: ["in", "at", "on"] },
              { phrase: "come _____ here", correct: "to", traps: ["in", "at", "on"] },
              { phrase: "walk _____ the park", correct: "through", traps: ["in", "at", "on"] }
            ]
          }
        ];
        
        const selectedContext = prepositionRules[Math.floor(Math.random() * prepositionRules.length)];
        const selectedTemplate = selectedContext.templates[Math.floor(Math.random() * selectedContext.templates.length)];
        
        const options = [selectedTemplate.correct, ...selectedTemplate.traps];
        
        return {
          question: `Choose the correct preposition:\n"${selectedTemplate.phrase}"`,
          options,
          correct: 0,
          explanation: `For ${selectedContext.context} context: "${selectedTemplate.phrase.replace('_____', selectedTemplate.correct)}"\nCorrect preposition: ${selectedTemplate.correct}\n\nPreposition rules vary by context (time/place/movement)`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: `Prepositions follow specific rules for ${selectedContext.context}`,
            commonTraps: ["Context confusion", "Literal translation errors", "Memorization gaps"]
          }
        };
      }
    },

    {
      name: "articleEngine",
      concept: "Article Usage",
      difficulty: "hard",
      trend2026: true,
      generate() {
        // Dynamic Article Templates
        const articleRules = [
          {
            type: "definite",
            examples: [
              { phrase: "_____ sun rises in the east", correct: "The", context: "unique objects" },
              { phrase: "_____ book you gave me", correct: "The", context: "specific reference" },
              { phrase: "_____ President of India", correct: "The", context: "titles with 'of'" }
            ]
          },
          {
            type: "indefinite",
            examples: [
              { phrase: "_____ apple a day", correct: "An", context: "vowel sound" },
              { phrase: "_____ university student", correct: "A", context: "consonant sound (yu-)" },
              { phrase: "_____ honest person", correct: "An", context: "silent h" }
            ]
          },
          {
            type: "zero",
            examples: [
              { phrase: "_____ water is essential", correct: "No article", context: "uncountable nouns" },
              { phrase: "_____ students are studying", correct: "No article", context: "general plural" },
              { phrase: "_____ Mount Everest", correct: "No article", context: "proper nouns" }
            ]
          }
        ];
        
        const selectedType = articleRules[Math.floor(Math.random() * articleRules.length)];
        const selectedExample = selectedType.examples[Math.floor(Math.random() * selectedType.examples.length)];
        
        // Generate trap options based on article type
        let trapOptions;
        if (selectedExample.correct === "The") {
          trapOptions = ["A", "An", "No article"];
        } else if (selectedExample.correct === "A") {
          trapOptions = ["An", "The", "No article"];
        } else if (selectedExample.correct === "An") {
          trapOptions = ["A", "The", "No article"];
        } else {
          trapOptions = ["A", "An", "The"];
        }
        
        const options = [selectedExample.correct, ...trapOptions];
        
        return {
          question: `Choose the correct article:\n"${selectedExample.phrase}"`,
          options,
          correct: 0,
          explanation: `Rule: ${selectedExample.context}\nCorrect: "${selectedExample.phrase.replace('_____', selectedExample.correct)}"\n\nArticle usage depends on:\n- Definiteness (specific vs general)\n- Sound (vowel vs consonant)\n- Countability (countable vs uncountable)`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: selectedExample.context,
            commonTraps: ["Sound-based confusion", "Definiteness errors", "Countability mistakes"]
          }
        };
      }
    },

    {
      name: "subjectVerbAgreement",
      concept: "Subject-Verb Agreement",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        // Dynamic Subject-Verb Agreement Engine
        const agreementRules = [
          {
            subject: "Each of the students",
            correctVerb: "has",
            trapVerbs: ["have", "are having", "were having"],
            rule: "Each/Every + singular verb"
          },
          {
            subject: "Neither John nor his friends",
            correctVerb: "are",
            trapVerbs: ["is", "was", "were"],
            rule: "Neither...nor - verb agrees with nearest subject"
          },
          {
            subject: "The team",
            correctVerb: "is",
            trapVerbs: ["are", "were", "have"],
            rule: "Collective nouns are usually singular"
          },
          {
            subject: "Mathematics",
            correctVerb: "is",
            trapVerbs: ["are", "were", "have"],
            rule: "Subject names ending in -s can be singular"
          },
          {
            subject: "One of my friends",
            correctVerb: "is",
            trapVerbs: ["are", "were", "have"],
            rule: "One of + plural noun + singular verb"
          }
        ];
        
        const selected = agreementRules[Math.floor(Math.random() * agreementRules.length)];
        const complement = "coming to the party.";
        
        const options = [selected.correctVerb, ...selected.trapVerbs];
        
        return {
          question: `Choose the correct verb form:\n"${selected.subject} _____ ${complement}"`,
          options,
          correct: 0,
          explanation: `Rule: ${selected.rule}\nCorrect: "${selected.subject} ${selected.correctVerb} ${complement}"\n\nSubject-Verb Agreement Traps:\n- Proximity errors (verb agrees with nearest noun, not subject)\n- Collective noun confusion\n- Prepositional phrase interference`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: selected.rule,
            commonTraps: ["Proximity agreement", "Collective noun errors", "Prepositional interference"]
          }
        };
      }
    }
  ],

  "Reading Comprehension": [
    {
      name: "inferenceEngine",
      concept: "Reading Inference",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        // Dynamic Passage Generator with Inference Questions
        const passageTemplates = [
          {
            passage: "The ancient library stood silent, its towering shelves casting long shadows in the dim light. Dust particles danced in the few rays of sunlight that managed to penetrate the heavy curtains. The librarian, an elderly woman with silver hair, moved quietly between the aisles, her footsteps muffled by the thick carpet.",
            question: "What can be inferred about the library's current state?",
            correct: "It is rarely visited and somewhat neglected",
            traps: [
              "It is a modern, well-maintained facility",
              "It is always crowded with visitors",
              "It has recently been renovated"
            ],
            inference: "Clues: 'silent', 'dust particles', 'dim light', 'heavy curtains' suggest neglect"
          },
          {
            passage: "Maria checked her watch for the third time in five minutes. The interview was scheduled to start ten minutes ago, but there was still no sign of the interviewer. She adjusted her blazer and reviewed her notes once more, trying to calm her nerves.",
            question: "How is Maria most likely feeling?",
            correct: "Anxious and concerned about the delay",
            traps: [
              "Confident and relaxed",
              "Angry and frustrated",
              "Indifferent about the outcome"
            ],
            inference: "Clues: checking watch repeatedly, adjusting clothes, reviewing notes show nervousness"
          }
        ];
        
        const selected = passageTemplates[Math.floor(Math.random() * passageTemplates.length)];
        const options = [selected.correct, ...selected.traps];
        
        return {
          question: `Read the passage and answer the question:\n\n"${selected.passage}"\n\n${selected.question}`,
          options,
          correct: 0,
          explanation: `Inference: ${selected.correct}\n\nReasoning: ${selected.inference}\n\nReading Comprehension Traps:\n- Literal interpretation without inference\n- Extreme conclusions not supported by text\n- Ignoring contextual clues`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Making logical inferences from textual evidence",
            commonTraps: ["Literal reading", "Unsupported conclusions", "Missing context clues"]
          }
        };
      }
    }
  ],

  "Vocabulary": [
    {
      name: "contextualVocabulary",
      concept: "Vocabulary in Context",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        // Dynamic Vocabulary Engine with Context
        const vocabularyItems = [
          {
            word: "ubiquitous",
            context: "Smartphones have become _____ in modern society, found in nearly every pocket and purse.",
            meaning: "present everywhere",
            traps: ["expensive", "complicated", "unnecessary"]
          },
          {
            word: "ephemeral",
            context: "The beauty of cherry blossoms is _____, lasting only a few weeks each spring.",
            meaning: "short-lived",
            traps: ["permanent", "colorful", "fragrant"]
          },
          {
            word: "meticulous",
            context: "The surgeon's _____ attention to detail ensured the operation's success.",
            meaning: "extremely careful",
            traps: ["quick", "expensive", "innovative"]
          },
          {
            word: "pragmatic",
            context: "Rather than pursuing idealistic goals, she took a _____ approach to solving the problem.",
            meaning: "practical",
            traps: ["theoretical", "emotional", "aggressive"]
          }
        ];
        
        const selected = vocabularyItems[Math.floor(Math.random() * vocabularyItems.length)];
        const options = [selected.meaning, ...selected.traps];
        
        return {
          question: `Choose the word that best fits the context:\n\n"${selected.context}"\n\nWhat does "${selected.word}" mean in this context?`,
          options,
          correct: 0,
          explanation: `"${selected.word}" means "${selected.meaning}"\n\nContext clues help determine meaning:\n- Look for surrounding words that give hints\n- Consider the overall tone and situation\n- Eliminate options that don't fit logically`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Using context to determine word meaning",
            commonTraps: ["Ignoring context", "Literal definitions", "Common word confusion"]
          }
        };
      }
    }
  ]
};

// Export individual generators for testing
export const generateGrammarQuestion = englishGenerators["Grammar"][0].generate;
export const generateVocabularyQuestion = englishGenerators["Vocabulary"][0].generate;