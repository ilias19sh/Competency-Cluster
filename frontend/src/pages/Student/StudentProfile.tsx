import { useEffect, useMemo, useState } from 'react';
import { IconBell, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { LogoutButton } from '../../components/LogoutButton';
import { VITE_API_BASE_URL } from '../../config/api';
import { getAuthUser } from '../../utils/authSession';
import classes from './StudentProfile.module.css';

type RecentAttempt = {
  id: number;
  score: number;
  submoduleTitle: string;
  earnedElos: number;
};

type StudentProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  points: number;
  program: string;
  studyLevel: string;
  promo: string;
  attemptsCount: number;
  averageScore: number;
  recentAttempts: RecentAttempt[];
};

export default function StudentProfile() {
  const authUser = useMemo(() => getAuthUser(), []);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authUser?.userId) {
      setError('Utilisateur introuvable');
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${VITE_API_BASE_URL}/student-modules/student/${authUser.userId}/profile`);
        const data = (await response.json()) as StudentProfileData | { message?: string | string[] };

        if (!response.ok) {
          const message =
            'message' in data
              ? Array.isArray(data.message)
                ? data.message[0]
                : data.message
              : undefined;
          throw new Error(message || 'Impossible de charger le profil');
        }

        setProfile(data as StudentProfileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger le profil');
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [authUser?.userId]);

  const initials = profile ? `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase() : '';

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
            <Link to="/student/profile" className={classes.navLink}>My profile</Link>
          </nav>
        </div>

        <div className={classes.headerRight}>
          <IconSettings size={18} stroke={1.8} className={classes.headerIcon} />
          <IconBell size={18} stroke={1.8} className={classes.headerIcon} />
          <LogoutButton />
          <div className={classes.avatarSmall}>
            <IconUserCircle size={24} stroke={1.8} />
          </div>
        </div>
      </header>

      <section className={classes.profileShell}>
        <div className={classes.heroBand} />

        {isLoading ? <p className={classes.statusMessage}>Loading profile...</p> : null}
        {error ? <p className={classes.errorMessage}>{error}</p> : null}

        {profile ? (
          <>
            <section className={classes.identityRow}>
              <div className={classes.identityLeft}>
                <div className={classes.avatarLarge}>{initials || 'S'}</div>
                <div>
                  <h1>{profile.firstName} {profile.lastName}</h1>
                  <p>{profile.email}</p>
                </div>
              </div>

              <div className={classes.pointsBlock}>
                <strong>{profile.points}</strong>
                <span>elos</span>
              </div>

              <div className={classes.programBlock}>
                <strong>{profile.program}</strong>
                <span>{profile.studyLevel}</span>
              </div>
            </section>

            <section className={classes.statsRow}>
              <div className={classes.statBubble}>
                <strong>{profile.attemptsCount}</strong>
                <span>quiz</span>
              </div>
              <div className={classes.statBubbleLarge}>
                <strong>{profile.averageScore}%</strong>
                <span>average</span>
              </div>
              <div className={classes.statBubble}>
                <strong>{profile.promo}</strong>
                <span>promo</span>
              </div>
            </section>

            <section className={classes.attemptsList}>
              {profile.recentAttempts.length > 0 ? (
                profile.recentAttempts.map((attempt) => (
                  <article key={attempt.id} className={classes.attemptItem}>
                    <span>{attempt.submoduleTitle} &gt;</span>
                    <div>
                      <span>{attempt.score}%</span>
                      <span>+ {attempt.earnedElos} elos</span>
                    </div>
                  </article>
                ))
              ) : (
                <article className={classes.attemptItem}>
                  <span>No quiz completed yet &gt;</span>
                  <div>
                    <span>0%</span>
                    <span>+ 0 elos</span>
                  </div>
                </article>
              )}
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}
