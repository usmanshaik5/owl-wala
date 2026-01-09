export interface Reaction {
  id: string;
  reactantA: string;
  reactantB: string;
  equation: string;
  type: "Acid-Base" | "Displacement" | "Redox" | "Synthesis" | "Decomposition" | "No reaction";
  energyChange: "Exothermic" | "Endothermic" | "None";
  observation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const CHEMICALS = [
  "Hydrochloric Acid (HCl)",
  "Sodium Hydroxide (NaOH)",
  "Magnesium (Mg)",
  "Copper Sulfate (CuSO4)",
  "Sodium Bicarbonate (NaHCO3)",
  "Vinegar (Acetic Acid)",
  "Silver Nitrate (AgNO3)",
  "Sodium Chloride (NaCl)",
  "Zinc (Zn)",
  "Water (H2O)",
];

export const REACTIONS: Reaction[] = [
  {
    id: "1",
    reactantA: "Hydrochloric Acid (HCl)",
    reactantB: "Sodium Hydroxide (NaOH)",
    equation: "HCl + NaOH → NaCl + H2O",
    type: "Acid-Base",
    energyChange: "Exothermic",
    observation: "The test tube feels warm. Clear solution remains.",
    difficulty: "Easy",
  },
  {
    id: "2",
    reactantA: "Magnesium (Mg)",
    reactantB: "Hydrochloric Acid (HCl)",
    equation: "Mg + 2HCl → MgCl2 + H2",
    type: "Displacement",
    energyChange: "Exothermic",
    observation: "Vigorous bubbling (effervescence) and the metal dissolves. Pop sound if lit.",
    difficulty: "Easy",
  },
  {
    id: "3",
    reactantA: "Vinegar (Acetic Acid)",
    reactantB: "Sodium Bicarbonate (NaHCO3)",
    equation: "CH3COOH + NaHCO3 → CH3COONa + H2O + CO2",
    type: "Acid-Base",
    energyChange: "Endothermic",
    observation: "Vigorous bubbling and foaming. CO2 gas is released.",
    difficulty: "Easy",
  },
  {
    id: "4",
    reactantA: "Zinc (Zn)",
    reactantB: "Copper Sulfate (CuSO4)",
    equation: "Zn + CuSO4 → ZnSO4 + Cu",
    type: "Displacement",
    energyChange: "Exothermic",
    observation: "The blue solution fades and reddish-brown copper deposit forms on the zinc.",
    difficulty: "Medium",
  },
  {
    id: "5",
    reactantA: "Silver Nitrate (AgNO3)",
    reactantB: "Sodium Chloride (NaCl)",
    equation: "AgNO3 + NaCl → AgCl + NaNO3",
    type: "Displacement",
    energyChange: "None",
    observation: "A white cloudy precipitate (Silver Chloride) forms immediately.",
    difficulty: "Medium",
  },
  {
    id: "6",
    reactantA: "Magnesium (Mg)",
    reactantB: "Water (H2O)",
    equation: "Mg + 2H2O → Mg(OH)2 + H2",
    type: "Displacement",
    energyChange: "Exothermic",
    observation: "Very slow bubbling at room temperature. Faster in hot water.",
    difficulty: "Hard",
  },
  {
    id: "7",
    reactantA: "Sodium Chloride (NaCl)",
    reactantB: "Water (H2O)",
    equation: "NaCl + H2O → NaCl(aq)",
    type: "No reaction",
    energyChange: "None",
    observation: "The salt simply dissolves. No chemical change occurs.",
    difficulty: "Easy",
  },
];
