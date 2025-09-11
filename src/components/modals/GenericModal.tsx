import { Modal, Button } from "react-bootstrap";
import React from "react";

interface GenericModalProps {
    show: boolean;
    title: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    children?: React.ReactNode;
    hideCancelButton?: boolean;
}

const GenericModal: React.FC<GenericModalProps> = ({
       show,
       title,
       onClose,
       onConfirm,
       confirmText = "Conferma",
       children,
       hideCancelButton = false,
   }) => {

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{children}</Modal.Body>

            <Modal.Footer>
                {!hideCancelButton && (
                    <Button variant="secondary" onClick={onClose}>
                        Annulla
                    </Button>
                )}
                {onConfirm && (
                    <Button variant="primary" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default GenericModal;
