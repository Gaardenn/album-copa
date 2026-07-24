import { useRef, useState } from "react";
import { exportarBackup, importarBackup } from "../services/db";
import "../styles/Ajustes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Nav } from "../components/Nav";

export function Ajustes() {
    const inputRef = useRef(null);
    const [mensagem, setMensagem] = useState(null);

    function handleExportar() {
        exportarBackup();
        setMensagem({ tipo: "sucesso", texto: "Backup exportado! Salve o arquivo em um lugar seguro." });
    }

    function handleImportarClick() {
        inputRef.current.click();
    }

    async function handleArquivoSelecionado(e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const confirmar = window.confirm(
            "Importar vai APAGAR todos os dados atuais e substituir pelos dados do backup. Continuar?"
        );
        if (!confirmar) {
            e.target.value = "";
            return;
        }

        try {
            await importarBackup(arquivo);
            setMensagem({ tipo: "sucesso", texto: "Backup importado com sucesso!" });
        } catch (err) {
            console.log(err);
            setMensagem({ tipo: "erro", texto: "Não foi possível importar. Confira se o arquivo é um backup válido." });
        }

        e.target.value = "";
    }

    return (
        <div className="view">
            <div className="section-label" style={{ paddingTop: "1rem" }}>Backup</div>

            <div className="ajustes-card">
                <div className="ajustes-item-title">Exportar dados</div>
                <div className="ajustes-item-desc">
                    Gera um arquivo com todo o seu progresso. Guardo no iCloud, Arquivos ou envie pra você mesmo.
                </div>
                <button className="ajustes-btn" onClick={handleExportar}>
                    <FontAwesomeIcon icon={faDownload} />Exportar backup
                </button>
            </div>

            <div className="ajustes-card">
                <div className="ajustes-item-title">Importar dados</div>
                <div className="ajustes-item-desc">
                    Restaura o álbum a partir de um arquivo de backup. Isso substitui os dados atuais.
                </div>
                <button className="ajustes-btn ajustes-btn-secundario" onClick={handleImportarClick}>
                    <FontAwesomeIcon icon={faUpload} />Importar backup
                </button>
                <input
                    type="file"
                    accept="application/json"
                    ref={inputRef}
                    onChange={handleArquivoSelecionado}
                    style={{ display: "none" }}
                />
            </div>

            {mensagem && (
                <div className={`ajustes-msg ${mensagem.tipo}`}>
                    {mensagem.tipo === "erro" && <FontAwesomeIcon icon={faTriangleExclamation} />}
                    {mensagem.texto}
                </div>
            )}

            <Nav />
        </div>
    );
}