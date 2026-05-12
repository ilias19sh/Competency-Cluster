export type AuthRole = 'admin' | 'teacher' | 'student';

export type AuthUser = {
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: AuthRole;
};

const AUTH_USER_KEY = 'cc_auth_user';
const TEACHER_USER_KEY = 'cc_teacher_user';

const isAuthRole = (role: unknown): role is AuthRole =>
  role === 'admin' || role === 'teacher' || role === 'student';

export const saveAuthUser = (user: AuthUser) => {
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  if (user.role === 'teacher') {
    sessionStorage.setItem(
      TEACHER_USER_KEY,
      JSON.stringify({
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
    );
    return;
  }

  sessionStorage.removeItem(TEACHER_USER_KEY);
};

export const getAuthUser = (): AuthUser | null => {
  const rawValue = sessionStorage.getItem(AUTH_USER_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const user = JSON.parse(rawValue) as Partial<AuthUser>;

    if (!user.userId || !isAuthRole(user.role)) {
      return null;
    }

    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(TEACHER_USER_KEY);
};
