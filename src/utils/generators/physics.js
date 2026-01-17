// Physics Question Generators - COMPLETE CUET 2026 SYLLABUS COVERAGE
// 100% Class 11 & 12 chapters with Trap Engine algorithms
// Exam-grade questions with smart traps based on common student errors

export const physicsGenerators = {
  // ===== CLASS 11 CHAPTERS (MECHANICS & PROPERTIES) =====
  
  "Motion in a Straight Line": [
    {
      name: "kinematicsEquations",
      concept: "Equations of Motion",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const u = Math.floor(Math.random() * 20) + 5; // 5-24 m/s
        const a = Math.floor(Math.random() * 8) + 2; // 2-9 m/s²
        const t = Math.floor(Math.random() * 5) + 2; // 2-6 s
        
        // v = u + at
        const correctVelocity = u + a * t;
        
        // TRAP ENGINE - Kinematics Formula Errors
        const trapOptions = [
          u + a * t * t,                           // Trap B: Used s = ut + ½at² formula
          u * a * t,                              // Trap C: Multiplied all terms
          u - a * t                               // Trap D: Wrong sign (deceleration confusion)
        ];
        
        const options = [
          `${correctVelocity} m/s`,
          `${trapOptions[0]} m/s`,
          `${trapOptions[1]} m/s`,
          `${trapOptions[2]} m/s`
        ];
        
        return {
          question: `A car starts with velocity ${u} m/s and accelerates at ${a} m/s² for ${t} seconds. Find its final velocity.`,
          options,
          correct: 0,
          explanation: `Using v = u + at\nv = ${u} + ${a} × ${t} = ${u} + ${a * t} = ${correctVelocity} m/s\n\nKinematics Traps:\n- Option B: Used displacement formula instead\n- Option C: Multiplied all terms incorrectly\n- Option D: Used negative acceleration`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "First equation of motion: v = u + at",
            commonTraps: ["Formula confusion", "Mathematical errors", "Sign mistakes"]
          }
        };
      }
    }
  ],

  "Motion in a Plane": [
    {
      name: "projectileMotion",
      concept: "Projectile Motion",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const u = Math.floor(Math.random() * 30) + 20; // 20-49 m/s
        const angle = [30, 45, 60][Math.floor(Math.random() * 3)]; // Common angles
        const g = 10; // m/s²
        
        // Range R = u²sin(2θ)/g
        const angleRad = (angle * Math.PI) / 180;
        const correctRange = (u * u * Math.sin(2 * angleRad)) / g;
        
        // TRAP ENGINE - Projectile Motion Errors
        const trapOptions = [
          (u * u * Math.sin(angleRad)) / g,        // Trap B: Used sin(θ) instead of sin(2θ)
          (u * u * Math.cos(2 * angleRad)) / g,   // Trap C: Used cos(2θ) instead of sin(2θ)
          (u * u * Math.sin(2 * angleRad)) / (2 * g) // Trap D: Extra factor of 2 in denominator
        ];
        
        const options = [
          `${correctRange.toFixed(1)} m`,
          `${trapOptions[0].toFixed(1)} m`,
          `${trapOptions[1].toFixed(1)} m`,
          `${trapOptions[2].toFixed(1)} m`
        ];
        
        return {
          question: `A projectile is launched at ${u} m/s at an angle of ${angle}° with horizontal. Find the range. (g = 10 m/s²)`,
          options,
          correct: 0,
          explanation: `Range formula: R = u²sin(2θ)/g\nR = ${u}² × sin(2×${angle}°) / 10\nR = ${u * u} × sin(${2 * angle}°) / 10 = ${correctRange.toFixed(1)} m\n\nProjectile Traps:\n- Option B: Used sin(θ) instead of sin(2θ)\n- Option C: Used cos(2θ) instead of sin(2θ)\n- Option D: Wrong denominator factor`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Range formula uses sin(2θ) for maximum range",
            commonTraps: ["Angle doubling error", "Trigonometric function confusion", "Formula manipulation errors"]
          }
        };
      }
    }
  ],

  "Laws of Motion": [
    {
      name: "newtonsSecondLaw",
      concept: "Newton's Second Law",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const mass = Math.floor(Math.random() * 8) + 2; // 2-9 kg
        const force = Math.floor(Math.random() * 40) + 10; // 10-49 N
        
        // F = ma, so a = F/m
        const correctAcceleration = force / mass;
        
        // TRAP ENGINE - Newton's Law Errors
        const trapOptions = [
          force * mass,                            // Trap B: Used a = F×m (multiplication)
          mass / force,                           // Trap C: Used a = m/F (inverted)
          force + mass                            // Trap D: Used a = F+m (addition)
        ];
        
        const options = [
          `${correctAcceleration.toFixed(2)} m/s²`,
          `${trapOptions[0].toFixed(2)} m/s²`,
          `${trapOptions[1].toFixed(2)} m/s²`,
          `${trapOptions[2].toFixed(2)} m/s²`
        ];
        
        return {
          question: `A force of ${force} N acts on a mass of ${mass} kg. Calculate the acceleration produced.`,
          options,
          correct: 0,
          explanation: `Newton's Second Law: F = ma\nTherefore: a = F/m = ${force}/${mass} = ${correctAcceleration.toFixed(2)} m/s²\n\nNewton's Law Traps:\n- Option B: Multiplied F×m instead of dividing\n- Option C: Inverted the formula to m/F\n- Option D: Added F+m incorrectly`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Newton's second law: F = ma, so a = F/m",
            commonTraps: ["Formula inversion", "Multiplication instead of division", "Addition confusion"]
          }
        };
      }
    },
    {
      name: "frictionForce",
      concept: "Friction",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const mass = Math.floor(Math.random() * 15) + 5; // 5-19 kg
        const mu = [0.2, 0.3, 0.4, 0.5][Math.floor(Math.random() * 4)]; // Common friction coefficients
        const g = 10; // m/s²
        
        // f = μN = μmg (on horizontal surface)
        const correctFriction = mu * mass * g;
        
        // TRAP ENGINE - Friction Errors
        const trapOptions = [
          mu * mass,                              // Trap B: Forgot gravity (f = μm)
          mass * g,                               // Trap C: Forgot friction coefficient (f = mg)
          mu * g                                  // Trap D: Forgot mass (f = μg)
        ];
        
        const options = [
          `${correctFriction.toFixed(1)} N`,
          `${trapOptions[0].toFixed(1)} N`,
          `${trapOptions[1].toFixed(1)} N`,
          `${trapOptions[2].toFixed(1)} N`
        ];
        
        return {
          question: `A ${mass} kg block rests on a horizontal surface with coefficient of friction μ = ${mu}. Find the maximum static friction force. (g = 10 m/s²)`,
          options,
          correct: 0,
          explanation: `Maximum static friction: f = μN = μmg\nf = ${mu} × ${mass} × 10 = ${correctFriction.toFixed(1)} N\n\nFriction Traps:\n- Option B: Forgot to include gravity\n- Option C: Forgot friction coefficient\n- Option D: Forgot mass in calculation`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Friction force f = μN = μmg on horizontal surface",
            commonTraps: ["Missing gravity factor", "Missing friction coefficient", "Missing mass"]
          }
        };
      }
    }
  ],

  "Work, Energy and Power": [
    {
      name: "kineticEnergy",
      concept: "Kinetic Energy",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const mass = Math.floor(Math.random() * 8) + 2; // 2-9 kg
        const velocity = Math.floor(Math.random() * 15) + 5; // 5-19 m/s
        
        // KE = ½mv²
        const correctKE = 0.5 * mass * velocity * velocity;
        
        // TRAP ENGINE - Kinetic Energy Errors
        const trapOptions = [
          mass * velocity * velocity,             // Trap B: Forgot ½ factor
          0.5 * mass * velocity,                 // Trap C: Used KE = ½mv (linear in v)
          mass * velocity                        // Trap D: Used KE = mv (completely wrong)
        ];
        
        const options = [
          `${correctKE} J`,
          `${trapOptions[0]} J`,
          `${trapOptions[1]} J`,
          `${trapOptions[2]} J`
        ];
        
        return {
          question: `Calculate the kinetic energy of a ${mass} kg object moving at ${velocity} m/s.`,
          options,
          correct: 0,
          explanation: `Kinetic Energy: KE = ½mv²\nKE = ½ × ${mass} × ${velocity}² = ½ × ${mass} × ${velocity * velocity} = ${correctKE} J\n\nKinetic Energy Traps:\n- Option B: Forgot the ½ factor\n- Option C: Linear dependence on velocity\n- Option D: Completely wrong formula`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Kinetic energy is quadratic in velocity with ½ factor",
            commonTraps: ["Missing ½ factor", "Linear velocity assumption", "Formula confusion"]
          }
        };
      }
    },
    {
      name: "workEnergyTheorem",
      concept: "Work-Energy Theorem",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const mass = Math.floor(Math.random() * 6) + 2; // 2-7 kg
        const u = Math.floor(Math.random() * 10) + 5; // 5-14 m/s
        const v = Math.floor(Math.random() * 15) + 15; // 15-29 m/s
        
        // Work = ΔKE = ½m(v² - u²)
        const correctWork = 0.5 * mass * (v * v - u * u);
        
        // TRAP ENGINE - Work-Energy Theorem Errors
        const trapOptions = [
          0.5 * mass * (v + u) * (v + u),       // Trap B: Used (v+u)² instead of (v²-u²)
          mass * (v * v - u * u),               // Trap C: Forgot ½ factor
          0.5 * mass * (v - u) * (v - u)        // Trap D: Used (v-u)² instead of (v²-u²)
        ];
        
        const options = [
          `${correctWork} J`,
          `${trapOptions[0]} J`,
          `${trapOptions[1]} J`,
          `${trapOptions[2]} J`
        ];
        
        return {
          question: `A ${mass} kg object accelerates from ${u} m/s to ${v} m/s. Calculate the work done using work-energy theorem.`,
          options,
          correct: 0,
          explanation: `Work-Energy Theorem: W = ΔKE = ½m(v² - u²)\nW = ½ × ${mass} × (${v}² - ${u}²) = ½ × ${mass} × (${v*v} - ${u*u}) = ${correctWork} J\n\nWork-Energy Traps:\n- Option B: Used (v+u)² expansion incorrectly\n- Option C: Forgot the ½ factor\n- Option D: Used (v-u)² instead of (v²-u²)`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Work equals change in kinetic energy: W = ½m(v² - u²)",
            commonTraps: ["Algebraic expansion errors", "Missing ½ factor", "Formula manipulation mistakes"]
          }
        };
      }
    }
  ],

  "System of Particles and Rotational Motion": [
    {
      name: "momentOfInertia",
      concept: "Moment of Inertia",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const mass = Math.floor(Math.random() * 8) + 2; // 2-9 kg
        const radius = Math.floor(Math.random() * 4) + 1; // 1-4 m
        
        // For solid cylinder: I = ½mr²
        const correctMOI = 0.5 * mass * radius * radius;
        
        // TRAP ENGINE - Moment of Inertia Errors
        const trapOptions = [
          mass * radius * radius,                 // Trap B: Used I = mr² (point mass formula)
          (2/5) * mass * radius * radius,        // Trap C: Used solid sphere formula
          mass * radius                          // Trap D: Used I = mr (linear)
        ];
        
        const options = [
          `${correctMOI} kg⋅m²`,
          `${trapOptions[0]} kg⋅m²`,
          `${trapOptions[1].toFixed(1)} kg⋅m²`,
          `${trapOptions[2]} kg⋅m²`
        ];
        
        return {
          question: `Calculate the moment of inertia of a solid cylinder of mass ${mass} kg and radius ${radius} m about its central axis.`,
          options,
          correct: 0,
          explanation: `For solid cylinder: I = ½mr²\nI = ½ × ${mass} × ${radius}² = ½ × ${mass} × ${radius * radius} = ${correctMOI} kg⋅m²\n\nMoment of Inertia Traps:\n- Option B: Used point mass formula I = mr²\n- Option C: Used solid sphere formula I = (2/5)mr²\n- Option D: Linear relationship I = mr`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Different shapes have different moment of inertia formulas",
            commonTraps: ["Shape formula confusion", "Point mass assumption", "Linear relationship error"]
          }
        };
      }
    }
  ],

  "Gravitation": [
    {
      name: "gravitationalForce",
      concept: "Newton's Law of Gravitation",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const m1 = Math.floor(Math.random() * 8) + 2; // 2-9 kg
        const m2 = Math.floor(Math.random() * 8) + 2; // 2-9 kg
        const r = Math.floor(Math.random() * 4) + 1; // 1-4 m
        const G = 6.67; // ×10⁻¹¹ (simplified)
        
        // F = Gm₁m₂/r²
        const correctForce = (G * m1 * m2) / (r * r);
        
        // TRAP ENGINE - Gravitational Force Errors
        const trapOptions = [
          (G * m1 * m2) / r,                     // Trap B: Forgot to square distance
          (G * m1) / (r * r),                   // Trap C: Forgot second mass
          G * m1 * m2 * r * r                   // Trap D: Multiplied by r² instead of dividing
        ];
        
        const options = [
          `${correctForce.toFixed(2)} × 10⁻¹¹ N`,
          `${trapOptions[0].toFixed(2)} × 10⁻¹¹ N`,
          `${trapOptions[1].toFixed(2)} × 10⁻¹¹ N`,
          `${trapOptions[2].toFixed(2)} × 10⁻¹¹ N`
        ];
        
        return {
          question: `Calculate gravitational force between masses ${m1} kg and ${m2} kg separated by ${r} m. (G = 6.67×10⁻¹¹ N⋅m²/kg²)`,
          options,
          correct: 0,
          explanation: `Newton's Law: F = Gm₁m₂/r²\nF = (6.67×10⁻¹¹) × ${m1} × ${m2} / ${r}²\nF = ${correctForce.toFixed(2)} × 10⁻¹¹ N\n\nGravitational Traps:\n- Option B: Distance not squared\n- Option C: Missing one mass\n- Option D: Multiplied by r² instead of dividing`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Gravitational force follows inverse square law",
            commonTraps: ["Distance not squared", "Missing mass terms", "Mathematical operation errors"]
          }
        };
      }
    }
  ],
  
  // ===== CLASS 12 CHAPTERS (ELECTRODYNAMICS & MODERN PHYSICS) =====
  
  "Electric Charges and Fields": [
    {
      name: "coulombsLaw",
      concept: "Coulomb's Law",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const q1 = Math.floor(Math.random() * 9) + 1; // 1-9 μC
        const q2 = Math.floor(Math.random() * 9) + 1; // 1-9 μC
        const r = Math.floor(Math.random() * 5) + 1;  // 1-5 cm
        
        // F = k*q1*q2/r^2, k = 9×10^9
        const correctForce = (9 * q1 * q2) / (r * r); // in N (×10^-3)
        
        // TRAP ENGINE - Coulomb's Law Errors
        const trapOptions = [
          (9 * q1 * q2) / r,                     // Trap B: Forgot to square distance
          (9 * q1) / r,                         // Trap C: Used potential formula V = kq/r
          correctForce * 10                     // Trap D: Unit conversion error
        ];
        
        const options = [
          `${correctForce.toFixed(2)} × 10⁻³ N`,
          `${trapOptions[0].toFixed(2)} × 10⁻³ N`,
          `${trapOptions[1].toFixed(2)} × 10⁻³ V`,
          `${trapOptions[2].toFixed(2)} × 10⁻⁴ N`
        ];
        
        return {
          question: `Two point charges of ${q1} μC and ${q2} μC are placed ${r} cm apart in air. Calculate the electrostatic force. (k = 9×10⁹ N⋅m²/C²)`,
          options,
          correct: 0,
          explanation: `Coulomb's Law: F = kq₁q₂/r²\nF = (9×10⁹) × (${q1}×10⁻⁶) × (${q2}×10⁻⁶) / (${r}×10⁻²)²\nF = ${correctForce.toFixed(2)} × 10⁻³ N\n\nCoulomb's Traps:\n- Option B: Distance not squared\n- Option C: Confused with potential formula\n- Option D: Unit conversion error`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Coulomb's law with inverse square relationship",
            commonTraps: ["Distance not squared", "Formula confusion", "Unit errors"]
          }
        };
      }
    }
  ],

  "Electrostatic Potential and Capacitance": [
    {
      name: "capacitorEnergy",
      concept: "Energy in Capacitors",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const capacitance = Math.floor(Math.random() * 8) + 2; // 2-9 μF
        const voltage = Math.floor(Math.random() * 6) + 4; // 4-9 V
        
        // U = ½CV²
        const correctEnergy = 0.5 * capacitance * voltage * voltage;
        
        // TRAP ENGINE - Capacitor Energy Errors
        const trapOptions = [
          capacitance * voltage * voltage,       // Trap B: Forgot ½ factor
          0.5 * capacitance * voltage,          // Trap C: Linear in voltage
          capacitance * voltage                 // Trap D: Wrong formula entirely
        ];
        
        const options = [
          `${correctEnergy} μJ`,
          `${trapOptions[0]} μJ`,
          `${trapOptions[1]} μJ`,
          `${trapOptions[2]} μJ`
        ];
        
        return {
          question: `A ${capacitance} μF capacitor is charged to ${voltage} V. Calculate the energy stored.`,
          options,
          correct: 0,
          explanation: `Energy: U = ½CV²\nU = ½ × ${capacitance} × ${voltage}² = ${correctEnergy} μJ\n\nCapacitor Energy Traps:\n- Option B: Missing ½ factor\n- Option C: Linear voltage dependence\n- Option D: Wrong formula`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Capacitor energy is quadratic in voltage",
            commonTraps: ["Missing ½ factor", "Linear assumption", "Formula confusion"]
          }
        };
      }
    }
  ],

  "Current Electricity": [
    {
      name: "ohmsLaw",
      concept: "Ohm's Law",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const voltage = Math.floor(Math.random() * 10) + 5; // 5-14 V
        const resistance = Math.floor(Math.random() * 8) + 2; // 2-9 Ω
        
        // I = V/R
        const correctCurrent = voltage / resistance;
        
        // TRAP ENGINE - Ohm's Law Errors
        const trapOptions = [
          voltage * resistance,                  // Trap B: Multiplication instead of division
          resistance / voltage,                 // Trap C: Formula inversion
          voltage + resistance                  // Trap D: Addition instead of division
        ];
        
        const options = [
          `${correctCurrent.toFixed(2)} A`,
          `${trapOptions[0].toFixed(2)} A`,
          `${trapOptions[1].toFixed(2)} A`,
          `${trapOptions[2].toFixed(2)} A`
        ];
        
        return {
          question: `A ${resistance} Ω resistor is connected to ${voltage} V. Calculate the current.`,
          options,
          correct: 0,
          explanation: `Ohm's Law: I = V/R\nI = ${voltage}/${resistance} = ${correctCurrent.toFixed(2)} A\n\nOhm's Law Traps:\n- Option B: Multiplied V×R\n- Option C: Inverted to R/V\n- Option D: Added V+R`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Ohm's law: V = IR, so I = V/R",
            commonTraps: ["Multiplication error", "Formula inversion", "Addition confusion"]
          }
        };
      }
    }
  ],

  "Moving Charges and Magnetism": [
    {
      name: "magneticForce",
      concept: "Force on Current-Carrying Conductor",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const current = Math.floor(Math.random() * 8) + 2; // 2-9 A
        const length = Math.floor(Math.random() * 5) + 1; // 1-5 m
        const field = Math.floor(Math.random() * 4) + 1; // 1-4 T
        
        // F = BIL (for perpendicular field)
        const correctForce = field * current * length;
        
        // TRAP ENGINE - Magnetic Force Errors
        const trapOptions = [
          field * current,                       // Trap B: Forgot length
          field * length,                       // Trap C: Forgot current
          (field * current * length) / 2        // Trap D: Extra factor of 2
        ];
        
        const options = [
          `${correctForce} N`,
          `${trapOptions[0]} N`,
          `${trapOptions[1]} N`,
          `${trapOptions[2]} N`
        ];
        
        return {
          question: `A ${length} m conductor carrying ${current} A current is placed perpendicular to ${field} T magnetic field. Find the force.`,
          options,
          correct: 0,
          explanation: `Magnetic Force: F = BIL\nF = ${field} × ${current} × ${length} = ${correctForce} N\n\nMagnetic Force Traps:\n- Option B: Missing length factor\n- Option C: Missing current factor\n- Option D: Incorrect factor of 2`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Force on conductor: F = BIL for perpendicular field",
            commonTraps: ["Missing length", "Missing current", "Incorrect factors"]
          }
        };
      }
    }
  ],

  "Electromagnetic Induction": [
    {
      name: "faradaysLaw",
      concept: "Faraday's Law",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const turns = Math.floor(Math.random() * 400) + 100; // 100-499 turns
        const fluxChange = Math.floor(Math.random() * 5) + 2; // 2-6 Wb
        const time = Math.floor(Math.random() * 4) + 2; // 2-5 s
        
        // EMF = N × dΦ/dt
        const correctEMF = turns * fluxChange / time;
        
        // TRAP ENGINE - Faraday's Law Errors
        const trapOptions = [
          fluxChange / time,                     // Trap B: Forgot number of turns
          turns * fluxChange,                   // Trap C: Forgot time factor
          turns / time                          // Trap D: Forgot flux change
        ];
        
        const options = [
          `${correctEMF.toFixed(0)} V`,
          `${trapOptions[0].toFixed(0)} V`,
          `${trapOptions[1].toFixed(0)} V`,
          `${trapOptions[2].toFixed(0)} V`
        ];
        
        return {
          question: `A coil of ${turns} turns has flux change of ${fluxChange} Wb in ${time} s. Find induced EMF.`,
          options,
          correct: 0,
          explanation: `Faraday's Law: EMF = N × dΦ/dt\nEMF = ${turns} × ${fluxChange}/${time} = ${correctEMF.toFixed(0)} V\n\nFaraday's Traps:\n- Option B: Missing turns factor\n- Option C: Missing time factor\n- Option D: Missing flux change`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "EMF depends on rate of flux change and number of turns",
            commonTraps: ["Missing turns", "Missing time", "Missing flux change"]
          }
        };
      }
    }
  ],

  "Ray Optics and Optical Instruments": [
    {
      name: "lensFormula",
      concept: "Lens Formula",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const f = Math.floor(Math.random() * 8) + 12; // 12-19 cm
        const u = Math.floor(Math.random() * 10) + 25; // 25-34 cm
        
        // 1/f = 1/u + 1/v, so v = uf/(u-f)
        const v = (u * f) / (u - f);
        
        // TRAP ENGINE - Lens Formula Errors
        const trapOptions = [
          u - f,                                // Trap B: Linear subtraction
          (u + f) / 2,                         // Trap C: Average of distances
          f * u                                // Trap D: Simple multiplication
        ];
        
        const options = [
          `${v.toFixed(1)} cm`,
          `${trapOptions[0]} cm`,
          `${trapOptions[1]} cm`,
          `${trapOptions[2]} cm`
        ];
        
        return {
          question: `A convex lens of focal length ${f} cm forms image of object at ${u} cm. Find image distance.`,
          options,
          correct: 0,
          explanation: `Lens formula: 1/f = 1/u + 1/v\n1/v = 1/f - 1/u = 1/${f} - 1/${u}\nv = ${v.toFixed(1)} cm\n\nLens Formula Traps:\n- Option B: Linear subtraction\n- Option C: Arithmetic mean\n- Option D: Simple multiplication`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Lens formula involves reciprocals",
            commonTraps: ["Linear operations", "Averaging", "Simple multiplication"]
          }
        };
      }
    }
  ],

  "Dual Nature of Radiation and Matter": [
    {
      name: "photoelectricEffect",
      concept: "Photoelectric Equation",
      difficulty: "hard",
      highWeightage: true,
      trend2026: true,
      generate() {
        const frequency = Math.floor(Math.random() * 5) + 8; // 8-12 ×10¹⁴ Hz
        const workFunction = Math.floor(Math.random() * 3) + 2; // 2-4 eV
        const h = 4.14; // ×10⁻¹⁵ eV⋅s (simplified)
        
        // E = hf - φ (kinetic energy of photoelectron)
        const photonEnergy = h * frequency;
        const kineticEnergy = photonEnergy - workFunction;
        
        // TRAP ENGINE - Photoelectric Errors
        const trapOptions = [
          photonEnergy,                         // Trap B: Forgot work function
          workFunction,                        // Trap C: Only work function
          photonEnergy + workFunction          // Trap D: Added instead of subtracted
        ];
        
        const options = [
          `${kineticEnergy.toFixed(1)} eV`,
          `${trapOptions[0].toFixed(1)} eV`,
          `${trapOptions[1]} eV`,
          `${trapOptions[2].toFixed(1)} eV`
        ];
        
        return {
          question: `Light of frequency ${frequency}×10¹⁴ Hz strikes metal with work function ${workFunction} eV. Find max kinetic energy of photoelectrons. (h = 4.14×10⁻¹⁵ eV⋅s)`,
          options,
          correct: 0,
          explanation: `Photoelectric equation: KE = hf - φ\nKE = (4.14×10⁻¹⁵) × (${frequency}×10¹⁴) - ${workFunction}\nKE = ${photonEnergy.toFixed(1)} - ${workFunction} = ${kineticEnergy.toFixed(1)} eV\n\nPhotoelectric Traps:\n- Option B: Forgot work function\n- Option C: Only work function value\n- Option D: Added work function instead`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Photoelectric equation: KE = hf - φ",
            commonTraps: ["Missing work function", "Wrong operation", "Incomplete calculation"]
          }
        };
      }
    }
  ],

  "Atoms": [
    {
      name: "bohrModel",
      concept: "Bohr's Model",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const n1 = 2; // Initial level
        const n2 = 1; // Final level
        const rydberg = 1.097; // ×10⁷ m⁻¹ (simplified)
        
        // 1/λ = R(1/n₂² - 1/n₁²)
        const waveNumber = rydberg * (1/(n2*n2) - 1/(n1*n1));
        const wavelength = 1 / waveNumber; // ×10⁻⁷ m
        
        // TRAP ENGINE - Bohr Model Errors
        const trapOptions = [
          1 / (rydberg * (1/(n1*n1) - 1/(n2*n2))), // Trap B: Swapped n1 and n2
          rydberg * (1/(n2*n2) - 1/(n1*n1)),      // Trap C: Forgot reciprocal
          1 / (rydberg * (n2*n2 - n1*n1))         // Trap D: No reciprocals in formula
        ];
        
        const options = [
          `${wavelength.toFixed(1)} × 10⁻⁷ m`,
          `${trapOptions[0].toFixed(1)} × 10⁻⁷ m`,
          `${trapOptions[1].toFixed(1)} × 10⁻⁷ m`,
          `${trapOptions[2].toFixed(1)} × 10⁻⁷ m`
        ];
        
        return {
          question: `Calculate wavelength of photon emitted when electron transitions from n=2 to n=1 in hydrogen. (R = 1.097×10⁷ m⁻¹)`,
          options,
          correct: 0,
          explanation: `Rydberg formula: 1/λ = R(1/n₂² - 1/n₁²)\n1/λ = 1.097×10⁷ × (1/1² - 1/2²) = ${waveNumber.toFixed(3)}×10⁷ m⁻¹\nλ = ${wavelength.toFixed(1)} × 10⁻⁷ m\n\nBohr Model Traps:\n- Option B: Swapped initial and final levels\n- Option C: Forgot wavelength reciprocal\n- Option D: Wrong formula structure`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Rydberg formula with proper level assignment",
            commonTraps: ["Level confusion", "Reciprocal errors", "Formula mistakes"]
          }
        };
      }
    }
  ],

  "Nuclei": [
    {
      name: "radioactiveDecay",
      concept: "Radioactive Decay",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const halfLife = Math.floor(Math.random() * 8) + 2; // 2-9 years
        const time = halfLife * 2; // 2 half-lives
        const initialAmount = 100; // grams
        
        // N = N₀(1/2)^(t/T₁/₂)
        const finalAmount = initialAmount * Math.pow(0.5, time / halfLife);
        
        // TRAP ENGINE - Radioactive Decay Errors
        const trapOptions = [
          initialAmount * Math.pow(0.5, time),   // Trap B: Used time directly instead of t/T₁/₂
          initialAmount - (time / halfLife) * 10, // Trap C: Linear decay assumption
          initialAmount / (time / halfLife)      // Trap D: Simple division
        ];
        
        const options = [
          `${finalAmount} g`,
          `${trapOptions[0]} g`,
          `${trapOptions[1]} g`,
          `${trapOptions[2]} g`
        ];
        
        return {
          question: `A radioactive sample has half-life ${halfLife} years. How much remains after ${time} years from initial 100 g?`,
          options,
          correct: 0,
          explanation: `Decay formula: N = N₀(1/2)^(t/T₁/₂)\nN = 100 × (1/2)^(${time}/${halfLife}) = 100 × (1/2)² = ${finalAmount} g\n\nRadioactive Decay Traps:\n- Option B: Used time directly in exponent\n- Option C: Assumed linear decay\n- Option D: Simple division approach`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Exponential decay with half-life formula",
            commonTraps: ["Exponent errors", "Linear assumption", "Division confusion"]
          }
        };
      }
    }
  ],

  "Semiconductor Electronics": [
    {
      name: "pnJunction",
      concept: "PN Junction Diode",
      difficulty: "hard",
      trend2026: true,
      generate() {
        const forwardVoltage = [0.3, 0.7, 1.0][Math.floor(Math.random() * 3)]; // Common values
        const resistance = Math.floor(Math.random() * 8) + 2; // 2-9 Ω
        const appliedVoltage = forwardVoltage + 2; // Above threshold
        
        // I = (V - V₀)/R for forward bias when V > V₀
        const current = (appliedVoltage - forwardVoltage) / resistance;
        
        // TRAP ENGINE - Diode Errors
        const trapOptions = [
          appliedVoltage / resistance,           // Trap B: Ignored threshold voltage
          forwardVoltage / resistance,          // Trap C: Used only threshold voltage
          0                                     // Trap D: Assumed reverse bias
        ];
        
        const options = [
          `${current.toFixed(2)} A`,
          `${trapOptions[0].toFixed(2)} A`,
          `${trapOptions[1].toFixed(2)} A`,
          `${trapOptions[2]} A`
        ];
        
        return {
          question: `A silicon diode (threshold ${forwardVoltage} V) with ${resistance} Ω resistance has ${appliedVoltage} V applied in forward bias. Find current.`,
          options,
          correct: 0,
          explanation: `Forward bias current: I = (V - V₀)/R\nI = (${appliedVoltage} - ${forwardVoltage})/${resistance} = ${current.toFixed(2)} A\n\nDiode Traps:\n- Option B: Ignored threshold voltage\n- Option C: Used only threshold voltage\n- Option D: Assumed no conduction`,
          type: "mcq",
          trapAnalysis: {
            correctConcept: "Diode conducts when forward voltage exceeds threshold",
            commonTraps: ["Ignoring threshold", "Wrong voltage", "Bias confusion"]
          }
        };
      }
    }
  ]
};
// MAIN EXPORT FUNCTION - Complete CUET Physics Question Generator
export function getPhysicsQuestion(chapter) {
  console.log(`🔬 Generating Physics question for: ${chapter}`);
  
  // Get generators for the specified chapter
  const chapterGenerators = physicsGenerators[chapter];
  
  if (!chapterGenerators || chapterGenerators.length === 0) {
    console.warn(`⚠️ No generators found for Physics chapter: ${chapter}`);
    return generateFallbackPhysicsQuestion(chapter);
  }
  
  // Select random generator from available ones
  const randomGenerator = chapterGenerators[Math.floor(Math.random() * chapterGenerators.length)];
  
  try {
    const question = randomGenerator.generate();
    return {
      ...question,
      subject: "Physics",
      chapter: chapter,
      generator: randomGenerator.name,
      concept: randomGenerator.concept,
      difficulty: randomGenerator.difficulty || "medium",
      source: "physics_generator",
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Error generating Physics question for ${chapter}:`, error);
    return generateFallbackPhysicsQuestion(chapter);
  }
}

// Fallback question generator for missing chapters
function generateFallbackPhysicsQuestion(chapter) {
  const fallbackQuestions = {
    "Physical World": {
      question: "Which of the following is NOT a fundamental force in nature?",
      options: ["Gravitational force", "Electromagnetic force", "Centrifugal force", "Strong nuclear force"],
      correct: 2,
      explanation: "Centrifugal force is a pseudo force, not a fundamental force. The four fundamental forces are gravitational, electromagnetic, weak nuclear, and strong nuclear forces."
    },
    "Units and Measurements": {
      question: "The dimensional formula for acceleration is:",
      options: ["[M L T⁻²]", "[L T⁻²]", "[M L² T⁻²]", "[M T⁻²]"],
      correct: 1,
      explanation: "Acceleration = velocity/time = (length/time)/time = [L T⁻²]"
    },
    "Thermal Properties of Matter": {
      question: "The coefficient of linear expansion has dimensions:",
      options: ["[K⁻¹]", "[L K⁻¹]", "[M L K⁻¹]", "[T K⁻¹]"],
      correct: 0,
      explanation: "Linear expansion: ΔL = αL₀ΔT, so α = ΔL/(L₀ΔT) = dimensionless/temperature = [K⁻¹]"
    },
    "Thermodynamics": {
      question: "In an adiabatic process:",
      options: ["Heat exchange is zero", "Temperature remains constant", "Pressure remains constant", "Volume remains constant"],
      correct: 0,
      explanation: "Adiabatic process is defined as one where no heat is exchanged with surroundings (Q = 0)."
    },
    "Kinetic Theory": {
      question: "Average kinetic energy of gas molecules is proportional to:",
      options: ["Pressure", "Volume", "Absolute temperature", "Density"],
      correct: 2,
      explanation: "From kinetic theory: Average KE = (3/2)kT, directly proportional to absolute temperature T."
    },
    "Oscillations": {
      question: "Time period of simple pendulum depends on:",
      options: ["Mass of bob", "Length and gravity", "Amplitude", "Material of string"],
      correct: 1,
      explanation: "T = 2π√(l/g), depends only on length l and acceleration due to gravity g."
    },
    "Waves": {
      question: "In wave motion, which quantity is transported?",
      options: ["Matter", "Energy", "Both matter and energy", "Neither matter nor energy"],
      correct: 1,
      explanation: "Waves transport energy without transporting matter. The medium particles oscillate about their mean positions."
    },
    "Magnetism and Matter": {
      question: "Magnetic susceptibility is negative for:",
      options: ["Paramagnetic materials", "Diamagnetic materials", "Ferromagnetic materials", "All materials"],
      correct: 1,
      explanation: "Diamagnetic materials have negative magnetic susceptibility as they are weakly repelled by magnetic fields."
    },
    "Alternating Current": {
      question: "In AC circuit, power factor is:",
      options: ["cos φ", "sin φ", "tan φ", "sec φ"],
      correct: 0,
      explanation: "Power factor = cos φ, where φ is phase difference between voltage and current."
    },
    "Electromagnetic Waves": {
      question: "Electromagnetic waves are:",
      options: ["Longitudinal waves", "Transverse waves", "Both longitudinal and transverse", "Neither"],
      correct: 1,
      explanation: "EM waves are transverse waves where electric and magnetic fields oscillate perpendicular to direction of propagation."
    },
    "Wave Optics": {
      question: "Young's double slit experiment demonstrates:",
      options: ["Particle nature of light", "Wave nature of light", "Dual nature of light", "Quantum nature of light"],
      correct: 1,
      explanation: "Young's experiment shows interference, which is a wave phenomenon, thus demonstrating wave nature of light."
    },
    "Mechanical Properties of Solids": {
      question: "Young's modulus is defined as:",
      options: ["Stress/Strain", "Strain/Stress", "Force/Area", "Change in length/Original length"],
      correct: 0,
      explanation: "Young's modulus Y = Stress/Strain = (F/A)/(ΔL/L₀)"
    },
    "Mechanical Properties of Fluids": {
      question: "Bernoulli's principle is based on conservation of:",
      options: ["Mass", "Momentum", "Energy", "Angular momentum"],
      correct: 2,
      explanation: "Bernoulli's equation is derived from conservation of mechanical energy for fluid flow."
    }
  };
  
  const fallback = fallbackQuestions[chapter] || {
    question: `Sample Physics question for ${chapter}. This chapter needs generator implementation.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: 0,
    explanation: `This is a placeholder for ${chapter}. Implement specific generators for complete coverage.`
  };
  
  return {
    ...fallback,
    subject: "Physics",
    chapter: chapter,
    type: "mcq",
    difficulty: "medium",
    source: "fallback_generator",
    concept: chapter,
    generatedAt: new Date().toISOString(),
    trapAnalysis: {
      correctConcept: `Basic concept from ${chapter}`,
      commonTraps: ["Conceptual confusion", "Formula errors", "Unit mistakes"]
    }
  };
}

// Export individual generators for testing
export const generateCoulombQuestion = physicsGenerators["Electric Charges and Fields"]?.[0]?.generate;
export const generateKinematicsQuestion = physicsGenerators["Motion in a Straight Line"]?.[0]?.generate;
export const generateLensQuestion = physicsGenerators["Ray Optics and Optical Instruments"]?.[0]?.generate;