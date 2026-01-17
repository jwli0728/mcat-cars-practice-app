import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { useTimerStore } from '../store/timerStore';

export default function PracticeSessionPage() {
  const { passageId } = useParams<{ passageId: string }>();
  const navigate = useNavigate();
  const [useTimer, setUseTimer] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const {
    sessionId,
    passage,
    answers,
    flaggedQuestions,
    isLoading,
    error,
    startSession,
    selectAnswer,
    toggleFlag,
    completeSession,
    clearSession,
  } = useSessionStore();

  const { isRunning, elapsedSeconds, start, pause, reset, getElapsed } =
    useTimerStore();

  useEffect(() => {
    return () => {
      clearSession();
      reset();
    };
  }, []);

  const handleStart = async () => {
    if (!passageId) return;

    try {
      await startSession(parseInt(passageId), useTimer);
      setHasStarted(true);
      if (useTimer) {
        start();
      }
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const handleAnswerSelect = (questionId: number, choiceId: number) => {
    selectAnswer(questionId, choiceId);
  };

  const handleSubmit = async () => {
    if (!sessionId) return;

    const unanswered = passage?.questions.filter(
      (q) => !answers.has(q.id)
    );

    if (unanswered && unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    try {
      pause();
      const result = await completeSession(useTimer ? getElapsed() : undefined);
      navigate(`/results/${result.sessionId}`);
    } catch (err) {
      console.error('Failed to complete session:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Practice Session</h2>
          <p className="text-gray-600 mb-6">
            Choose whether you'd like to time yourself during this practice session.
          </p>

          <div className="space-y-4 mb-6">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                checked={!useTimer}
                onChange={() => setUseTimer(false)}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">Untimed</div>
                <div className="text-sm text-gray-600">Practice at your own pace</div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-blue-500 rounded-lg cursor-pointer bg-blue-50">
              <input
                type="radio"
                checked={useTimer}
                onChange={() => setUseTimer(true)}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">Timed</div>
                <div className="text-sm text-gray-600">
                  Track your time for realistic practice
                </div>
              </div>
            </label>
          </div>

          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-medium"
          >
            {isLoading ? 'Starting...' : 'Begin Practice'}
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !passage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading passage...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{passage.title}</h1>
              <p className="text-sm text-gray-600">
                {passage.category} • {passage.difficulty}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {useTimer && (
                <div className="text-lg font-mono font-semibold text-gray-900">
                  {formatTime(elapsedSeconds)}
                </div>
              )}
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Passage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Passage</h2>
            <div className="prose prose-sm max-w-none">
              {passage.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {passage.questions.map((question, qIdx) => (
              <div key={question.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {qIdx + 1}
                  </h3>
                  <button
                    onClick={() => toggleFlag(question.id)}
                    className={`text-2xl ${
                      flaggedQuestions.has(question.id) ? 'text-red-500' : 'text-gray-300'
                    }`}
                    title="Flag for review"
                  >
                    🚩
                  </button>
                </div>

                <p className="text-gray-700 mb-4">{question.questionText}</p>

                <div className="space-y-2">
                  {question.choices.map((choice) => {
                    const isSelected = answers.get(question.id) === choice.id;
                    return (
                      <label
                        key={choice.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(question.id, choice.id)}
                          className="mr-3"
                        />
                        <span className="font-medium">{choice.choiceLetter}.</span>{' '}
                        {choice.choiceText}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
