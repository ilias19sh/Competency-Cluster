import { useEffect, useMemo, useState } from 'react';
import { IconBell, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { VITE_API_BASE_URL } from '../../config/api';
import { getAuthUser } from '../../utils/authSession';
import classes from './StudentQuiz.module.css';

type QuizAnswer = {
  id: number;
  value: string;
};

type QuizQuestion = {
  id: number;
  value: string;
  answers: QuizAnswer[];
};

type QuizData = {
  id: number;
  title: string;
  description: string;
  module: {
    id: number;
    title: string;
    subTitle: string;
  };
  questions: QuizQuestion[];
};

type SubmitResult = {
  questionId: number;
  isCorrect: boolean;
  selectedAnswerIds: number[];
  goodAnswerIds: number[];
};

type SubmitResponse = {
  score: number;
  earnedElos: number;
  correctAnswersCount: number;
  totalQuestions: number;
  isComplete: boolean;
  results: SubmitResult[];
};

type SubmittedAnswer = {
  questionId: number;
  answerId: number;
};

export default function StudentQuiz() {
  const navigate = useNavigate();
  const { submoduleId } = useParams();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmittedAnswer[]>([]);
  const [lastResult, setLastResult] = useState<SubmitResult | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [earnedElos, setEarnedElos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const authUser = useMemo(() => getAuthUser(), []);
  const currentQuestion = quiz?.questions[currentQuestionIndex] ?? null;
  const progressValue = quiz?.questions.length
    ? Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)
    : 0;
  const isLastQuestion = quiz ? currentQuestionIndex === quiz.questions.length - 1 : false;

  useEffect(() => {
    if (!authUser?.userId || !submoduleId) {
      setError('Quiz introuvable');
      setIsLoading(false);
      return;
    }

    const loadQuiz = async () => {
      try {
        const response = await fetch(`${VITE_API_BASE_URL}/student-modules/student/${authUser.userId}/submodule/${submoduleId}/quiz`);
        const data = (await response.json()) as QuizData | { message?: string | string[] };

        if (!response.ok) {
          const message =
            'message' in data
              ? Array.isArray(data.message)
                ? data.message[0]
                : data.message
              : undefined;
          throw new Error(message || 'Impossible de charger le quiz');
        }

        setQuiz(data as QuizData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger le quiz');
      } finally {
        setIsLoading(false);
      }
    };

    void loadQuiz();
  }, [authUser?.userId, submoduleId]);

  const handleSubmit = async () => {
    if (!authUser?.userId || !submoduleId || !currentQuestion || !selectedAnswerId || lastResult) {
      return;
    }

    const nextSubmittedAnswers = [
      ...submittedAnswers.filter((answer) => answer.questionId !== currentQuestion.id),
      {
        questionId: currentQuestion.id,
        answerId: selectedAnswerId,
      },
    ];

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/student-modules/student/${authUser.userId}/submodule/${submoduleId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: nextSubmittedAnswers }),
      });
      const data = (await response.json()) as SubmitResponse | { message?: string | string[] };

      if (!response.ok) {
        const message =
          'message' in data
            ? Array.isArray(data.message)
              ? data.message[0]
              : data.message
            : undefined;
        throw new Error(message || 'Impossible de valider la reponse');
      }

      const submitResponse = data as SubmitResponse;
      const result = submitResponse.results.find((item) => item.questionId === currentQuestion.id) ?? null;

      setSubmittedAnswers(nextSubmittedAnswers);
      setLastResult(result);

      if (submitResponse.isComplete) {
        setFinalScore(submitResponse.score);
        setEarnedElos(submitResponse.earnedElos);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de valider la reponse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!quiz || !currentQuestion) {
      return;
    }

    if (isLastQuestion) {
      navigate(`/student/submodules/${submoduleId}/score`, {
        state: {
          score: finalScore ?? 0,
          earnedElos,
          submoduleTitle: quiz.title,
          moduleId: quiz.module.id,
        },
      });
      return;
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    const nextQuestion = quiz.questions[nextQuestionIndex];
    const existingAnswer = submittedAnswers.find((answer) => answer.questionId === nextQuestion.id);

    setCurrentQuestionIndex(nextQuestionIndex);
    setSelectedAnswerId(existingAnswer?.answerId ?? null);
    setLastResult(null);
  };

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <div className={classes.headerLeft}>
          <Link to="/student" className={classes.logoLink} aria-label="Retour a l'accueil student">
            <img src="/images/logo_cc_couleur.png" alt="Competency Cluster" className={classes.logo} />
          </Link>

          <nav className={classes.nav}>
            <Link to="/student/modules" className={classes.navLink}>Modules</Link>
            <a href="#ranking" className={classes.navLink}>Ranking</a>
            <a href="#profile" className={classes.navLink}>My profile</a>
          </nav>
        </div>

        <div className={classes.headerRight}>
          <IconSettings size={18} stroke={1.8} className={classes.headerIcon} />
          <IconBell size={18} stroke={1.8} className={classes.headerIcon} />
          <div className={classes.avatar}>
            <IconUserCircle size={24} stroke={1.8} />
          </div>
        </div>
      </header>

      <section className={classes.quizShell}>
        <div className={classes.progressBar} aria-label={`Progression ${progressValue}%`}>
          <div className={classes.progressFill} style={{ width: `${progressValue}%` }}>
            <span>{progressValue}%</span>
          </div>
        </div>

        {error ? <p className={classes.errorMessage}>{error}</p> : null}

        {isLoading ? (
          <p className={classes.statusMessage}>Loading question...</p>
        ) : null}

        {!isLoading && quiz && quiz.questions.length === 0 ? (
          <div className={classes.emptyState}>
            <h1>Question &gt;</h1>
            <p>No question available yet.</p>
          </div>
        ) : null}

        {currentQuestion ? (
          <div className={classes.questionArea}>
            <div className={classes.questionLabel}>Question &gt;</div>

            <h1 className={classes.questionTitle}>{currentQuestion.value}</h1>

            <div className={classes.answersGrid}>
              {currentQuestion.answers.map((answer) => {
                const isSelected = selectedAnswerId === answer.id;
                const isGoodAnswer = Boolean(lastResult?.goodAnswerIds.includes(answer.id));
                const isDisabledAfterSubmit = Boolean(lastResult);

                return (
                  <button
                    key={answer.id}
                    type="button"
                    className={[
                      classes.answerCard,
                      isSelected && !lastResult ? classes.answerCardSelected : '',
                      isDisabledAfterSubmit ? classes.answerCardSubmitted : '',
                      isGoodAnswer ? classes.answerCardCorrect : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (!lastResult) {
                        setSelectedAnswerId(answer.id);
                      }
                    }}
                  >
                    {answer.value}
                  </button>
                );
              })}
            </div>

            {lastResult ? (
              <p className={lastResult.isCorrect ? classes.goodFeedback : classes.badFeedback}>
                {lastResult.isCorrect ? 'Good answer, congratulation !' : 'Wrong answer, try the next one !'}
              </p>
            ) : null}

            {finalScore !== null && isLastQuestion ? (
              <p className={classes.scoreFeedback}>Score: {finalScore}%</p>
            ) : null}

            <div className={classes.actionRow}>
              {lastResult ? (
                <button type="button" className={classes.actionButton} onClick={handleNext}>
                  {isLastQuestion ? 'Finish' : 'Next'}
                </button>
              ) : (
                <button
                  type="button"
                  className={classes.actionButton}
                  onClick={handleSubmit}
                  disabled={!selectedAnswerId || isSubmitting}
                >
                  {isSubmitting ? '...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
