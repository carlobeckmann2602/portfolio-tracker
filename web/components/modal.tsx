import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
  open?: boolean;
  title?: string;
  closeButton?: boolean;
  onClose: () => void;
};

export const Modal = ({
  open = false,
  title = "",
  closeButton = true,
  onClose,
  children,
}: React.PropsWithChildren<ModalProps>) => {
  const [root, setRoot] = React.useState<Element | null>(null);

  useEffect(() => {
    setRoot(document.querySelector("#modal-portal"));
  }, []);

  return open && root
    ? createPortal(
        <div
          onClick={(evt) => {
            if (evt.target === evt.currentTarget) onClose();
          }}
          className="bg-gray-500/50 w-full h-full flex items-center justify-center pointer-events-auto md:p-20"
        >
          <div className="bg-white w-full h-full overflow-hidden flex flex-col md:rounded-md max-w-3xl p-6 md:max-h-128">
            <div className="flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-medium">{title}</h2>
              {closeButton && (
                <div
                  onClick={onClose}
                  className="rounded-full border-2 border-black border-solid w-8 h-8 items-center text-center cursor-pointer"
                >
                  x
                </div>
              )}
            </div>
            <div className="h-full">{children}</div>
          </div>
        </div>,
        root
      )
    : null;
};
