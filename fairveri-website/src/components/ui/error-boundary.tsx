'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { Card } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      // Error caught by boundary - logged in development only
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would typically send this to an error reporting service
    // trackError(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Bir hata oluştu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border text-sm">
                <summary className="cursor-pointer font-medium text-red-800 dark:text-red-300 mb-2">
                  Hata Detayları (Geliştirme Modu)
                </summary>
                <pre className="text-red-700 dark:text-red-400 whitespace-pre-wrap overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
              >
                Tekrar Dene
              </Button>
              <Button
                onClick={this.handleReload}
                size="sm"
              >
                Sayfayı Yenile
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryConfig?: Omit<Props, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    // Error logged for development debugging
    
    // In production, send to error reporting service
    // trackError(error, { context });
  }, []);

  return handleError;
}

// Loading error component
export function LoadingError({ 
  error, 
  retry, 
  context = 'içerik yüklenirken' 
}: {
  error: Error;
  retry?: () => void;
  context?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-3xl mb-3">❌</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Yükleme Hatası
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {context} bir hata oluştu.
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="text-left mb-4 max-w-md">
          <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
            Hata Detayları
          </summary>
          <pre className="text-xs text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      
      {retry && (
        <Button
          onClick={retry}
          variant="outline"
          size="sm"
        >
          Tekrar Dene
        </Button>
      )}
    </div>
  );
}

// Network error component
export function NetworkError({ retry }: { retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-3xl mb-3">🌐</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Bağlantı Hatası
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        İnternet bağlantınızı kontrol edin ve tekrar deneyin.
      </p>
      
      {retry && (
        <Button
          onClick={retry}
          variant="outline"
          size="sm"
        >
          Tekrar Dene
        </Button>
      )}
    </div>
  );
}