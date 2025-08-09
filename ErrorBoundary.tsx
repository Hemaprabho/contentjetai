import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorRecoveryUI: React.FC<{ error?: Error, errorInfo?: ErrorInfo }> = ({ error, errorInfo }) => {
    
    const copyDebugInfo = () => {
        const debugInfo = `
User Agent: ${navigator.userAgent}
Error: ${error?.toString()}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
LocalStorage Keys: ${Object.keys(localStorage).join(', ')}
        `;
        navigator.clipboard.writeText(debugInfo.trim());
        alert('Debug information copied to clipboard.');
    };

    const resetApp = () => {
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            console.error("Failed to clear storage", e);
        }
        window.location.reload();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#05050A] text-white p-4 font-inter">
            <div className="text-center max-w-2xl p-8 bg-black/30 backdrop-blur-lg border border-red-500/50 rounded-2xl">
                <div className="text-5xl mb-4">💥</div>
                <h1 className="font-sora text-3xl font-bold text-red-400 mb-2">Application Error</h1>
                <p className="text-gray-300 mb-6">Something went wrong while rendering the application. This can happen due to a temporary glitch or corrupted data.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-accent-start text-black font-bold rounded-lg hover:brightness-110 transition">
                        Try Again
                    </button>
                    <button onClick={resetApp} className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition">
                        Reset Application
                    </button>
                </div>
                <details className="mt-6 text-left text-xs text-gray-500">
                    <summary className="cursor-pointer">Show Technical Details</summary>
                    <pre className="mt-2 p-2 bg-black/50 rounded-md overflow-auto whitespace-pre-wrap">
                        {error?.toString()}
                    </pre>
                    <button onClick={copyDebugInfo} className="text-accent-start hover:underline mt-2">Copy Debug Info</button>
                </details>
            </div>
        </div>
    );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorRecoveryUI error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
