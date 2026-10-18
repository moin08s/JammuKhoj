import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('JammuKhoj ErrorBoundary caught:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleResetCache = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-ink">
                Something Went Wrong
              </h2>
              <div className="text-xs text-primary font-semibold">
                कुछ गलत हो गया
              </div>
              <p className="text-xs text-stone leading-relaxed pt-1">
                JammuKhoj encountered an unexpected issue. Your offline database and saved itineraries are safe.
              </p>
            </div>

            {this.state.errorMessage && (
              <div className="p-2.5 rounded-xl bg-surface border border-border text-[11px] font-mono text-stone truncate select-all">
                {this.state.errorMessage}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-primary/95 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw size={15} />
                <span>Reload App</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full py-3 px-4 rounded-2xl bg-surface border border-border text-ink font-bold text-xs hover:bg-card shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Home size={15} />
                <span>Return to Home</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="text-[11px] text-stone hover:text-danger underline pt-1 block mx-auto transition-colors"
              >
                Reset Local Storage Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
