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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Fondo con blur y gradiente */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
            
            {/* Contenedor principal con efecto glassmorphism futurista */}
            <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
                {/* Líneas de neón decorativas */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl blur-xl opacity-30"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 rounded-2xl blur opacity-20"></div>
                
                <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 overflow-hidden">
                    {/* Header con efecto glitch y gradiente */}
                    <div className="relative px-6 py-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-950/50 via-transparent to-blue-950/50">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 tracking-tight">
                                {title}
                            </h3>
                            <button 
                                onClick={onClose} 
                                className="relative w-8 h-8 flex items-center justify-center text-blue-400 hover:text-white transition-all duration-300 group"
                            >
                                <span className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/20 transition-all duration-300"></span>
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>
                        {/* Línea decorativa inferior */}
                        <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                    </div>
                    
                    {/* Contenido del modal */}
                    <div className="p-6 space-y-4">
                        {/* Decoración de esquinas */}
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg"></div>
                        
                        {children}
                        
                        {/* Línea decorativa inferior */}
                        <div className="pt-4 flex justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse delay-300"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Modal };