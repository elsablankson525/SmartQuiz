import { AuthTest } from '@/components/auth-test';

export default function TestAuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Authentication Test Page
        </h1>
        <AuthTest />
      </div>
    </div>
  );
} 