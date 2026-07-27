import { useEffect, useState } from "react";
import { getFigurinhasFaltando } from "../services/db";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCheck, faCopy, faGifts } from "@fortawesome/free-solid-svg-icons";
import "../styles/ListaCompras.css";

export function ListaCompras() {
    const [faltando, setFaltando] = useState([]);
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        async function carregarInicial() {
            const lista = await getFigurinhasFaltando();
            setFaltando(lista);
        }
        carregarInicial();
    }, []);

    const agrupado = faltando.reduce((acc, fig) => {
        if (!acc[fig.grupo]) acc[fig.grupo] = [];
        acc[fig.grupo].push(fig.id);
        return acc;
    }, {});

    function gerarTexto() {
        let texto = `Figurinhas que faltam (${faltando.length}):\n\n`;
        Object.entries(agrupado).forEach(([sigla, ids]) => {
            texto += `${sigla}: ${ids.join(", ")}\n`;
        });
        return texto;
    }

    async function handleCopiar() {
        const texto = gerarTexto();
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    }

    return (
        <div className="view">
            <div className="back-row">
                <Link to="/">
                    <FontAwesomeIcon icon={faAngleLeft} style={{ width: "1.25rem", height: "1.25rem", color: "#f2f0ea" }} />
                </Link>
                <span className="back-title">Lista de compras</span>
            </div>

            <div className="lc-resumo">
                <span className="lc-total">{faltando.length}</span>
                <span className="lc-total-label">figurinhas faltando</span>
            </div>

            <button className="ajustes-btn" onClick={handleCopiar} style={{ margin: "0 1rem 1rem 1rem", width: "calc(100% - 2rem" }}>
                <FontAwesomeIcon icon={copiado ? faCheck : faCopy} /> {copiado ? "Copiado!" : "Copiar lista"}
            </button>

            {faltando.length === 0 ? (
                <div className="empty-state">
                    <div className="e-icon"><FontAwesomeIcon icon={faGifts} /></div>
                    <div className="e-title">Nada faltando!</div>
                    <div className="e-sub">Seu álbum está completo.</div>
                </div>
            ) : (
                <div className="lc-list">
                    {Object.entries(agrupado).map(([sigla, ids]) => (
                        <div className="lc-group" key={sigla}>
                            <div className="lc-group-title">{sigla} <span>({ids.length})</span></div>
                            <div className="lc-codes">
                                {ids.map((id) => (
                                    <span className="lc-code" key={id}>{id}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}