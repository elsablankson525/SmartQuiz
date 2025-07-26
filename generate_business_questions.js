import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Business category
const businessQuestions = [
  // Additional Beginner Questions (need 8 more to reach 10)
  {
    question: "What is a business plan?",
    options: ["A financial document", "A comprehensive document outlining business goals and strategies", "A marketing strategy", "A legal document"],
    correctAnswer: "A comprehensive document outlining business goals and strategies",
    explanation: "A business plan is a formal document that outlines a company's goals, strategies, market analysis, and financial projections.",
    difficulty: "beginner",
    topic: "business-planning",
    relatedConcepts: ["strategy", "planning", "goals"]
  },
  {
    question: "What is the primary goal of marketing?",
    options: ["To spend money", "To create awareness and drive sales", "To hire employees", "To reduce costs"],
    correctAnswer: "To create awareness and drive sales",
    explanation: "Marketing aims to create awareness of products/services and drive sales by connecting with target customers.",
    difficulty: "beginner",
    topic: "marketing",
    relatedConcepts: ["awareness", "sales", "customers"]
  },
  {
    question: "What is a startup?",
    options: ["A large corporation", "A newly established business", "A government agency", "A non-profit organization"],
    correctAnswer: "A newly established business",
    explanation: "A startup is a newly established business, typically characterized by innovation and rapid growth potential.",
    difficulty: "beginner",
    topic: "startups",
    relatedConcepts: ["new business", "innovation", "growth"]
  },
  {
    question: "What is customer service?",
    options: ["Selling products", "Providing support and assistance to customers", "Managing finances", "Hiring employees"],
    correctAnswer: "Providing support and assistance to customers",
    explanation: "Customer service involves providing support, assistance, and solutions to customers before, during, and after purchases.",
    difficulty: "beginner",
    topic: "customer-service",
    relatedConcepts: ["support", "assistance", "satisfaction"]
  },
  {
    question: "What is a target market?",
    options: ["All customers", "A specific group of customers a business aims to serve", "Competitors", "Suppliers"],
    correctAnswer: "A specific group of customers a business aims to serve",
    explanation: "A target market is a specific group of consumers that a business identifies as the most likely to purchase its products or services.",
    difficulty: "beginner",
    topic: "marketing",
    relatedConcepts: ["customers", "segmentation", "focus"]
  },
  {
    question: "What is cash flow?",
    options: ["Total revenue", "The movement of money in and out of a business", "Profit", "Expenses"],
    correctAnswer: "The movement of money in and out of a business",
    explanation: "Cash flow refers to the net movement of cash and cash equivalents coming into and going out of a business.",
    difficulty: "beginner",
    topic: "finance",
    relatedConcepts: ["money", "movement", "liquidity"]
  },
  {
    question: "What is a competitive advantage?",
    options: ["Having more money than competitors", "A unique benefit that sets a business apart from competitors", "Lower prices", "More employees"],
    correctAnswer: "A unique benefit that sets a business apart from competitors",
    explanation: "A competitive advantage is a unique benefit or feature that allows a business to outperform its competitors.",
    difficulty: "beginner",
    topic: "strategy",
    relatedConcepts: ["uniqueness", "advantage", "differentiation"]
  },
  {
    question: "What is branding?",
    options: ["Creating a logo", "The process of creating a unique identity for a product or company", "Advertising", "Selling products"],
    correctAnswer: "The process of creating a unique identity for a product or company",
    explanation: "Branding is the process of creating a unique identity, image, and reputation for a product, service, or company.",
    difficulty: "beginner",
    topic: "branding",
    relatedConcepts: ["identity", "image", "reputation"]
  },

  // Additional Intermediate Questions (need 7 more to reach 10)
  {
    question: "What is market segmentation?",
    options: ["Dividing a market into smaller groups", "Selling to everyone", "Competing with others", "Setting prices"],
    correctAnswer: "Dividing a market into smaller groups",
    explanation: "Market segmentation is the process of dividing a broad market into smaller, more manageable groups of consumers with similar needs or characteristics.",
    difficulty: "intermediate",
    topic: "marketing",
    relatedConcepts: ["segmentation", "targeting", "customers"]
  },
  {
    question: "What is the break-even point?",
    options: ["When a business makes profit", "When total revenue equals total costs", "When sales are highest", "When costs are lowest"],
    correctAnswer: "When total revenue equals total costs",
    explanation: "The break-even point is the level of sales at which total revenue equals total costs, resulting in neither profit nor loss.",
    difficulty: "intermediate",
    topic: "finance",
    relatedConcepts: ["revenue", "costs", "profitability"]
  },
  {
    question: "What is a value proposition?",
    options: ["A price tag", "A statement explaining why customers should choose your product", "A marketing budget", "A sales target"],
    correctAnswer: "A statement explaining why customers should choose your product",
    explanation: "A value proposition is a clear statement that explains how a product solves customers' problems, delivers specific benefits, and tells why it's better than alternatives.",
    difficulty: "intermediate",
    topic: "marketing",
    relatedConcepts: ["value", "benefits", "differentiation"]
  },
  {
    question: "What is the difference between fixed and variable costs?",
    options: ["Fixed costs change with production, variable costs don't", "Fixed costs remain constant, variable costs change with production", "There is no difference", "Fixed costs are always higher"],
    correctAnswer: "Fixed costs remain constant, variable costs change with production",
    explanation: "Fixed costs remain constant regardless of production levels, while variable costs change directly with the level of production or sales.",
    difficulty: "intermediate",
    topic: "finance",
    relatedConcepts: ["costs", "production", "analysis"]
  },
  {
    question: "What is a business model?",
    options: ["A financial plan", "A description of how a business creates, delivers, and captures value", "A marketing strategy", "An organizational chart"],
    correctAnswer: "A description of how a business creates, delivers, and captures value",
    explanation: "A business model describes how an organization creates, delivers, and captures value for its customers and stakeholders.",
    difficulty: "intermediate",
    topic: "strategy",
    relatedConcepts: ["value creation", "delivery", "capture"]
  },
  {
    question: "What is the purpose of a SWOT analysis?",
    options: ["To calculate profits", "To evaluate strengths, weaknesses, opportunities, and threats", "To set prices", "To hire employees"],
    correctAnswer: "To evaluate strengths, weaknesses, opportunities, and threats",
    explanation: "SWOT analysis is a strategic planning tool used to evaluate a business's internal strengths and weaknesses, and external opportunities and threats.",
    difficulty: "intermediate",
    topic: "strategy",
    relatedConcepts: ["analysis", "planning", "evaluation"]
  },
  {
    question: "What is customer lifetime value (CLV)?",
    options: ["The price of a product", "The total value a customer brings to a business over their relationship", "Monthly revenue", "Annual profit"],
    correctAnswer: "The total value a customer brings to a business over their relationship",
    explanation: "Customer lifetime value is the total worth of a customer to a business over the entire duration of their relationship.",
    difficulty: "intermediate",
    topic: "marketing",
    relatedConcepts: ["customer value", "relationship", "long-term"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the Blue Ocean Strategy?",
    options: ["A pricing strategy", "Creating uncontested market space by making competition irrelevant", "A marketing campaign", "A cost-cutting approach"],
    correctAnswer: "Creating uncontested market space by making competition irrelevant",
    explanation: "Blue Ocean Strategy involves creating new market space where competition is irrelevant, rather than competing in existing markets.",
    difficulty: "advanced",
    topic: "strategy",
    relatedConcepts: ["innovation", "market creation", "differentiation"]
  },
  {
    question: "What is the difference between gross profit and net profit?",
    options: ["No difference", "Gross profit is revenue minus cost of goods sold, net profit includes all expenses", "Net profit is always higher", "Gross profit includes taxes"],
    correctAnswer: "Gross profit is revenue minus cost of goods sold, net profit includes all expenses",
    explanation: "Gross profit is revenue minus cost of goods sold, while net profit includes all operating expenses, taxes, and other costs.",
    difficulty: "advanced",
    topic: "finance",
    relatedConcepts: ["profit", "expenses", "analysis"]
  },
  {
    question: "What is the concept of economies of scale?",
    options: ["Reducing prices", "Cost advantages from increased production levels", "Hiring more employees", "Expanding markets"],
    correctAnswer: "Cost advantages from increased production levels",
    explanation: "Economies of scale occur when increasing production leads to lower average costs per unit due to spreading fixed costs over more units.",
    difficulty: "advanced",
    topic: "economics",
    relatedConcepts: ["cost efficiency", "production", "scale"]
  },
  {
    question: "What is the difference between B2B and B2C marketing?",
    options: ["No difference", "B2B targets businesses, B2C targets individual consumers", "B2C is always more expensive", "B2B is always online"],
    correctAnswer: "B2B targets businesses, B2C targets individual consumers",
    explanation: "B2B (Business-to-Business) marketing targets other businesses, while B2C (Business-to-Consumer) marketing targets individual consumers.",
    difficulty: "advanced",
    topic: "marketing",
    relatedConcepts: ["target markets", "segmentation", "strategy"]
  },
  {
    question: "What is the concept of market saturation?",
    options: ["High competition", "A market where most potential customers already own the product", "Low prices", "High demand"],
    correctAnswer: "A market where most potential customers already own the product",
    explanation: "Market saturation occurs when a product has reached most of its potential customers, making further growth difficult.",
    difficulty: "advanced",
    topic: "marketing",
    relatedConcepts: ["market maturity", "growth limits", "penetration"]
  },
  {
    question: "What is the purpose of a balance sheet?",
    options: ["To show profits", "To show assets, liabilities, and equity at a specific point in time", "To track sales", "To calculate taxes"],
    correctAnswer: "To show assets, liabilities, and equity at a specific point in time",
    explanation: "A balance sheet shows a company's assets, liabilities, and shareholders' equity at a specific point in time.",
    difficulty: "advanced",
    topic: "finance",
    relatedConcepts: ["financial statements", "assets", "liabilities"]
  },
  {
    question: "What is the concept of opportunity cost?",
    options: ["The cost of opportunities", "The value of the next best alternative foregone", "The cost of doing business", "The price of products"],
    correctAnswer: "The value of the next best alternative foregone",
    explanation: "Opportunity cost is the value of the next best alternative that is given up when making a choice.",
    difficulty: "advanced",
    topic: "economics",
    relatedConcepts: ["decision making", "trade-offs", "value"]
  },
  {
    question: "What is the difference between a merger and an acquisition?",
    options: ["No difference", "Merger combines companies equally, acquisition involves one company buying another", "Merger is always hostile", "Acquisition is always friendly"],
    correctAnswer: "Merger combines companies equally, acquisition involves one company buying another",
    explanation: "A merger combines two companies as equals, while an acquisition involves one company purchasing and taking control of another.",
    difficulty: "advanced",
    topic: "corporate-finance",
    relatedConcepts: ["consolidation", "control", "ownership"]
  },
  {
    question: "What is the concept of disruptive innovation?",
    options: ["Breaking things", "Innovation that creates new markets and disrupts existing ones", "Cost reduction", "Marketing strategy"],
    correctAnswer: "Innovation that creates new markets and disrupts existing ones",
    explanation: "Disruptive innovation creates new markets and value networks, eventually disrupting existing markets and displacing established market leaders.",
    difficulty: "advanced",
    topic: "innovation",
    relatedConcepts: ["market disruption", "innovation", "change"]
  },
  {
    question: "What is the purpose of a cash flow statement?",
    options: ["To show profits", "To track the movement of cash in and out of a business", "To calculate taxes", "To show assets"],
    correctAnswer: "To track the movement of cash in and out of a business",
    explanation: "A cash flow statement shows how cash moves in and out of a business over a specific period, including operating, investing, and financing activities.",
    difficulty: "advanced",
    topic: "finance",
    relatedConcepts: ["cash management", "liquidity", "financial health"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the primary goal of a business?",
    options: ["To make money", "To create value for stakeholders", "To hire employees", "To pay taxes"],
    correctAnswer: "To create value for stakeholders",
    explanation: "The primary goal of a business is to create value for its stakeholders, including customers, employees, shareholders, and society.",
    difficulty: "adaptive",
    topic: "business-fundamentals",
    relatedConcepts: ["value creation", "stakeholders", "purpose"]
  },
  {
    question: "What is the role of management in a business?",
    options: ["To make all decisions", "To plan, organize, lead, and control resources", "To only supervise employees", "To handle finances"],
    correctAnswer: "To plan, organize, lead, and control resources",
    explanation: "Management involves planning, organizing, leading, and controlling resources to achieve organizational goals efficiently and effectively.",
    difficulty: "adaptive",
    topic: "management",
    relatedConcepts: ["leadership", "organization", "control"]
  },
  {
    question: "What is the importance of customer feedback?",
    options: ["It's not important", "It helps improve products and services", "It only matters for complaints", "It's only for marketing"],
    correctAnswer: "It helps improve products and services",
    explanation: "Customer feedback is crucial for understanding customer needs, improving products and services, and maintaining customer satisfaction.",
    difficulty: "adaptive",
    topic: "customer-service",
    relatedConcepts: ["feedback", "improvement", "satisfaction"]
  },
  {
    question: "What is the concept of supply and demand?",
    options: ["A business strategy", "The relationship between product availability and consumer desire", "A pricing method", "A marketing technique"],
    correctAnswer: "The relationship between product availability and consumer desire",
    explanation: "Supply and demand describes the relationship between the availability of a product and consumers' desire for it, which affects pricing.",
    difficulty: "adaptive",
    topic: "economics",
    relatedConcepts: ["market forces", "pricing", "equilibrium"]
  },
  {
    question: "What is the purpose of advertising?",
    options: ["To spend money", "To inform, persuade, and remind customers about products", "To compete with others", "To reduce costs"],
    correctAnswer: "To inform, persuade, and remind customers about products",
    explanation: "Advertising serves to inform customers about products, persuade them to purchase, and remind them of the brand.",
    difficulty: "adaptive",
    topic: "marketing",
    relatedConcepts: ["communication", "persuasion", "awareness"]
  },
  {
    question: "What is the difference between revenue and income?",
    options: ["No difference", "Revenue is total sales, income is profit after expenses", "Income is always higher", "Revenue includes taxes"],
    correctAnswer: "Revenue is total sales, income is profit after expenses",
    explanation: "Revenue is the total amount of money earned from sales, while income (or profit) is what remains after deducting all expenses.",
    difficulty: "adaptive",
    topic: "finance",
    relatedConcepts: ["revenue", "profit", "expenses"]
  },
  {
    question: "What is the role of innovation in business?",
    options: ["It's not important", "It drives growth and competitive advantage", "It only matters for technology", "It's only for large companies"],
    correctAnswer: "It drives growth and competitive advantage",
    explanation: "Innovation is crucial for business growth, maintaining competitive advantage, and adapting to changing market conditions.",
    difficulty: "adaptive",
    topic: "innovation",
    relatedConcepts: ["growth", "competition", "adaptation"]
  },
  {
    question: "What is the importance of ethical business practices?",
    options: ["It's not important", "It builds trust and long-term success", "It only matters for large companies", "It's only about following laws"],
    correctAnswer: "It builds trust and long-term success",
    explanation: "Ethical business practices build trust with stakeholders, enhance reputation, and contribute to long-term business success.",
    difficulty: "adaptive",
    topic: "ethics",
    relatedConcepts: ["trust", "reputation", "sustainability"]
  },
  {
    question: "What is the concept of market research?",
    options: ["A type of advertising", "Systematic gathering and analysis of market information", "A sales technique", "A financial analysis"],
    correctAnswer: "Systematic gathering and analysis of market information",
    explanation: "Market research involves systematically gathering and analyzing information about markets, customers, and competitors to make informed business decisions.",
    difficulty: "adaptive",
    topic: "marketing",
    relatedConcepts: ["research", "analysis", "decision-making"]
  },
  {
    question: "What is the purpose of strategic planning?",
    options: ["To set daily goals", "To define long-term direction and allocate resources", "To manage employees", "To track finances"],
    correctAnswer: "To define long-term direction and allocate resources",
    explanation: "Strategic planning defines an organization's long-term direction and allocates resources to achieve its goals effectively.",
    difficulty: "adaptive",
    topic: "strategy",
    relatedConcepts: ["planning", "direction", "resource allocation"]
  }
];

async function generateBusinessQuestions() {
  try {
    console.log('🎯 GENERATING BUSINESS QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Business category
    const businessCategory = await prisma.category.findUnique({
      where: { name: 'Business' }
    });

    if (!businessCategory) {
      console.log('❌ Business category not found');
      return;
    }

    console.log(`📁 Category: ${businessCategory.name}`);
    console.log(`📝 Adding ${businessQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of businessQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: businessCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: businessCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Business questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Business questions: ${updatedQuestions.length}`);
    console.log('\n✅ Business questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateBusinessQuestions(); 