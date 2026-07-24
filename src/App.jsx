import { useEffect, useState } from 'react';
import { inicializarBanco } from './services/db';
import { Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Grupo } from './pages/Grupo';
import { Time } from './pages/Time';
import { Repetidas } from './pages/Repetidas';
import { Ajustes } from './pages/Ajustes';

function App() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    inicializarBanco();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home tab={tab} setTab={setTab} />} />
        <Route path="/grupo/:sigla" element={<Grupo tab={tab} setTab={setTab} />} />
        <Route path="/time/:sigla" element={<Time tab={tab} setTab={setTab} />} />
        <Route path="/repetidas" element={<Repetidas tab={tab} setTab={setTab} />} />
        <Route path="/ajustes" element={<Ajustes />} />
      </Routes>
    </>
  );
}

export default App;