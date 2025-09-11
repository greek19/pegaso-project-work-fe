export interface Movimento {
    _id: string;
    data: string;
    descrizione: string;
    importo: number;
}

export interface PaginatedMovimentiResponse {
    contenuto: Movimento[];
    pagina: number;
    totalePagine: number;
    totaleElementi: number;
}