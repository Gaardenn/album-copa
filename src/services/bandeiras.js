export const bandeiras = {
    MEX: "mx", RSA: "za", KOR: "kr", CZE: "cz",
    CAN: "ca", BIH: "ba", QAT: "qa", SUI: "ch",
    BRA: "br", MAR: "ma", HAI: "ht", SCO: "gb-sct",
    USA: "us", PAR: "py", AUS: "au", TUR: "tr",
    GER: "de", CUW: "cw", CIV: "ci", ECU: "ec",
    NED: "nl", JPN: "jp", SWE: "se", TUN: "tn",
    BEL: "be", EGY: "eg", IRN: "ir", NZL: "nz",
    ESP: "es", CPV: "cv", KSA: "sa", URU: "uy",
    FRA: "fr", SEN: "sn", IRQ: "iq", NOR: "no",
    ARG: "ar", ALG: "dz", AUT: "at", JOR: "jo",
    POR: "pt", COD: "cd", UZB: "uz", COL: "co",
    ENG: "gb-eng", CRO: "hr", GHA: "gh", PAN: "pa",
};

export function getBandeiraUrl(sigla) {
    const codigo = bandeiras[sigla];
    if (!codigo) return null;
    return `https://flagcdn.com/w320/${codigo}.png`;
}

export function getImagemEspecial(grupo) {
    if (grupo === "FWC") return "/logos/taca-copa.png";
    if (grupo === "CC") return "/logos/logo-coca.png";
    return null;
}