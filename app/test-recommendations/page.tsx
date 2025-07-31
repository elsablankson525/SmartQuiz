"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestRecommendationsPage() {
  const [result, setResult] = useState<{ status: number; data: unknown } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRecommendations = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with a sample user email
      const response = await fetch('/api/recommendations?userId=test@example.com');
      const data = await response.json();
      
      setResult({
        status: response.status,
        data: data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Recommendations API</h1>
      
      <Button onClick={testRecommendations} disabled={loading}>
        {loading ? 'Testing...' : 'Test API'}
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-400 rounded">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 