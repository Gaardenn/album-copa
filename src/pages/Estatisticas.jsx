import { useEffect, useState } from "react";
import { grupos } from "../services/estrutura";
import { getTodasFigurinhas } from "../services/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGifts, faMedal } from "@fortawesome/free-solid-svg-icons";
import { getBandeiraUrl, getImagemEspecial } from "../services/bandeiras";
import { Nav } from "../components/Nav";
import "../styles/Estatisticas.css";

export function Estatisticas() {
    const [porTime, setPorTime] = useState([]);
    const [porGrupo, setPorGrupo] = useState([]);

    useEffect(() => {
        async function carregarInicial() {
            const todas = await getTodasFigurinhas();

            const mapaTimes = {};
            todas.forEach((fig) => {
                if (!mapaTimes[fig.grupo]) {
                    mapaTimes[fig.grupo] = { sigla: fig.grupo, tenho: 0, repetida: 0, faltando: 0, total: 0 };
                }
                const t = mapaTimes[fig.grupo];
                t.total += 1;
                if (fig.status === "tenho") t.tenho += 1;
                else if (fig.status === "repetida") t.repetida += 1;
                else t.faltando += 1;
            });

            const listaTimes = Object.values(mapaTimes).sort((a, b) => b.faltando - a.faltando);
            setPorTime(listaTimes);

            const listaGrupos = grupos.map((g) => {
                const acumulado = g.times.reduce(
                    (acc, sigla) => {
                        const t = mapaTimes[sigla] || { tenho: 0, repetida: 0, total: 0 };
                        return {
                            feito: acc.feito + t.tenho + t.repetida,
                            total: acc.total + t.total
                        };
                    },
                    { feito: 0, total: 0 }
                );
                const percentual = acumulado.total > 0 ? Math.round((acumulado.feito / acumulado.total) * 100) : 0;
                return { grupo: g.grupo, ...acumulado, percentual };
            });

            listaGrupos.sort((a, b) => b.percentual - a.percentual);
            setPorGrupo(listaGrupos);
        }
        carregarInicial();
    }, []);

    return (
        <div className="view">
            <div className="section-label" style={{ paddingTop: "1rem" }}>Ranking de grupos</div>
            <div className="rank-list">
                {porGrupo.map((g, i) => (
                    <div className="rank-row" key={g.grupo}>
                        <div className="rank-pos">
                            {i <= 2 ? (
                                <FontAwesomeIcon
                                    icon={faMedal}
                                    style={{
                                        color:
                                            i === 0
                                                ? "#FFd700"
                                                : i === 1
                                                ? "#C0C0C0"
                                                : "#CD7F32",
                                    }}
                                />
                            ) : (
                                `${i + 1}º`
                            )}
                        </div>
                        <div className="rank-info">
                            <div className="rank-name">Grupo {g.grupo}</div>
                            <div className="mini-bar-track">
                                <div className="mini-bar-fill" style={{ width: `${g.percentual}%` }}></div>
                            </div>
                        </div>
                        <div className="rank-percent">{g.percentual}%</div>
                    </div>
                ))}
            </div>

            <div className="section-label" style={{ marginTop: "1.25rem" }}>Faltando por seleção</div>
            <div className="rank-list">
                {porTime.filter((t) => t.faltando > 0).map((t) => {
                    const bandeiraUrl = t.sigla === "FWC" || t.sigla === "CC" ? getImagemEspecial(t.sigla) : getBandeiraUrl(t.sigla);
                    return (
                        <div className="rank-row" key={t.sigla}>
                            <div
                                className="group-badge"
                                style={bandeiraUrl ? { backgroundImage: `url(${bandeiraUrl})` } : {}}
                            >
                                {!bandeiraUrl && t.sigla}
                            </div>
                            <div className="rank-info">
                                <div className="rank-name">{t.sigla}</div>
                            </div>
                            <div className="rank-faltando">{t.faltando} faltando</div>
                        </div>
                    );
                })}

                {porTime.length > 0 && porTime.every((t) => t.faltando === 0) && (
                    <div className="empty-state">
                        <div className="e-icon"><FontAwesomeIcon icon={faGifts} /></div>
                        <div className="e-title">Álbum completo!</div>
                        <div className="e-sub">Você já tem todas as figurinhas de todas as seleções.</div>
                    </div>
                )}
            </div>

            <Nav />
        </div>
    );
}