import Dexie from 'dexie';
import { gerarFigurinhas } from './estrutura';

export const db = new Dexie('AlbumCopa');

db.version(1).stores({
    figurinhas: 'id, grupo, status'
});

export async function inicializarBanco() {
    const quantidade = await db.figurinhas.count();

    if (quantidade === 0) {
        const figurinhas = gerarFigurinhas();
        await db.figurinhas.bulkAdd(figurinhas);
    }
}

export async function getResumoGeral() {
    const todas = await db.figurinhas.toArray();
    const tenho = todas.filter(f => f.status === "tenho").length;
    const repetida = todas.filter(f => f.status === "repetida").length;
    const total = todas.length;
    return { tenho, repetida, total, progresso: tenho + repetida };
}

export async function getResumoPorGrupo(sigla) {
    const doGrupo = await db.figurinhas.where("grupo").equals(sigla).toArray();
    const feito = doGrupo.filter(f => f.status === "tenho" || f.status === "repetida").length;
    return { feito, total: doGrupo.length };
}

export async function getFigurinhasPorGrupo(sigla) {
    return await db.figurinhas.where("grupo").equals(sigla).sortBy("numero");
}

export async function atualizarStatus(id, status, qtd = 0) {
    await db.figurinhas.update(id, { status, quantidadeRepetida: qtd });
}

export async function getRepetidas() {
    return await db.figurinhas.where("status").equals("repetida").toArray();
}

export async function figurinhaExiste(id) {
    const fig = await db.figurinhas.get(id);
    return fig;
}

export async function exportarBackup() {
    const todas = await db.figurinhas.toArray();
    const backup = {
        versao: 1,
        dataExportacao: new Date().toISOString(),
        figurinhas: todas
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `album-copa-backup-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

export async function importarBackup(arquivo) {
    const texto = await arquivo.text();
    const backup = JSON.parse(texto);

    if (!backup.figurinhas || !Array.isArray(backup.figurinhas)) {
        throw new Error("Arquivo de backup inválido");
    }

    await db.figurinhas.clear();
    await db.figurinhas.bulkAdd(backup.figurinhas);
}

export async function getTodasFigurinhas() {
    return await db.figurinhas.toArray();
}