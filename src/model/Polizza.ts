export interface Polizza {
    _id: string;
    nome: string;
    tipo: string;
    costoMensile: number;
    descrizione: string;
}

export interface PolizzeUtenteResponse {
    polizzeAttive: Polizza[];
    polizzeDisponibili: Polizza[];
}