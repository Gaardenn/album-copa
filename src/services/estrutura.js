export const grupos = [
    {
        grupo: 'A',
        times: ['MEX', 'RSA', 'KOR', 'CZE']
    },
    {
        grupo: 'B',
        times: ['CAN', 'BIH', 'QAT', 'SUI']
    },
    {
        grupo: 'C',
        times: ['BRA', 'MAR', 'HAI', 'SCO']
    },
    {
        grupo: 'D',
        times: ['USA', 'PAR', 'AUS', 'TUR']
    },
    {
        grupo: 'E',
        times: ['GER', 'CUW', 'CIV', 'ECU']
    },
    {
        grupo: 'F',
        times: ['NED', 'JPN', 'SWE', 'TUN']
    },
    {
        grupo: 'G',
        times: ['BEL', 'EGY', 'IRN', 'NZL']
    },
    {
        grupo: 'H',
        times: ['ESP', 'CPV', 'KSA', 'URU']
    },
    {
        grupo: 'I',
        times: ['FRA', 'SEN', 'IRQ', 'NOR']
    },
    {
        grupo: 'J',
        times: ['ARG', 'ALG', 'AUT', 'JOR']
    },
    {
        grupo: 'K',
        times: ['POR', 'COD', 'UZB', 'COL']
    },
    {
        grupo: 'L',
        times: ['ENG', 'CRO', 'GHA', 'PAN']
    }
];

export const figurinhasPorTime = 20;

export const especiais = [
    { grupo: 'FWC', inicio: 0, fim: 19 },
    { grupo: 'CC', inicio: 1, fim: 14}
];

export function gerarFigurinhas() {
    const lista = [];

    grupos.forEach(({ times }) => {
        times.forEach((sigla) => {
            for (let n = 1; n <= figurinhasPorTime; n++) {
                const numero = String(n).padStart(2, '0');
                lista.push({
                    id: `${sigla}${numero}`,
                    grupo: sigla,
                    numero: n,
                    categoria: 'time',
                    status: 'nao_tenho',
                    quantidadeRepetida: 0
                });
            }
        });
    });

    especiais.forEach(({ grupo, inicio, fim }) => {
        for (let n = inicio; n <= fim; n++) {
            const numero = String(n).padStart(2, '0');
            lista.push({
                id: `${grupo}${numero}`,
                grupo,
                numero: n,
                categoria: 'especial',
                status: 'nao_tenho',
                quantidadeRepetida: 0
            });
        }
    });

    return lista;
}