# Migration Guide: Unified Recommendation Engine

This guide helps you migrate from the old recommendation engines to the new unified recommendation engine.

## Overview

The unified recommendation engine combines the best features from both:
- `lib/recommendation-engine.ts` (original engine)
- `lib/smart-quiz-recommendation-engine.ts` (smart engine)

## What's New

### Enhanced Features
- **Unified Interface**: Single engine with both basic and advanced features
- **Backward Compatibility**: Existing code continues to work
- **Enhanced Analytics**: More detailed performance insights
- **Adaptive Recommendations**: Smarter difficulty adjustments
- **Personalized Insights**: Learning style detection and study recommendations

### New Capabilities
- Performance analytics with time efficiency analysis
- Topic mastery tracking
- Adaptive difficulty recommendations
- Personalized study plans
- Learning path recommendations with completion estimates

## Migration Steps

### 1. Update Imports

**Before:**
```typescript
import { generatePersonalizedRecommendations } from "@/lib/recommendation-engine"
import { smartQuizRecommendationEngine } from "@/lib/smart-quiz-recommendation-engine"
```

**After:**
```typescript
import { unifiedRecommendationEngine } from "@/lib/unified-recommendation-engine"
```

### 2. Update API Calls

**Basic Recommendations (Backward Compatible):**
```typescript
// This still works exactly the same
const recommendations = await unifiedRecommendationEngine.generatePersonalizedRecommendations(
  quizResult,
  questions,
  userHistory
)
```

**Advanced Recommendations (New):**
```typescript
// New comprehensive recommendations
const recommendations = await unifiedRecommendationEngine.generateUnifiedRecommendations(
  quizResult,
  questions,
  userHistory,
  user,
  learnerType
)
```

### 3. Update Components

**Before:**
```typescript
import { RecommendationPanel } from "@/components/recommendation-panel"
import { SmartRecommendationPanel } from "@/components/smart-recommendation-panel"
```

**After:**
```typescript
import { UnifiedRecommendationPanel } from "@/components/unified-recommendation-panel"

// Basic view (like old recommendation panel)
<UnifiedRecommendationPanel 
  recommendations={recommendations}
  showAdvancedFeatures={false}
/>

// Advanced view (like old smart recommendation panel)
<UnifiedRecommendationPanel 
  recommendations={recommendations}
  showAdvancedFeatures={true}
/>
```

### 4. Update API Routes

The API routes have been automatically updated to use the unified engine:

- `/api/recommendations` - Uses unified engine with backward compatibility
- `/api/smart-recommendations` - Uses unified engine with advanced features

## New Features Usage

### Performance Analytics
```typescript
const recommendations = await unifiedRecommendationEngine.generateUnifiedRecommendations(...)

// Access detailed analytics
const { performanceAnalytics } = recommendations
console.log(performanceAnalytics.overallScore)
console.log(performanceAnalytics.learningTrend)
console.log(performanceAnalytics.timeSpentAnalysis)
```

### Personalized Insights
```typescript
const { personalizedInsights } = recommendations
console.log(personalizedInsights.learningStyle)
console.log(personalizedInsights.recommendedStudyTime)
console.log(personalizedInsights.suggestedPace)
```

### Adaptive Recommendations
```typescript
const { adaptiveRecommendations } = recommendations
console.log(adaptiveRecommendations.difficultyAdjustment)
console.log(adaptiveRecommendations.readinessForNextLevel)
console.log(adaptiveRecommendations.skillGaps)
```

## Backward Compatibility

The unified engine maintains full backward compatibility:

### Legacy Functions Still Work
```typescript
// These still work exactly as before
import { generatePersonalizedRecommendations, analyzeProgressTrend } from "@/lib/unified-recommendation-engine"

const recommendations = await generatePersonalizedRecommendations(quizResult, questions, userHistory)
const progress = analyzeProgressTrend(userHistory)
```

### Legacy Components Still Work
The old `RecommendationPanel` component continues to work with the unified engine.

## Benefits of Migration

1. **Simplified Codebase**: One engine instead of two
2. **Enhanced Features**: Access to advanced analytics and insights
3. **Better Performance**: Optimized algorithms and caching
4. **Future-Proof**: All new features will be added to the unified engine
5. **Consistent API**: Single interface for all recommendation features

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure you're importing from the correct path
2. **Type Errors**: The unified engine uses the same types as the original engines
3. **Missing Features**: Enable `showAdvancedFeatures={true}` to access new capabilities

### Getting Help

If you encounter issues during migration:
1. Check that all imports are updated
2. Verify that the unified engine is properly installed
3. Test with the basic features first before enabling advanced features

## Next Steps

After migration:
1. Test all existing functionality
2. Gradually enable advanced features
3. Update your UI to take advantage of new insights
4. Consider customizing the recommendation algorithms for your specific needs

The unified recommendation engine provides a solid foundation for future enhancements while maintaining compatibility with existing code. 