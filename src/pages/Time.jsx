import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { atualizarStatus, getFigurinhasPorGrupo } from "../services/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCheck, faHand, faHandPointer, faRotate } from "@fortawesome/free-solid-svg-icons";
import "../styles/Time.css";
import { Nav } from "../components/Nav";
import { getBandeiraUrl, getImagemEspecial } from "../services/bandeiras";

export function Time({ tab, setTab }) {
    const { sigla } = useParams();
    const [figurinhas, setFigurinhas] = useState([]);
    const pressStart = useRef(null);
    const [pressionado, setPressionado] = useState(null);

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

    return (
        <>
            <div className="view">
                <div>
                    <Link className="back-row" to={-1}>
                        <FontAwesomeIcon icon={faAngleLeft} style={{ width: "1.25rem", height: "1.25rem", color: "#f2f0ea" }} />
                        <span className="back-title">{sigla}</span>
                    </Link>
                </div>

                <div className="grid-wrap">
                    <div className="grid">
                        {figurinhas.map((fig) => {
                            const bandeiraUrl = getBandeiraUrl(fig.grupo) || getImagemEspecial(fig.grupo);
                            return(
                            <div
                                key={fig.id}
                                className={`sticker ${fig.status} ${pressionado === fig.id ? "pressing" : ""}`}
                                onMouseDown={(e) => iniciarPress(fig, e)}
                                onMouseUp={(e) => finalizarPress(fig, e)}
                                onMouseLeave={cancelarPress}
                                onTouchStart={(e) => iniciarPress(fig, e)}
                                onTouchEnd={(e) => finalizarPress(fig, e)}
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <div className="sticker-bg" style={bandeiraUrl ? { backgroundImage: `url(${bandeiraUrl})` } : {}} />
                                <div className="sticker-num">{String(fig.numero).padStart(2, "0")}</div>
                                {fig.status === "tenho" && <FontAwesomeIcon icon={faCheck} className="sticker-icon" style={{ color: "#0f0"}} />}
                                {fig.status === "repetida" && <FontAwesomeIcon icon={faRotate} className="sticker-icon" />}
                                {fig.status === "repetida" && fig.quantidadeRepetida > 0 && (
                                    <div className="rep-badge">x{fig.quantidadeRepetida}</div>
                                )}
                            </div>
                        )})}
                    </div>
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