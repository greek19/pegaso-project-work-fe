import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useGetMovimentiPaginatiQuery, useGetSaldoQuery } from "../services/accountApi";
import MovimentiTable from "../components/MovimentiTable";
import "../assets/style/card.css";
import {Link} from "react-router-dom";

export default function HomePage() {
    const username = useSelector((state: RootState) => state.auth.username);
    const [showSaldo, setShowSaldo] = useState(true);
    const { data: saldo, isLoading: saldoLoading } = useGetSaldoQuery();
    const { data: movimentiResponse, isLoading: movimentiLoading } =
        useGetMovimentiPaginatiQuery({ page: 1, pageSize: 10 });

    return (
        <div className="container mt-4">
            <div className="cardInfo shadow-sm mb-4">
                <div className="card-img"></div>
                <div className="card-info row">
                    <div className="card-text col-10">
                        <h2 className="text-title">Ciao, {username}</h2>
                        <p className="text-subtitle">Saldo disponibile:</p>
                        <h3 className="text-white">
                            {saldoLoading
                                ? "Caricamento..."
                                : showSaldo
                                    ? `€ ${saldo?.saldo?.toFixed(2)}`
                                    : "••••••"}
                        </h3>
                    </div>
                    <div className="col-2 d-flex align-items-start justify-content-end">
                        <button
                            className="btn btn-link text-white p-0"
                            onClick={() => setShowSaldo(!showSaldo)}
                            aria-label="Mostra/Nascondi saldo"
                        >
                            <i
                                className={`bi ${
                                    showSaldo ? "bi-eye-slash-fill" : "bi-eye-fill"
                                } fs-3`}
                            ></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-row-reverse p-2">
                <Link to='movimenti' className='text-decoration-none'>
                    Lista movimenti completa
                    <i className="bi bi-arrow-right px-2" ></i>
                </Link>
            </div>
            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">Ultimi movimenti</div>
                <div className="card-body p-0">
                    {movimentiLoading ? (
                        <p className="p-3">Caricamento...</p>
                    ) : (
                        <MovimentiTable movimenti={movimentiResponse?.contenuto ?? []} />
                    )}
                </div>
            </div>
        </div>
    );
}
