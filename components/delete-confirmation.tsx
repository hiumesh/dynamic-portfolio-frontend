"use client";

import { Trash2 } from "lucide-react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

interface DeleteConfirmationProps {
  title?: string;
  itemName: string;
  button?: React.ReactNode;
  onDelete?: () => Promise<boolean>;
}

export default function DeleteConfirmation({
  title,
  itemName = "item",
  button,
  onDelete,
}: DeleteConfirmationProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const isSuccess = await onDelete?.();
      setLoading(false);
      if (isSuccess) {
        onClose();
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => onOpen()}>
        {button ? (
          button
        ) : (
          <Button>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {itemName}
          </Button>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{title || "Confirm Deletion"}</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this &quot;
                  <span className="font-semibold">{itemName}</span>&quot;? This
                  action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={loading}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );

  // return (
  //   <Dialog open={open} onOpenChange={setOpen}>
  //     <DialogTrigger asChild>
  //       {button ? (
  //         button
  //       ) : (
  //         <Button variant="destructive">
  //           <Trash2 className="mr-2 h-4 w-4" />
  //           Delete {itemName}
  //         </Button>
  //       )}
  //     </DialogTrigger>
  //     <DialogContent className="sm:max-w-[425px]">
  //       <DialogHeader>
  //         <DialogTitle>Confirm Deletion</DialogTitle>
  //         <DialogDescription>
  //           Are you sure you want to delete this {itemName}? This action cannot
  //           be undone.
  //         </DialogDescription>
  //       </DialogHeader>
  //       <DialogFooter>
  //         <Button variant="secondary" onClick={() => setOpen(false)}>
  //           Cancel
  //         </Button>
  //         <Button variant="destructive" onClick={handleDelete}>
  //           Delete
  //         </Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // );
}
