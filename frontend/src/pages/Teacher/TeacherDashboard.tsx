import { useEffect, useMemo, useState } from 'react';
import { Box, Select, TextInput, Textarea } from '@mantine/core';
import {IconBell,IconChevronDown,IconChevronRight,IconFilter,IconSearch,IconSettings} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CcButton, CcCircleProgress, CcText, CcTitle } from '../../components';
import { VITE_API_BASE_URL } from '../../config/api';
import classes from './TeacherDashboard.module.css';

const actionItems = [
  'Create a module',
  'Create a Submodule',
  'Generate By AI',
];

const availableTags = ['Front-end', 'Back-end', 'Versionning', 'UI/UX', 'Devops', 'Development', 'Programming'];

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

type FilterSuggestion = {
  id: string;
  label: string;
  type: 'Module' | 'Tag';
};

type SubmoduleQuestion = {
  id: string;
  value: string;
  answers: Array<{
    id: string;
    value: string;
    isGoodAnswer: boolean;
  }>;
};

const createAnswer = () => ({
  id: `${Date.now()}-${Math.random()}`,
  value: '',
  isGoodAnswer: false,
});

const createQuestion = (): SubmoduleQuestion => ({
  id: `${Date.now()}-${Math.random()}`,
  value: '',
  answers: [createAnswer(), createAnswer()],
});

