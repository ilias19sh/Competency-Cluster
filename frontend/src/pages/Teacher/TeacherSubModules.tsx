import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconBell, IconChevronRight, IconSettings } from '@tabler/icons-react';
import { Box, TextInput } from '@mantine/core';
import { CcButton, CcCircleProgress, CcText, CcTitle } from '../../components';
import { VITE_API_BASE_URL } from '../../config/api';
import classes from './TeacherSubModules.module.css';

type TeacherLocationState = {
  userId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
};

type TeacherModule = {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  submodulesCount: number;
  tags: string[];
};

type TeacherSubmodule = {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  progress: number;
};

type TeacherSubmoduleDetails = {
  id: number;
  title: string;
  description: string;
  moduleId: number;
  moduleTitle: string;
  moduleSubTitle: string;
  questions: Array<{
    id: number;
    value: string;
    answers: Array<{
      id: number;
      value: string;
      isGoodAnswer: boolean;
    }>;
  }>;
};

type EditableQuestion = {
  id: string;
  value: string;
  answers: Array<{
    id: string;
    value: string;
    isGoodAnswer: boolean;
  }>;
};

type RouteState = {
  teacherUser?: TeacherLocationState | null;
  module?: TeacherModule | null;
};

export default function TeacherSubModules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId, submoduleId } = useParams();
  const routeState = (location.state as RouteState | null) ?? null;
  const storedTeacherUser = useMemo(() => {
    const rawValue = sessionStorage.getItem('cc_teacher_user');

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as TeacherLocationState;
    } catch {
      return null;
    }
  }, []);

  const teacherUser = routeState?.teacherUser?.userId ? routeState.teacherUser : storedTeacherUser;
  const [moduleInfo, setModuleInfo] = useState<TeacherModule | null>(routeState?.module ?? null);
  const [submodules, setSubmodules] = useState<TeacherSubmodule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedSubmodule, setSelectedSubmodule] = useState<TeacherSubmodule | null>(null);
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);

  const createAnswer = () => ({
    id: `${Date.now()}-${Math.random()}`,
    value: '',
    isGoodAnswer: false,
  });

  const createQuestion = (): EditableQuestion => ({
    id: `${Date.now()}-${Math.random()}`,
    value: '',
    answers: [createAnswer(), createAnswer()],
  });

  useEffect(() => {
    const loadData = async () => {
      if (!moduleId) {
        setError('No module selected.');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        if (submoduleId) {
          const submoduleResponse = await fetch(`${VITE_API_BASE_URL}/teacher-submodules/${submoduleId}`);
          const submoduleData = (await submoduleResponse.json()) as TeacherSubmoduleDetails | { message?: string | string[] };

          if (!submoduleResponse.ok) {
            const message =
              'message' in submoduleData
                ? Array.isArray(submoduleData.message)
                  ? submoduleData.message[0]
                  : submoduleData.message
                : undefined;
            throw new Error(message || 'Unable to load submodule');
          }

          const details = submoduleData as TeacherSubmoduleDetails;

          setSelectedSubmodule({
            id: details.id,
            title: details.title,
            description: details.description,
            questionsCount: details.questions.length,
            progress: 75,
          });

          setQuestions(
            details.questions.length > 0
              ? details.questions.map((question) => ({
                  id: String(question.id),
                  value: question.value,
                  answers: question.answers.map((answer) => ({
                    id: String(answer.id),
                    value: answer.value,
                    isGoodAnswer: answer.isGoodAnswer,
                  })),
                }))
              : [createQuestion()],
          );

          if (!moduleInfo) {
            setModuleInfo({
              id: details.moduleId,
              title: details.moduleTitle,
              subTitle: details.moduleSubTitle,
              description: '',
              submodulesCount: 0,
              tags: [],
            });
          }
        } else {
          const submodulesResponse = await fetch(`${VITE_API_BASE_URL}/teacher-submodules/module/${moduleId}`);
          const submodulesData = (await submodulesResponse.json()) as TeacherSubmodule[] | { message?: string | string[] };

          if (!submodulesResponse.ok) {
            const message =
              'message' in submodulesData
                ? Array.isArray(submodulesData.message)
                  ? submodulesData.message[0]
                  : submodulesData.message
                : undefined;
            throw new Error(message || 'Unable to load submodules');
          }

          setSubmodules(submodulesData as TeacherSubmodule[]);
        }

        if (!routeState?.module && teacherUser?.userId) {
          const modulesResponse = await fetch(`${VITE_API_BASE_URL}/teacher-modules/teacher/${teacherUser.userId}`);
          const modulesData = (await modulesResponse.json()) as TeacherModule[] | { message?: string | string[] };

          if (modulesResponse.ok) {
            const matchedModule = (modulesData as TeacherModule[]).find(
              (currentModule) => String(currentModule.id) === String(moduleId),
            );

            if (matchedModule) {
              setModuleInfo(matchedModule);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load submodules');
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [moduleId, submoduleId, routeState?.module, teacherUser?.userId]);

  const updateQuestionValue = (questionId: string, value: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId ? { ...question, value } : question,
      ),
    );
  };

  const updateAnswerValue = (questionId: string, answerId: string, value: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId ? { ...answer, value } : answer,
              ),
            }
          : question,
      ),
    );
  };

  const toggleCorrectAnswer = (questionId: string, answerId: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId
                  ? { ...answer, isGoodAnswer: !answer.isGoodAnswer }
                  : answer,
              ),
            }
          : question,
      ),
    );
  };

  const addQuestion = () => {
    setQuestions((currentQuestions) => [...currentQuestions, createQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((currentQuestions) => currentQuestions.filter((question) => question.id !== questionId));
  };

  const addAnswer = (questionId: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? { ...question, answers: [...question.answers, createAnswer()] }
          : question,
      ),
    );
  };

  const removeAnswer = (questionId: string, answerId: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers:
                question.answers.length > 2
                  ? question.answers.filter((answer) => answer.id !== answerId)
                  : question.answers,
            }
          : question,
      ),
    );
  };

  const handleSaveQuestions = async () => {
    if (!submoduleId) {
      return;
    }

    setError('');
    setFeedback('');
    setIsSaving(true);

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/teacher-submodules/${submoduleId}/questions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: questions.map((question) => ({
            value: question.value,
            answers: question.answers.map((answer) => ({
              value: answer.value,
              isGoodAnswer: answer.isGoodAnswer,
            })),
          })),
        }),
      });

      const data = (await response.json()) as { message?: string | string[] };

      if (!response.ok) {
        const message = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(message || 'Unable to save questions');
      }

      setFeedback(Array.isArray(data.message) ? data.message[0] : data.message || 'Questions saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save questions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <button type="button" className={classes.logoButton} onClick={() => navigate('/teacher')} aria-label="Retour a l'accueil teacher">
          <img
            src="/images/logo_cc_couleur.png"
            alt="Competency Cluster"
            className={classes.logo}
          />
        </button>

        <CcText className={classes.welcomeText} color="#4f4f4f">
          Welcome on your HomePage Competency Cluster{teacherUser?.lastName ? ` ${teacherUser.lastName},` : '.'}
        </CcText>

        <div className={classes.headerActions}>
          <IconSettings size={20} stroke={1.8} className={classes.headerIcon} />
          <IconBell size={20} stroke={1.8} className={classes.headerIcon} />
        </div>
      </header>

      <section className={classes.content}>
        <div className={classes.topRow}>
          <div className={classes.heading}>
            <CcTitle order={1} withChevron={false}>
              <span className={classes.headingText}>Submodules</span>
            </CcTitle>
            <IconChevronRight size={30} stroke={1.8} className={classes.headingChevron} />
          </div>

          <CcButton
            variant="default-gradient"
            className={classes.backButton}
            onClick={() => navigate('/teacher', { state: teacherUser ? { ...teacherUser } : undefined })}
          >
            Back
          </CcButton>
        </div>

        {error ? (
          <div className={classes.feedbackMessage}>
            <CcText size="sm" color="#d94841">
              {error}
            </CcText>
          </div>
        ) : null}

        {feedback ? (
          <div className={classes.feedbackMessage}>
            <CcText size="sm" color="#2f9e44">
              {feedback}
            </CcText>
          </div>
        ) : null}

        {isLoading ? (
          <div className={classes.feedbackMessage}>
            <CcText size="sm" color="#9c9c9c">
              Loading submodules...
            </CcText>
          </div>
        ) : null}

        {!submoduleId && !isLoading && submodules.length === 0 ? (
          <section className={classes.emptyState}>
            <Box className={classes.emptyGlow} />
            <div className={classes.emptyCard}>
              <CcText size="xl" color="#7a7a7a" className={classes.emptyTitle}>
                No submodule created yet
              </CcText>
              <CcText size="md" color="#9c9c9c">
                {moduleInfo ? `Create one inside ${moduleInfo.title} from the Actions menu.` : 'Create one from the Actions menu.'}
              </CcText>
            </div>
          </section>
        ) : null}

        {!submoduleId && submodules.length > 0 ? (
          <section className={classes.grid}>
            {submodules.map((submodule) => (
              <article
                key={submodule.id}
                className={classes.card}
                onClick={() =>
                  navigate(`/teacher/modules/${moduleId}/submodules/${submodule.id}`, {
                    state: {
                      teacherUser,
                      module: moduleInfo,
                    },
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    navigate(`/teacher/modules/${moduleId}/submodules/${submodule.id}`, {
                      state: {
                        teacherUser,
                        module: moduleInfo,
                      },
                    });
                  }
                }}
              >
                <div className={classes.cardHeader}>
                  <h3 className={classes.cardTitle}>{submodule.title}</h3>
                </div>

                <div className={classes.cardBody}>
                  <CcCircleProgress value={submodule.progress} size={146} thickness={9} label="Success" />
                  <p className={classes.questionCount}>{submodule.questionsCount} questions</p>
                </div>

                <div className={classes.cardFooter}>
                  <p className={classes.cardDescription}>
                    {submodule.description || moduleInfo?.subTitle || 'Submodule ready to be completed.'}
                  </p>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {submoduleId && selectedSubmodule ? (
          <section className={classes.editorSection}>
            <div className={classes.editorHeader}>
              <div>
                <CcTitle order={2} withChevron={false}>
                  <span className={classes.editorTitle}>{selectedSubmodule.title}</span>
                </CcTitle>
                <CcText size="md" color="#8a8a8a">
                  {selectedSubmodule.description || 'Add your questions and choose the good answers.'}
                </CcText>
              </div>

              <CcButton
                variant="default-gradient"
                className={classes.backButton}
                onClick={() =>
                  navigate(`/teacher/modules/${moduleId}/submodules`, {
                    state: {
                      teacherUser,
                      module: moduleInfo,
                    },
                  })
                }
              >
                Back to list
              </CcButton>
            </div>

            <div className={classes.questionsPanel}>
              <div className={classes.questionsPanelTop}>
                <CcText size="sm" color="#8a8a8a" italic>
                  Add your questions, answers and mark the good ones.
                </CcText>

                <CcButton
                  variant="default-gradient"
                  className={classes.addQuestionButton}
                  onClick={addQuestion}
                >
                  Add question
                </CcButton>
              </div>

              <div className={classes.questionsList}>
                {questions.map((question, questionIndex) => (
                  <div key={question.id} className={classes.questionCard}>
                    <div className={classes.questionCardTop}>
                      <TextInput
                        placeholder={`Question ${questionIndex + 1}`}
                        radius="xl"
                        classNames={{ input: classes.questionInput }}
                        value={question.value}
                        onChange={(event) => updateQuestionValue(question.id, event.currentTarget.value)}
                      />

                      <button
                        type="button"
                        className={classes.removeQuestionButton}
                        onClick={() => removeQuestion(question.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className={classes.answersList}>
                      {question.answers.map((answer, answerIndex) => (
                        <div
                          key={answer.id}
                          className={`${classes.answerRow} ${answer.isGoodAnswer ? classes.answerRowCorrect : ''}`}
                        >
                          <button
                            type="button"
                            className={`${classes.answerToggle} ${answer.isGoodAnswer ? classes.answerToggleActive : ''}`}
                            onClick={() => toggleCorrectAnswer(question.id, answer.id)}
                          >
                            {answer.isGoodAnswer ? 'Good' : 'Mark'}
                          </button>

                          <TextInput
                            placeholder={`Answer ${answerIndex + 1}`}
                            radius="xl"
                            classNames={{ input: classes.answerInput }}
                            value={answer.value}
                            onChange={(event) => updateAnswerValue(question.id, answer.id, event.currentTarget.value)}
                          />

                          <button
                            type="button"
                            className={classes.removeAnswerButton}
                            onClick={() => removeAnswer(question.id, answer.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={classes.addAnswerButton}
                      onClick={() => addAnswer(question.id)}
                    >
                      + Add answer
                    </button>
                  </div>
                ))}
              </div>

              <div className={classes.saveButtonRow}>
                <CcButton
                  variant="default-gradient"
                  className={classes.backButton}
                  onClick={() => void handleSaveQuestions()}
                  disabled={isSaving}
                >
                  Save questions
                </CcButton>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
