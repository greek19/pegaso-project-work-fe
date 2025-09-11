import { Table } from "react-bootstrap";
import type {Movimento} from "../model/Movimento.ts";

interface MovimentiTableProps {
    movimenti: Movimento[];
    showPagination?: boolean;
}

const MovimentiTable = ({ movimenti }: MovimentiTableProps) => {
    if (movimenti.length === 0) {
        return <p className="p-3">Nessun movimento trovato.</p>;
    }

    return (
        <Table striped bordered hover responsive className="mb-0">
            <thead>
            <tr>
                <th>Data</th>
                <th>Descrizione</th>
                <th className="text-end">Importo</th>
            </tr>
            </thead>
            <tbody>
            {movimenti.map((m) => (
                <tr key={m._id}>
                    <td>{new Date(m.data).toLocaleDateString()}</td>
                    <td>{m.descrizione}</td>
                    <td
                        className={`text-end ${
                            m.importo < 0 ? "text-danger" : "text-success"
                        }`}
                    >
                        {m.importo < 0 ? "-" : "+"}€ {Math.abs(m.importo).toFixed(2)}
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default MovimentiTable;
