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

function App() {
  const [tab, setTab] = useState(0);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    async function iniciar() {
      await inicializarBanco();
      setCarregado(true);
    }

    iniciar();
  }, []);

  if (!carregado) {
    return (
      <div className="splash">
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