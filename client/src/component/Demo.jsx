import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

const Demo = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        {/* Modal content */}
      </Modal>

      <Button variant="default" onClick={open}>
        Open centered Modal
      </Button>
    </>
  );
};

export default Demo;
