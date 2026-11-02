import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] p-6 flex items-center justify-center">
          <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-danger/10 text-danger flex items-center justify-center">
              <ShieldAlert size={28} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone block">
                Offline Recovery Safeguard
              </span>
              <h2 className="font-heading font-black text-lg text-ink">
                {this.props.fallbackTitle || 'Something interrupted this view'}
              </h2>
              <p className="text-xs text-stone leading-relaxed">
                JammuKhoj recovered safely. You can reload the module or return to the main sacred explorer.
              </p>
              <p className="text-[11px] text-stone/80 italic">
                (कोई तकनीकी त्रुटि आई है। कृपया पुनः प्रयास करें।)
              </p>
            </div>

            {this.state.error && (
              <div className="p-2.5 rounded-xl bg-surface border border-border text-left font-mono text-[10px] text-stone max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Retry Module</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-3 rounded-xl bg-surface border border-border text-ink font-bold text-xs hover:bg-surface/80 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Home size={14} />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
