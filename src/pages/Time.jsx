import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { atualizarStatus, getFigurinhasPorGrupo } from "../services/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCheck, faHand, faHandPointer, faMagnifyingGlass, faRotate } from "@fortawesome/free-solid-svg-icons";
import "../styles/Time.css";
import { Nav } from "../components/Nav";
import { getBandeiraUrl, getImagemEspecial } from "../services/bandeiras";

export function Time({ tab, setTab }) {
    const { sigla } = useParams();
    const [figurinhas, setFigurinhas] = useState([]);
    const pressStart = useRef(null);
    const [pressionado, setPressionado] = useState(null);
    const [filtro, setFiltro] = useState("todas");

    async function carregar() {
        const lista = await getFigurinhasPorGrupo(sigla);
        setFigurinhas(lista);
    }

    useEffect(() => {
        async function carregarInicial() {
            const lista = await getFigurinhasPorGrupo(sigla);
            setFigurinhas(lista);
        }
        carregarInicial();
    }, [sigla]);

    const alternarStatus = useCallback(async (fig) => {
        let novoStatus;
        if (fig.status === "nao_tenho") novoStatus = "tenho";
        else if (fig.status === "tenho") novoStatus = "nao_tenho";
        else novoStatus = "nao_tenho";

        await atualizarStatus(fig.id, novoStatus, novoStatus === "repetida" ? fig.quantidadeRepetida : 0);
        carregar();
    }, []);

    const marcarRepetida = useCallback(async (fig) => {
        const qtd = fig.quantidadeRepetida > 0 ? fig.quantidadeRepetida : 1;
        await atualizarStatus(fig.id, "repetida", qtd);
        carregar();
        if (navigator.vibrate) navigator.vibrate(15);
    }, []);

    const iniciarPress = useCallback((fig, e) => {
        e.preventDefault();
        pressStart.current = Date.now();
        setPressionado(fig.id);
    }, []);

    const finalizarPress = useCallback((fig, e) => {
        e.preventDefault();
        setPressionado(null);
        if (pressStart.current === null) return;
        const duracao = Date.now() - pressStart.current;
        pressStart.current = null;

        if (duracao >= 400) {
            marcarRepetida(fig);
        } else {
            alternarStatus(fig);
        }
    }, [marcarRepetida, alternarStatus]);

    const cancelarPress = useCallback(() => {
        setPressionado(null);
        pressStart.current = null;
    }, []);

    const figurinhasFiltradas = filtro === "todas"
        ? figurinhas
        : figurinhas.filter((fig) => fig.status === filtro);

    return (
        <>
            <div className="view">
                <div>
                    <Link className="back-row" to={-1}>
                        <FontAwesomeIcon icon={faAngleLeft} style={{ width: "1.25rem", height: "1.25rem", color: "#f2f0ea" }} />
                        <span className="back-title">{sigla}</span>
                    </Link>
                </div>

                <div className="filter-chips">
                    <div className={`chip ${filtro === "todas" ? "active" : ""}`} onClick={() => setFiltro("todas")}>
                        Todas
                    </div>
                    <div className={`chip ${filtro === "nao_tenho" ? "active" : ""}`} onClick={() => setFiltro("nao_tenho")}>
                        Faltando
                    </div>
                    <div className={`chip ${filtro === "tenho" ? "active" : ""}`} onClick={() => setFiltro("tenho")}>
                        Tenho
                    </div>
                    <div className={`chip ${filtro === "repetida" ? "active" : ""}`} onClick={() => setFiltro("repetida")}>
                        Repetidas
                    </div>
                </div>

                <div className="grid-wrap">
                    {figurinhasFiltradas.length === 0 ? (
                        <div className="empty-state">
                            <div className="e-icon"><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                            <div className="e-title">Nenhuma figurinha aqui</div>
                            <div className="e-sub">Não há figurinhas com esse filtro neste time.</div>
                        </div>
                    ) : (
                        <div className="grid">
                            {figurinhasFiltradas.map((fig) => {
                                const bandeiraUrl = getBandeiraUrl(fig.grupo) || getImagemEspecial(fig.grupo);
                                return (
                                    <div
                                        key={fig.id}
                                        className={`sticker ${fig.status} ${pressionado === fig.id ? "pressing" : ""}`}
                                        onPointerDown={(e) => iniciarPress(fig, e)}
                                        onPointerUp={(e) => finalizarPress(fig, e)}
                                        onPointerLeave={cancelarPress}
                                        onPointerCancel={cancelarPress}
                                        onContextMenu={(e) => e.preventDefault()}
                                        style={{ touchAction: "manipulation" }}
                                    >
                                        <div className="sticker-bg" style={bandeiraUrl ? { backgroundImage: `url(${bandeiraUrl})` } : {}} />
                                        <div className="sticker-num">{String(fig.numero).padStart(2, "0")}</div>
                                        {fig.status === "tenho" && <FontAwesomeIcon icon={faCheck} className="sticker-icon" style={{ color: "#0f0" }} />}
                                        {fig.status === "repetida" && <FontAwesomeIcon icon={faRotate} className="sticker-icon" />}
                                        {fig.status === "repetida" && fig.quantidadeRepetida > 0 && (
                                            <div className="rep-badge">x{fig.quantidadeRepetida}</div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="hint-row">
                    <span><FontAwesomeIcon icon={faHandPointer} /> Toque: alterna falta/tenho</span>
                </div>
                <div className="hint-row" style={{ paddingTop: 0 }}>
                    <span><FontAwesomeIcon icon={faHand} /> Segure: marca repetida</span>
                </div>

                <Nav tab={tab} setTab={setTab} />
            </div>
        </>
    )
}