import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import Storybook from './components/storybook';
import Authentification from './pages/Auth/Authentification/Authentification';
import Dashboard from './pages/Admin/Dashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import StudentHome from './pages/Student/StudentHome';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authentification />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentHome />} />

          <Route path="/storybook" element={<Storybook />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
