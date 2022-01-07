import Modal from  "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

// Raldys
// Function that manages the rendering of a modal. Modal is used for confirmations and/or error handling
// Returns the modal component.
export default function MessageModal(props) {

    return (
        <>
            <Modal {...props}> {/* Props is used to make the component reusable */}
                <Modal.Header closeButton className="bg-primary border border-primary">
                    <Modal.Title className="text-light">{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center text-primary" message={props.message}>{props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={props.onClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}