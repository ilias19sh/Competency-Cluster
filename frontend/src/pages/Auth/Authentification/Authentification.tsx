
import { useState } from 'react';
import { Checkbox, Divider, PasswordInput, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { CcButton, CcCard, CcText, CcTitle } from '../../../components';
import { apiBaseUrl } from '../../../config/api';
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

type RegisterResponse = {
  id: number;
  email: string;
  message: string;
  profileCompleted: boolean;
};

export default function Authentification() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegisterMode = authMode === 'register';

  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
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

  const handleRegister = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      if (!hasAcceptedTerms) {
        throw new Error('You must accept the terms and conditions to continue');
      }

      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          confirmPassword,
        }),
      });

      const data = (await response.json()) as RegisterResponse | LoginErrorResponse;

      if (!response.ok) {
        const message =
          'message' in data
            ? Array.isArray(data.message)
              ? data.message[0]
              : data.message
            : undefined;
        throw new Error(message || 'Inscription impossible');
      }

      const registerData = data as RegisterResponse;

      navigate('/config-profile', {
        state: {
          userId: registerData.id,
          email: registerData.email,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inscription impossible');
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
          <div className={`${classes.cardContent} ${isRegisterMode ? classes.cardContentRegister : ''}`}>
            <div className={classes.formPanel}>
              <div className={classes.formPanelContent}>
                <CcTitle order={1} withChevron={false}>
                  <span className={classes.formTitle}>
                    {isRegisterMode ? 'Register' : 'Login'}
                  </span>
                </CcTitle>

                <div className={classes.formFields}>
                  {isRegisterMode ? (
                    <>
                      <TextInput
                        classNames={{ input: classes.textInput }}
                        placeholder="Email *"
                        radius="md"
                        size="md"
                        value={registerEmail}
                        onChange={(event) => setRegisterEmail(event.currentTarget.value)}
                      />

                      <PasswordInput
                        classNames={{ input: classes.textInput, section: classes.passwordSection }}
                        placeholder="Password *"
                        radius="md"
                        size="md"
                        value={registerPassword}
                        onChange={(event) => setRegisterPassword(event.currentTarget.value)}
                      />

                      <PasswordInput
                        classNames={{ input: classes.textInput, section: classes.passwordSection }}
                        placeholder="Confirm password *"
                        radius="md"
                        size="md"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                      />

                      <Checkbox
                        checked={hasAcceptedTerms}
                        onChange={(event) => setHasAcceptedTerms(event.currentTarget.checked)}
                        label="I have read and accept the terms and conditions *"
                        classNames={{
                          root: classes.termsCheckbox,
                          label: classes.termsCheckboxLabel,
                          input: classes.termsCheckboxInput,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <TextInput
                        classNames={{ input: classes.textInput }}
                        placeholder="Email *"
                        radius="md"
                        size="md"
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                      />

                      <PasswordInput
                        classNames={{ input: classes.textInput, section: classes.passwordSection }}
                        placeholder="Password *"
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
                    </>
                  )}
                </div>

                <CcText className={classes.requiredHint} size="sm" color="#8D8D8D">
                  * Required fields
                </CcText>

                {!isRegisterMode ? (
                  <CcText className={classes.forgotPassword} size="sm" color="#8C52FF">
                    Forgot password
                  </CcText>
                ) : null}

                {error ? (
                  <CcText className={classes.loginError} size="sm" color="#d94841">
                    {error}
                  </CcText>
                ) : null}

                {isRegisterMode ? (
                  <CcButton
                    className={classes.submitButton}
                    variant="full-violet"
                    onClick={() => void handleRegister()}
                    disabled={isSubmitting}
                  >
                    Register
                  </CcButton>
                ) : (
                  <>
                    <CcButton
                      className={classes.submitButton}
                      variant="full-orange"
                      onClick={() => void handleLogin()}
                      disabled={isSubmitting}
                    >
                      Login
                    </CcButton>

                    <Divider className={classes.divider} />
                  </>
                )}
              </div>
            </div>
            <div className={`${classes.sidePanel} ${isRegisterMode ? classes.sidePanelRegister : ''}`}>
              <div
                className={`${classes.sidePanelContent} ${
                  isRegisterMode ? classes.sidePanelContentRegister : ''
                }`}
              >
                <CcTitle order={2} withChevron={false}>
                  <span className={classes.welcomeTitle}>Welcome !</span>
                </CcTitle>

                <CcText size="sm" color="#FFFFFF">
                  {isRegisterMode ? 'Already have an account ?' : "Don't have an account ?"}
                </CcText>

                <CcButton
                  className={classes.switchButton}
                  variant={isRegisterMode ? 'full-orange' : 'full-violet'}
                  onClick={() => {
                    setError('');
                    setAuthMode(isRegisterMode ? 'login' : 'register');
                  }}
                >
                  {isRegisterMode ? 'Login' : 'Register'}
                </CcButton>
              </div>
            </div>
          </div>
        </CcCard>
      </section>
    </main>
  );
}
