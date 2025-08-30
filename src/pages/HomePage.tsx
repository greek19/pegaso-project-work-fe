import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useGetSaldoQuery, useGetUltimiMovimentiQuery } from "../services/accountApi";
import "../assets/style/card.css";

export default function HomePage() {
    const username = useSelector((state: RootState) => state.auth.username);
    const [showSaldo, setShowSaldo] = useState(true);

    const { data: saldo, isLoading: saldoLoading } = useGetSaldoQuery();
    const { data: movimenti, isLoading: movimentiLoading } = useGetUltimiMovimentiQuery(10);

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
                                    ? `€ ${saldo?.toFixed(2)}`
                                    : "••••••"}
                        </h3>
                    </div>
                    <div className="col-2 d-flex align-items-start justify-content-end">
                        <button
                            className="btn btn-link text-white p-0"
                            onClick={() => setShowSaldo(!showSaldo)}
                            aria-label="Mostra/Nascondi saldo"
                        >
                            <i className={`bi ${showSaldo ? "bi-eye-slash-fill" : "bi-eye-fill"} fs-3`}></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">Ultimi movimenti</div>
                <div className="card-body p-0">
                    {movimentiLoading ? (
                        <p className="p-3">Caricamento...</p>
                    ) : (
                        <table className="table mb-0">
                            <thead className="table-light">
                            <tr>
                                <th scope="col">Data</th>
                                <th scope="col">Descrizione</th>
                                <th scope="col" className="text-end">
                                    Importo
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {movimenti?.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.data}</td>
                                    <td>{m.descrizione}</td>
                                    <td
                                        className={`text-end ${m.importo < 0 ? "text-danger" : "text-success"}`}
                                    >
                                        {m.importo < 0 ? "-" : "+"}€ {Math.abs(m.importo).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
