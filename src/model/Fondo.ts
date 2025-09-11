export interface Fondo {
    id: number;
    nome: string;
    descrizione: string;
    tipoAttivo: string;
    rendimento1anno: number;
    investimentoMinimo: number;
    sfdrLevel: number;
    performance: number[];
}