// Chemistry Question Generators - Algorithmic Templates
// Infinite unique questions without API dependency

export const chemistryGenerators = {
  "Solutions": [
    {
      name: "molarity",
      concept: "Molarity Calculations",
      difficulty: "medium",
      highWeightage: true,
      trend2026: true,
      generate() {
        const moles = Math.floor(Math.random() * 8) + 2; // 2-9 moles
        const volume = Math.floor(Math.random() * 4) + 1; // 1-4 L
        
        // Molarity = moles / volume (L)
        const molarity = moles / volume;
        
        const wrongOptions = [
          moles * volume,
          moles + volume,
          volume / moles
        ].map(m => m.toFixed(2));
        
        const correctOption = molarity.toFixed(2);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `Calculate the molarity of a solution containing ${moles} moles of solute in ${volume} L of solution.`,
          options: options.map(opt => `${opt} M`),
          correct: correctIndex,
          explanation: `Molarity = moles of solute / volume of solution (L)\nM = ${moles} / ${volume} = ${correctOption} M`
        };
      }
    },

    {
      name: "moleFraction",
      concept: "Mole Fraction",
      difficulty: "medium",
      trend2026: true,
      generate() {
        const molesA = Math.floor(Math.random() * 6) + 2; // 2-7 moles
        const molesB = Math.floor(Math.random() * 4) + 1; // 1-4 moles
        const totalMoles = molesA + molesB;
        
        // Mole fraction of A = moles of A / total moles
        const moleFraction = molesA / totalMoles;
        
        const wrongOptions = [
          molesB / totalMoles,
          molesA / molesB,
          molesB / molesA
        ].map(x => x.toFixed(3));
        
        const correctOption = moleFraction.toFixed(3);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `In a solution containing ${molesA} moles of component A and ${molesB} moles of component B, find the mole fraction of A.`,
          options,
          correct: correctIndex,
          explanation: `Mole fraction of A = moles of A / total moles\nχₐ = ${molesA} / (${molesA} + ${molesB}) = ${molesA} / ${totalMoles} = ${correctOption}`
        };
      }
    },

    {
      name: "colligativeProperties",
      concept: "Colligative Properties",
      difficulty: "hard",
      highWeightage: true,
      generate() {
        const molality = Math.floor(Math.random() * 4) + 1; // 1-4 m
        const kf = 1.86; // Freezing point depression constant for water
        
        // ΔTf = Kf × m
        const freezingPointDepression = kf * molality;
        const newFreezingPoint = 0 - freezingPointDepression;
        
        const wrongOptions = [
          0 + freezingPointDepression,
          -freezingPointDepression / 2,
          -freezingPointDepression * 2
        ].map(t => t.toFixed(2));
        
        const correctOption = newFreezingPoint.toFixed(2);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `Calculate the freezing point of a ${molality} m aqueous solution. (Kf for water = 1.86 K⋅kg/mol)`,
          options: options.map(opt => `${opt}°C`),
          correct: correctIndex,
          explanation: `ΔTf = Kf × m = 1.86 × ${molality} = ${freezingPointDepression}°C\nNew freezing point = 0°C - ${freezingPointDepression}°C = ${correctOption}°C`
        };
      }
    }
  ],

  "Electrochemistry": [
    {
      name: "faradaysLaws",
      concept: "Faraday's Laws of Electrolysis",
      difficulty: "medium",
      highWeightage: true,
      trend2026: true,
      generate() {
        const current = Math.floor(Math.random() * 8) + 2; // 2-9 A
        const time = Math.floor(Math.random() * 6) + 2; // 2-7 hours
        const atomicMass = 63.5; // Copper
        const valency = 2;
        const faraday = 96500;
        
        // Mass deposited = (I × t × M) / (n × F)
        const timeInSeconds = time * 3600;
        const mass = (current * timeInSeconds * atomicMass) / (valency * faraday);
        
        const wrongOptions = [
          mass * 2,
          mass / 2,
          mass * valency
        ].map(m => m.toFixed(2));
        
        const correctOption = mass.toFixed(2);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `Calculate the mass of copper deposited when ${current} A current is passed through CuSO₄ solution for ${time} hours. (Atomic mass of Cu = 63.5 g/mol)`,
          options: options.map(opt => `${opt} g`),
          correct: correctIndex,
          explanation: `Mass = (I × t × M) / (n × F)\nMass = (${current} × ${timeInSeconds} × 63.5) / (2 × 96500) = ${correctOption} g`
        };
      }
    },

    {
      name: "cellPotential",
      concept: "Cell Potential",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const cathodeE = (Math.floor(Math.random() * 15) + 5) / 10; // 0.5 to 1.9 V
        const anodeE = -(Math.floor(Math.random() * 10) + 1) / 10; // -0.1 to -1.0 V
        
        // E°cell = E°cathode - E°anode
        const cellPotential = cathodeE - anodeE;
        
        const wrongOptions = [
          cathodeE + anodeE,
          anodeE - cathodeE,
          Math.abs(cathodeE - anodeE) / 2
        ].map(e => e.toFixed(2));
        
        const correctOption = cellPotential.toFixed(2);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `Calculate the standard cell potential if E°(cathode) = ${cathodeE} V and E°(anode) = ${anodeE} V`,
          options: options.map(opt => `${opt} V`),
          correct: correctIndex,
          explanation: `E°cell = E°cathode - E°anode = ${cathodeE} - (${anodeE}) = ${correctOption} V`
        };
      }
    },

    {
      name: "nernstEquation",
      concept: "Nernst Equation",
      difficulty: "hard",
      highWeightage: true,
      generate() {
        const standardPotential = (Math.floor(Math.random() * 10) + 5) / 10; // 0.5 to 1.4 V
        const concentration = Math.floor(Math.random() * 4) + 1; // 1-4 M
        const n = 2; // electrons transferred
        
        // E = E° - (0.059/n) × log[products]/[reactants]
        // Simplified: E = E° - (0.059/2) × log(concentration)
        const potential = standardPotential - (0.059 / n) * Math.log10(concentration);
        
        const wrongOptions = [
          standardPotential + (0.059 / n) * Math.log10(concentration),
          standardPotential - 0.059 * Math.log10(concentration),
          standardPotential / concentration
        ].map(e => e.toFixed(3));
        
        const correctOption = potential.toFixed(3);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `Using Nernst equation, calculate the cell potential when E° = ${standardPotential} V and [product] = ${concentration} M (n = 2)`,
          options: options.map(opt => `${opt} V`),
          correct: correctIndex,
          explanation: `E = E° - (0.059/n) × log[products]\nE = ${standardPotential} - (0.059/2) × log(${concentration}) = ${correctOption} V`
        };
      }
    }
  ],

  "Chemical Kinetics": [
    {
      name: "rateConstant",
      concept: "Rate Constant",
      difficulty: "medium",
      highWeightage: true,
      trend2026: true,
      generate() {
        const initialConc = Math.floor(Math.random() * 6) + 2; // 2-7 M
        const finalConc = Math.floor(initialConc / 2) + 1; // Half or less
        const time = Math.floor(Math.random() * 8) + 2; // 2-9 min
        
        // For first order: ln([A]₀/[A]) = kt
        const k = Math.log(initialConc / finalConc) / time;
        
        const wrongOptions = [
          (initialConc - finalConc) / time,
          Math.log(finalConc / initialConc) / time,
          (initialConc / finalConc) / time
        ].map(rate => rate.toFixed(4));
        
        const correctOption = k.toFixed(4);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `For a first-order reaction, concentration decreases from ${initialConc} M to ${finalConc} M in ${time} minutes. Calculate the rate constant.`,
          options: options.map(opt => `${opt} min⁻¹`),
          correct: correctIndex,
          explanation: `For first order: k = (1/t) × ln([A]₀/[A])\nk = (1/${time}) × ln(${initialConc}/${finalConc}) = ${correctOption} min⁻¹`
        };
      }
    },

    {
      name: "halfLife",
      concept: "Half-life",
      difficulty: "medium",
      trend2026: true,
      generate() {
        const k = (Math.floor(Math.random() * 8) + 2) / 100; // 0.02 to 0.09 min⁻¹
        
        // For first order: t₁/₂ = 0.693/k
        const halfLife = 0.693 / k;
        
        const wrongOptions = [
          0.693 * k,
          1 / k,
          k / 0.693
        ].map(t => t.toFixed(1));
        
        const correctOption = halfLife.toFixed(1);
        const options = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);
        
        return {
          question: `Calculate the half-life of a first-order reaction with rate constant k = ${k} min⁻¹`,
          options: options.map(opt => `${opt} min`),
          correct: correctIndex,
          explanation: `For first order reaction: t₁/₂ = 0.693/k = 0.693/${k} = ${correctOption} min`
        };
      }
    }
  ],

  "Coordination Compounds": [
    {
      name: "oxidationState",
      concept: "Oxidation State in Complexes",
      difficulty: "medium",
      highWeightage: true,
      generate() {
        const complexes = [
          { formula: "[Fe(CN)₆]³⁻", metal: "Fe", ligandCharge: -1, ligandCount: 6, complexCharge: -3, answer: "+3" },
          { formula: "[Co(NH₃)₆]³⁺", metal: "Co", ligandCharge: 0, ligandCount: 6, complexCharge: +3, answer: "+3" },
          { formula: "[Ni(CO)₄]", metal: "Ni", ligandCharge: 0, ligandCount: 4, complexCharge: 0, answer: "0" },
          { formula: "[CuCl₄]²⁻", metal: "Cu", ligandCharge: -1, ligandCount: 4, complexCharge: -2, answer: "+2" }
        ];
        
        const selected = complexes[Math.floor(Math.random() * complexes.length)];
        
        // Calculate other possible wrong answers
        const wrongOptions = ["+1", "+2", "+4", "+5", "0", "-1"].filter(opt => opt !== selected.answer).slice(0, 3);
        
        const options = [selected.answer, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(selected.answer);
        
        return {
          question: `Find the oxidation state of ${selected.metal} in ${selected.formula}`,
          options,
          correct: correctIndex,
          explanation: `Let oxidation state of ${selected.metal} = x\nCharge balance: x + (${selected.ligandCount} × ${selected.ligandCharge}) = ${selected.complexCharge}\nSolving: x = ${selected.answer}`
        };
      }
    },

    {
      name: "coordinationNumber",
      concept: "Coordination Number",
      difficulty: "easy",
      trend2026: true,
      generate() {
        const complexes = [
          { formula: "[Fe(CN)₆]³⁻", cn: 6 },
          { formula: "[Co(NH₃)₆]³⁺", cn: 6 },
          { formula: "[Ni(CO)₄]", cn: 4 },
          { formula: "[CuCl₄]²⁻", cn: 4 },
          { formula: "[Ag(NH₃)₂]⁺", cn: 2 }
        ];
        
        const selected = complexes[Math.floor(Math.random() * complexes.length)];
        const wrongOptions = [2, 4, 6, 8].filter(opt => opt !== selected.cn).slice(0, 3);
        
        const options = [selected.cn, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(selected.cn);
        
        return {
          question: `What is the coordination number of the central metal ion in ${selected.formula}?`,
          options,
          correct: correctIndex,
          explanation: `Coordination number is the number of ligand atoms directly bonded to the central metal ion. In ${selected.formula}, it is ${selected.cn}.`
        };
      }
    }
  ]
};

// Export individual generators for testing
export const generateMolarityQuestion = chemistryGenerators["Solutions"][0].generate;
export const generateElectrochemistryQuestion = chemistryGenerators["Electrochemistry"][0].generate;