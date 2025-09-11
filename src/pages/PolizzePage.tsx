import { useState, useMemo } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import BreadcrumbCustom from "../components/BreadcrumbCustom.tsx";
import {
    useGetPolizzeUtenteQuery,
    useAggiungiPolizzaMutation,
    useRimuoviPolizzaMutation
} from "../services/polizzeApi.ts";

const PolizzePage = () => {
    const [selectedPolizza, setSelectedPolizza] = useState<any>(null);
    const [filtroTipo, setFiltroTipo] = useState<string>("Tutte");
    const [ordinamento, setOrdinamento] = useState<string>("asc");
    const [showModal, setShowModal] = useState(false);
    const [aggiungiPolizza, { isLoading: isAdding }] = useAggiungiPolizzaMutation();
    const { data, isLoading, isError, refetch } = useGetPolizzeUtenteQuery();
    const [rimuoviPolizza] = useRimuoviPolizzaMutation();

    const costoTotale = useMemo(
        () => data?.polizzeAttive.reduce((acc, p) => acc + p.costoMensile, 0) || 0,
        [data]
    );

    const polizzeFiltrate = useMemo(() => {
        let result = [...(data?.polizzeDisponibili || [])];
        if (filtroTipo !== "Tutte") result = result.filter((p) => p.tipo === filtroTipo);
        result.sort((a, b) => (ordinamento === "asc" ? a.costoMensile - b.costoMensile : b.costoMensile - a.costoMensile));
        return result;
    }, [data, filtroTipo, ordinamento]);

    const handleAggiungi = async (polizzaId: string) => {
        try {
            await aggiungiPolizza({ polizzaId }).unwrap();
            refetch();
        } catch (err) {
            console.error("Errore aggiungendo polizza:", err);
        }

    };
    const handleRemove = async (id: string) => {
        try {
            await rimuoviPolizza({ polizzaId: id }).unwrap();
            refetch();
            alert("Polizza rimossa con successo!");
        } catch (err) {
            alert("Errore nella rimozione della polizza");
        }

    };

    const handleOpenModal = (polizza: any) => {
        setSelectedPolizza(polizza);
        setShowModal(true);
    };

    if (isLoading) return <p>Caricamento...</p>;
    if (isError) return <p>Errore nel recupero delle polizze</p>;

    return (
        <Container className="my-4">
            <BreadcrumbCustom currentPage="Polizze" />

            <h2 className="mb-4">Le mie polizze</h2>
            <Row xs={1} md={2} className="g-4 mb-3">
                {data?.polizzeAttive.map((p) => (
                    <Col key={p._id}>
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div onClick={() => handleOpenModal(p)} style={{ cursor: "pointer" }}>
                                    <Card.Title>{p.nome}</Card.Title>
                                    <Card.Text>{p.tipo}</Card.Text>
                                    <Card.Text><strong>Costo mensile:</strong> € {p.costoMensile}</Card.Text>
                                </div>
                                <Button
                                    variant="danger"
                                    className="mt-2"
                                    onClick={() => handleRemove(p._id)}
                                >
                                    Rimuovi
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="alert alert-info">
                <strong>Totale mensile delle tue polizze attive:</strong> € {costoTotale}
            </div>

            <h2 className="mb-4">Altre polizze</h2>
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                        <option value="Tutte">Tutte</option>
                        <option value="Casa">Casa</option>
                        <option value="Auto">Auto</option>
                        <option value="Viaggio">Viaggio</option>
                        <option value="Salute">Salute</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select value={ordinamento} onChange={(e) => setOrdinamento(e.target.value)}>
                        <option value="asc">Costo crescente</option>
                        <option value="desc">Costo decrescente</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row xs={1} md={2} className="g-4">
                {polizzeFiltrate.map((p) => (
                    <Col key={p._id}>
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div onClick={() => handleOpenModal(p)} style={{ cursor: "pointer" }}>
                                    <Card.Title>{p.nome}</Card.Title>
                                    <Card.Text>{p.tipo}</Card.Text>
                                    <Card.Text><strong>Costo mensile:</strong> € {p.costoMensile}</Card.Text>
                                </div>
                                <Button variant="primary" disabled={isAdding} onClick={() => handleAggiungi(p._id)}>
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
                    <p><strong>Costo mensile:</strong> € {selectedPolizza?.costoMensile}</p>
                    <p>{selectedPolizza?.descrizione}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Chiudi</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PolizzePage;
