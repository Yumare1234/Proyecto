import React, { useEffect, useState } from 'react';

// --- COMPONENTE INTERACTIVO: LIBERACIÓN DE ENERGÍA MALDITA POR CLICK ---
interface CardClickEffectProps {
    children: React.ReactNode;
}

export const CardClickEffect = ({ children }: CardClickEffectProps) => {
    const [isActivating, setIsActivating] = useState(false);

    const handleCardClick = () => {
        if (isActivating) return;
        setIsActivating(true);
        
        // La animación dura 800ms antes de regresar al estado normal
        setTimeout(() => {
            setIsActivating(false);
        }, 800);
    };

    return (
        <div 
            onClick={handleCardClick}
            className={`relative rounded-xl overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.8)] w-full h-full select-none transition-all duration-300
                ${isActivating ? 'animate-bounce scale-[0.97] ring-4 ring-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.6)]' : 'hover:scale-[1.01]'}
            `}
        >
            {/* Onda expansiva de energía maldita (Efecto Onda/Shockwave) */}
            {isActivating && (
                <div className="absolute inset-0 z-30 pointer-events-none animate-ping rounded-xl bg-gradient-to-r from-purple-600/30 via-transparent to-pink-600/30 scale-150 duration-700" />
            )}

            {/* Brillo sobre la ilustración al activarse */}
            <div 
                className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 bg-gradient-to-t from-purple-900/40 via-transparent to-white/10 mix-blend-color-dodge
                    ${isActivating ? 'opacity-100' : 'opacity-0'}
                `}
            />

            {/* Aura perimetral parpadeante activa */}
            <div 
                className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-red-600 rounded-xl blur-md z-0 transition-opacity duration-300
                    ${isActivating ? 'opacity-80 animate-pulse' : 'opacity-0'}
                `}
            />

            {/* Contenedor del Render Interior */}
            <div className="relative w-full h-full bg-[#0a0a0f] rounded-xl overflow-hidden z-10 border border-white/5">
                {children}
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL: MODAL TÁCTICO ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto animate-in fade-in duration-200">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-[#020206]/85 backdrop-blur-xl cursor-pointer transition-opacity"
            />

            <div className="relative w-full max-w-[min(100vw-2rem,700px)] bg-[#0d0d12]/95 border border-white/10 rounded-[1.75rem] shadow-[0_0_40px_rgba(0,0,0,0.35)] z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/5 via-transparent to-red-950/5 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-70"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
                        </div>
                        <h3 className="text-sm font-black tracking-[0.25em] text-white uppercase truncate">
                            {title}
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition duration-200 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="relative z-10 flex-1 p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { Modal };