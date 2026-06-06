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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
            {/* Fondo oscuro con desenfoque */}
            <div 
                onClick={onClose} 
                className="absolute inset-0 bg-[#050508]/85 backdrop-blur-md cursor-pointer transition-all"
            ></div>
            
            {/* Contenedor principal */}
            <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300 z-10">
                
                {/* Aura/Glow de fondo */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-purple-900 to-indigo-600 rounded-2xl blur-xl opacity-25"></div>
                
                {/* Marco del Contenedor */}
                <div className="relative bg-black/40 backdrop-blur-2xl rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                    
                    {/* Header */}
                    <div className="relative px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-transparent to-indigo-950/30">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"></div>
                        
                        <div className="flex justify-between items-center gap-4">
                            <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-indigo-400 tracking-[0.1em] uppercase drop-shadow-[0_0_12px_rgba(168,85,247,0.2)] truncate">
                                {title}
                            </h3>
                            
                            {/* BOTÓN X ROJO FÁCIL DE CLICKEAR (HITBOX OPTIMIZADA) */}
                            <button 
                                onClick={onClose} 
                                aria-label="Cerrar modal"
                                className="relative flex items-center justify-center min-w-[32px] min-h-[32px] w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 border border-red-400/40 shadow-[0_0_10px_rgba(220,38,38,0.4)] hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all duration-200 active:scale-90 group"
                            >
                                {/* Multiplicador de zona táctil invisible para clicks erráticos rápidos */}
                                <span className="absolute -inset-2 rounded-full cursor-pointer"></span>
                                
                                <svg 
                                    className="w-3.5 h-3.5 text-white stroke-[3.5] transition-transform group-hover:rotate-95 duration-200" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    </div>
                    
                    {/* Contenido del modal */}
                    <div className="relative p-6 space-y-4">
                        <div className="relative z-10">
                            {children}
                        </div>
                        
                        {/* LEDs inferiores */}
                        <div className="pt-2 flex justify-center gap-2.5 border-t border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7] animate-pulse"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_#6366f1] animate-pulse delay-150"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6] animate-pulse delay-300"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export { Modal };