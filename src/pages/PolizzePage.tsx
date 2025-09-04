import { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

interface Polizza {
    id: number;
    nome: string;
    tipo: string;
    costoMensile: number;
}

const PolizzePage = () => {
    const [polizzeAttive, setPolizzeAttive] = useState<Polizza[]>([
        { id: 1, nome: "Polizza Casa", tipo: "Assicurazione abitazione", costoMensile: 25 },
    ]);

    const [altrePolizze, setAltrePolizze] = useState<Polizza[]>([
        { id: 2, nome: "Polizza Auto", tipo: "Assicurazione auto", costoMensile: 30 },
        { id: 3, nome: "Polizza Viaggio", tipo: "Assicurazione viaggio", costoMensile: 15 },
        { id: 4, nome: "Polizza Salute", tipo: "Assicurazione sanitaria", costoMensile: 40 },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedPolizza, setSelectedPolizza] = useState<Polizza | null>(null);

    const handleRimuovi = (id: number) => {
        setPolizzeAttive(polizzeAttive.filter((p) => p.id !== id));
    };

    const handleAggiungi = (polizza: Polizza) => {
        setPolizzeAttive([...polizzeAttive, polizza]);
        setAltrePolizze(altrePolizze.filter((p) => p.id !== polizza.id));
    };

    const openModal = (polizza: Polizza) => {
        setSelectedPolizza(polizza);
        setShowModal(true);
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Le mie polizze</h2>
            <Row xs={1} md={2} className="g-4 mb-5">
                {polizzeAttive.map((p) => (
                    <Col key={p.id}>
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <Card.Title>{p.nome}</Card.Title>
                                    <Card.Text>{p.tipo}</Card.Text>
                                    <Card.Text>
                                        <strong>Costo mensile:</strong> € {p.costoMensile}
                                    </Card.Text>
                                </div>
                                <Button variant="danger" onClick={() => handleRimuovi(p.id)}>
                                    Rimuovi
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h2 className="mb-4">Altre polizze</h2>
            <Row xs={1} md={2} className="g-4">
                {altrePolizze.map((p) => (
                    <Col key={p.id}>
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <Card.Title>{p.nome}</Card.Title>
                                    <Card.Text>{p.tipo}</Card.Text>
                                    <Card.Text>
                                        <strong>Costo mensile:</strong> € {p.costoMensile}
                                    </Card.Text>
                                </div>
                                <Button variant="success" onClick={() => handleAggiungi(p)}>
                                    Aggiungi
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPolizza?.nome}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{selectedPolizza?.tipo}</p>
                    <p>
                        <strong>Costo mensile:</strong> € {selectedPolizza?.costoMensile}
                    </p>
                    <p>
                        Descrizione estesa della polizza, coperture, esclusioni e vantaggi.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Chiudi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PolizzePage;
