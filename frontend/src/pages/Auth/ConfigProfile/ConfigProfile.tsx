import { Checkbox, Select, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CcButton } from '../../../components/actions/CcButton/CcButton.component';
import { CcCard } from '../../../components/displayData/CcCard/CcCard.component';
import { CcCircleProgress } from '../../../components/progress/CcCircleProgressBar/CcCircleProgressBar.component';
import { CcProgressBar } from '../../../components/progress/CcProgressBar/CcProgressBar.component';
import { CcText } from '../../../components/typography/CcText/CcText.component';
import { CcTitle } from '../../../components/typography/CcTitle/CcTitle.component';
import classes from './ConfigProfile.module.css';

type ConfigProfileLocationState = {
  userId?: number;
  email?: string;
};

type CompleteProfileResponse = {
  role?: 'admin' | 'teacher' | 'student';
  message?: string | string[];
};

type ConfigProfileScreen = 'form' | 'verification' | 'completed';

export default function ConfigProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ConfigProfileLocationState | null) ?? null;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [program, setProgram] = useState<string | null>(null);
  const [studyLevel, setStudyLevel] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screen, setScreen] = useState<ConfigProfileScreen>('form');
  const [assignedRole, setAssignedRole] = useState<'admin' | 'teacher' | 'student' | null>(null);

  const handleNext = async () => {
    setError('');
    setSuccess('');

    if (!state?.userId) {
      setError('No user is linked to this profile setup.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: state.userId,
          firstName,
          lastName,
          phone,
          isTeacher,
          program: isTeacher ? null : program,
          studyLevel: isTeacher ? null : studyLevel,
        }),
      });

      const data = (await response.json()) as CompleteProfileResponse;

      if (!response.ok) {
        const message = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(message || 'Unable to save your profile');
      }

      setAssignedRole(data.role ?? 'student');
      setSuccess('Your profile has been completed successfully.');
      setScreen('verification');

      window.setTimeout(() => {
        setScreen('completed');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStart = () => {
    if (assignedRole === 'teacher') {
      navigate('/teacher');
      return;
    }

    if (assignedRole === 'admin') {
      navigate('/admin');
      return;
    }

    navigate('/student');
  };

  return (
    <main className={classes.page}>
      {screen === 'form' ? (
        <div className={classes.logoWrapper}>
          <img
            src="/images/logo_cc_couleur.png"
            alt="Competency Cluster"
            className={classes.logo}
          />
        </div>
      ) : null}

      <section className={classes.progressSection}>
        <div className={classes.progressWrapper}>
          <CcProgressBar value={screen === 'form' ? 50 : screen === 'verification' ? 90 : 100} size="lg" />
        </div>
      </section>

      {screen === 'form' ? (
        <>
          <section className={classes.cardSection}>
            <div className={classes.cardGlow} />

            <CcCard className={classes.card} withStack={false} p="2.4rem" radius="2rem">
              <div className={classes.cardContent}>
                <div className={classes.titleBlock}>
                  <CcTitle
                    order={1}
                    withChevron={false}
                    bold
                  >
                    Complete your profile
                  </CcTitle>
                  {state?.email ? (
                    <CcText size="sm" color="#9a9a9a">
                      Continue your setup for {state.email}
                    </CcText>
                  ) : null}
                </div>

                <div className={classes.formGrid}>
                  <TextInput
                    placeholder="Firstname"
                    radius="md"
                    classNames={{ input: classes.input }}
                    value={firstName}
                    onChange={(event) => setFirstName(event.currentTarget.value)}
                  />

                  <TextInput
                    placeholder="Lastname"
                    radius="md"
                    classNames={{ input: classes.input }}
                    value={lastName}
                    onChange={(event) => setLastName(event.currentTarget.value)}
                  />

                  <TextInput
                    placeholder="Phone number"
                    radius="md"
                    className={classes.fullWidth}
                    classNames={{ input: classes.input }}
                    value={phone}
                    onChange={(event) => setPhone(event.currentTarget.value)}
                  />
                </div>

                <div className={classes.teacherBlock}>
                  <Checkbox
                    label="I am a teacher"
                    color="violet"
                    checked={isTeacher}
                    onChange={(event) => {
                      const checked = event.currentTarget.checked;
                      setIsTeacher(checked);

                      if (checked) {
                        setProgram(null);
                        setStudyLevel(null);
                      }
                    }}
                    classNames={{
                      root: classes.checkboxRoot,
                      input: classes.checkboxInput,
                      label: classes.checkboxLabel,
                    }}
                  />

                  <CcText size="sm" italic color="#a0a0a0">
                    {isTeacher
                      ? 'Teacher accounts can continue without program selection'
                      : 'Select your program and your study level to continue'}
                  </CcText>
                </div>

                {!isTeacher ? (
                  <div className={classes.selectGrid}>
                    <Select
                      placeholder="Program"
                      data={['CDA']}
                      value={program}
                      onChange={setProgram}
                      radius="xl"
                      rightSectionPointerEvents="none"
                      classNames={{
                        input: `${classes.selectInput} ${classes.programSelect}`,
                      }}
                    />

                    <Select
                      placeholder="Study level"
                      data={['2025-2026']}
                      value={studyLevel}
                      onChange={setStudyLevel}
                      radius="xl"
                      rightSectionPointerEvents="none"
                      classNames={{
                        input: `${classes.selectInput} ${classes.levelSelect}`,
                      }}
                    />
                  </div>
                ) : null}

                {error ? (
                  <CcText size="sm" color="#d94841" className={classes.feedbackText}>
                    {error}
                  </CcText>
                ) : null}

                {success ? (
                  <CcText size="sm" color="#2f9e44" className={classes.feedbackText}>
                    {success}
                  </CcText>
                ) : null}
              </div>
            </CcCard>
          </section>

          <section className={classes.actionsSection}>
            <CcButton
              variant="default-gradient"
              className={classes.nextButton}
              onClick={() => void handleNext()}
              disabled={isSubmitting}
            >
              Next
            </CcButton>
          </section>
        </>
      ) : null}

      {screen === 'verification' ? (
        <>
          <section className={classes.statusSection}>
            <div className={classes.statusContent}>
              <CcTitle order={1} withChevron={false} bold>
                <span className={classes.statusTitle}>Your Account Is Almost Ready!</span>
              </CcTitle>

              <div className={classes.circleWrapper}>
                <CcCircleProgress value={90} size={118} thickness={8} />
              </div>

              <CcText size="xl" italic color="#8a8a8a" className={classes.statusLabel}>
                Verification account
              </CcText>

              <CcText size="xl" italic color="#8a8a8a" className={classes.statusParagraph}>
                An email has been sent to your institution for approval.
                <br />
                Once your registration is validated, you will receive a confirmation email.
                <br />
                After that, you'll be able to log in and access your space.
              </CcText>
            </div>
          </section>
        </>
      ) : null}

      {screen === 'completed' ? (
        <>
          <section className={classes.statusSection}>
            <div className={classes.statusContent}>
              <CcTitle order={1} withChevron={false} bold>
                <span className={classes.completedTitle}>Congratulations !</span>
              </CcTitle>

              <CcText size="xl" italic color="#8a8a8a" className={classes.completedSubtitle}>
                Your account has been successfully created.
              </CcText>

              <CcButton
                variant="default-gradient"
                className={classes.startButton}
                onClick={handleStart}
              >
                Start !
              </CcButton>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
