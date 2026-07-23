// import { Link } from "react-router";
import "../styles/Home.css";
import { useEffect, useState } from "react";
import { figurinhaExiste, getResumoGeral, getResumoPorGrupo } from "../services/db";
import { especiais, grupos } from "../services/estrutura";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router";
import { Nav } from "../components/Nav";
import { getImagemEspecial } from "../services/bandeiras";

export function Home({ tab, setTab }) {
    const [resumo, setResumo] = useState({ tenho: 0, repetida: 0, total: 0, progresso: 0 });
    const [progressoGrupos, setProgressoGrupos] = useState({});
    const [percentual, setPercentual] = useState(0);
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [erroBusca, setErroBusca] = useState("");

    useEffect(() => {
        async function carregar() {
            const geral = await getResumoGeral();
            setResumo(geral);

            const resultado = {};

            for (const g of grupos) {
                let feito = 0;
                let total = 0;
                for (const time of g.times) {
                    const r = await getResumoPorGrupo(time);
                    feito += r.feito;
                    total += r.total;
                }
                resultado[g.grupo] = { feito, total };
            }

            for (const e of especiais) {
                const r = await getResumoPorGrupo(e.grupo);
                resultado[e.grupo] = { feito: r.feito, total: r.total };
            }

            setProgressoGrupos(resultado);
            setPercentual(geral.total > 0 ? Math.round((geral.progresso / geral.total) * 100) : 0);
        }
        carregar();
    }, []);

    useEffect(() => {
        async function buscarAoVivo() {
            const valor = busca.trim().toUpperCase();
            if (valor.length < 4) {
                setErroBusca("");
                return;
            }
            const fig = await figurinhaExiste(valor);
            if (fig) {
                navigate(`/time/${fig.grupo}`);
            } else {
                setErroBusca(`Figurinha "${valor}" não encontrada`);
            }
        }
        buscarAoVivo();
    }, [busca, navigate]);

    return (
        <>
            <div className="view">
                <div className="scoreboard">
                    <div className="sb-title">PROGRESSO DO ÁLBUM</div>
                    <div className="sb-count">
                        <span className="sb-num">{resumo.progresso}</span>
                        <span className="sb-total">/ <span>{resumo.total}</span></span>
                    </div>
                    <div className="sb-bar-track"><div className="sb-bar-fill" style={{ width: `${percentual}%` }}></div></div>
                    <div className="sb-legend">
                        <span><FontAwesomeIcon icon={faCircle} style={{ color: "var(--green)" }} />Tenho</span>
                        <span><FontAwesomeIcon icon={faCircle} style={{ color: "var(--gold)" }} />Repetida</span>
                        <span><FontAwesomeIcon icon={faCircle} style={{ color: "var(--text-faint)" }} />Falta</span>
                    </div>
                </div>

                <div className="search-wrap">
                    <input
                        className="search"
                        placeholder="Buscar figurinha, ex: MEX03"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    {erroBusca && <p className="search-erro">{erroBusca}</p>}
                </div>

                <div className="section-label">Especiais</div>
                <div className="group-list">
                    {especiais.map((e) => {
                        const p = progressoGrupos[e.grupo] || { feito: 0, total: 0 };
                        const bandeiraUrl = getImagemEspecial(e.grupo);
                        return (
                            <Link to={`/grupo/${e.grupo}`} key={e.grupo} className="group-row">
                                <div className="group-left">
                                    <div
                                        className="group-badge"
                                        style={bandeiraUrl ? { backgroundImage: `url(${bandeiraUrl})` } : {}}
                                    >
                                        {!bandeiraUrl && e.grupo}
                                    </div>
                                    <div>
                                        <div className="group-name">{e.grupo} - {e.grupo === "FWC" ? "Copa do Mundo" : "Coca-Cola"}</div>
                                        <div className="group-sub">{p.total} figurinhas</div>
                                    </div>
                                </div>
                                <div className="group-right">
                                    <div className="mini-progress">{p.feito}/{p.total}</div>
                                    <FontAwesomeIcon className="chevron" icon={faAngleRight} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="section-label" style={{ marginTop: "14px" }}>Grupos</div>
                <div className="group-list">
                    {grupos.map((g) => {
                        const p = progressoGrupos[g.grupo] || { feito: 0, total: 0 };
                        return (
                            <Link to={`/grupo/${g.grupo}`} key={g.grupo} className="group-row">
                                <div className="group-left">
                                    <div className="group-badge">{g.grupo}</div>
                                    <div>
                                        <div className="group-name">Grupo {g.grupo}</div>
                                        <div className="group-sub">{g.times.join(" - ")}</div>
                                    </div>
                                </div>
                                <div className="group-right">
                                    <div className="mini-progress">{p.feito}/{p.total}</div>
                                    <FontAwesomeIcon className="chevron" icon={faAngleRight} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <Nav tab={tab} setTab={setTab} />
            </div>
        </>
    )
}