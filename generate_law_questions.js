import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Law category
const lawQuestions = [
  // Additional Beginner Questions (need 8 more to reach 10)
  {
    question: "What is the purpose of law in society?",
    options: ["To create confusion", "To maintain order and protect rights", "To make money", "To punish people"],
    correctAnswer: "To maintain order and protect rights",
    explanation: "Laws serve to maintain social order, protect individual rights, and provide a framework for resolving disputes in society.",
    difficulty: "beginner",
    topic: "legal-fundamentals",
    relatedConcepts: ["order", "rights", "society"]
  },
  {
    question: "What is the difference between civil and criminal law?",
    options: ["No difference", "Civil law deals with private disputes, criminal law deals with crimes", "Civil law is always more serious", "Criminal law only applies to businesses"],
    correctAnswer: "Civil law deals with private disputes, criminal law deals with crimes",
    explanation: "Civil law handles disputes between individuals or organizations, while criminal law deals with offenses against society as a whole.",
    difficulty: "beginner",
    topic: "legal-systems",
    relatedConcepts: ["civil law", "criminal law", "disputes"]
  },
  {
    question: "What is a contract?",
    options: ["A legal document", "A legally binding agreement between parties", "A court order", "A law"],
    correctAnswer: "A legally binding agreement between parties",
    explanation: "A contract is a legally enforceable agreement between two or more parties that creates obligations for each party.",
    difficulty: "beginner",
    topic: "contracts",
    relatedConcepts: ["agreement", "obligations", "enforcement"]
  },
  {
    question: "What is the role of a judge in court?",
    options: ["To represent clients", "To interpret and apply the law", "To collect evidence", "To make arrests"],
    correctAnswer: "To interpret and apply the law",
    explanation: "A judge's role is to interpret and apply the law, ensure fair proceedings, and make decisions based on legal principles.",
    difficulty: "beginner",
    topic: "court-procedures",
    relatedConcepts: ["interpretation", "fairness", "decision-making"]
  },
  {
    question: "What is the purpose of a jury?",
    options: ["To make arrests", "To represent the defendant", "To determine facts and reach a verdict", "To write laws"],
    correctAnswer: "To determine facts and reach a verdict",
    explanation: "A jury is a group of citizens who hear evidence and determine the facts of a case to reach a verdict.",
    difficulty: "beginner",
    topic: "court-procedures",
    relatedConcepts: ["fact-finding", "verdict", "citizen participation"]
  },
  {
    question: "What is the presumption of innocence?",
    options: ["A legal fiction", "The principle that defendants are innocent until proven guilty", "A type of evidence", "A court procedure"],
    correctAnswer: "The principle that defendants are innocent until proven guilty",
    explanation: "The presumption of innocence is a fundamental legal principle that a person is considered innocent until proven guilty beyond a reasonable doubt.",
    difficulty: "beginner",
    topic: "criminal-law",
    relatedConcepts: ["innocence", "proof", "rights"]
  },
  {
    question: "What is the purpose of legal precedent?",
    options: ["To make laws", "To provide consistency in legal decisions", "To punish criminals", "To collect taxes"],
    correctAnswer: "To provide consistency in legal decisions",
    explanation: "Legal precedent ensures consistency in legal decisions by using previous court rulings as guidance for similar cases.",
    difficulty: "beginner",
    topic: "legal-systems",
    relatedConcepts: ["consistency", "decisions", "guidance"]
  },
  {
    question: "What is the role of a lawyer?",
    options: ["To make laws", "To represent clients and provide legal advice", "To enforce laws", "To judge cases"],
    correctAnswer: "To represent clients and provide legal advice",
    explanation: "Lawyers represent clients in legal matters, provide legal advice, and advocate for their clients' interests within the legal system.",
    difficulty: "beginner",
    topic: "legal-profession",
    relatedConcepts: ["representation", "advice", "advocacy"]
  },

  // Additional Intermediate Questions (need 7 more to reach 10)
  {
    question: "What is the difference between common law and civil law systems?",
    options: ["No difference", "Common law relies on precedent, civil law relies on codes", "Common law is older", "Civil law is always better"],
    correctAnswer: "Common law relies on precedent, civil law relies on codes",
    explanation: "Common law systems rely heavily on judicial precedent, while civil law systems are based on comprehensive legal codes and statutes.",
    difficulty: "intermediate",
    topic: "legal-systems",
    relatedConcepts: ["precedent", "codes", "systems"]
  },
  {
    question: "What is the concept of jurisdiction?",
    options: ["A type of court", "The authority of a court to hear and decide cases", "A legal document", "A type of law"],
    correctAnswer: "The authority of a court to hear and decide cases",
    explanation: "Jurisdiction refers to the legal authority of a court to hear and decide cases based on factors like location, subject matter, or parties involved.",
    difficulty: "intermediate",
    topic: "court-procedures",
    relatedConcepts: ["authority", "hearings", "decisions"]
  },
  {
    question: "What is the purpose of the appeals process?",
    options: ["To delay justice", "To review decisions for legal errors", "To retry cases", "To change laws"],
    correctAnswer: "To review decisions for legal errors",
    explanation: "The appeals process allows higher courts to review lower court decisions for legal errors or procedural mistakes.",
    difficulty: "intermediate",
    topic: "court-procedures",
    relatedConcepts: ["review", "errors", "corrections"]
  },
  {
    question: "What is the difference between misdemeanors and felonies?",
    options: ["No difference", "Misdemeanors are less serious crimes than felonies", "Felonies are always violent", "Misdemeanors don't exist"],
    correctAnswer: "Misdemeanors are less serious crimes than felonies",
    explanation: "Misdemeanors are less serious crimes with lighter penalties, while felonies are more serious crimes with harsher punishments.",
    difficulty: "intermediate",
    topic: "criminal-law",
    relatedConcepts: ["severity", "penalties", "classification"]
  },
  {
    question: "What is the concept of due process?",
    options: ["A court procedure", "Fair treatment under the law", "A type of evidence", "A legal document"],
    correctAnswer: "Fair treatment under the law",
    explanation: "Due process ensures that individuals receive fair treatment under the law, including notice of charges and opportunity to be heard.",
    difficulty: "intermediate",
    topic: "constitutional-law",
    relatedConcepts: ["fairness", "rights", "procedures"]
  },
  {
    question: "What is the role of evidence in legal proceedings?",
    options: ["To confuse juries", "To prove or disprove facts in a case", "To delay trials", "To make lawyers rich"],
    correctAnswer: "To prove or disprove facts in a case",
    explanation: "Evidence is used to prove or disprove facts relevant to a legal case, helping courts reach accurate decisions.",
    difficulty: "intermediate",
    topic: "evidence",
    relatedConcepts: ["proof", "facts", "accuracy"]
  },
  {
    question: "What is the concept of legal standing?",
    options: ["A physical position", "The right to bring a lawsuit", "A type of evidence", "A court procedure"],
    correctAnswer: "The right to bring a lawsuit",
    explanation: "Legal standing refers to a party's right to bring a lawsuit, requiring that they have a sufficient connection to and harm from the action challenged.",
    difficulty: "intermediate",
    topic: "court-procedures",
    relatedConcepts: ["rights", "harm", "connection"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the doctrine of stare decisis?",
    options: ["A type of evidence", "The principle of following precedent", "A court procedure", "A legal document"],
    correctAnswer: "The principle of following precedent",
    explanation: "Stare decisis is the legal principle of following precedent, ensuring consistency and predictability in legal decisions.",
    difficulty: "advanced",
    topic: "legal-systems",
    relatedConcepts: ["precedent", "consistency", "predictability"]
  },
  {
    question: "What is the concept of mens rea in criminal law?",
    options: ["A type of evidence", "The mental state or intent required for a crime", "A court procedure", "A legal defense"],
    correctAnswer: "The mental state or intent required for a crime",
    explanation: "Mens rea refers to the mental state or criminal intent that must be proven to establish criminal liability.",
    difficulty: "advanced",
    topic: "criminal-law",
    relatedConcepts: ["intent", "mental state", "liability"]
  },
  {
    question: "What is the difference between strict liability and negligence?",
    options: ["No difference", "Strict liability doesn't require fault, negligence requires failure to meet standard of care", "Negligence is always criminal", "Strict liability is always civil"],
    correctAnswer: "Strict liability doesn't require fault, negligence requires failure to meet standard of care",
    explanation: "Strict liability holds parties responsible regardless of fault, while negligence requires proof that a party failed to meet the required standard of care.",
    difficulty: "advanced",
    topic: "tort-law",
    relatedConcepts: ["fault", "standard of care", "responsibility"]
  },
  {
    question: "What is the concept of judicial review?",
    options: ["A type of trial", "The power of courts to review and invalidate laws", "A legal document", "A court procedure"],
    correctAnswer: "The power of courts to review and invalidate laws",
    explanation: "Judicial review is the power of courts to examine and potentially invalidate laws or government actions that violate constitutional principles.",
    difficulty: "advanced",
    topic: "constitutional-law",
    relatedConcepts: ["constitutionality", "invalidation", "checks and balances"]
  },
  {
    question: "What is the difference between substantive and procedural law?",
    options: ["No difference", "Substantive law defines rights and duties, procedural law defines processes", "Substantive law is always criminal", "Procedural law is always civil"],
    correctAnswer: "Substantive law defines rights and duties, procedural law defines processes",
    explanation: "Substantive law defines legal rights and duties, while procedural law defines the processes and methods for enforcing those rights.",
    difficulty: "advanced",
    topic: "legal-systems",
    relatedConcepts: ["rights", "duties", "processes"]
  },
  {
    question: "What is the concept of double jeopardy?",
    options: ["A type of crime", "Protection against being tried twice for the same offense", "A legal defense", "A court procedure"],
    correctAnswer: "Protection against being tried twice for the same offense",
    explanation: "Double jeopardy protects individuals from being tried twice for the same criminal offense after an acquittal or conviction.",
    difficulty: "advanced",
    topic: "constitutional-law",
    relatedConcepts: ["protection", "retrial", "rights"]
  },
  {
    question: "What is the role of the exclusionary rule?",
    options: ["To exclude evidence", "To prevent illegally obtained evidence from being used in court", "To exclude witnesses", "To exclude lawyers"],
    correctAnswer: "To prevent illegally obtained evidence from being used in court",
    explanation: "The exclusionary rule prevents evidence obtained through illegal searches or seizures from being used in criminal trials.",
    difficulty: "advanced",
    topic: "criminal-procedure",
    relatedConcepts: ["illegal evidence", "searches", "seizures"]
  },
  {
    question: "What is the concept of vicarious liability?",
    options: ["A type of crime", "Liability for the actions of another person", "A legal defense", "A court procedure"],
    correctAnswer: "Liability for the actions of another person",
    explanation: "Vicarious liability holds one party responsible for the wrongful actions of another, such as an employer for an employee's actions.",
    difficulty: "advanced",
    topic: "tort-law",
    relatedConcepts: ["responsibility", "relationships", "liability"]
  },
  {
    question: "What is the difference between actual and constructive notice?",
    options: ["No difference", "Actual notice is direct knowledge, constructive notice is implied knowledge", "Actual notice is always written", "Constructive notice is always verbal"],
    correctAnswer: "Actual notice is direct knowledge, constructive notice is implied knowledge",
    explanation: "Actual notice involves direct knowledge of a fact, while constructive notice is knowledge that a person should have had based on circumstances.",
    difficulty: "advanced",
    topic: "legal-concepts",
    relatedConcepts: ["knowledge", "implication", "circumstances"]
  },
  {
    question: "What is the concept of equitable remedies?",
    options: ["A type of punishment", "Non-monetary remedies like injunctions or specific performance", "A legal defense", "A court procedure"],
    correctAnswer: "Non-monetary remedies like injunctions or specific performance",
    explanation: "Equitable remedies are non-monetary solutions such as injunctions, specific performance, or rescission, used when monetary damages are inadequate.",
    difficulty: "advanced",
    topic: "remedies",
    relatedConcepts: ["non-monetary", "inadequacy", "solutions"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the purpose of legal ethics?",
    options: ["To make lawyers rich", "To ensure professional conduct and protect clients", "To confuse people", "To delay cases"],
    correctAnswer: "To ensure professional conduct and protect clients",
    explanation: "Legal ethics establish standards of professional conduct for lawyers, ensuring client protection and maintaining public trust in the legal system.",
    difficulty: "adaptive",
    topic: "legal-profession",
    relatedConcepts: ["professional conduct", "client protection", "trust"]
  },
  {
    question: "What is the importance of legal representation?",
    options: ["Not important", "To ensure fair treatment and protect rights", "Only for criminals", "Only for rich people"],
    correctAnswer: "To ensure fair treatment and protect rights",
    explanation: "Legal representation ensures individuals receive fair treatment, understand their rights, and have proper advocacy in legal proceedings.",
    difficulty: "adaptive",
    topic: "legal-rights",
    relatedConcepts: ["fair treatment", "rights", "advocacy"]
  },
  {
    question: "What is the role of alternative dispute resolution?",
    options: ["To replace courts", "To provide faster and less expensive ways to resolve disputes", "To avoid justice", "To make lawyers rich"],
    correctAnswer: "To provide faster and less expensive ways to resolve disputes",
    explanation: "Alternative dispute resolution methods like mediation and arbitration provide faster, less expensive alternatives to traditional court proceedings.",
    difficulty: "adaptive",
    topic: "dispute-resolution",
    relatedConcepts: ["efficiency", "cost-effectiveness", "alternatives"]
  },
  {
    question: "What is the importance of legal precedent?",
    options: ["Not important", "To provide consistency and predictability in legal decisions", "Only for judges", "Only for lawyers"],
    correctAnswer: "To provide consistency and predictability in legal decisions",
    explanation: "Legal precedent ensures consistency in legal decisions, provides predictability for future cases, and maintains stability in the legal system.",
    difficulty: "adaptive",
    topic: "legal-systems",
    relatedConcepts: ["consistency", "predictability", "stability"]
  },
  {
    question: "What is the role of public interest law?",
    options: ["To make money", "To serve the public good and protect vulnerable populations", "To help only rich people", "To avoid justice"],
    correctAnswer: "To serve the public good and protect vulnerable populations",
    explanation: "Public interest law focuses on serving the public good, protecting vulnerable populations, and addressing social justice issues.",
    difficulty: "adaptive",
    topic: "public-interest",
    relatedConcepts: ["public good", "vulnerable populations", "social justice"]
  },
  {
    question: "What is the importance of legal education?",
    options: ["Not important", "To ensure competent legal professionals and informed citizens", "Only for lawyers", "Only for judges"],
    correctAnswer: "To ensure competent legal professionals and informed citizens",
    explanation: "Legal education ensures competent legal professionals and helps create informed citizens who understand their rights and legal system.",
    difficulty: "adaptive",
    topic: "legal-education",
    relatedConcepts: ["competence", "informed citizens", "understanding"]
  },
  {
    question: "What is the role of international law?",
    options: ["To replace national laws", "To govern relations between nations and protect human rights", "To help only powerful countries", "To avoid justice"],
    correctAnswer: "To govern relations between nations and protect human rights",
    explanation: "International law governs relations between nations, establishes global standards, and protects human rights across borders.",
    difficulty: "adaptive",
    topic: "international-law",
    relatedConcepts: ["nations", "global standards", "human rights"]
  },
  {
    question: "What is the importance of legal reform?",
    options: ["Not important", "To adapt laws to changing social needs and improve justice", "To make laws more complex", "To help only lawyers"],
    correctAnswer: "To adapt laws to changing social needs and improve justice",
    explanation: "Legal reform adapts laws to changing social needs, addresses injustices, and improves the effectiveness of the legal system.",
    difficulty: "adaptive",
    topic: "legal-reform",
    relatedConcepts: ["adaptation", "social needs", "improvement"]
  },
  {
    question: "What is the role of legal technology?",
    options: ["To replace lawyers", "To improve efficiency and access to legal services", "To make law more complex", "To help only rich people"],
    correctAnswer: "To improve efficiency and access to legal services",
    explanation: "Legal technology improves efficiency, increases access to legal services, and helps streamline legal processes and procedures.",
    difficulty: "adaptive",
    topic: "legal-technology",
    relatedConcepts: ["efficiency", "access", "streamlining"]
  },
  {
    question: "What is the importance of legal diversity?",
    options: ["Not important", "To ensure the legal system reflects and serves diverse populations", "Only for minorities", "Only for women"],
    correctAnswer: "To ensure the legal system reflects and serves diverse populations",
    explanation: "Legal diversity ensures the legal system reflects and serves diverse populations, promoting fairness and equal access to justice.",
    difficulty: "adaptive",
    topic: "legal-diversity",
    relatedConcepts: ["representation", "fairness", "equal access"]
  }
];

async function generateLawQuestions() {
  try {
    console.log('🎯 GENERATING LAW QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Law category
    const lawCategory = await prisma.category.findUnique({
      where: { name: 'Law' }
    });

    if (!lawCategory) {
      console.log('❌ Law category not found');
      return;
    }

    console.log(`📁 Category: ${lawCategory.name}`);
    console.log(`📝 Adding ${lawQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of lawQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: lawCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: lawCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Law questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Law questions: ${updatedQuestions.length}`);
    console.log('\n✅ Law questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateLawQuestions(); 