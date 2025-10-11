
export type QuizQuestion = {
  id: number;
  question: string;
  imageHint: string;
  imageId: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Where should you dispose of a greasy pizza box?",
    imageId: "quiz-pizza-box",
    imageHint: "greasy pizza box",
    options: ["Recycling Bin", "Compost/Organic Bin", "General Waste"],
    correctAnswer: "General Waste",
    explanation: "The grease and cheese contaminate paper fibers, making them impossible to recycle. The soiled parts should go into general waste. Clean parts of the box can be recycled.",
  },
  {
    id: 2,
    question: "How do you correctly dispose of used alkaline batteries (like AA or AAA)?",
    imageId: "quiz-batteries",
    imageHint: "alkaline batteries",
    options: ["Recycling Bin", "General Waste", "Hazardous Waste Collection"],
    correctAnswer: "Hazardous Waste Collection",
    explanation: "Batteries contain toxic chemicals that can leak and harm the environment. They are considered hazardous waste and must be taken to a special collection point.",
  },
  {
    id: 3,
    question: "What does this plastic recycling symbol with the number '1' (PETE) typically represent?",
    imageId: "quiz-plastic-1",
    imageHint: "plastic recycling symbol 1",
    options: ["Milk jugs and shampoo bottles", "Water and soda bottles", "Yogurt pots and bottle caps"],
    correctAnswer: "Water and soda bottles",
    explanation: "Symbol #1 (PETE) is one of the most commonly recycled plastics and is used for products like single-use water and soft drink bottles.",
  },
  {
    id: 4,
    question: "Can you recycle single-use coffee cups?",
    imageId: "quiz-coffee-cup",
    imageHint: "disposable coffee cup",
    options: ["Yes, in the paper recycling", "No, they go in general waste", "Only if you separate the plastic lining"],
    correctAnswer: "No, they go in general waste",
    explanation: "Most single-use coffee cups have a thin plastic lining to make them waterproof. This lining is very difficult to separate from the paper, making them non-recyclable in most facilities.",
  },
  {
    id: 5,
    question: "Where should you put old clothes and textiles that are no longer wearable?",
    imageId: "quiz-textiles",
    imageHint: "torn clothes pile",
    options: ["General Waste", "Textile Recycling Bin", "Compost Bin"],
    correctAnswer: "Textile Recycling Bin",
    explanation: "Even torn or old textiles can be recycled. They are shredded and used for things like insulation, carpet padding, or cleaning rags. Look for a local textile recycling program.",
  },
];
