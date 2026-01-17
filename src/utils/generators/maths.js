// Mathematics Question Generators - PRO LEVEL with TRAP ENGINE
// Exam-grade questions with smart traps based on common student errors

export const mathsGenerators = {
  "Calculus": [
    {
      name: "derivativeTraps",
      concept: "Differentiation",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const coefficient = Math.floor(Math.random() * 8) + 2; // 2-9
        const power = Math.floor(Math.random() * 5) + 2; // 2-6
        
        // d/dx(ax^n) = n*a*x^(n-1)
        const correctCoeff = coefficient * power;
        const correctPower = power - 1;
        
        // TRAP ENGINE - Differentiation Errors
        const trapOptions = [
          `${coefficient}x^${power}`,                    // Trap B: Didn't differentiate at all
          `${correctCoeff}x^${power}`,                  // Trap C: Multiplied by power but kept same power
          `${coefficient}x^${correctPower}`             // Trap D: Reduced power but forgot to multiply by original power
        ];
        
        const correctOption = correctPower === 1 ? `${correctCoeff}x` : 
                             correctPower === 0 ? `${correctCoeff}` : 
                             `${correctCoeff}x^${correctPower}`;
        
        const options = [correctOption, ...trapOptions];
        
        return {
          question: `Find the derivative of f(x) = ${coefficient}x^${power}`,
          options,
          correct: 0,
          explanation: `Using power rule: d/dx(ax^n) = n⋅a⋅x^(n-1)\nf'(x) = ${power} × ${coefficient} × x^${power-1} = ${correctOption}\n\nCommon Differentiation Traps:\n- Option B: Forgot to differentiate\n- Option C: Applied coefficient but kept same power\n- Option D: Reduced power but forgot multiplication`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Power rule requires both coefficient multiplication and power reduction",
            commonTraps: ["Forgetting to differentiate", "Partial application of power rule", "Power reduction without coefficient"]
          }
        };
      }
    },

    {
      name: "integrationTraps",
      concept: "Integration",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const coefficient = Math.floor(Math.random() * 6) + 2; // 2-7
        const power = Math.floor(Math.random() * 4) + 1; // 1-4
        
        // ∫ax^n dx = (a/(n+1))x^(n+1) + C
        const newPower = power + 1;
        const newCoeff = coefficient / newPower;
        
        // TRAP ENGINE - Integration Errors
        const trapOptions = [
          `${coefficient}x^${power} + C`,               // Trap B: Didn't integrate at all
          `${coefficient * power}x^${newPower} + C`,   // Trap C: Multiplied by old power instead of dividing by new
          `${coefficient}x^${newPower}`                // Trap D: Forgot constant of integration
        ];
        
        const correctOption = newCoeff % 1 === 0 ? 
          `${newCoeff}x^${newPower} + C` : 
          `(${coefficient}/${newPower})x^${newPower} + C`;
        
        const options = [correctOption, ...trapOptions];
        
        return {
          question: `Evaluate ∫${coefficient}x^${power} dx`,
          options,
          correct: 0,
          explanation: `Using power rule: ∫ax^n dx = (a/(n+1))x^(n+1) + C\n∫${coefficient}x^${power} dx = ${correctOption}\n\nIntegration Traps:\n- Option B: Forgot to integrate\n- Option C: Multiplied by old power instead of dividing by new power\n- Option D: Missing constant of integration`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Integration increases power by 1 and divides coefficient by new power",
            commonTraps: ["Not integrating", "Wrong coefficient manipulation", "Missing integration constant"]
          }
        };
      }
    },

    {
      name: "limitTraps",
      concept: "Limits",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const numeratorCoeff = Math.floor(Math.random() * 6) + 2; // 2-7
        const approaches = Math.floor(Math.random() * 4) + 2; // 2-5
        
        // lim(x→a) (x² - a²)/(x - a) = lim(x→a) (x + a) = 2a
        const correctLimit = 2 * approaches;
        
        // TRAP ENGINE - Limit Evaluation Errors
        const trapOptions = [
          0,                                           // Trap B: Direct substitution gives 0/0, student thinks answer is 0
          approaches * approaches - approaches * approaches, // Trap C: Thinks 0/0 = 0
          approaches                                   // Trap D: Cancels incorrectly to get just 'a'
        ];
        
        const options = [correctLimit, ...trapOptions];
        
        return {
          question: `Evaluate lim(x→${approaches}) (x² - ${approaches * approaches})/(x - ${approaches})`,
          options,
          correct: 0,
          explanation: `This is an indeterminate form 0/0. Factor the numerator:\nx² - ${approaches * approaches} = (x - ${approaches})(x + ${approaches})\nSo the limit becomes: lim(x→${approaches}) (x + ${approaches}) = ${approaches} + ${approaches} = ${correctLimit}\n\nLimit Traps:\n- Option B: Thought 0/0 = 0\n- Option C: Direct substitution without factoring\n- Option D: Incorrect cancellation`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Indeterminate forms require algebraic manipulation before substitution",
            commonTraps: ["0/0 equals 0", "Direct substitution", "Incorrect factoring"]
          }
        };
      }
    },

    {
      name: "maxMinTraps",
      concept: "Maxima and Minima",
      difficulty: "hard",
      highWeightage: true,
      generate() {
        const a = Math.floor(Math.random() * 3) + 1; // 1-3
        const b = Math.floor(Math.random() * 8) + 4; // 4-11
        
        // f(x) = -ax² + bx, f'(x) = -2ax + b
        // Critical point: x = b/(2a)
        const criticalPoint = b / (2 * a);
        
        // TRAP ENGINE - Calculus Application Errors
        const trapOptions = [
          b / a,                                       // Trap B: Used f'(x) = -ax + b (forgot factor of 2)
          -b / (2 * a),                              // Trap C: Wrong sign (forgot negative in front of ax²)
          b                                          // Trap D: Set f(x) = 0 instead of f'(x) = 0
        ];
        
        const options = [
          `x = ${criticalPoint.toFixed(1)}`,
          `x = ${trapOptions[0].toFixed(1)}`,
          `x = ${trapOptions[1].toFixed(1)}`,
          `x = ${trapOptions[2]}`
        ];
        
        return {
          question: `Find the critical point of f(x) = -${a}x² + ${b}x`,
          options,
          correct: 0,
          explanation: `f'(x) = -${2*a}x + ${b}\nSetting f'(x) = 0: -${2*a}x + ${b} = 0\nx = ${b}/${2*a} = ${criticalPoint.toFixed(1)}\n\nMaxima/Minima Traps:\n- Option B: Forgot factor of 2 in derivative\n- Option C: Sign error in calculation\n- Option D: Set f(x) = 0 instead of f'(x) = 0`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Critical points found by setting first derivative equal to zero",
            commonTraps: ["Derivative calculation errors", "Sign mistakes", "Setting function to zero instead of derivative"]
          }
        };
      }
    },

    {
      name: "definiteIntegralTraps",
      concept: "Definite Integration",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const coefficient = Math.floor(Math.random() * 4) + 1; // 1-4
        const upperLimit = Math.floor(Math.random() * 4) + 2; // 2-5
        
        // ∫₀ᵇ cx dx = c[x²/2]₀ᵇ = cb²/2
        const correctArea = (coefficient * upperLimit * upperLimit) / 2;
        
        // TRAP ENGINE - Definite Integration Errors
        const trapOptions = [
          coefficient * upperLimit * upperLimit,      // Trap B: Forgot to divide by 2
          coefficient * upperLimit,                   // Trap C: Used ∫cx dx = cx (forgot x²/2)
          (coefficient * upperLimit * upperLimit) / 2 - 0 // Trap D: Subtracted lower limit incorrectly
        ];
        
        const options = [
          `${correctArea} sq units`,
          `${trapOptions[0]} sq units`,
          `${trapOptions[1]} sq units`,
          `${trapOptions[2]} sq units`
        ];
        
        return {
          question: `Find the area under the curve y = ${coefficient}x from x = 0 to x = ${upperLimit}`,
          options,
          correct: 0,
          explanation: `Area = ∫₀^${upperLimit} ${coefficient}x dx = ${coefficient}[x²/2]₀^${upperLimit}\n= ${coefficient} × (${upperLimit}²/2 - 0²/2) = ${coefficient} × ${upperLimit * upperLimit}/2 = ${correctArea} sq units\n\nDefinite Integration Traps:\n- Option B: Forgot division by 2 in antiderivative\n- Option C: Wrong antiderivative of x\n- Option D: Incorrect handling of limits`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Definite integration requires correct antiderivative and limit evaluation",
            commonTraps: ["Antiderivative errors", "Limit evaluation mistakes", "Fundamental theorem confusion"]
          }
        };
      }
    },

    {
      name: "calculusAR",
      concept: "Calculus Concepts",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const assertions = [
          {
            assertion: "If f'(c) = 0, then f(x) has a local extremum at x = c",
            reason: "Critical points always correspond to maxima or minima",
            correct: "assertion_true_reason_false",
            explanation: "Assertion is true but reason is false - critical points can also be inflection points"
          },
          {
            assertion: "The derivative of a continuous function is always continuous",
            reason: "Continuity is preserved under differentiation",
            correct: "assertion_false",
            explanation: "Assertion is false - derivatives can have jump discontinuities"
          },
          {
            assertion: "∫f'(x)dx = f(x) + C",
            reason: "Integration and differentiation are inverse operations",
            correct: "both_true_correct",
            explanation: "Both statements are true and reason correctly explains assertion"
          }
        ];
        
        const selected = assertions[Math.floor(Math.random() * assertions.length)];
        
        let correctAnswer;
        switch(selected.correct) {
          case "both_true_correct": correctAnswer = 0; break;
          case "both_true_incorrect": correctAnswer = 1; break;
          case "assertion_true_reason_false": correctAnswer = 2; break;
          case "assertion_false": correctAnswer = 3; break;
        }
        
        const options = [
          "Both Assertion and Reason are true, and Reason is correct explanation of Assertion",
          "Both Assertion and Reason are true, but Reason is not correct explanation of Assertion",
          "Assertion is true but Reason is false",
          "Assertion is false but Reason is true"
        ];
        
        return {
          question: `**Assertion (A):** ${selected.assertion}\n**Reason (R):** ${selected.reason}`,
          options,
          correct: correctAnswer,
          explanation: selected.explanation,
          type: "assertion-reasoning",
          trapAnalysis: {
            correctConcept: "Understanding subtle calculus concepts and their relationships",
            commonTraps: ["Assuming all critical points are extrema", "Confusing continuity properties", "Misunderstanding inverse operations"]
          }
        };
      }
    }
  ],

  "Vectors": [
    {
      name: "vectorAdditionTraps",
      concept: "Vector Addition",
      difficulty: "hard",
      highWeightage: true,
      generate() {
        const a1 = Math.floor(Math.random() * 6) + 1; // 1-6
        const a2 = Math.floor(Math.random() * 6) + 1; // 1-6
        const b1 = Math.floor(Math.random() * 6) + 1; // 1-6
        const b2 = Math.floor(Math.random() * 6) + 1; // 1-6
        
        // Vector addition: (a1, a2) + (b1, b2) = (a1+b1, a2+b2)
        const resultX = a1 + b1;
        const resultY = a2 + b2;
        
        // TRAP ENGINE - Vector Operation Errors
        const trapOptions = [
          `(${a1 * b1}, ${a2 * b2})`,                 // Trap B: Component-wise multiplication
          `(${Math.abs(a1 - b1)}, ${Math.abs(a2 - b2)})`, // Trap C: Component-wise subtraction (absolute)
          `(${Math.sqrt(a1*a1 + a2*a2 + b1*b1 + b2*b2).toFixed(1)}, 0)` // Trap D: Confused with magnitude
        ];
        
        const correctOption = `(${resultX}, ${resultY})`;
        const options = [correctOption, ...trapOptions];
        
        return {
          question: `Find the sum of vectors A = (${a1}, ${a2}) and B = (${b1}, ${b2})`,
          options,
          correct: 0,
          explanation: `Vector addition: A + B = (${a1} + ${b1}, ${a2} + ${b2}) = ${correctOption}\n\nVector Addition Traps:\n- Option B: Multiplied components instead of adding\n- Option C: Subtracted components instead of adding\n- Option D: Confused vector addition with magnitude calculation`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Vector addition is component-wise addition",
            commonTraps: ["Component multiplication", "Subtraction instead of addition", "Magnitude confusion"]
          }
        };
      }
    },

    {
      name: "dotProductTraps",
      concept: "Dot Product",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const a1 = Math.floor(Math.random() * 5) + 1; // 1-5
        const a2 = Math.floor(Math.random() * 5) + 1; // 1-5
        const b1 = Math.floor(Math.random() * 5) + 1; // 1-5
        const b2 = Math.floor(Math.random() * 5) + 1; // 1-5
        
        // Dot product: A·B = a1*b1 + a2*b2
        const correctDotProduct = a1 * b1 + a2 * b2;
        
        // TRAP ENGINE - Dot Product Confusion
        const trapOptions = [
          a1 * b2 + a2 * b1,                         // Trap B: Cross-multiplied components
          Math.abs(a1 * b1 - a2 * b2),              // Trap C: Subtracted instead of added
          `(${a1 * b1}, ${a2 * b2})`                // Trap D: Gave vector result instead of scalar
        ];
        
        const options = [
          correctDotProduct.toString(),
          trapOptions[0].toString(),
          trapOptions[1].toString(),
          trapOptions[2]
        ];
        
        return {
          question: `Calculate the dot product of A = (${a1}, ${a2}) and B = (${b1}, ${b2})`,
          options,
          correct: 0,
          explanation: `Dot product: A·B = ${a1}×${b1} + ${a2}×${b2} = ${a1*b1} + ${a2*b2} = ${correctDotProduct}\n\nDot Product Traps:\n- Option B: Cross-multiplied components incorrectly\n- Option C: Subtracted products instead of adding\n- Option D: Gave vector answer instead of scalar`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Dot product is sum of component products, result is scalar",
            commonTraps: ["Component cross-multiplication", "Subtraction instead of addition", "Vector vs scalar confusion"]
          }
        };
      }
    },

    {
      name: "vectorMagnitudeTraps",
      concept: "Vector Magnitude",
      difficulty: "hard",
      highWeightage: true,
      generate() {
        const x = Math.floor(Math.random() * 6) + 3; // 3-8 (easier numbers)
        const y = Math.floor(Math.random() * 6) + 3; // 3-8
        
        // |v| = √(x² + y²)
        const correctMagnitude = Math.sqrt(x * x + y * y);
        
        // TRAP ENGINE - Magnitude Calculation Errors
        const trapOptions = [
          x + y,                                      // Trap B: Added components linearly
          Math.sqrt(x + y),                          // Trap C: Square root of sum instead of sum of squares
          Math.abs(x - y)                            // Trap D: Absolute difference of components
        ];
        
        const options = [
          correctMagnitude.toFixed(1),
          trapOptions[0].toFixed(1),
          trapOptions[1].toFixed(1),
          trapOptions[2].toFixed(1)
        ];
        
        return {
          question: `Find the magnitude of vector V = (${x}, ${y})`,
          options,
          correct: 0,
          explanation: `Magnitude: |V| = √(${x}² + ${y}²) = √(${x*x} + ${y*y}) = √${x*x + y*y} = ${correctMagnitude.toFixed(1)}\n\nMagnitude Traps:\n- Option B: Linear addition of components\n- Option C: Square root of sum instead of sum of squares\n- Option D: Absolute difference of components`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Vector magnitude uses Pythagorean theorem",
            commonTraps: ["Linear addition", "Wrong square root application", "Component subtraction"]
          }
        };
      }
    }
  ],

  "Probability": [
    {
      name: "conditionalProbabilityTraps",
      concept: "Conditional Probability",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const totalStudents = 100;
        const mathStudents = 60;
        const physicsStudents = 40;
        const bothSubjects = 25;
        
        // P(Physics|Math) = P(Physics ∩ Math) / P(Math)
        const correctProbability = bothSubjects / mathStudents;
        
        // TRAP ENGINE - Conditional Probability Confusion
        const trapOptions = [
          bothSubjects / totalStudents,               // Trap B: Used total instead of given condition
          physicsStudents / totalStudents,           // Trap C: Ignored the condition completely
          mathStudents / totalStudents               // Trap D: Calculated P(Math) instead of P(Physics|Math)
        ];
        
        const options = [
          correctProbability.toFixed(3),
          trapOptions[0].toFixed(3),
          trapOptions[1].toFixed(3),
          trapOptions[2].toFixed(3)
        ];
        
        return {
          question: `In a class of ${totalStudents} students, ${mathStudents} study Math, ${physicsStudents} study Physics, and ${bothSubjects} study both. What is the probability that a randomly selected Math student also studies Physics?`,
          options,
          correct: 0,
          explanation: `P(Physics|Math) = P(Physics ∩ Math) / P(Math) = (${bothSubjects}/${totalStudents}) / (${mathStudents}/${totalStudents}) = ${bothSubjects}/${mathStudents} = ${correctProbability.toFixed(3)}\n\nConditional Probability Traps:\n- Option B: Used total population instead of Math students\n- Option C: Calculated unconditional probability\n- Option D: Calculated wrong conditional probability`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Conditional probability restricts sample space to given condition",
            commonTraps: ["Using wrong denominator", "Ignoring condition", "Calculating wrong probability"]
          }
        };
      }
    }
  ],

  "Trigonometry": [
    {
      name: "trigIdentityTraps",
      concept: "Trigonometric Identities",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const angle = Math.floor(Math.random() * 3) + 1; // 1-3 (for multiples)
        
        // sin²θ + cos²θ = 1, so sin²θ = 1 - cos²θ
        const identities = [
          {
            question: `If cos θ = 3/5, find sin²θ`,
            cosValue: 3/5,
            correct: 1 - (3/5) * (3/5), // 1 - 9/25 = 16/25
            traps: [
              (3/5) * (3/5),              // Used cos²θ instead of 1 - cos²θ
              Math.sqrt(1 - (3/5) * (3/5)), // Found sin θ instead of sin²θ
              1 + (3/5) * (3/5)           // Added instead of subtracted
            ]
          }
        ];
        
        const selected = identities[0];
        const correctAnswer = selected.correct;
        
        const options = [
          `${correctAnswer.toFixed(3)}`,
          `${selected.traps[0].toFixed(3)}`,
          `${selected.traps[1].toFixed(3)}`,
          `${selected.traps[2].toFixed(3)}`
        ];
        
        return {
          question: selected.question,
          options,
          correct: 0,
          explanation: `Using sin²θ + cos²θ = 1:\nsin²θ = 1 - cos²θ = 1 - (3/5)² = 1 - 9/25 = 16/25 = ${correctAnswer.toFixed(3)}\n\nTrigonometric Identity Traps:\n- Option B: Used cos²θ value directly\n- Option C: Found sin θ instead of sin²θ\n- Option D: Added cos²θ instead of subtracting`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Pythagorean identity: sin²θ + cos²θ = 1",
            commonTraps: ["Using wrong value", "Finding wrong quantity", "Sign errors in identity"]
          }
        };
      }
    }
  ]
};

// Export individual generators for testing
export const generateDerivativeQuestion = mathsGenerators["Calculus"][0].generate;
export const generateVectorQuestion = mathsGenerators["Vectors"][0].generate;