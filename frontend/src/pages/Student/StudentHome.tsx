import { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { IconBell, IconChevronRight, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { CcButton, CcCard, CcCircleProgress, CcText, CcTitle } from '../../components';
import { LogoutButton } from '../../components/LogoutButton';
import { VITE_API_BASE_URL } from '../../config/api';
import { getAuthUser } from '../../utils/authSession';
import classes from './StudentHome.module.css';

// const goals = [
//   { title: 'Get 80% on the React sub-module', reward: '+8 elos' },
//   { title: 'Being level master on html', reward: '+100 elos', highlighted: true },
//   { title: 'Complete the Docker challenge', reward: '+8 elos' },
//   { title: 'Get 80% on the React sub-module', reward: '+8 elos' },
//   { title: 'Get 80% on the React sub-module', reward: '+8 elos' },
// ];

// const rankingTabs = [
//   { label: 'All' },
//   { label: 'Classe', active: true },
//   { label: 'Campus' },
// ];

type StudentModule = {  //type pour etudiant
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

export default function StudentHome() {
  const navigate = useNavigate();
  const [studentModules, setStudentModules] = useState<StudentModule[]>([]); // modules qui ont ete recuperer depuis notre back 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const authUser = getAuthUser();

    if (!authUser?.userId) {
      setError('Utilisateur introuvable');
      setIsLoading(false);
      return;
    }

    const fetchStudentModules = async () => {
      try {
        const response = await fetch(`${VITE_API_BASE_URL}/student-modules/student/${authUser.userId}`);

        if (!response.ok) {
          throw new Error('Impossible de charger les modules');
        }

        const data = await response.json() as StudentModule[]; //json en tableau
        setStudentModules(data);
      } catch {
        setError('Impossible de charger les modules');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStudentModules();
  }, []);

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <div className={classes.headerLeft}>
          <Link to="/student" className={classes.logoLink} aria-label="Retour a l'accueil student">
            <img
              src="/images/logo_cc_couleur.png"
              alt="Competency Cluster"
              className={classes.logo}
            />
          </Link>

          <nav className={classes.nav}>
            <Link to="/student/modules" className={classes.navLink}>Modules</Link>
            <Link to="/student/submodules" className={classes.navLink}>Submodules</Link>
            <Link to="/student/profile" className={classes.navLink}>My profile</Link>
          </nav>
        </div>

        <div className={classes.headerRight}>
          <IconSettings size={22} stroke={1.8} className={classes.headerIcon} />
          <IconBell size={22} stroke={1.8} className={classes.headerIcon} />
          <LogoutButton />
          <div className={classes.avatar}>
            <IconUserCircle size={26} stroke={1.8} />
          </div>
        </div>
      </header>

      <section className={classes.progressHero}>
        <div className={classes.progressIntro}>
          <CcTitle order={1} withChevron={false}>
            <span className={classes.progressTitle}>Progression</span>
          </CcTitle>
          <IconChevronRight
            size={30}
            stroke={1.8}
            className={classes.sectionChevron}
            onClick={() => navigate('/student/modules')}
          />
        </div>

        <div className={classes.progressMetrics}>
          {studentModules.map((module) => (
            <div key={module.id} className={classes.progressCircleItem}>
              <div className={classes.circleShadow}>
                <CcCircleProgress value={0} size={110} thickness={8} />
              </div>
              <CcText size="sm" color="#c08bb0" className={classes.progressLabel}>
                {module.title}
              </CcText>
            </div>
          ))}
        </div>

        <div className={classes.progressAction}>
          <CcButton variant="default-gradient" className={classes.continueButton} onClick={() => navigate('/student/modules')}>
            Continue
          </CcButton>
        </div>
      </section>

      <section className={classes.dashboardGrid}>
        {/*
        <CcCard className={classes.goalsCard} withStack={false} p="1rem" radius="1.25rem">
          <div className={classes.cardHeader}>
            <CcText size="sm" color="#8a82b6">Goals&gt;</CcText>
            <span className={classes.pillViolet}>All goals</span>
          </div>

          <div className={classes.goalList}>
            {goals.map((goal, index) => (
              <div key={`${goal.title}-${index}`} className={classes.goalItem}>
                <CcText size="md" color="#6d6d6d">{goal.title}</CcText>
                <div className={classes.goalReward}>
                  {goal.highlighted ? <span className={classes.goalBadge}>✦</span> : null}
                  <CcText size="sm" color="#d19bdb">{goal.reward}</CcText>
                </div>
              </div>
            ))}
          </div>
        </CcCard>
        */}

        {/*
        <CcCard className={classes.rankingCard} withStack={false} p="1rem" radius="1.25rem">
          <div className={classes.cardHeader}>
            <CcText size="sm" color="#8f8f8f">Ranking&gt;</CcText>
            <span className={classes.pillOrange}>Ranking</span>
          </div>

          <div className={classes.rankingContent}>
            <div className={classes.rankingTabs}>
              {rankingTabs.map((tab) => (
                <div
                  key={tab.label}
                  className={`${classes.rankingTab} ${tab.active ? classes.rankingTabActive : ''}`}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            <div className={classes.rankingMain}>
              <div className={classes.rankingScoreBox}>
                <span className={classes.rankingScore}>1 / 27</span>
              </div>

              <div className={classes.rankingStats}>
                <CcText size="sm" color="#b89ce8">+26 elos this week</CcText>
                <CcText size="sm" color="#c58ad1">472 elos</CcText>
                <div className={classes.rankingTrend}>
                  <IconTrendingUp size={18} stroke={2} />
                  <span>2</span>
                </div>
              </div>
            </div>
          </div>
        </CcCard>
        */}
      </section>

      <div className={classes.separator} />

      <section className={classes.submodulesSection} id="modules">
        <div className={classes.submoduleHeading}>
          <CcTitle order={2} withChevron={false}>
            <span className={classes.submoduleTitle}>Submodules</span>
          </CcTitle>
          <IconChevronRight
            size={28}
            stroke={1.8}
            className={classes.sectionChevron}
            onClick={() => navigate('/student/submodules')}
          />
        </div>

        {isLoading ? (
          <CcText size="sm" color="#666666">Chargement des submodules...</CcText>
        ) : error ? (
          <CcText size="sm" color="#c45d5d">{error}</CcText>
        ) : (
          <div className={classes.submoduleGrid}>
            {studentModules.flatMap((module) =>
              module.submodules.map((submodule) => (
                <CcCard
                  key={submodule.id}
                  className={classes.submoduleCard}
                  withStack={false}
                  p="0.7rem"
                  radius="1rem"
                >
                  <div className={classes.submoduleHero}>
                    <span className={classes.submoduleCategory}>{module.title}</span>
                    <span className={classes.submoduleName}>{submodule.title}</span>
                  </div>

                  <div className={classes.submoduleBody}>
                    <CcText size="sm" color="#666666">
                      {submodule.description}
                    </CcText>
                  </div>

                  <div className={classes.submoduleFooter}>
                    <CcText size="sm" color="#b18ce8">
                      {submodule.questionsCount} questions
                    </CcText>
                    <Box className={classes.submoduleDot} />
                  </div>
                </CcCard>
              )),
            )}
          </div>
        )}
      </section>
    </main>
  );
}
