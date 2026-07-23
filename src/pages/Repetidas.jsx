import { useEffect, useState } from "react";
import "../styles/Repetidas.css";
import { atualizarStatus, getRepetidas } from "../services/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Nav } from "../components/Nav";

export function Repetidas({ tab, setTab }) {
    const [repetidas, setRepetidas] = useState([]);

    useEffect(() => {
        async function carregarInicial() {
            const lista = await getRepetidas();
            setRepetidas(lista);
        }
        carregarInicial();
    }, []);

    async function carregar() {
        const lista = await getRepetidas();
        setRepetidas(lista);
    }

    async function alterarQtd(fig, delta) {
        const novaQtd = fig.quantidadeRepetida + delta;
        if (novaQtd <= 0) {
            await atualizarStatus(fig.id, "nao_tenho", 0);
        } else {
            await atualizarStatus(fig.id, "repetida", novaQtd);
        }
        carregar();
    }

    return (
        <>
            <div className="view">
                <div className="section-label">Repetidas para troca</div>

                {repetidas.length === 0 ? (
                    <div className="empty-state">
                        <div className="e-icon"><FontAwesomeIcon icon={faFolder} /></div>
                        <div className="e-title">Nenhuma repetida ainda</div>
                        <div className="e-sub">Segura uma figurinha no álbum para marcar como repetida.</div>
                    </div>
                ) : (
                    repetidas.map((fig) => (
                        <div className="dup-item" key={fig.id}>
                            <div className="dup-left">
                                <div className="dup-code">{fig.id}</div>
                            </div>
                            <div className="dup-qty">
                                <div className="qty-btn" onClick={() => alterarQtd(fig, -1)}>-</div>
                                <div className="qty-num">{fig.quantidadeRepetida}</div>
                                <div className="qty-btn" onClick={() => alterarQtd(fig, 1)}>+</div>
                            </div>
                        </div>
                    ))
                )}

                <Nav tab={tab} setTab={setTab} />
            </div>
        </>
    );
}