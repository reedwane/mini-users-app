import { Button, Modal } from "react-bootstrap";

interface DeleteProps {
  showDeleteModal: boolean;
  hideModal: () => void;
  handleDelete: () => void;
  userName: string;
}

const DeleteUser = ({
  showDeleteModal,
  hideModal,
  handleDelete,
  userName,
}: DeleteProps) => {
  return (
    <Modal show={showDeleteModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <strong>{userName}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUser;
