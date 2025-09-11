import { useState } from "react";
import { Card, Button, Badge, Form } from "react-bootstrap";
import GenericModal from "../components/modals/GenericModal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import BreadcrumbCustom from "../components/BreadcrumbCustom.tsx";
import {useGetFondiQuery} from "../services/tipologicheApi.ts";
import type {Fondo} from "../model/Fondo.ts";

export default function FondiPage() {
    const [selectedFondo, setSelectedFondo] = useState<Fondo | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [importo, setImporto] = useState(1000);
    const { data: fondi } = useGetFondiQuery();

    const handleOpenModal = (fondo: Fondo) => {
        setSelectedFondo(fondo);
        setShowModal(true);
    };

    const simulatedData =
        selectedFondo?.performance.map((value, index) => ({
            anno: index + 1,
            capitale: (value / 10000) * importo,
        })) || [];

    return (
        <div className="container mt-4">
            <BreadcrumbCustom currentPage="Fondi di investimento" />

            <h2 className="mb-3">Fondi di investimento selezionati</h2>
            <p>
                Ti presentiamo i fondi selezionati con cura dal nostro team di esperti in investimenti di Pegaso
                Banking Quality Funds, per semplificare la tua scelta.
            </p>

            <div className="row g-4">
                {fondi?.map((fondo) => (
                    <div key={fondo.id} className="col-md-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <Card.Title>{fondo.nome}</Card.Title>
                                    <Card.Text>{fondo.descrizione}</Card.Text>
                                    <div className="mb-2">
                                        <strong>Tipo di attivo:</strong> {fondo.tipoAttivo}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Redditività 1 anno:</strong> {fondo.rendimento1anno.toFixed(2)} %
                                    </div>
                                    <div className="mb-2">
                                        <strong>Investimento minimo:</strong> Da {fondo.investimentoMinimo} €
                                    </div>
                                    <Badge bg="success">SFDR {fondo.sfdrLevel}</Badge>
                                </div>
                                <Button variant="primary" className="mt-3" onClick={() => handleOpenModal(fondo)}>
                                    Simula investimento
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {selectedFondo && (
                <GenericModal
                    show={showModal}
                    title={`Simulazione - ${selectedFondo.nome}`}
                    onClose={() => setShowModal(false)}
                    confirmText="Chiudi"
                >
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Importo da investire (€)</Form.Label>
                            <Form.Control
                                type="number"
                                value={importo}
                                min={0}
                                onChange={(e) => setImporto(Number(e.target.value))}
                            />
                        </Form.Group>
                    </Form>

                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={simulatedData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="anno" label={{ value: "Anno", position: "insideBottomRight", offset: -5 }} />
                                <YAxis label={{ value: "Capitale (€)", angle: -90, position: "insideLeft" }} />
                                <Tooltip formatter={(value: number) => `€ ${value.toFixed(2)}`} />
                                <Line type="monotone" dataKey="capitale" stroke="#007bff" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </GenericModal>
            )}
        </div>
    );
}
