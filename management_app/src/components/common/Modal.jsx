import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          {/* <FiX size={24} /> */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
