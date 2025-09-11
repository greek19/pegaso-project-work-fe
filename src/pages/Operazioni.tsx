import { useState } from "react";
import GenericModal from "../components/modals/GenericModal";
import { Button } from "react-bootstrap";
import { useCreateBonificoMutation } from "../services/accountApi";
import { useNavigate } from "react-router-dom";
import type {Operazione} from "../model/Operazione.ts";

export default function Operazioni() {
    const navigate = useNavigate();
    const [showBonifico, setShowBonifico] = useState(false);
    const [beneficiario, setBeneficiario] = useState("");
    const [causale, setCausale] = useState("");
    const [importo, setImporto] = useState(0);
    const [iban, setIban] = useState("");
    const [createBonifico] = useCreateBonificoMutation();

    const handleBonifico = async () => {
        try {
            await createBonifico({ beneficiario, iban, importo, causale }).unwrap();
            alert("Bonifico effettuato!");
            setShowBonifico(false);
        } catch {
            alert("Errore durante il bonifico");
        }
    };

    const operazioni: Operazione[] = [
        {
            title: "Bonifico",
            description: "Effettua un bonifico verso un altro conto.",
            modalFields: [
                { label: "Beneficiario", type: "text", state: beneficiario, setState: setBeneficiario },
                { label: "IBAN", type: "text", state: iban, setState: setIban },
                { label: "Importo", type: "number", state: importo, setState: setImporto },
                { label: "Causale", type: "text", state: causale, setState: setCausale },
            ],
            action: handleBonifico,
            show: showBonifico,
            setShow: setShowBonifico,
            confirmText: "Invia",
        },
        {
            title: "Fondi di investimento",
            description: "Scopri i fondi selezionati dal nostro team.",
            isRedirect: true,
            redirectTo: "/fondi",
        },
        {
            title: "Richiesta prestito",
            description: "Richiedi un prestito personale.",
            isRedirect: true,
            redirectTo: "/prestiti",
        },
        {
            title: "Polizze assicurative",
            description: "Richiedi un prestito personale.",
            isRedirect: true,
            redirectTo: "/polizze",
        }
    ];

    return (
        <div className="row g-4">
            <h2>Lista operazioni</h2>
            {operazioni.map((op, idx) => (
                <div key={idx} className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <h5 className="card-title">{op.title}</h5>
                            <p className="card-text">{op.description}</p>

                            {op.isRedirect ? (
                                <Button variant="primary" onClick={() => navigate(op.redirectTo!)}>
                                    Vai
                                </Button>
                            ) : (
                                op.setShow && <Button variant="primary" onClick={() => op.setShow!(true)}>Avvia</Button>
                            )}
                        </div>
                    </div>

                    {op.modalFields && op.setShow && (
                        <GenericModal
                            show={op.show!}
                            title={op.title}
                            onClose={() => op.setShow!(false)}
                            onConfirm={op.action}
                            confirmText={op.confirmText}
                        >
                            <form>
                                {op.modalFields.map((field, i) => (
                                    <div key={i} className="mb-3">
                                        <label className="form-label">{field.label}</label>
                                        {field.type === "number" ? (
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={field.state}
                                                onChange={(e) => field.setState(Number(e.target.value))}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={field.state}
                                                onChange={(e) => field.setState(e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </form>
                        </GenericModal>
                    )}
                </div>
            ))}
        </div>
    );
}
