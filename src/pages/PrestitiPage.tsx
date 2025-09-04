import { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const PrestitiPage = () => {
    const [importo, setImporto] = useState(3000);
    const [durata, setDurata] = useState(12);
    const [tan, setTan] = useState(5.99);

    const calcolaRata = () => {
        const rata = (importo * (1 + tan / 100)) / durata;
        return rata.toFixed(2);
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Prestiti Personali</h2>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title>Prestito Immediato</Card.Title>
                    <Card.Text>
                        Richiedi un prestito personale da 3.000€ a 30.000€ con accredito
                        immediato sul tuo conto. Nessun costo di attivazione o cancellazione,
                        rimborso flessibile in rate mensili.
                    </Card.Text>
                    <Card.Text>
                        Migliora le condizioni accreditando almeno 800€ al mese sul tuo conto.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title>Simula il tuo prestito</Card.Title>

                    <Form.Group className="mb-3">
                        <Form.Label>Importo: {importo}€</Form.Label>
                        <Form.Range
                            min={3000}
                            max={30000}
                            step={100}
                            value={importo}
                            onChange={(e) => setImporto(Number(e.target.value))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Durata: {durata} mesi</Form.Label>
                        <Form.Range
                            min={12}
                            max={96}
                            step={1}
                            value={durata}
                            onChange={(e) => setDurata(Number(e.target.value))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>TAN: {tan}%</Form.Label>
                        <Form.Range
                            min={5.99}
                            max={11.99}
                            step={0.01}
                            value={tan}
                            onChange={(e) => setTan(Number(e.target.value))}
                        />
                    </Form.Group>

                    <Card.Text>
                        <strong>Rata Mensile Stimata:</strong> {calcolaRata()}€
                    </Card.Text>

                    <Button variant="primary">Richiedi ora</Button>
                </Card.Body>
            </Card>

            <Row xs={1} md={2} className="g-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Vantaggi del Prestito</Card.Title>
                            <Card.Text>
                                • Accredito immediato sul conto<br />
                                • Nessun costo di attivazione o cancellazione<br />
                                • Rimborso flessibile da 12 a 96 mesi<br />
                                • Migliora le condizioni accreditando almeno 800€/mese
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Come richiederlo</Card.Title>
                            <Card.Text>
                                Compila la simulazione, seleziona importo e durata, quindi clicca
                                su “Richiedi ora”. Tutto 100% online e sicuro.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PrestitiPage;
