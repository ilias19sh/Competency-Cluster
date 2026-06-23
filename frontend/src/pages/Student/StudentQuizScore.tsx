import { useEffect, useMemo, useState } from 'react';
import { IconBell, IconChevronRight, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { VITE_API_BASE_URL } from '../../config/api';
import { getAuthUser } from '../../utils/authSession';
import classes from './StudentQuizScore.module.css';

type StudentSubmodule = {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
};

type StudentModule = {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  tags: string[];
  submodules: StudentSubmodule[];
};

type ScoreState = {
  score?: number;
  earnedElos?: number;
  submoduleTitle?: string;
  moduleId?: number;
};

type DisplaySubmodule = StudentSubmodule & {
  moduleId: number;
  moduleTitle: string;
};

const getRankMessage = (score: number) => {
  if (score >= 90) {
    return 'You reached Diamond, congratulations !';
  }

  if (score >= 70) {
    return 'You reached Gold, keep going !';
  }

  if (score >= 50) {
    return 'You reached Silver, nice progress !';
  }

  return 'Keep training, your next level is close !';
};

export default function StudentQuizScore() {
  const navigate = useNavigate();
  const location = useLocation();
  const { submoduleId } = useParams();
  const state = (location.state as ScoreState | null) ?? null;
  const authUser = useMemo(() => getAuthUser(), []);
  const [modules, setModules] = useState<StudentModule[]>([]);
  const [error, setError] = useState('');

  const score = state?.score ?? 0;
  const earnedElos = state?.earnedElos ?? Math.round(score * 0.26);
  const submoduleTitle = state?.submoduleTitle ?? 'Submodule';

  useEffect(() => {
    if (!authUser?.userId) {
      setError('Utilisateur introuvable');
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
      }
    };

    void loadModules();
  }, [authUser?.userId]);

  const otherSubmodules = useMemo<DisplaySubmodule[]>(() => {
    return modules
      .flatMap((module) =>
        module.submodules.map((submodule) => ({
          ...submodule,
          moduleId: module.id,
          moduleTitle: module.title,
        })),
      )
      .filter((submodule) => String(submodule.id) !== String(submoduleId))
      .slice(0, 8);
  }, [modules, submoduleId]);

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

      <section className={classes.hero}>
        <button type="button" className={classes.homeButton} onClick={() => navigate('/student')}>
          Back to home
        </button>

        <div className={classes.scoreCircle}>
          <span className={classes.scoreValue}>{score}%</span>
          <span className={classes.scoreLabel}>{submoduleTitle}</span>
        </div>

        <p className={classes.elos}>+ {earnedElos} elos</p>

        <button
          type="button"
          className={classes.rankMessage}
          onClick={() => navigate(state?.moduleId ? `/student/modules/${state.moduleId}/submodules` : '/student/submodules')}
        >
          <span>{getRankMessage(score)}</span>
          <IconChevronRight size={22} stroke={1.8} />
        </button>
      </section>

      <section className={classes.otherSection}>
        <button type="button" className={classes.otherTitle} onClick={() => navigate('/student/submodules')}>
          <span>Other submodules</span>
          <IconChevronRight size={22} stroke={1.8} />
        </button>

        {error ? <p className={classes.errorMessage}>{error}</p> : null}

        <div className={classes.submoduleRail}>
          {otherSubmodules.map((submodule) => (
            <article
              key={submodule.id}
              className={classes.submoduleCard}
              onClick={() => navigate(`/student/submodules/${submodule.id}/quiz`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  navigate(`/student/submodules/${submodule.id}/quiz`);
                }
              }}
            >
              <div className={classes.cardHeader}>
                <span>{submodule.moduleTitle}</span>
              </div>
              <h3>{submodule.title}</h3>
              <p>{submodule.description || 'Ready to practice.'}</p>
              <div className={classes.cardFooter}>
                <span>{submodule.questionsCount} questions</span>
                <span className={classes.cardDot} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
