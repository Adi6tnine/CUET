// High-Yield Previous Year Questions (PYQs) - CUET 2026 Pattern
export const PYQ_DATABASE = {
  "Physics": {
    "Electric Charges and Fields": [
      {
        id: 1,
        question: "Two point charges +4μC and +9μC are placed 20 cm apart. At what distance from the +4μC charge will the electric field be zero?",
        options: ["8 cm", "12 cm", "6 cm", "10 cm"],
        correct: 0,
        explanation: "For electric field to be zero between charges, the point divides the distance in ratio √(q₁/q₂) = √(4/9) = 2:3. Distance = 20×2/5 = 8 cm from +4μC charge.",
        difficulty: "medium",
        source: "CUET 2024",
        year: "2024"
      },
      {
        id: 2,
        question: "A hollow metallic sphere of radius R has a charge Q. The electric field at distance r from center (where r < R) is:",
        options: ["kQ/r²", "Zero", "kQ/R²", "kQ/(R²-r²)"],
        correct: 1,
        explanation: "Inside a hollow conductor, electric field is zero due to electrostatic shielding. All charge resides on the outer surface.",
        difficulty: "easy",
        source: "CUET 2023",
        year: "2023"
      },
      {
        id: 3,
        question: "The electric flux through a closed surface depends on:",
        options: ["Shape of surface", "Size of surface", "Charge enclosed", "Material of surface"],
        correct: 2,
        explanation: "According to Gauss's law, electric flux = Q_enclosed/ε₀, which depends only on the charge enclosed by the surface.",
        difficulty: "easy",
        source: "CUET 2025",
        year: "2025"
      },
      {
        id: 4,
        question: "An electric dipole is placed in a uniform electric field. The net force on the dipole is:",
        options: ["Always zero", "Maximum when θ = 0°", "Maximum when θ = 90°", "Depends on field strength"],
        correct: 0,
        explanation: "In a uniform electric field, the net force on a dipole is always zero as equal and opposite forces act on the charges.",
        difficulty: "medium",
        source: "CUET 2024",
        year: "2024"
      },
      {
        id: 5,
        question: "The dimension of electric field intensity is:",
        options: ["[MLT⁻³A⁻¹]", "[MLT⁻²A⁻¹]", "[ML²T⁻³A⁻¹]", "[MLT⁻¹A⁻¹]"],
        correct: 0,
        explanation: "Electric field E = F/q. Dimension of force [MLT⁻²] divided by charge [AT] gives [MLT⁻³A⁻¹].",
        difficulty: "medium",
        source: "CUET 2023",
        year: "2023"
      },
      {
        id: 6,
        question: "If the distance between two point charges is doubled, the force between them becomes:",
        options: ["Half", "One-fourth", "Double", "Four times"],
        correct: 1,
        explanation: "According to Coulomb's law, F ∝ 1/r². When distance is doubled, force becomes 1/4 times.",
        difficulty: "easy",
        source: "CUET 2025",
        year: "2025"
      },
      {
        id: 7,
        question: "The electric field lines around an isolated positive charge are:",
        options: ["Circular", "Radial outward", "Radial inward", "Parallel"],
        correct: 1,
        explanation: "Electric field lines originate from positive charges and extend radially outward to infinity.",
        difficulty: "easy",
        source: "CUET 2024",
        year: "2024"
      },
      {
        id: 8,
        question: "Two identical conducting spheres with charges +Q and -3Q are brought into contact and then separated. The final charge on each sphere is:",
        options: ["+Q, -3Q", "-Q, -Q", "+2Q, -4Q", "0, -2Q"],
        correct: 1,
        explanation: "When conductors touch, total charge (+Q - 3Q = -2Q) distributes equally. Each gets -Q charge.",
        difficulty: "medium",
        source: "CUET 2023",
        year: "2023"
      },
      {
        id: 9,
        question: "The work done in moving a charge in an equipotential surface is:",
        options: ["Maximum", "Minimum", "Zero", "Depends on path"],
        correct: 2,
        explanation: "On an equipotential surface, potential is constant everywhere, so work done = q(V₂ - V₁) = 0.",
        difficulty: "easy",
        source: "CUET 2025",
        year: "2025"
      },
      {
        id: 10,
        question: "A charge +q is placed at the center of a cube. The electric flux through one face of the cube is:",
        options: ["q/ε₀", "q/6ε₀", "6q/ε₀", "q/12ε₀"],
        correct: 1,
        explanation: "Total flux through cube = q/ε₀. Due to symmetry, flux through each of 6 faces = q/6ε₀.",
        difficulty: "medium",
        source: "CUET 2024",
        year: "2024"
      }
    ],
    "Current Electricity": [
      {
        id: 11,
        question: "The resistance of a wire is 10Ω. If it is stretched to double its length, the new resistance becomes:",
        options: ["20Ω", "40Ω", "5Ω", "10Ω"],
        correct: 1,
        explanation: "When length doubles, area becomes half. R = ρl/A, so new resistance = ρ(2l)/(A/2) = 4ρl/A = 4R = 40Ω.",
        difficulty: "medium",
        source: "CUET 2024",
        year: "2024"
      },
      {
        id: 12,
        question: "In a Wheatstone bridge, the bridge is balanced when:",
        options: ["P/Q = R/S", "P×Q = R×S", "P/R = Q/S", "P+Q = R+S"],
        correct: 0,
        explanation: "Wheatstone bridge is balanced when P/Q = R/S, which means no current flows through the galvanometer.",
        difficulty: "medium",
        source: "CUET 2023",
        year: "2023"
      }
    ]
  },
  "Chemistry": {
    "Solutions": [
      {
        id: 21,
        question: "The molality of a solution containing 5.85g NaCl in 500g water is: (Atomic mass: Na=23, Cl=35.5)",
        options: ["0.1 m", "0.2 m", "0.3 m", "0.4 m"],
        correct: 1,
        explanation: "Moles of NaCl = 5.85/58.5 = 0.1 mol. Molality = moles/kg of solvent = 0.1/0.5 = 0.2 m.",
        difficulty: "medium",
        source: "CUET 2024",
        year: "2024"
      },
      {
        id: 22,
        question: "Which of the following solutions will have the highest boiling point?",
        options: ["0.1 M glucose", "0.1 M NaCl", "0.1 M CaCl₂", "0.1 M Al₂(SO₄)₃"],
        correct: 3,
        explanation: "Boiling point elevation depends on van't Hoff factor (i). Al₂(SO₄)₃ has highest i=5, so highest boiling point.",
        difficulty: "medium",
        source: "CUET 2025",
        year: "2025"
      }
    ]
  },
  "Mathematics": {
    "Matrices": [
      {
        id: 31,
        question: "If A = [1 2; 3 4] and B = [2 0; 1 3], then (AB)ᵀ equals:",
        options: ["AᵀBᵀ", "BᵀAᵀ", "AB", "BA"],
        correct: 1,
        explanation: "For matrix multiplication, (AB)ᵀ = BᵀAᵀ. This is a fundamental property of matrix transpose.",
        difficulty: "medium",
        source: "CUET 2024",
        year: "2024"
      },
      {
        id: 32,
        question: "The determinant of a 3×3 identity matrix is:",
        options: ["0", "1", "3", "9"],
        correct: 1,
        explanation: "The determinant of any identity matrix is always 1, regardless of its size.",
        difficulty: "easy",
        source: "CUET 2023",
        year: "2023"
      }
    ]
  },
  "English": {
    "Reading Comprehension (Factual Passages)": [
      {
        id: 41,
        question: "In factual passages, the primary purpose is usually to:",
        options: ["Entertain readers", "Provide information", "Express emotions", "Create suspense"],
        correct: 1,
        explanation: "Factual passages are written primarily to inform and provide accurate information to readers.",
        difficulty: "easy",
        source: "CUET 2024",
        year: "2024"
      },
      {
        id: 42,
        question: "Which reading strategy is most effective for factual passages?",
        options: ["Skimming only", "Detailed reading", "Reading for pleasure", "Speed reading"],
        correct: 1,
        explanation: "Factual passages require detailed reading to understand and retain specific information and data.",
        difficulty: "medium",
        source: "CUET 2025",
        year: "2025"
      }
    ]
  },
  "General Test": {
    "General Knowledge": [
      {
        id: 51,
        question: "Who is the current President of India (as of 2026)?",
        options: ["Ram Nath Kovind", "Droupadi Murmu", "Pranab Mukherjee", "A.P.J. Abdul Kalam"],
        correct: 1,
        explanation: "Droupadi Murmu is the current President of India, having taken office in July 2022.",
        difficulty: "easy",
        source: "CUET 2025",
        year: "2025"
      },
      {
        id: 52,
        question: "The 'Chandrayaan-3' mission was launched by which space agency?",
        options: ["NASA", "ESA", "ISRO", "JAXA"],
        correct: 2,
        explanation: "Chandrayaan-3 was successfully launched by ISRO (Indian Space Research Organisation) in 2023.",
        difficulty: "easy",
        source: "CUET 2024",
        year: "2024"
      }
    ]
  }
};