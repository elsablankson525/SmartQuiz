import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Map subject name to category for LearningResource table
    const categoryMapping: Record<string, string> = {
      "JavaScript Fundamentals": "Computer Science",
      "Python Programming": "Computer Science",
      "Data Structures & Algorithms": "Computer Science",
      "Web Development": "Computer Science",
      "Machine Learning": "Computer Science",
      "Human Anatomy": "Health & Medicine",
      "Medical Terminology": "Health & Medicine",
      "Nutrition Science": "Health & Medicine",
      "Pharmacology Basics": "Health & Medicine",
      "Clinical Skills": "Health & Medicine",
      "Business Fundamentals": "Business",
      "Digital Marketing": "Business",
      "Financial Management": "Business",
      "Strategic Management": "Business",
      "Entrepreneurship": "Business",
      "Legal Fundamentals": "Law",
      "Contract Law": "Law",
      "Business Law": "Law",
      "Criminal Law": "Law",
      "International Law": "Law",
      "Introduction to Psychology": "Psychology",
      "Cognitive Psychology": "Psychology",
      "Social Psychology": "Psychology",
      "Abnormal Psychology": "Psychology",
      "Clinical Psychology": "Psychology",
      "Algebra Fundamentals": "Mathematics",
      "Calculus I": "Mathematics",
      "Statistics": "Mathematics",
      "Linear Algebra": "Mathematics",
      "Number Theory": "Mathematics",
      "Engineering Mechanics": "Engineering",
      "Electrical Circuits": "Engineering",
      "Thermodynamics": "Engineering",
      "Fluid Mechanics": "Engineering",
      "Control Systems": "Engineering",
      "World History": "Arts & Humanities",
      "Literature Analysis": "Arts & Humanities",
      "Philosophy": "Arts & Humanities",
      "Art History": "Arts & Humanities",
      "Cultural Studies": "Arts & Humanities",
      "Physics Fundamentals": "Natural Sciences",
      "Chemistry Basics": "Natural Sciences",
      "Biology Essentials": "Natural Sciences",
      "Organic Chemistry": "Natural Sciences",
      "Quantum Physics": "Natural Sciences",
      "Sociology": "Social Sciences",
      "Economics": "Social Sciences",
      "Political Science": "Social Sciences",
      "Anthropology": "Social Sciences",
      "Artificial Intelligence": "Technology",
      "Cybersecurity": "Technology",
      "Data Science": "Technology",
      "Cloud Computing": "Technology",
      "Blockchain Technology": "Technology"
    }

    // More robust category mapping with fallbacks
    let category = categoryMapping[subject.name];
    
    // If no exact match, try to map based on keywords
    if (!category) {
      const subjectLower = subject.name.toLowerCase();
      
      // Health & Medicine keywords
      if (subjectLower.includes('health') || subjectLower.includes('medical') || 
          subjectLower.includes('anatomy') || subjectLower.includes('nutrition') || 
          subjectLower.includes('pharmacology') || subjectLower.includes('clinical') ||
          subjectLower.includes('medicine')) {
        category = "Health & Medicine";
      }
      // Computer Science keywords
      else if (subjectLower.includes('javascript') || subjectLower.includes('python') || 
               subjectLower.includes('programming') || subjectLower.includes('web') || 
               subjectLower.includes('algorithm') || subjectLower.includes('data structure') ||
               subjectLower.includes('machine learning') || subjectLower.includes('ai')) {
        category = "Computer Science";
      }
      // Business keywords
      else if (subjectLower.includes('business') || subjectLower.includes('marketing') || 
               subjectLower.includes('finance') || subjectLower.includes('management') ||
               subjectLower.includes('entrepreneur')) {
        category = "Business";
      }
      // Law keywords
      else if (subjectLower.includes('law') || subjectLower.includes('legal') || 
               subjectLower.includes('contract') || subjectLower.includes('criminal')) {
        category = "Law";
      }
      // Psychology keywords
      else if (subjectLower.includes('psychology') || subjectLower.includes('cognitive') || 
               subjectLower.includes('social') || subjectLower.includes('abnormal')) {
        category = "Psychology";
      }
      // Mathematics keywords
      else if (subjectLower.includes('algebra') || subjectLower.includes('calculus') || 
               subjectLower.includes('statistics') || subjectLower.includes('math') ||
               subjectLower.includes('linear')) {
        category = "Mathematics";
      }
      // Engineering keywords
      else if (subjectLower.includes('engineering') || subjectLower.includes('mechanics') || 
               subjectLower.includes('electrical') || subjectLower.includes('thermodynamics') ||
               subjectLower.includes('fluid')) {
        category = "Engineering";
      }
      // Arts & Humanities keywords
      else if (subjectLower.includes('history') || subjectLower.includes('literature') || 
               subjectLower.includes('philosophy') || subjectLower.includes('art') ||
               subjectLower.includes('cultural')) {
        category = "Arts & Humanities";
      }
      // Natural Sciences keywords
      else if (subjectLower.includes('physics') || subjectLower.includes('chemistry') || 
               subjectLower.includes('biology') || subjectLower.includes('organic') ||
               subjectLower.includes('quantum')) {
        category = "Natural Sciences";
      }
      // Social Sciences keywords
      else if (subjectLower.includes('sociology') || subjectLower.includes('economics') || 
               subjectLower.includes('political') || subjectLower.includes('anthropology')) {
        category = "Social Sciences";
      }
      // Technology keywords
      else if (subjectLower.includes('artificial intelligence') || subjectLower.includes('cybersecurity') || 
               subjectLower.includes('data science') || subjectLower.includes('cloud') ||
               subjectLower.includes('blockchain')) {
        category = "Technology";
      }
      // Default fallback
      else {
        category = subject.name;
      }
    }

    console.log(`[DEBUG] Subject: "${subject.name}" -> Category: "${category}"`);

    // Fetch learning resources from LearningResource table for this category
    let learningResources = await prisma.learningResource.findMany({
      where: { category },
      orderBy: { rating: 'desc' },
      take: 10
    })

    // If no resources found, try alternative category names
    if (learningResources.length === 0) {
      console.log(`[DEBUG] No resources found for category "${category}", trying alternatives...`);
      
      // Try alternative category names
      const alternativeCategories = [];
      
      if (category === "Health & Medicine") {
        alternativeCategories.push("Health", "Medicine", "Medical");
      } else if (category === "Computer Science") {
        alternativeCategories.push("Technology", "Programming", "Software");
      } else if (category === "Business") {
        alternativeCategories.push("Management", "Finance", "Marketing");
      } else if (category === "Law") {
        alternativeCategories.push("Legal", "Jurisprudence");
      } else if (category === "Psychology") {
        alternativeCategories.push("Mental Health", "Behavioral Science");
      } else if (category === "Mathematics") {
        alternativeCategories.push("Math", "Calculus", "Algebra");
      } else if (category === "Engineering") {
        alternativeCategories.push("Mechanical", "Electrical", "Civil");
      } else if (category === "Arts & Humanities") {
        alternativeCategories.push("Humanities", "Arts", "Literature");
      } else if (category === "Natural Sciences") {
        alternativeCategories.push("Science", "Physics", "Chemistry", "Biology");
      } else if (category === "Social Sciences") {
        alternativeCategories.push("Sociology", "Economics", "Politics");
      } else if (category === "Technology") {
        alternativeCategories.push("Computer Science", "Programming", "Software");
      }
      
      // Try each alternative category
      for (const altCategory of alternativeCategories) {
        const altResources = await prisma.learningResource.findMany({
          where: { category: altCategory },
          orderBy: { rating: 'desc' },
          take: 10
        });
        
        if (altResources.length > 0) {
          console.log(`[DEBUG] Found ${altResources.length} resources using alternative category "${altCategory}"`);
          learningResources = altResources;
          category = altCategory; // Update the category for the response
          break;
        }
      }
    }

    console.log(`[DEBUG] Final result: ${learningResources.length} resources for category "${category}"`);

    // Format resources for response
    const formattedResources = learningResources.map((resource: Record<string, unknown>) => ({
      id: resource.id,
      title: resource.title,
      type: resource.type,
      url: resource.url,
      description: resource.description,
      difficulty: resource.difficulty,
      provider: resource.provider,
      rating: resource.rating,
      isFree: resource.isFree,
      certification: resource.certification
    }))

    return NextResponse.json({ 
      success: true,
      resources: formattedResources || [],
      category,
      subjectName: subject.name
    })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { title, type, url, description } = body

    if (!title || !type || !url) {
      return NextResponse.json({ 
        error: "Title, type, and url are required" 
      }, { status: 400 })
    }

    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    const resource = await prisma.resource.create({
      data: {
        subjectId: id,
        title,
        type,
        url,
        description: description || ""
      }
    })

    return NextResponse.json({ 
      success: true,
      resource 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
  }
} 