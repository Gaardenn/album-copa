import { Link, Navigate, useParams } from "react-router";
import "../styles/Grupo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { especiais, grupos } from "../services/estrutura";
import { useEffect, useState } from "react";
import { getResumoPorGrupo } from "../services/db";
import { Nav } from "../components/Nav";
import { getBandeiraUrl } from "../services/bandeiras";

export function Grupo({ tab, setTab }) {
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

    return (
        <div className="view">
            <Link to="/" className="back-row">
                <FontAwesomeIcon icon={faAngleLeft} style={{ width: "1.25rem", height: "1.25rem", color: "#f2f0ea"}}/>
                <span className="back-title">Grupo {sigla}</span>
            </Link>
            <div className="group-list" style={{ marginTop: "0.625rem" }}>
                {grupoInfo.times.map((time) => {
                    const p = progressoTimes[time] || { feito: 0, total: 0 };
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
                                <div>
                                    <div className="group-name">{time}</div>
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

            <Nav tab={tab} setTab={setTab} />
        </div>
    );
}