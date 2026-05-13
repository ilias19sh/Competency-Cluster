import { Box } from '@mantine/core';
import {IconBell,IconChevronRight,IconSettings,IconTrendingUp,IconUserCircle,} from '@tabler/icons-react';
import { CcButton, CcCard, CcCircleProgress, CcText, CcTitle } from '../../components';
import classes from './StudentHome.module.css';

const progressItems = [
  { label: 'React.js', value: 75 },
  { label: 'Docker', value: 75 },
  { label: 'MySQL', value: 75 },
];

const goals = [
  { title: 'Get 80% on the React sub-module', reward: '+8 elos' },
  { title: 'Being level master on html', reward: '+100 elos', highlighted: true },
  { title: 'Complete the Docker challenge', reward: '+8 elos' },
  { title: 'Get 80% on the React sub-module', reward: '+8 elos' },
  { title: 'Get 80% on the React sub-module', reward: '+8 elos' },
];

const rankingTabs = [
  { label: 'All' },
  { label: 'Classe', active: true },
  { label: 'Campus' },
];

const submodules = [
  {
    title: 'React',
    category: 'Javascript',
    description: 'Library Javascript that using concepts like components, hooks, etc...',
    footer: '43 masters in your school',
  },
  {
    title: 'React',
    category: 'Javascript',
    description: 'Library Javascript that using concepts like components, hooks, etc...',
    footer: '43 masters in your school',
  },
  {
    title: 'React',
    category: 'Javascript',
    description: 'Library Javascript that using concepts like components, hooks, etc...',
    footer: '43 masters in your school',
  },
  {
    title: 'React',
    category: 'Javascript',
    description: 'Library Javascript that using concepts like components, hooks, etc...',
    footer: '43 masters in your school',
  },
];

export default function StudentHome() {
  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <div className={classes.headerLeft}>
          <img
            src="/images/logo_cc_couleur.png"
            alt="Competency Cluster"
            className={classes.logo}
          />

          <nav className={classes.nav}>
            <a href="#modules" className={classes.navLink}>Modules</a>
            <a href="#ranking" className={classes.navLink}>Ranking</a>
            <a href="#profile" className={classes.navLink}>My profile</a>
          </nav>
        </div>

        <div className={classes.headerRight}>
          <IconSettings size={22} stroke={1.8} className={classes.headerIcon} />
          <IconBell size={22} stroke={1.8} className={classes.headerIcon} />
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
          <IconChevronRight size={30} stroke={1.8} className={classes.sectionChevron} />
        </div>

        <div className={classes.progressMetrics}>
          {progressItems.map((item) => (
            <div key={item.label} className={classes.progressCircleItem}>
              <div className={classes.circleShadow}>
                <CcCircleProgress value={item.value} size={110} thickness={8} />
              </div>
              <CcText size="sm" color="#c08bb0" className={classes.progressLabel}>
                {item.label}
              </CcText>
            </div>
          ))}
        </div>

        <div className={classes.progressAction}>
          <CcButton variant="default-gradient" className={classes.continueButton}>
            Continue
          </CcButton>
        </div>
      </section>

      <section className={classes.dashboardGrid}>
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
      </section>

      <div className={classes.separator} />

      <section className={classes.submodulesSection} id="modules">
        <div className={classes.submoduleHeading}>
          <CcTitle order={2} withChevron={false}>
            <span className={classes.submoduleTitle}>Submodules</span>
          </CcTitle>
          <IconChevronRight size={28} stroke={1.8} className={classes.sectionChevron} />
        </div>

        <div className={classes.submoduleGrid}>
          {submodules.map((module, index) => (
            <CcCard
              key={`${module.title}-${index}`}
              className={classes.submoduleCard}
              withStack={false}
              p="0.7rem"
              radius="1rem"
            >
              <div className={classes.submoduleHero}>
                <span className={classes.submoduleCategory}>{module.category}</span>
                <span className={classes.submoduleName}>{module.title}</span>
              </div>

              <div className={classes.submoduleBody}>
                <CcText size="sm" color="#666666">
                  {module.description}
                </CcText>
              </div>

              <div className={classes.submoduleFooter}>
                <CcText size="sm" color="#b18ce8">
                  {module.footer}
                </CcText>
                <Box className={classes.submoduleDot} />
              </div>
            </CcCard>
          ))}
        </div>
      </section>
    </main>
  );
}
