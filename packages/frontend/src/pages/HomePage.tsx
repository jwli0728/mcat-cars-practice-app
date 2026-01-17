import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';

interface Passage {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  estimatedTime: number;
}

interface Progress {
  totalSessions: number;
  averageScore: string;
  totalTimeSpent: number;
}

export default function HomePage() {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [passagesRes, progressRes] = await Promise.all([
        apiClient.getPassages(),
        apiClient.getProgress(),
      ]);
      setPassages(passagesRes.passages);
      setProgress(progressRes.progress);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startPractice = (passageId: number) => {
    navigate(`/practice/${passageId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MCAT CARS Practice</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Summary */}
        {progress && progress.totalSessions > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{progress.totalSessions}</div>
                <div className="text-sm text-gray-600">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {parseFloat(progress.averageScore).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {formatTime(progress.totalTimeSpent)}
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Passages */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Passages</h2>
          <p className="text-sm text-gray-600 mt-1">
            Select a passage to begin practicing
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {passages.map((passage) => (
            <div
              key={passage.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer"
              onClick={() => startPractice(passage.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {passage.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    passage.difficulty
                  )}`}
                >
                  {passage.difficulty}
                </span>
                <span className="text-sm text-gray-600">{passage.category}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>⏱ {formatTime(passage.estimatedTime)}</span>
                <span className="text-blue-600 font-medium">Start →</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
