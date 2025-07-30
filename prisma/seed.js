"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding started');
        // Categories
        yield prisma.category.createMany({
            data: [
                { name: 'Computer Science', description: 'Programming, algorithms, data structures, and software engineering', icon: '💻', color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500', questionCount: 45 },
                { name: 'Health & Medicine', description: 'Medical knowledge, anatomy, pharmacology, and healthcare practices', icon: '🏥', color: 'bg-green-100 text-green-700', iconColor: 'text-green-500', questionCount: 38 },
                { name: 'Business & Management', description: 'Business strategy, management, finance, and entrepreneurship', icon: '💼', color: 'bg-purple-100 text-purple-700', iconColor: 'text-purple-500', questionCount: 52 },
                { name: 'Law & Legal Studies', description: 'Legal principles, constitutional law, contracts, and jurisprudence', icon: '⚖️', color: 'bg-amber-100 text-amber-700', iconColor: 'text-amber-500', questionCount: 29 },
                { name: 'Psychology', description: 'Human behavior, cognitive science, and psychological theories', icon: '🧠', color: 'bg-pink-100 text-pink-700', iconColor: 'text-pink-500', questionCount: 34 },
                { name: 'Mathematics', description: 'Algebra, calculus, statistics, and mathematical reasoning', icon: '📊', color: 'bg-indigo-100 text-indigo-700', iconColor: 'text-indigo-500', questionCount: 41 },
            ]
        });
        // Subjects
        yield prisma.subject.createMany({
            data: [
                { name: 'JavaScript', icon: '💻', description: 'JavaScript programming language', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['ES6', 'DOM', 'Async'], quizzes: 10, learners: 1000, avgTime: '15 min', difficulty: 'Intermediate', rating: 4.8 },
                { name: 'Python', icon: '🐍', description: 'Python programming language', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['OOP', 'Data Structures'], quizzes: 8, learners: 900, avgTime: '18 min', difficulty: 'Beginner', rating: 4.7 },
            ]
        });
        // Learning Paths
        const learningPaths = yield prisma.learningPath.createMany({
            data: [
                { title: 'Web Development Fundamentals', description: 'Master the basics of web development with HTML, CSS, and JavaScript', category: 'Computer Science', difficulty: 'Beginner', duration: '6 weeks', modules: 12, enrolled: 3420, rating: 4.8, progress: 0, color: 'bg-blue-100 text-blue-700', icon: '💻', skills: ['HTML', 'CSS', 'JavaScript'], instructor: 'EduQuest AI', isPopular: true },
                { title: 'Introduction to Data Science', description: 'Learn data analysis, visualization, and machine learning basics', category: 'Computer Science', difficulty: 'Intermediate', duration: '8 weeks', modules: 16, enrolled: 2890, rating: 4.9, progress: 25, color: 'bg-purple-100 text-purple-700', icon: '📊', skills: ['Python', 'Pandas', 'Matplotlib'], instructor: 'EduQuest AI', isPopular: true },
            ]
        });
        // Fetch created learning paths to get their IDs
        const webDevPath = yield prisma.learningPath.findFirst({ where: { title: 'Web Development Fundamentals' } });
        const dataSciencePath = yield prisma.learningPath.findFirst({ where: { title: 'Introduction to Data Science' } });
        // Milestones for Web Development Fundamentals
        if (webDevPath) {
            yield prisma.milestone.createMany({
                data: [
                    {
                        title: 'HTML Fundamentals',
                        description: 'Learn HTML structure, elements, and semantic markup',
                        requiredScore: 80,
                        quizTopics: ['html', 'markup'],
                        resources: ['html-mdn-guide'],
                        learningPathId: webDevPath.id,
                    },
                    {
                        title: 'CSS Styling',
                        description: 'Master CSS selectors, properties, and layout techniques',
                        requiredScore: 75,
                        quizTopics: ['css', 'styling'],
                        resources: ['css-complete-guide'],
                        learningPathId: webDevPath.id,
                    },
                    {
                        title: 'JavaScript Programming',
                        description: 'Learn JavaScript fundamentals and DOM manipulation',
                        requiredScore: 70,
                        quizTopics: ['javascript', 'programming'],
                        resources: ['cs-javascript-mdn'],
                        learningPathId: webDevPath.id,
                    },
                ]
            });
        }
        // Milestones for Introduction to Data Science (example milestones)
        if (dataSciencePath) {
            yield prisma.milestone.createMany({
                data: [
                    {
                        title: 'Python Basics',
                        description: 'Learn Python syntax and basic programming concepts',
                        requiredScore: 80,
                        quizTopics: ['python', 'basics'],
                        resources: ['python-official-tutorial'],
                        learningPathId: dataSciencePath.id,
                    },
                    {
                        title: 'Data Analysis',
                        description: 'Introduction to data analysis with Pandas',
                        requiredScore: 75,
                        quizTopics: ['pandas', 'data-analysis'],
                        resources: ['pandas-docs'],
                        learningPathId: dataSciencePath.id,
                    },
                ]
            });
        }
        // Learning Resources - Comprehensive coverage for all 11 subjects
        yield prisma.learningResource.createMany({
            data: [
                // Computer Science Resources
                { title: 'JavaScript Complete Guide', type: 'tutorial', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', difficulty: 'beginner', category: 'Computer Science', topic: 'javascript', description: 'Comprehensive JavaScript tutorial covering all fundamentals', readTime: '6 hours', provider: 'MDN Web Docs', rating: 4.8, tags: ['javascript', 'web-development'], language: 'English', isFree: true, certification: false },
                { title: 'Eloquent JavaScript', type: 'book', url: 'https://eloquentjavascript.net/', difficulty: 'intermediate', category: 'Computer Science', topic: 'javascript', description: 'A modern introduction to programming with JavaScript', readTime: '20 hours', provider: 'Marijn Haverbeke', rating: 4.7, tags: ['javascript', 'programming', 'book'], language: 'English', isFree: true, certification: false },
                { title: 'Python Official Tutorial', type: 'tutorial', url: 'https://docs.python.org/3/tutorial/', difficulty: 'beginner', category: 'Computer Science', topic: 'python', description: 'Official Python tutorial for beginners', readTime: '8 hours', provider: 'Python Software Foundation', rating: 4.9, tags: ['python', 'programming'], language: 'English', isFree: true, certification: false },
                { title: 'Data Structures and Algorithms', type: 'course', url: 'https://www.coursera.org/learn/data-structures', difficulty: 'intermediate', category: 'Computer Science', topic: 'algorithms', description: 'Comprehensive course on data structures and algorithms', readTime: '40 hours', provider: 'Coursera', rating: 4.6, tags: ['algorithms', 'data-structures'], language: 'English', isFree: false, certification: true },
                
                // Health & Medicine Resources
                { title: 'Anatomy and Physiology', type: 'course', url: 'https://www.khanacademy.org/science/health-and-medicine', difficulty: 'beginner', category: 'Health & Medicine', topic: 'anatomy', description: 'Comprehensive anatomy and physiology course', readTime: '30 hours', provider: 'Khan Academy', rating: 4.7, tags: ['anatomy', 'physiology', 'medicine'], language: 'English', isFree: true, certification: false },
                { title: 'Medical Terminology Guide', type: 'tutorial', url: 'https://www.medlineplus.gov/medwords/', difficulty: 'beginner', category: 'Health & Medicine', topic: 'medical-terminology', description: 'Essential medical terminology for healthcare professionals', readTime: '4 hours', provider: 'MedlinePlus', rating: 4.5, tags: ['medical-terminology', 'healthcare'], language: 'English', isFree: true, certification: false },
                { title: 'Pharmacology Basics', type: 'course', url: 'https://www.edx.org/learn/pharmacology', difficulty: 'intermediate', category: 'Health & Medicine', topic: 'pharmacology', description: 'Introduction to pharmacology and drug interactions', readTime: '25 hours', provider: 'edX', rating: 4.4, tags: ['pharmacology', 'drugs', 'medicine'], language: 'English', isFree: false, certification: true },
                
                // Business & Management Resources
                { title: 'Business Strategy Fundamentals', type: 'course', url: 'https://www.coursera.org/learn/business-strategy', difficulty: 'beginner', category: 'Business', topic: 'strategy', description: 'Core concepts of business strategy and competitive advantage', readTime: '20 hours', provider: 'Coursera', rating: 4.6, tags: ['business-strategy', 'management'], language: 'English', isFree: false, certification: true },
                { title: 'Financial Management', type: 'tutorial', url: 'https://www.investopedia.com/financial-management/', difficulty: 'intermediate', category: 'Business', topic: 'finance', description: 'Comprehensive guide to financial management principles', readTime: '15 hours', provider: 'Investopedia', rating: 4.5, tags: ['finance', 'management', 'business'], language: 'English', isFree: true, certification: false },
                { title: 'Entrepreneurship Guide', type: 'book', url: 'https://www.amazon.com/Lean-Startup-Eric-Ries/dp/0307887898', difficulty: 'intermediate', category: 'Business', topic: 'entrepreneurship', description: 'The Lean Startup methodology for entrepreneurs', readTime: '12 hours', provider: 'Eric Ries', rating: 4.8, tags: ['entrepreneurship', 'startup', 'business'], language: 'English', isFree: false, certification: false },
                
                // Law & Legal Studies Resources
                { title: 'Constitutional Law Basics', type: 'course', url: 'https://www.edx.org/learn/constitutional-law', difficulty: 'intermediate', category: 'Law', topic: 'constitutional-law', description: 'Fundamental principles of constitutional law', readTime: '25 hours', provider: 'edX', rating: 4.4, tags: ['constitutional-law', 'legal-studies'], language: 'English', isFree: false, certification: true },
                { title: 'Contract Law Essentials', type: 'tutorial', url: 'https://www.law.cornell.edu/wex/contract', difficulty: 'intermediate', category: 'Law', topic: 'contract-law', description: 'Essential concepts of contract law and formation', readTime: '10 hours', provider: 'Cornell Law School', rating: 4.6, tags: ['contract-law', 'legal-studies'], language: 'English', isFree: true, certification: false },
                { title: 'Criminal Law Overview', type: 'course', url: 'https://www.coursera.org/learn/criminal-law', difficulty: 'intermediate', category: 'Law', topic: 'criminal-law', description: 'Comprehensive overview of criminal law principles', readTime: '30 hours', provider: 'Coursera', rating: 4.5, tags: ['criminal-law', 'legal-studies'], language: 'English', isFree: false, certification: true },
                
                // Psychology Resources
                { title: 'Introduction to Psychology', type: 'course', url: 'https://www.coursera.org/learn/introduction-psychology', difficulty: 'beginner', category: 'Psychology', topic: 'psychology-basics', description: 'Comprehensive introduction to psychological principles', readTime: '35 hours', provider: 'Coursera', rating: 4.7, tags: ['psychology', 'behavior', 'cognition'], language: 'English', isFree: false, certification: true },
                { title: 'Cognitive Psychology', type: 'tutorial', url: 'https://www.simplypsychology.org/cognitive.html', difficulty: 'intermediate', category: 'Psychology', topic: 'cognitive-psychology', description: 'Understanding cognitive processes and mental functions', readTime: '8 hours', provider: 'Simply Psychology', rating: 4.4, tags: ['cognitive-psychology', 'mental-processes'], language: 'English', isFree: true, certification: false },
                { title: 'Behavioral Psychology', type: 'course', url: 'https://www.edx.org/learn/behavioral-psychology', difficulty: 'intermediate', category: 'Psychology', topic: 'behavioral-psychology', description: 'Study of behavior and learning principles', readTime: '20 hours', provider: 'edX', rating: 4.5, tags: ['behavioral-psychology', 'learning'], language: 'English', isFree: false, certification: true },
                
                // Mathematics Resources
                { title: 'Calculus Fundamentals', type: 'course', url: 'https://www.khanacademy.org/math/calculus-1', difficulty: 'intermediate', category: 'Mathematics', topic: 'calculus', description: 'Comprehensive calculus course from basics to advanced', readTime: '40 hours', provider: 'Khan Academy', rating: 4.8, tags: ['calculus', 'mathematics'], language: 'English', isFree: true, certification: false },
                { title: 'Linear Algebra', type: 'tutorial', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', difficulty: 'intermediate', category: 'Mathematics', topic: 'linear-algebra', description: 'Visual introduction to linear algebra concepts', readTime: '15 hours', provider: '3Blue1Brown', rating: 4.9, tags: ['linear-algebra', 'mathematics'], language: 'English', isFree: true, certification: false },
                { title: 'Statistics and Probability', type: 'course', url: 'https://www.coursera.org/learn/probability-statistics', difficulty: 'intermediate', category: 'Mathematics', topic: 'statistics', description: 'Comprehensive statistics and probability course', readTime: '25 hours', provider: 'Coursera', rating: 4.6, tags: ['statistics', 'probability', 'mathematics'], language: 'English', isFree: false, certification: true },
                
                // Engineering Resources
                { title: 'Mechanical Engineering Basics', type: 'course', url: 'https://www.edx.org/learn/mechanical-engineering', difficulty: 'intermediate', category: 'Engineering', topic: 'mechanical-engineering', description: 'Fundamental principles of mechanical engineering', readTime: '30 hours', provider: 'edX', rating: 4.5, tags: ['mechanical-engineering', 'engineering'], language: 'English', isFree: false, certification: true },
                { title: 'Electrical Engineering', type: 'tutorial', url: 'https://www.allaboutcircuits.com/textbook/', difficulty: 'intermediate', category: 'Engineering', topic: 'electrical-engineering', description: 'Comprehensive electrical engineering textbook', readTime: '50 hours', provider: 'All About Circuits', rating: 4.7, tags: ['electrical-engineering', 'circuits'], language: 'English', isFree: true, certification: false },
                { title: 'Civil Engineering Principles', type: 'course', url: 'https://www.coursera.org/learn/civil-engineering', difficulty: 'intermediate', category: 'Engineering', topic: 'civil-engineering', description: 'Core principles of civil engineering and infrastructure', readTime: '35 hours', provider: 'Coursera', rating: 4.4, tags: ['civil-engineering', 'infrastructure'], language: 'English', isFree: false, certification: true },
                
                // Arts & Humanities Resources
                { title: 'Art History Survey', type: 'course', url: 'https://www.khanacademy.org/humanities/art-history', difficulty: 'beginner', category: 'Arts & Humanities', topic: 'art-history', description: 'Comprehensive survey of art history from ancient to modern', readTime: '45 hours', provider: 'Khan Academy', rating: 4.8, tags: ['art-history', 'humanities'], language: 'English', isFree: true, certification: false },
                { title: 'Philosophy Fundamentals', type: 'tutorial', url: 'https://plato.stanford.edu/', difficulty: 'intermediate', category: 'Arts & Humanities', topic: 'philosophy', description: 'Stanford Encyclopedia of Philosophy - comprehensive resource', readTime: '60 hours', provider: 'Stanford University', rating: 4.9, tags: ['philosophy', 'humanities'], language: 'English', isFree: true, certification: false },
                { title: 'Literature Analysis', type: 'course', url: 'https://www.edx.org/learn/literature', difficulty: 'intermediate', category: 'Arts & Humanities', topic: 'literature', description: 'Critical analysis of literary works and techniques', readTime: '25 hours', provider: 'edX', rating: 4.5, tags: ['literature', 'humanities'], language: 'English', isFree: false, certification: true },
                
                // Natural Sciences Resources
                { title: 'Physics Fundamentals', type: 'course', url: 'https://www.khanacademy.org/science/physics', difficulty: 'intermediate', category: 'Natural Sciences', topic: 'physics', description: 'Comprehensive physics course covering mechanics to quantum physics', readTime: '50 hours', provider: 'Khan Academy', rating: 4.8, tags: ['physics', 'natural-sciences'], language: 'English', isFree: true, certification: false },
                { title: 'Chemistry Basics', type: 'tutorial', url: 'https://www.chemguide.co.uk/', difficulty: 'intermediate', category: 'Natural Sciences', topic: 'chemistry', description: 'Comprehensive chemistry guide for students', readTime: '35 hours', provider: 'Chemguide', rating: 4.6, tags: ['chemistry', 'natural-sciences'], language: 'English', isFree: true, certification: false },
                { title: 'Biology Essentials', type: 'course', url: 'https://www.coursera.org/learn/biology', difficulty: 'intermediate', category: 'Natural Sciences', topic: 'biology', description: 'Essential concepts in biology and life sciences', readTime: '30 hours', provider: 'Coursera', rating: 4.7, tags: ['biology', 'natural-sciences'], language: 'English', isFree: false, certification: true },
                
                // Social Sciences Resources
                { title: 'Sociology Introduction', type: 'course', url: 'https://www.coursera.org/learn/sociology', difficulty: 'beginner', category: 'Social Sciences', topic: 'sociology', description: 'Introduction to sociological concepts and methods', readTime: '25 hours', provider: 'Coursera', rating: 4.5, tags: ['sociology', 'social-sciences'], language: 'English', isFree: false, certification: true },
                { title: 'Political Science', type: 'tutorial', url: 'https://www.britannica.com/topic/political-science', difficulty: 'intermediate', category: 'Social Sciences', topic: 'political-science', description: 'Comprehensive overview of political science', readTime: '20 hours', provider: 'Encyclopaedia Britannica', rating: 4.4, tags: ['political-science', 'social-sciences'], language: 'English', isFree: true, certification: false },
                { title: 'Economics Principles', type: 'course', url: 'https://www.edx.org/learn/economics', difficulty: 'intermediate', category: 'Social Sciences', topic: 'economics', description: 'Fundamental principles of micro and macroeconomics', readTime: '30 hours', provider: 'edX', rating: 4.6, tags: ['economics', 'social-sciences'], language: 'English', isFree: false, certification: true },
                
                // Technology Resources
                { title: 'Machine Learning Basics', type: 'course', url: 'https://www.coursera.org/learn/machine-learning', difficulty: 'intermediate', category: 'Technology', topic: 'machine-learning', description: 'Introduction to machine learning algorithms and applications', readTime: '40 hours', provider: 'Coursera', rating: 4.8, tags: ['machine-learning', 'artificial-intelligence'], language: 'English', isFree: false, certification: true },
                { title: 'Web Development Bootcamp', type: 'course', url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/', difficulty: 'beginner', category: 'Technology', topic: 'web-development', description: 'Complete web development course from HTML to advanced JavaScript', readTime: '60 hours', provider: 'Udemy', rating: 4.7, tags: ['web-development', 'programming'], language: 'English', isFree: false, certification: true },
                { title: 'Cybersecurity Fundamentals', type: 'tutorial', url: 'https://www.coursera.org/learn/cybersecurity', difficulty: 'intermediate', category: 'Technology', topic: 'cybersecurity', description: 'Essential cybersecurity concepts and practices', readTime: '25 hours', provider: 'Coursera', rating: 4.6, tags: ['cybersecurity', 'information-security'], language: 'English', isFree: false, certification: true },
                { title: 'Data Science Essentials', type: 'course', url: 'https://www.edx.org/learn/data-science', difficulty: 'intermediate', category: 'Technology', topic: 'data-science', description: 'Comprehensive introduction to data science and analytics', readTime: '35 hours', provider: 'edX', rating: 4.7, tags: ['data-science', 'analytics'], language: 'English', isFree: false, certification: true }
            ]
        });
        // Quiz Questions
        yield prisma.quizQuestion.createMany({
            data: [
                { question: 'What is the output of console.log(typeof NaN)?', options: ["'number'", "'NaN'", "'undefined'", "'object'"], correctAnswer: "'number'", explanation: "In JavaScript, NaN (Not a Number) is actually of type 'number'.", difficulty: 'intermediate', topic: 'javascript', relatedConcepts: ['data types', 'type coercion', 'NaN'] },
                { question: 'Which method adds elements to the end of an array?', options: ['push()', 'pop()', 'unshift()', 'shift()'], correctAnswer: 'push()', explanation: 'The push() method adds one or more elements to the end of an array.', difficulty: 'beginner', topic: 'javascript', relatedConcepts: ['arrays', 'methods', 'data manipulation'] },
            ]
        });
        // Leaderboard Entries
        yield prisma.leaderboardEntry.createMany({
            data: [
                { name: 'Alex Chen', avatar: '/placeholder.svg', score: 2450, quizzes: 28, streak: 7, badge: '🔥', subjects: ['Computer Science', 'Mathematics'], timeframe: 'weekly', rank: 1 },
                { name: 'Sarah Johnson', avatar: '/placeholder.svg', score: 2380, quizzes: 25, streak: 6, badge: '⚡', subjects: ['Health', 'Psychology'], timeframe: 'weekly', rank: 2 },
            ]
        });
        // Achievements
        yield prisma.achievement.createMany({
            data: [
                { title: 'Quiz Master', description: 'Completed 100+ quizzes', icon: '🏆', earned: true },
                { title: 'Streak Champion', description: '30-day learning streak', icon: '🔥', earned: true },
            ]
        });
        // Study Plans
        yield prisma.studyPlan.createMany({
            data: [
                { category: 'Computer Science', week: 1, focus: 'Programming Fundamentals', resources: ['js-mdn-complete', 'python-official-tutorial'], quizTopics: ['javascript', 'python'], goals: ['Understand basic syntax', 'Write simple programs'] },
                { category: 'Health', week: 1, focus: 'Basic Anatomy', resources: ['anatomy-khan-academy'], quizTopics: ['anatomy'], goals: ['Learn body systems', 'Understand organ functions'] },
            ]
        });
    });
}
main()
    .then(() => {
    console.log('Database seeded successfully!');
    return prisma.$disconnect();
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
