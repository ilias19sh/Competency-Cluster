import { useEffect, useMemo, useState } from 'react';
import { TextInput } from '@mantine/core';
import { IconBell, IconChevronRight, IconFilter, IconSearch, IconSettings } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CcButton, CcCircleProgress, CcText, CcTitle } from '../../components';
import { LogoutButton } from '../../components/LogoutButton';
import { VITE_API_BASE_URL } from '../../config/api';
import { getAuthUser } from '../../utils/authSession';
import classes from './StudentModules.module.css';

type StudentModule = {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  tags: string[];
  submodules: {
    id: number;
    title: string;
    description: string;
    questionsCount: number;
  }[];
};

type FilterSuggestion = {
  id: string;
  label: string;
  type: 'Module' | 'Tag' | 'Teacher';
};

export default function StudentModules() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<StudentModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [appliedFilterQuery, setAppliedFilterQuery] = useState('');

  useEffect(() => {
    const authUser = getAuthUser();

    if (!authUser?.userId) {
      setError('Utilisateur introuvable');
      setIsLoading(false);
      return;
    }

    const loadModules = async () => {
      try {
        const response = await fetch(`${VITE_API_BASE_URL}/student-modules/student/${authUser.userId}`);
        const data = (await response.json()) as StudentModule[] | { message?: string | string[] };

        if (!response.ok) {
          const message =
            'message' in data
              ? Array.isArray(data.message)
                ? data.message[0]
                : data.message
              : undefined;
          throw new Error(message || 'Impossible de charger les modules');
        }

        setModules(data as StudentModule[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les modules');
      } finally {
        setIsLoading(false);
      }
    };

    void loadModules();
  }, []);

  // Meme logique que la page teacher: recherche par module, tag ou professeur, mais sans action de creation.
  const filterSuggestions = useMemo<FilterSuggestion[]>(() => {
    const query = filterQuery.trim().toLowerCase();
    const moduleSuggestions = modules.map((module) => ({
      id: `module-${module.id}`,
      label: module.title,
      type: 'Module' as const,
    }));
    const tagSuggestions = Array.from(new Set(modules.flatMap((module) => module.tags))).map((tag) => ({
      id: `tag-${tag}`,
      label: tag,
      type: 'Tag' as const,
    }));
    const teacherSuggestions = Array.from(
      new Set(modules.map((module) => `${module.teacher.firstName} ${module.teacher.lastName}`.trim())),
    )
      .filter(Boolean)
      .map((teacherName) => ({
        id: `teacher-${teacherName}`,
        label: teacherName,
        type: 'Teacher' as const,
      }));

    return [...moduleSuggestions, ...tagSuggestions, ...teacherSuggestions]
      .filter((item) => !query || item.label.toLowerCase().includes(query))
      .slice(0, 8);
  }, [filterQuery, modules]);

  const filteredModules = useMemo(() => {
    const query = appliedFilterQuery.trim().toLowerCase();

    if (!query) {
      return modules;
    }

    return modules.filter((module) => {
      const teacherName = `${module.teacher.firstName} ${module.teacher.lastName}`.toLowerCase();

      return (
        module.title.toLowerCase().includes(query) ||
        module.subTitle.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        teacherName.includes(query) ||
        module.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [appliedFilterQuery, modules]);

  const handleApplyFilter = () => {
    setAppliedFilterQuery(filterQuery.trim());
    setIsFilterOpen(false);
  };

  const handleClearFilter = () => {
    setFilterQuery('');
    setAppliedFilterQuery('');
    setIsFilterOpen(false);
  };

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <button type="button" className={classes.logoButton} onClick={() => navigate('/student')} aria-label="Retour a l'accueil student">
          <img src="/images/logo_cc_couleur.png" alt="Competency Cluster" className={classes.logo} />
        </button>

        <CcText className={classes.welcomeText} color="#4f4f4f">
          Student modules
        </CcText>

        <div className={classes.headerActions}>
          <IconSettings size={20} stroke={1.8} className={classes.headerIcon} />
          <IconBell size={20} stroke={1.8} className={classes.headerIcon} />
          <LogoutButton />
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

          <CcButton variant="default-gradient" className={classes.backButton} onClick={() => navigate('/student')}>
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

        {isLoading ? (
          <div className={classes.feedbackMessage}>
            <CcText size="sm" color="#9c9c9c">
              Loading modules...
            </CcText>
          </div>
        ) : null}

        {!isLoading && modules.length === 0 ? (
          <section className={classes.emptyState}>
            <div className={classes.emptyCard}>
              <CcText size="xl" color="#7a7a7a" className={classes.emptyTitle}>
                No module available yet
              </CcText>
              <CcText size="md" color="#9c9c9c">
                Modules created by teachers from your school will appear here.
              </CcText>
            </div>
          </section>
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
                        navigate(`/student/modules/${module.id}/submodules`, {
                          state: { module },
                        })
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          navigate(`/student/modules/${module.id}/submodules`, {
                            state: { module },
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
                          {module.submodules.length} submodule{module.submodules.length > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className={classes.moduleCardCenter}>
                        <CcCircleProgress value={0} size={118} thickness={8} label="text" />
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
                <button type="button" className={classes.filterButton} onClick={() => setIsFilterOpen(true)}>
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
            <div className={classes.filterDialog} onClick={(event) => event.stopPropagation()}>
              <h3 className={classes.filterTitle}>Filter modules</h3>

              <div className={classes.filterSearchRow}>
                <TextInput
                  placeholder="Search by title, subtitle, tag or teacher"
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
