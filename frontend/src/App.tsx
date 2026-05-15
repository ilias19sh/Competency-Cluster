import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import Storybook from './components/storybook';
import Authentification from './pages/Auth/Authentification/Authentification';
import ConfigProfile from './pages/Auth/ConfigProfile/ConfigProfile';
import Dashboard from './pages/Admin/Dashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import TeacherSubModules from './pages/Teacher/TeacherSubModules';
import StudentHome from './pages/Student/StudentHome';
import StudentModules from './pages/Student/StudentModules';
import StudentSubmodules from './pages/Student/StudentSubmodules';
import { getAuthUser } from './utils/authSession';
import type { AuthRole } from './utils/authSession';

type ProtectedRouteProps = {
  allowedRoles: AuthRole[];
  children: ReactNode;
};

const roleHome: Record<AuthRole, string> = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
};

function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const authUser = getAuthUser();

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(authUser.role)) {
    return <Navigate to={roleHome[authUser.role]} replace />;
  }

  return children;
}

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authentification />} />
          <Route path="/config-profile" element={<ConfigProfile />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/modules/:moduleId/submodules"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherSubModules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/modules/:moduleId/submodules/:submoduleId"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherSubModules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/modules"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentModules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submodules"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSubmodules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/modules/:moduleId/submodules"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSubmodules />
              </ProtectedRoute>
            }
          />

          <Route path="/storybook" element={<Storybook />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
