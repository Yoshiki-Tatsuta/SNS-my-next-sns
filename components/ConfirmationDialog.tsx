import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ConfirmationDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={onCancel} static className="fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white rounded p-4 z-50">
              <Dialog.Title className="font-bold text-lg mb-2">削除の確認</Dialog.Title>
              <p className="mb-4">{message}</p>
              <div className="flex justify-end">
                <button
                  onClick={onConfirm}
                  className="text-red-500 font-bold px-2 py-1 rounded-md mr-2 border border-red-400 hover:border-2 active:border"
                >
                  削除する
                </button>
                <button
                  onClick={onCancel}
                  className="text-gray-500 font-bold px-2 py-1 rounded-md border border-gray-400 hover:border-2 active:border"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmationDialog;
