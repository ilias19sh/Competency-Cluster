import { useEffect, useMemo, useState } from 'react';
import { TextInput } from '@mantine/core';
import { IconBell, IconChevronRight, IconFilter, IconSearch, IconSettings } from '@tabler/icons-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CcButton, CcCircleProgress, CcText, CcTitle } from '../../components';
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
  submodules: StudentSubmodule[];
};

type StudentSubmodule = {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
};

type DisplaySubmodule = StudentSubmodule & {
  moduleId: number;
  moduleTitle: string;
  moduleSubTitle: string;
  tags: string[];
};

type RouteState = {
  module?: StudentModule | null;
};

type FilterSuggestion = {
  id: string;
  label: string;
  type: 'Submodule' | 'Module' | 'Tag';
};

export default function StudentSubmodules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId } = useParams();
  const routeState = (location.state as RouteState | null) ?? null;
  const [modules, setModules] = useState<StudentModule[]>(routeState?.module ? [routeState.module] : []);
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
          throw new Error(message || 'Impossible de charger les submodules');
        }

        setModules(data as StudentModule[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les submodules');
      } finally {
        setIsLoading(false);
      }
    };

    void loadModules();
  }, []);

  const selectedModule = useMemo(
    () => modules.find((module) => String(module.id) === String(moduleId)) ?? routeState?.module ?? null,
    [moduleId, modules, routeState?.module],
  );

  const submodules = useMemo<DisplaySubmodule[]>(() => {
    const sourceModules = moduleId ? modules.filter((module) => String(module.id) === String(moduleId)) : modules;

    return sourceModules.flatMap((module) =>
      module.submodules.map((submodule) => ({
        ...submodule,
        moduleId: module.id,
        moduleTitle: module.title,
        moduleSubTitle: module.subTitle,
        tags: module.tags,
      })),
    );
  }, [moduleId, modules]);

  const filterSuggestions = useMemo<FilterSuggestion[]>(() => {
    const query = filterQuery.trim().toLowerCase();
    const submoduleSuggestions = submodules.map((submodule) => ({
      id: `submodule-${submodule.id}`,
      label: submodule.title,
      type: 'Submodule' as const,
    }));
    const moduleSuggestions = Array.from(new Set(submodules.map((submodule) => submodule.moduleTitle))).map((title) => ({
      id: `module-${title}`,
      label: title,
      type: 'Module' as const,
    }));
    const tagSuggestions = Array.from(new Set(submodules.flatMap((submodule) => submodule.tags))).map((tag) => ({
      id: `tag-${tag}`,
      label: tag,
      type: 'Tag' as const,
    }));

    return [...submoduleSuggestions, ...moduleSuggestions, ...tagSuggestions]
      .filter((item) => !query || item.label.toLowerCase().includes(query))
      .slice(0, 8);
  }, [filterQuery, submodules]);

  const filteredSubmodules = useMemo(() => {
    const query = appliedFilterQuery.trim().toLowerCase();

    if (!query) {
      return submodules;
    }

    return submodules.filter(
      (submodule) =>
        submodule.title.toLowerCase().includes(query) ||
        submodule.description.toLowerCase().includes(query) ||
        submodule.moduleTitle.toLowerCase().includes(query) ||
        submodule.moduleSubTitle.toLowerCase().includes(query) ||
        submodule.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [appliedFilterQuery, submodules]);

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
          Student submodules
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
              <span className={classes.headingText}>{selectedModule ? selectedModule.title : 'Submodules'}</span>
            </CcTitle>
            <IconChevronRight size={30} stroke={1.8} className={classes.headingChevron} />
          </div>

          <CcButton variant="default-gradient" className={classes.backButton} onClick={() => navigate('/student/modules')}>
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
              Loading submodules...
            </CcText>
          </div>
        ) : null}

        {!isLoading && submodules.length === 0 ? (
          <section className={classes.emptyState}>
            <div className={classes.emptyCard}>
              <CcText size="xl" color="#7a7a7a" className={classes.emptyTitle}>
                No submodule available yet
              </CcText>
              <CcText size="md" color="#9c9c9c">
                Submodules created by teachers from your school will appear here.
              </CcText>
            </div>
          </section>
        ) : null}

        {submodules.length > 0 ? (
          <section className={classes.submodulesLayout}>
            <div>
              {filteredSubmodules.length === 0 ? (
                <div className={classes.noFilterResults}>
                  <CcText size="md" color="#8a8a8a">
                    No submodule matches this filter.
                  </CcText>
                </div>
              ) : null}

              <div className={classes.submoduleGrid}>
                {filteredSubmodules.map((submodule) => (
                  <article key={submodule.id} className={classes.submoduleCard}>
                    <div className={classes.submoduleCardHeader}>
                      <h3 className={classes.submoduleTitle}>{submodule.title}</h3>
                    </div>

                    <div className={classes.submoduleCardBody}>
                      <CcCircleProgress value={0} size={136} thickness={9} label="Success" />
                      <p className={classes.questionCount}>{submodule.questionsCount} questions</p>
                    </div>

                    <div className={classes.submoduleCardFooter}>
                      <p className={classes.submoduleDescription}>
                        {submodule.description || submodule.moduleSubTitle || 'Submodule ready to be completed.'}
                      </p>
                      <span className={classes.submoduleModuleName}>{submodule.moduleTitle}</span>
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
          </section>
        ) : null}

        {isFilterOpen ? (
          <div className={classes.filterOverlay} onClick={() => setIsFilterOpen(false)}>
            <div className={classes.filterDialog} onClick={(event) => event.stopPropagation()}>
              <h3 className={classes.filterTitle}>Filter submodules</h3>

              <div className={classes.filterSearchRow}>
                <TextInput
                  placeholder="Search by submodule, module or tag"
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
