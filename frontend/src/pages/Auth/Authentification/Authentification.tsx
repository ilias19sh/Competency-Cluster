import { useState } from 'react';
import { Divider, PasswordInput, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { CcButton, CcCard, CcText, CcTitle } from '../../../components';
import classes from './Authentification.module.css';

type LoginResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
};

type LoginErrorResponse = {
  message?: string | string[];
};

export default function Authentification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse | LoginErrorResponse;

      if (!response.ok) {
        const message =
          'message' in data
            ? Array.isArray(data.message)
              ? data.message[0]
              : data.message
            : undefined;
        throw new Error(message || 'Connexion impossible');
      }

      const loginData = data as LoginResponse;

      if (loginData.role === 'admin') {
        navigate('/admin');
        return;
      }

      if (loginData.role === 'teacher') {
        navigate('/teacher');
        return;
      }

      navigate('/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <img
          className={classes.logo}
          src="/images/logo_cc_blanc.png"
          alt="Competency Cluster"
        />
      </header>

      <section className={classes.cardWrapper}>
        <CcCard className={classes.card} p={0} withStack={false} withBorder={false}>
          <div className={classes.cardContent}>
            <div className={classes.leftPanel}>
              <div className={classes.leftPanelContent}>
                <CcTitle order={1} withChevron={false}>
                  <span className={classes.loginTitle}>Login</span>
                </CcTitle>

                <div className={classes.formFields}>
                  <TextInput
                    classNames={{ input: classes.textInput }}
                    placeholder="Email"
                    radius="md"
                    size="md"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                  />

                  <PasswordInput
                    classNames={{ input: classes.textInput, section: classes.passwordSection }}
                    placeholder="Password"
                    radius="md"
                    size="md"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        void handleLogin();
                      }
                    }}
                  />
                </div>

                <CcText className={classes.forgotPassword} size="sm" color="#8C52FF">
                  Forgot password
                </CcText>

                {error ? (
                  <CcText className={classes.loginError} size="sm" color="#d94841">
                    {error}
                  </CcText>
                ) : null}

                <CcButton
                  className={classes.loginButton}
                  variant="full-orange"
                  onClick={() => void handleLogin()}
                  disabled={isSubmitting}
                >
                  Login
                </CcButton>

                <Divider className={classes.divider} />
              </div>
            </div>
            <div className={classes.rightPanel}>
              <div className={classes.rightPanelContent}>
                <CcTitle order={2} withChevron={false}>
                  <span className={classes.welcomeTitle}>Welcome !</span>
                </CcTitle>

                <CcText size="sm" color="#FFFFFF">
                  Don&apos;t have an account ?
                </CcText>

                <CcButton className={classes.registerButton} variant="full-violet">
                  Register
                </CcButton>
              </div>
            </div>
          </div>
        </CcCard>
      </section>
    </main>
  );
}
