import { useEffect, useState } from 'react';
import { inicializarBanco } from './services/db';
import { Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Grupo } from './pages/Grupo';
import { Time } from './pages/Time';
import { Repetidas } from './pages/Repetidas';
import { Ajustes } from './pages/Ajustes';
import { Estatisticas } from './pages/Estatisticas';
import { ListaCompras } from './pages/ListaCompras';
import "./App.css"

const TEMPO_MINIMO_SPLASH = 1500;

function App() {
  const [tab, setTab] = useState(0);
  const [bancoCarregado, setBancoCarregado] = useState(false);
  const [tempoMinimoPassou, setTempoMinimoPassou] = useState(false);
  const [mostrarSplash, setMostrarSplash] = useState(true);

  useEffect(() => {
    async function iniciar() {
      await inicializarBanco();
      setBancoCarregado(true);
    }
    iniciar();

    const timer = setTimeout(() => {
      setTempoMinimoPassou(true);
    }, TEMPO_MINIMO_SPLASH);

    return () => clearTimeout(timer);
  }, []);

  const prontoParaSair = bancoCarregado && tempoMinimoPassou;

  useEffect(() => {
    if (!prontoParaSair) return;

    const timer = setTimeout(() => {
      setMostrarSplash(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [prontoParaSair]);

  if (mostrarSplash) {
    return (
      <div className={`splash ${prontoParaSair ? "splash-saindo" : ""}`}>
        <img src="icon-512.png" className="splash-logo" />
        <div className="splash-title">Álbum da Copa</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grupo/:sigla" element={<Grupo />} />
        <Route path="/time/:sigla" element={<Time tab={tab} setTab={setTab} />} />
        <Route path="/repetidas" element={<Repetidas tab={tab} setTab={setTab} />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="/lista-compras" element={<ListaCompras />} />
      </Routes>
    </>
  );
}

export default App;