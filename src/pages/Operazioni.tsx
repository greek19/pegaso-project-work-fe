import {use, useState} from "react";
import GenericModal from "../components/modals/GenericModal";
import {Button} from "react-bootstrap";
import {useCreateBonificoMutation} from "../services/accountApi.ts";


export default function Operazioni() {
    const [showBonifico, setShowBonifico] = useState(false);
    const [showInvestimento, setShowInvestimento] = useState(false);
    const [showPrestito, setShowPrestito] = useState(false);
    const [showPolizza, setShowPolizza] = useState(false);

    const [beneficiario, setBeneficiario] = useState("");
    const [investImporto, setInvestImporto] = useState(0);
    const [investPeriodo,setInvestPeriodo] =useState(0);
    const [prestitoImporto, setPrestitoImporto] = useState(0);
    const [prestitoDurata, setPrestitoDurata] = useState(0);
    const [polizzaTipo, setPolizzaTipo] = useState(0);
    const [polizzaImporto, setPolizzaImporto] = useState(0);

    const [iban, setIban] = useState("");
    const [importo, setImporto] = useState(0);
    const [causale, setCausale] = useState("");

    const [createBonifico] = useCreateBonificoMutation();

    const handleBonifico = async () => {
        try {
            await createBonifico({ beneficiario, iban, importo, causale }).unwrap();
            alert("Bonifico effettuato!");
            setShowBonifico(false);
        } catch (err) {
            alert("Errore durante il bonifico");
        }
    }
    const handleInvestimento = async () => { /* calcolo simulazione */ }
    const handlePrestito = async () => { /* richiesta prestito */ }
    const handlePolizza = async () => { /* aggiornamento polizza */ }

    const operazioni = [
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
            confirmText: "Invia"
        },
        {
            title: "Simulazione investimenti",
            description: "Simula i rendimenti dei tuoi investimenti.",
            modalFields: [
                { label: "Importo", type: "number", state: investImporto, setState: setInvestImporto },
                { label: "Periodo (mesi)", type: "number", state: investPeriodo, setState: setInvestPeriodo },
            ],
            action: handleInvestimento,
            show: showInvestimento,
            setShow: setShowInvestimento,
            confirmText: "Simula"
        },
        {
            title: "Richiesta prestito",
            description: "Richiedi un prestito personale.",
            modalFields: [
                { label: "Importo", type: "number", state: prestitoImporto, setState: setPrestitoImporto },
                { label: "Durata (mesi)", type: "number", state: prestitoDurata, setState: setPrestitoDurata },
            ],
            action: handlePrestito,
            show: showPrestito,
            setShow: setShowPrestito,
            confirmText: "Invia"
        },
        {
            title: "Gestione polizze assicurative",
            description: "Visualizza e aggiorna le tue polizze.",
            modalFields: [
                { label: "Tipo polizza", type: "text", state: polizzaTipo, setState: setPolizzaTipo },
                { label: "Importo premio", type: "number", state: polizzaImporto, setState: setPolizzaImporto },
            ],
            action: handlePolizza,
            show: showPolizza,
            setShow: setShowPolizza,
            confirmText: "Aggiorna"
        },
    ];

    return (
        <div className="row g-4">
            {operazioni.map((op, idx) => (
                <div key={idx} className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <h5 className="card-title">{op.title}</h5>
                            <p className="card-text">{op.description}</p>
                            <Button variant="primary" onClick={() => op.setShow(true)}>Avvia</Button>
                        </div>
                    </div>

                    <GenericModal
                        show={op.show}
                        title={op.title}
                        onClose={() => op.setShow(false)}
                        onConfirm={op.action}
                        confirmText={op.confirmText}
                    >
                        <form>
                            {op.modalFields.map((field, i) => (
                                <div key={i} className="mb-3">
                                    <label className="form-label">{field.label}</label>
                                    <input
                                        type={field.type}
                                        className="form-control"
                                        value={field.state}
                                        onChange={(e) => field.setState(field.type === "number" ? Number(e.target.value) : e.target.value)}
                                    />
                                </div>
                            ))}
                        </form>
                    </GenericModal>
                </div>
            ))}
        </div>

    );
}
