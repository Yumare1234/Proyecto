import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-gray-500 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-6 border-black-900">
        <div className="flex justify-between items-center p-4 bg-linear-to-r from-purple-700 to-blue-500 text-white">
    <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="text-2xl hover:text-gray-300">&times;</button>
        </div>
        <div className="p-6 bg-gray-700">
        {children}
        </div>
        </div>
    </div>
    );
};

export { Modal };
