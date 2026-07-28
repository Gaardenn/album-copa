import { Link, Navigate, useParams } from "react-router";
import "../styles/Grupo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { especiais, grupos } from "../services/estrutura";
import { useEffect, useState } from "react";
import { getResumoPorGrupo, marcarGrupoCompleto } from "../services/db";
import { Nav } from "../components/Nav";
import { getBandeiraUrl } from "../services/bandeiras";

export function Grupo() {
    const { sigla } = useParams();
    const [progressoTimes, setProgressoTimes] = useState({});

    const grupoInfo = grupos.find((g) => g.grupo === sigla);
    const especialInfo = especiais.find((e) => e.grupo === sigla);

    useEffect(() => {
        async function carregar() {
            if (!grupoInfo) return;
            const resultado = {};
            for (const time of grupoInfo.times) {
                resultado[time] = await getResumoPorGrupo(time);
            }
            setProgressoTimes(resultado);
        }
        carregar();
    }, [sigla, grupoInfo]);

    if (especialInfo) {
        return <Navigate to={`/time/${sigla}`} replace />;
    }

    if (!grupoInfo) {
        return <Navigate to="/" replace />;
    }

    const totalGrupo = Object.values(progressoTimes).reduce(
        (acc, p) => ({ feito: acc.feito + p.feito, total: acc.total + p.total }),
        { feito: 0, total: 0 }
    );

    const percentualGrupo = totalGrupo.total > 0 ? Math.round((totalGrupo.feito / totalGrupo.total) * 100) : 0;

    async function handleCompletarGrupo(e) {
        e.stopPropagation();
        e.preventDefault();

        const confirmar = window.confirm(
            `Marcar todas as figurinhas do Grupo ${sigla} (${grupoInfo.times.join(', ')}) como "tenho"? Isso não pode ser desfeito automaticamente.`
        );
        if (!confirmar) return;

        await marcarGrupoCompleto(grupoInfo.times);

        const resultado = {};
        for (const time of grupoInfo.times) {
            resultado[time] = await getResumoPorGrupo(time);
        }
        setProgressoTimes(resultado);
    }

    return (
        <div className="view">
            <div className="back-row">
                <Link to="/" style={{ textDecoration: "none", color: "#f2f0ea" }}>
                    <FontAwesomeIcon icon={faAngleLeft} style={{ width: "1.25rem", height: "1.25rem", color: "#f2f0ea" }} />
                    <span className="back-title">Grupo {sigla}</span>
                </Link>
                <button className="completar-btn" onClick={handleCompletarGrupo}>
                    <FontAwesomeIcon icon={faCircleCheck} /> Completar
                </button>
            </div>

            <div className="scoreboard">
                <div className="sb-title">Progresso do grupo</div>
                <div className="sb-count">
                    <span className="sb-num">{totalGrupo.feito}</span>
                    <span className="sb-total">/ <span>{totalGrupo.total}</span></span>
                </div>
                <div className="sb-bar-track">
                    <div className="sb-bar-fill" style={{ width: `${percentualGrupo}%` }}></div>
                </div>
            </div>

            <div className="group-list" style={{ marginTop: "0.625rem" }}>
                {grupoInfo.times.map((time) => {
                    const p = progressoTimes[time] || { feito: 0, total: 0 };
                    const percentual = p.total > 0 ? Math.round((p.feito / p.total) * 100) : 0;
                    const bandeiraUrl = getBandeiraUrl(time);

                    return (
                        <Link to={`/time/${time}`} key={time} className="group-row">
                            <div className="group-left">
                                <div
                                    className="group-badge"
                                    style={bandeiraUrl ? { backgroundImage: `url(${bandeiraUrl})` } : {}}
                                >
                                    {!bandeiraUrl && time}
                                </div>
                                <div className="group-info">
                                    <div className="group-name">{time}</div>
                                    <div className="mini-bar-track">
                                        <div className="mini-bar-fill" style={{ width: `${percentual}%` }}></div>
                                    </div>
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

            <Nav />
        </div>
    );
}