import { useEffect, useState } from 'react';

type ToastProps = {
    mensaje: string;
    visible: boolean;
    onClose: () => void;
    duracion?: number; // en ms, por defecto 3000
};

export function ToastNotificacion({ mensaje, visible, onClose, duracion = 3000 }: ToastProps) {
    const [mostrando, setMostrando] = useState(false);

    useEffect(() => {
        if (visible) {
            setMostrando(true);
            const timer = setTimeout(() => {
                setMostrando(false);
                setTimeout(() => onClose(), 300); // esperar la animación de salida
            }, duracion);
            return () => clearTimeout(timer);
        } else {
            setMostrando(false);
        }
    }, [visible, duracion, onClose]);

    if (!visible && !mostrando) return null;

    return (
        <div
            className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${mostrando ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-purple-400/30 flex items-center gap-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-300 animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span className="font-black text-sm tracking-wider">{mensaje}</span>
                </div>
                <button
                    onClick={() => {
                        setMostrando(false);
                        setTimeout(() => onClose(), 300);
                    }}
                    className="ml-auto text-white/70 hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}