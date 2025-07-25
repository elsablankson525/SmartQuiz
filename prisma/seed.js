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
        // Learning Resources
        yield prisma.learningResource.createMany({
            data: [
                { title: 'JavaScript Complete Guide', type: 'tutorial', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', difficulty: 'beginner', category: 'Computer Science', topic: 'javascript', description: 'Comprehensive JavaScript tutorial covering all fundamentals', readTime: '6 hours', provider: 'MDN Web Docs', rating: 4.8, tags: ['javascript', 'web-development'], language: 'English', isFree: true, certification: false },
                { title: 'Eloquent JavaScript', type: 'book', url: 'https://eloquentjavascript.net/', difficulty: 'intermediate', category: 'Computer Science', topic: 'javascript', description: 'A modern introduction to programming with JavaScript', readTime: '20 hours', provider: 'Marijn Haverbeke', rating: 4.7, tags: ['javascript', 'programming', 'book'], language: 'English', isFree: true, certification: false },
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
