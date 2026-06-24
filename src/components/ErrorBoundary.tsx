import React, { Component, type ErrorInfo } from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
}

static getDerivedStateFromError(error: Error): State {
    // Puedes loguear el error si quieres
    console.error('ErrorBoundary atrapó:', error);
    return { hasError: true };
}

componentDidCatch(error: Error, info: ErrorInfo) {
    // Usamos 'any' para evitar problemas con ErrorInfo
    console.error('Detalles del error:', error, info);
}

render() {
    if (this.state.hasError) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
            <div className="text-center">
            <span className="text-4xl">💥</span>
            <h2 className="text-xl font-bold mt-4">Algo salió mal</h2>
            <p className="text-gray-400 mt-2">Recarga la página para continuar.</p>
            <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 px-4 py-2 bg-purple-700 rounded-xl text-sm font-bold"
            >
                Intentar de nuevo
            </button>
            </div>
        </div>
        );
    }

    return this.props.children;
    }
}

export default ErrorBoundary;