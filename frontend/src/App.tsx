import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import Storybook from './components/storybook';

const Home = () => <div>Bienvenue sur ton App de Compétences</div>;

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/storybook" element={<Storybook />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}