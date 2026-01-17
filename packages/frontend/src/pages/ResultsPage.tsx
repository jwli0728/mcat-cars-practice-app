import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";

interface QuestionResult {
  question: any;
  userAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  isFlagged: boolean;
  allChoices: any[];
}

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    if (!sessionId) return;

    try {
      const data = await apiClient.getSessionResults(parseInt(sessionId));
      setResults(data);
    } catch (error) {
      console.error("Failed to load results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScorePercentage = () => {
    if (!results) return "0";
    return ((results.score / results.totalQuestions) * 100).toFixed(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load results</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Practice Results
            </h1>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Session Complete!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className={`text-5xl font-bold mb-2 ${
                  parseInt(getScorePercentage()) >= 70
                    ? "text-green-600"
                    : parseInt(getScorePercentage()) >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {getScorePercentage()}%
              </div>
              <div className="text-gray-600">Score</div>
              <div className="text-sm text-gray-500 mt-1">
                {results.score} / {results.totalQuestions} correct
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-gray-600">Time</div>
              <div className="text-sm text-gray-500 mt-1">
                {results.session.timedSession ? "Timed session" : "Untimed"}
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {
                  results.questions.filter((q: QuestionResult) => q.isFlagged)
                    .length
                }
              </div>
              <div className="text-gray-600">Flagged</div>
              <div className="text-sm text-gray-500 mt-1">Questions marked</div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Question Review
          </h2>

          {results.questions.map((qResult: QuestionResult, idx: number) => (
            <div
              key={qResult.question.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {idx + 1}
                  </h3>
                  {qResult.isFlagged && (
                    <span className="text-red-500">🚩</span>
                  )}
                  {qResult.isCorrect ? (
                    <span className="text-green-600 font-medium">
                      ✓ Correct
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ✗ Incorrect
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {qResult.question.questionText}
              </p>

              <div className="space-y-3">
                {qResult.allChoices.map((choice: any) => {
                  const isUserAnswer = qResult.userAnswer?.id === choice.id;
                  const isCorrectAnswer = choice.isCorrect;

                  return (
                    <div
                      key={choice.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrectAnswer
                          ? "border-green-500 bg-green-50"
                          : isUserAnswer
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-bold">
                          {choice.choiceLetter}.
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span>{choice.choiceText}</span>
                            {isCorrectAnswer && (
                              <span className="text-green-600 font-medium">
                                ✓ Correct
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-red-600 font-medium">
                                Your answer
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-2 italic">
                            {choice.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!qResult.userAnswer && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    You did not answer this question.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Practice More
          </button>
        </div>
      </main>
    </div>
  );
}