type TeacherSubmoduleResponse = {
  id: number;
  title: string;
  moduleId: number;
  message?: string;
};

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as TeacherLocationState | null) ?? null;
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

  const teacherUser = routeState?.userId ? routeState : storedTeacherUser;
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'module' | 'submodule' | 'ai' | null>(null);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [moduleSubtitle, setModuleSubtitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [modules, setModules] = useState<TeacherModule[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [appliedFilterQuery, setAppliedFilterQuery] = useState('');
  const [isSubmittingModule, setIsSubmittingModule] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [submoduleTitle, setSubmoduleTitle] = useState('');
  const [submoduleDescription, setSubmoduleDescription] = useState('');
  const [notifyProgram, setNotifyProgram] = useState<string | null>(null);
  const [notifyStudyLevel, setNotifyStudyLevel] = useState<string | null>(null);
  const [submoduleQuestions, setSubmoduleQuestions] = useState<SubmoduleQuestion[]>([]);
  const [isSubmittingSubmodule, setIsSubmittingSubmodule] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const moduleOptions = modules.map((module) => ({
    value: String(module.id),
    label: module.title,
  }));

  const filterSuggestions = useMemo<FilterSuggestion[]>(() => {
    const query = filterQuery.trim().toLowerCase();
    const moduleSuggestions = modules.map((module) => ({
      id: `module-${module.id}`,
      label: module.title,
      type: 'Module' as const,
    }));
    const tagSuggestions = Array.from(
      new Set(modules.flatMap((module) => module.tags)),
    ).map((tag) => ({
      id: `tag-${tag}`,
      label: tag,
      type: 'Tag' as const,
    }));

    return [...moduleSuggestions, ...tagSuggestions]
      .filter((item) => !query || item.label.toLowerCase().includes(query))
      .slice(0, 8);
  }, [filterQuery, modules]);

  const filteredModules = useMemo(() => {
    const query = appliedFilterQuery.trim().toLowerCase();

    if (!query) {
      return modules;
    }

    return modules.filter((module) => {
      const titleMatches = module.title.toLowerCase().includes(query);
      const subTitleMatches = module.subTitle.toLowerCase().includes(query);
      const tagMatches = module.tags.some((tag) => tag.toLowerCase().includes(query));

      return titleMatches || subTitleMatches || tagMatches;
    });
  }, [appliedFilterQuery, modules]);

  const loadTeacherModules = async (teacherId: number) => {
    setIsLoadingModules(true);

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/teacher-modules/teacher/${teacherId}`);
      const data = (await response.json()) as TeacherModule[] | { message?: string | string[] };

      if (!response.ok) {
        const message =
          'message' in data
            ? Array.isArray(data.message)
              ? data.message[0]
              : data.message
            : undefined;
        throw new Error(message || 'Unable to load teacher modules');
      }

      setModules(data as TeacherModule[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load teacher modules');
    } finally {
      setIsLoadingModules(false);
    }
  };

  useEffect(() => {
    if (teacherUser?.userId) {
      void loadTeacherModules(teacherUser.userId);
    }
  }, [teacherUser?.userId]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((currentTag) => currentTag !== tag);
      }

      return [...currentTags, tag];
    });
  };

  const handleCreateModule = async () => {
    setError('');
    setFeedback('');

    if (!teacherUser?.userId) {
      setError('No teacher is linked to this dashboard.');
      return;
    }

    setIsSubmittingModule(true);

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/teacher-modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: teacherUser.userId,
          title: moduleName,
          subTitle: moduleSubtitle,
          description: moduleDescription,
          tags: selectedTags,
        }),
      });

      const data = (await response.json()) as TeacherModule | { message?: string | string[] };

      if (!response.ok) {
        const message =
          'message' in data
            ? Array.isArray(data.message)
              ? data.message[0]
              : data.message
            : undefined;
        throw new Error(message || 'Unable to create module');
      }

      setFeedback('Module created successfully.');
      setModuleName('');
      setModuleSubtitle('');
      setModuleDescription('');
      setSelectedTags([]);
      setIsTagsOpen(false);
      setSelectedAction(null);

      await loadTeacherModules(teacherUser.userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create module');
    } finally {
      setIsSubmittingModule(false);
    }
  };

  const handleApplyFilter = () => {
    setAppliedFilterQuery(filterQuery.trim());
    setIsFilterOpen(false);
  };

  const handleClearFilter = () => {
    setFilterQuery('');
    setAppliedFilterQuery('');
    setIsFilterOpen(false);
  };

  const handleCreateSubmodule = async () => {
    setError('');
    setFeedback('');

    if (!teacherUser?.userId) {
      setError('No teacher is linked to this dashboard.');
      return;
    }

    if (!selectedModuleId) {
      setError('Please select a module first.');
      return;
    }

    setIsSubmittingSubmodule(true);

    try {
      const cleanedQuestions = submoduleQuestions
        .map((question) => ({
          value: question.value.trim(),
          answers: question.answers
            .map((answer) => ({
              value: answer.value.trim(),
              isGoodAnswer: answer.isGoodAnswer,
            }))
            .filter((answer) => answer.value),
        }))
        .filter((question) => question.value);

      const response = await fetch(`${VITE_API_BASE_URL}/teacher-submodules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: teacherUser.userId,
          moduleId: Number(selectedModuleId),
          title: submoduleTitle,
          description: submoduleDescription,
          program: notifyProgram,
          studyLevel: notifyStudyLevel,
          questions: cleanedQuestions,
        }),
      });

      const data = (await response.json()) as TeacherSubmoduleResponse | { message?: string | string[] };

      if (!response.ok) {
        const message =
          'message' in data
            ? Array.isArray(data.message)
              ? data.message[0]
              : data.message
            : undefined;
        throw new Error(message || 'Unable to create submodule');
      }

      const submoduleData = data as TeacherSubmoduleResponse;

      setFeedback(submoduleData.message ?? 'Submodule created successfully.');
      setSelectedAction(null);
      setSelectedModuleId(null);
      setSubmoduleTitle('');
      setSubmoduleDescription('');
      setNotifyProgram(null);
      setNotifyStudyLevel(null);
      setSubmoduleQuestions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create submodule');
    } finally {
      setIsSubmittingSubmodule(false);
    }
  };

  const updateQuestionValue = (questionId: string, value: string) => {
    setSubmoduleQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId ? { ...question, value } : question,
      ),
    );
  };

  const updateAnswerValue = (questionId: string, answerId: string, value: string) => {
    setSubmoduleQuestions((currentQuestions) =>
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
    setSubmoduleQuestions((currentQuestions) =>
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
    setSubmoduleQuestions((currentQuestions) => [...currentQuestions, createQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    setSubmoduleQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== questionId),
    );
  };

  const addAnswer = (questionId: string) => {
    setSubmoduleQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? { ...question, answers: [...question.answers, createAnswer()] }
          : question,
      ),
    );
  };

  const removeAnswer = (questionId: string, answerId: string) => {
    setSubmoduleQuestions((currentQuestions) =>
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

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <img
          src="/images/logo_cc_couleur.png"
          alt="Competency Cluster"
          className={classes.logo}
        />

        <CcText className={classes.welcomeText} color="#4f4f4f">
          Welcome on your HomePage Competency Cluster{teacherUser?.lastName ? `, ${teacherUser.lastName}.` : '.'}
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
              <span className={classes.headingText}>Modules</span>
            </CcTitle>
            <IconChevronRight size={30} stroke={1.8} className={classes.headingChevron} />
          </div>

          <div className={classes.actionsWrapper}>
            <CcButton
              variant="default-gradient"
              className={classes.actionsButton}
              onClick={() => setIsActionsOpen((value) => !value)}
            >
              <span className={classes.actionsButtonInner}>
                Actions
                <IconChevronDown size={18} stroke={2} />
              </span>
            </CcButton>

            {isActionsOpen ? (
              <div className={classes.dropdown}>
                {actionItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={classes.dropdownItem}
                    onClick={() => {
                      if (item === 'Create a module') {
                        setSelectedAction('module');
                      } else if (item === 'Create a Submodule') {
                        setSelectedAction('submodule');
                      } else {
                        setSelectedAction('ai');
                      }

                      setIsActionsOpen(false);
                    }}
                  >
                    <IconChevronRight size={36} stroke={1.8} />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {selectedAction === 'module' ? (
          <section className={classes.createModuleSection}>
            <div className={classes.createModuleLayout}>
              <div className={classes.leftFormColumn}>
                <TextInput
                  placeholder="Name of the module (Example : Next.js)"
                  radius="xl"
                  classNames={{ input: classes.moduleInput }}
                  value={moduleName}
                      onChange={(event) => setModuleName(event.currentTarget.value)}
                    />

                <TextInput
                      placeholder="Write a Sub-title"
                      radius="xl"
                      classNames={{ input: classes.moduleInput }}
                      value={moduleSubtitle}
                      onChange={(event) => setModuleSubtitle(event.currentTarget.value)}
                    />

                <div className={classes.tagsPanel}>
                  <div className={classes.tagsSearchRow}>
                    <TextInput
                      placeholder="Choose tags"
                      radius="xl"
                      classNames={{ input: classes.moduleInput }}
                      className={classes.tagsInput}
                      value={selectedTags.join(', ')}
                      readOnly
                      onFocus={() => setIsTagsOpen(true)}
                      onClick={() => setIsTagsOpen(true)}
                    />
                    <span className={classes.searchIcon}>⌕</span>
                  </div>

                  {isTagsOpen ? (
                    <div className={classes.tagsList}>
                      <button
                        type="button"
                        className={classes.closeTagsButton}
                        onClick={() => setIsTagsOpen(false)}
                      >
                        Close
                      </button>

                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`${classes.tagItem} ${selectedTags.includes(tag) ? classes.tagItemActive : ''}`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className={classes.rightFormColumn}>
                <div className={classes.formLogoWrapper}>
                  <img
                    src="/images/logo_cc_couleur.png"
                    alt="Competency Cluster"
                    className={classes.formLogo}
                  />
                </div>

                <Textarea
                  placeholder="Description..."
                  radius="xl"
                  autosize
                  minRows={10}
                  classNames={{ input: classes.moduleTextarea }}
                  value={moduleDescription}
                  onChange={(event) => setModuleDescription(event.currentTarget.value)}
                />

                <div className={classes.createButtonRow}>
                  <CcButton
                    variant="default-gradient"
                    className={classes.createButton}
                    onClick={() => void handleCreateModule()}
                    disabled={isSubmittingModule}
                  >
                    Create
                  </CcButton>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {selectedAction === 'submodule' ? (
          <section className={classes.createSubmoduleSection}>
            <div className={classes.createSubmoduleHeader}>
              <CcTitle order={2} withChevron={false}>
                <span className={classes.createSubmoduleTitle}>Create a submodule</span>
              </CcTitle>
              <IconChevronRight size={26} stroke={1.8} className={classes.createSubmoduleChevron} />
            </div>

            <div className={classes.createSubmoduleTop}>
              <div className={classes.createSubmoduleLeft}>
                <Select
                  placeholder="Select your Module"
                  data={moduleOptions}
                  value={selectedModuleId}
                  onChange={setSelectedModuleId}
                  radius="xl"
                  rightSectionPointerEvents="none"
                  classNames={{ input: classes.submoduleInput }}
                />

                <TextInput
                  placeholder="Name your submodule"
                  radius="xl"
                  classNames={{ input: classes.submoduleInput }}
                  value={submoduleTitle}
                  onChange={(event) => setSubmoduleTitle(event.currentTarget.value)}
                />
              </div>

              <Textarea
                placeholder="Short description..."
                radius="xl"
                autosize
                minRows={4}
                classNames={{ input: classes.submoduleDescriptionInput }}
                value={submoduleDescription}
                onChange={(event) => setSubmoduleDescription(event.currentTarget.value)}
              />

              <div className={classes.createSubmoduleRight}>
                <CcText size="sm" color="#8a8a8a" italic className={classes.notifyLabel}>
                  Notify student (optional)
                </CcText>

                <Select
                  placeholder="Select a program"
                  data={['CDA']}
                  value={notifyProgram}
                  onChange={setNotifyProgram}
                  radius="xl"
                  rightSectionPointerEvents="none"
                  classNames={{ input: classes.submoduleInput }}
                />

                <Select
                  placeholder="Select a study level"
                  data={['2025-2026']}
                  value={notifyStudyLevel}
                  onChange={setNotifyStudyLevel}
                  radius="xl"
                  rightSectionPointerEvents="none"
                  classNames={{ input: classes.submoduleInput }}
                />
              </div>
            </div>

            <div className={classes.questionsPanel}>
              <div className={classes.questionsPanelTop}>
                <CcText size="sm" color="#8a8a8a" italic>
                  Questions are optional for now, you can add them later.
                </CcText>

                <CcButton
                  variant="default-gradient"
                  className={classes.addQuestionButton}
                  onClick={addQuestion}
                >
                  Add question
                </CcButton>
              </div>

              {submoduleQuestions.length > 0 ? (
                <div className={classes.questionsList}>
                  {submoduleQuestions.map((question, questionIndex) => (
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
                              onChange={(event) =>
                                updateAnswerValue(question.id, answer.id, event.currentTarget.value)
                              }
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
              ) : (
                <div className={classes.questionsEmptyState}>
                  <CcText size="md" color="#8f8f8f">
                    No question yet. You can publish now or add them later.
                  </CcText>
                </div>
              )}
            </div>

            <div className={classes.publishButtonRow}>
              <CcButton
                variant="default-gradient"
                className={classes.publishButton}
                onClick={() => void handleCreateSubmodule()}
                disabled={isSubmittingSubmodule}
              >
                Publish
              </CcButton>
            </div>
          </section>
        ) : null}

        {feedback ? (
          <div className={classes.feedbackMessage}>
            <CcText size="sm" color="#2f9e44">
              {feedback}
            </CcText>
          </div>
        ) : null}

        {error ? (
          <div className={classes.feedbackMessage}>
            <CcText size="sm" color="#d94841">
              {error}
            </CcText>
          </div>
        ) : null}

        {selectedAction !== 'module' && modules.length === 0 ? (
          <section className={classes.emptyState}>
            <Box className={classes.emptyGlow} />
            <div className={classes.emptyCard}>
              <CcText size="xl" color="#7a7a7a" className={classes.emptyTitle}>
                No module created yet
              </CcText>
              <CcText size="md" color="#9c9c9c" className={classes.emptyText}>
                Use the Actions menu to create your first module.
              </CcText>
            </div>
          </section>
        ) : null}

        {selectedAction === 'ai' ? (
          <div className={classes.helperMessage}>
            <CcText size="md" color="#9c9c9c">
              Generate By AI flow will be added after module creation.
            </CcText>
          </div>
        ) : null}

        {isLoadingModules ? (
          <div className={classes.feedbackMessage}>
            <CcText size="sm" color="#9c9c9c">
              Loading modules...
            </CcText>
          </div>
        ) : null}

        {modules.length > 0 ? (
          <section className={classes.modulesSection}>
            <div className={classes.modulesLayout}>
              <div>
                {filteredModules.length === 0 ? (
                  <div className={classes.noFilterResults}>
                    <CcText size="md" color="#8a8a8a">
                      No module matches this filter.
                    </CcText>
                  </div>
                ) : null}

                <div className={classes.modulesList}>
                  {filteredModules.map((module) => (
                    <article
                      key={module.id}
                      className={classes.moduleCard}
                      onClick={() =>
                        navigate(`/teacher/modules/${module.id}/submodules`, {
                          state: {
                            module,
                            teacherUser,
                          },
                        })
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          navigate(`/teacher/modules/${module.id}/submodules`, {
                            state: {
                              module,
                              teacherUser,
                            },
                          });
                        }
                      }}
                    >
                      <div className={classes.moduleCardLeft}>
                        <h3 className={classes.moduleTitle}>
                          {module.title}
                          <span className={classes.moduleTitleChevron}>›</span>
                        </h3>

                        <p className={classes.moduleSubmodules}>
                          {module.submodulesCount} submodule{module.submodulesCount > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className={classes.moduleCardCenter}>
                        <CcCircleProgress value={75} size={118} thickness={8} label="text" />
                      </div>

                      <div className={classes.moduleCardRight}>
                        <p className={classes.moduleCategory}>{module.subTitle}</p>

                        <div className={classes.moduleTags}>
                          {module.tags.map((tag) => (
                            <span key={`${module.id}-${tag}`} className={classes.moduleTag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className={classes.filterRail}>
                <button
                  type="button"
                  className={classes.filterButton}
                  onClick={() => setIsFilterOpen(true)}
                >
                  <IconFilter size={22} />
                  Filter
                </button>

                {appliedFilterQuery ? (
                  <button type="button" className={classes.clearFilterButton} onClick={handleClearFilter}>
                    Clear
                  </button>
                ) : null}
              </aside>
            </div>
          </section>
        ) : null}

        {isFilterOpen ? (
          <div className={classes.filterOverlay} onClick={() => setIsFilterOpen(false)}>
            <div
              className={classes.filterDialog}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <h3 className={classes.filterTitle}>Filter modules</h3>

              <div className={classes.filterSearchRow}>
                <TextInput
                  placeholder="Search by title, subtitle or tag"
                  radius="xl"
                  classNames={{ input: classes.filterInput }}
                  value={filterQuery}
                  onChange={(event) => setFilterQuery(event.currentTarget.value)}
                />
                <IconSearch size={20} className={classes.filterSearchIcon} />
              </div>

              <div className={classes.filterResults}>
                {filterSuggestions.length > 0 ? (
                  filterSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className={`${classes.filterResultItem} ${
                        suggestion.type === 'Tag' ? classes.filterResultTag : classes.filterResultModule
                      }`}
                      onClick={() => setFilterQuery(suggestion.label)}
                    >
                      <span>{suggestion.label}</span>
                      <span className={classes.filterResultType}>{suggestion.type}</span>
                    </button>
                  ))
                ) : (
                  <p className={classes.filterNoResult}>No suggestion found.</p>
                )}
              </div>

              <div className={classes.filterActions}>
                <button type="button" className={classes.filterCancelButton} onClick={handleClearFilter}>
                  Cancel
                </button>
                <button type="button" className={classes.filterSearchButton} onClick={handleApplyFilter}>
                  Search
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
