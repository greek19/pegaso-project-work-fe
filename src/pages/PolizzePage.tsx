import { useState, useMemo } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Form,
} from "react-bootstrap";
import BreadcrumbCustom from "../components/BreadcrumbCustom.tsx";

interface Polizza {
    id: number;
    nome: string;
    tipo: string;
    costoMensile: number;
}

const PolizzePage = () => {
    const [polizzeAttive, setPolizzeAttive] = useState<Polizza[]>([
        { id: 1, nome: "Polizza Casa", tipo: "Casa", costoMensile: 25 },
    ]);

    const [altrePolizze, setAltrePolizze] = useState<Polizza[]>([
        { id: 2, nome: "Polizza Auto", tipo: "Auto", costoMensile: 30 },
        { id: 3, nome: "Polizza Viaggio", tipo: "Viaggio", costoMensile: 15 },
        { id: 4, nome: "Polizza Salute", tipo: "Salute", costoMensile: 40 },
    ]);

    const [filtroTipo, setFiltroTipo] = useState<string>("Tutte");
    const [ordinamento, setOrdinamento] = useState<string>("asc");

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

    const costoTotale = useMemo(
        () =>
            polizzeAttive.reduce((acc, p) => acc + p.costoMensile, 0),
        [polizzeAttive]
    );

    const polizzeFiltrate = useMemo(() => {
        let result = [...altrePolizze];

        if (filtroTipo !== "Tutte") {
            result = result.filter((p) => p.tipo === filtroTipo);
        }

        result.sort((a, b) =>
            ordinamento === "asc"
                ? a.costoMensile - b.costoMensile
                : b.costoMensile - a.costoMensile
        );

        return result;
    }, [altrePolizze, filtroTipo, ordinamento]);

    return (
        <Container className="my-4">
            <BreadcrumbCustom currentPage="Polizze" />

            <h2 className="mb-4">Le mie polizze</h2>
            <Row xs={1} md={2} className="g-4 mb-3">
                {polizzeAttive.map((p) => (
                    <Col key={p.id}>
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div onClick={() => openModal(p)} style={{ cursor: "pointer" }}>
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

            <div className="alert alert-info">
                <strong>Totale mensile delle tue polizze attive:</strong> €{" "}
                {costoTotale}
            </div>

            <h2 className="mb-4">Altre polizze</h2>

            <Row className="mb-3">
                <Col md={4}>
                    <Form.Select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                        <option value="Tutte">Tutte</option>
                        <option value="Casa">Casa</option>
                        <option value="Auto">Auto</option>
                        <option value="Viaggio">Viaggio</option>
                        <option value="Salute">Salute</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={ordinamento}
                        onChange={(e) => setOrdinamento(e.target.value)}
                    >
                        <option value="asc">Costo crescente</option>
                        <option value="desc">Costo decrescente</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row xs={1} md={2} className="g-4">
                {polizzeFiltrate.map((p) => (
                    <Col key={p.id}>
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div onClick={() => openModal(p)} style={{ cursor: "pointer" }}>
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
