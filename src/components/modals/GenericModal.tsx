import { Modal, Button } from "react-bootstrap";

interface GenericModalProps {
    show: boolean;
    title: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    children: React.ReactNode;
    isPrestiti?: boolean
}

export default function GenericModal({
                                         show,
                                         title,
                                         onClose,
                                         onConfirm,
                                         confirmText = "Conferma",
                                         children,
                                         isPrestiti = false,
                                     }: GenericModalProps) {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                {!isPrestiti &&
                    <Button variant="secondary" onClick={onClose}>
                        Annulla
                    </Button>
                }
                {onConfirm && (
                    <Button variant="primary" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}
