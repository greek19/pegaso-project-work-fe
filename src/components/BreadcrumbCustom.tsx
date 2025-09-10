import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface BreadcrumbCustomProps {
    currentPage: string;
}

export default function BreadcrumbCustom({ currentPage }: BreadcrumbCustomProps) {
    const navigate = useNavigate();

    return (
        <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate(-1)}><i className="bi bi-arrow-left-short"/>Torna indietro</Breadcrumb.Item>
            <Breadcrumb.Item active>{currentPage}</Breadcrumb.Item>
        </Breadcrumb>
    );
}
