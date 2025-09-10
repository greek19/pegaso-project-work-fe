import {Container, Spinner, Alert, Button} from "react-bootstrap";
import {useState} from "react";
import CustomPagination from "../components/CustomPagination";
import MovimentiTable from "../components/MovimentiTable";
import {useDownloadMovimentiPdfMutation, useGetMovimentiPaginatiQuery} from "../services/accountApi.ts";

const MovimentiPage = () => {
    const [paginaCorrente, setPaginaCorrente] = useState(1);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const elementiPerPagina = 10;

    const {data, isError} = useGetMovimentiPaginatiQuery({
        page: paginaCorrente,
        pageSize: elementiPerPagina,
    });

    const [downloadPdf, {isLoading}] = useDownloadMovimentiPdfMutation();
    const handleDownloadPdf = async () => {
        try {
            setDownloadError(null);
            const result = await downloadPdf().unwrap();

            if (result instanceof Blob) {
                if (result.type !== 'application/pdf') {
                    console.warn('Il file scaricato potrebbe non essere un PDF valido');
                }

                const url = window.URL.createObjectURL(result);
                const a = document.createElement("a");
                a.href = url;
                a.download = `movimenti_${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                setDownloadError("Formato di risposta non valido");
            }
        } catch (error) {
            console.error("Errore nel download:", error);
            setDownloadError("Errore durante il download del PDF");
        }
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Storico movimenti</h2>

            {isError && <Alert variant="danger">Errore nel caricamento dei movimenti</Alert>}
            {downloadError && <Alert variant="danger">{downloadError}</Alert>}

            <div className="d-flex justify-content-end mb-2">
                <Button
                    onClick={handleDownloadPdf}
                    variant="primary"
                >
                    Scarica PDF
                </Button>
            </div>

            {isLoading ? (
                <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border"/>
                </div>
            ) : (
                <>
                    <div className="card shadow-sm mb-2">
                        <div className="card-body p-0">
                            <MovimentiTable movimenti={data?.contenuto ?? []}/>
                        </div>
                    </div>
                    {data && data.totalePagine > 1 && (
                        <CustomPagination
                            currentPage={data.pagina}
                            totalPages={data.totalePagine}
                            onPageChange={setPaginaCorrente}
                        />
                    )}
                </>
            )}
        </Container>
    );
};

export default MovimentiPage;