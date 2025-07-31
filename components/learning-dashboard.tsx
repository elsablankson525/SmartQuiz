'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, BookOpen, Video, FileText, Clock, Star } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  prerequisites: string[];
  progress: number;
  isActive: boolean;
}

interface LearningResource {
  id: string;
  title: string;
  type: string;
  url: string;
  difficulty: string;
  category: string;
  topic: string;
  description: string;
  duration?: string;
  readTime?: string;
  provider: string;
  rating: number;
  tags: string[];
  language: string;
  isFree: boolean;
}

export function LearningDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, pathsRes, resourcesRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/learning-paths'),
        fetch('/api/learning-resources')
      ]);

      const subjectsData = await subjectsRes.json();
      const pathsData = await pathsRes.json();
      const resourcesData = await resourcesRes.json();

      setSubjects(subjectsData);
      setLearningPaths(pathsData);
      setResources(resourcesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'tutorial': return <FileText className="w-4 h-4" />;
      case 'book': return <BookOpen className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredPaths = learningPaths.filter(path => 
    (selectedCategory === 'All' || path.category === selectedCategory) &&
    (searchQuery === '' || path.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredResources = resources.filter(resource => 
    (selectedCategory === 'All' || resource.category === selectedCategory) &&
    (searchQuery === '' || resource.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">SmartQuiz Learning Dashboard</h1>
        <p className="text-gray-600">Explore subjects, learning paths, and resources</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search learning content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.name}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="subjects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subjects">Subjects ({subjects.length})</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths ({filteredPaths.length})</TabsTrigger>
          <TabsTrigger value="resources">Resources ({filteredResources.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subject.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription>{subject.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedCategory(subject.name)}
                  >
                    Explore Content
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(path.difficulty)}>
                      {path.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {path.estimatedDuration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Category:</span>
                    <Badge variant="outline">{path.category}</Badge>
                  </div>
                  {path.prerequisites.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {path.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button className="flex-1">Start Learning</Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{resource.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{resource.provider}</span>
                    <Badge className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {resource.duration && (
                      <>
                        <Clock className="w-4 h-4" />
                        {resource.duration}
                      </>
                    )}
                    {resource.readTime && (
                      <>
                        <FileText className="w-4 h-4" />
                        {resource.readTime}
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {resource.isFree ? 'Access Free' : 'View Resource'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 