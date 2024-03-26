import { useState } from "react";
import {
  Modal,
  ButtonToolbar,
  Button,
  RadioGroup,
  Radio,
  Placeholder,
} from "rsuite";
import { useLoading } from "../contexts/LoadingContext";

export default function SessionModal() {
  const {isSessionExModalOpen, setIsSessionExModalOpen} = useLoading();

  const handleClose = () => {
    setIsSessionExModalOpen(false);
    location.reload();
  };

  return (
   

      (<Modal
        backdrop={"static"}
        keyboard={false}
        open={isSessionExModalOpen}
        onClose={handleClose}
      >
        <Modal.Header>
          <Modal.Title>Session Expired</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Your Session has been Expired. Please Login Again</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Login
          </Button>
          
        </Modal.Footer>
      </Modal>)
  );
}
