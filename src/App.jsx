import { useEffect, useState } from 'react';
import { inicializarBanco } from './services/db';
import { Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Grupo } from './pages/Grupo';
import { Time } from './pages/Time';
import { Repetidas } from './pages/Repetidas';
import { Ajustes } from './pages/Ajustes';
import { Estatisticas } from './pages/Estatisticas';

function App() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    async function carregar() {
      await inicializarBanco();
    }

    carregar();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grupo/:sigla" element={<Grupo />} />
        <Route path="/time/:sigla" element={<Time tab={tab} setTab={setTab} />} />
        <Route path="/repetidas" element={<Repetidas tab={tab} setTab={setTab} />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
      </Routes>
    </>
  );
}

export default App;