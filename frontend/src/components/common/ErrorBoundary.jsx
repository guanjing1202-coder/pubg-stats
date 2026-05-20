import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { LanguageContext } from '../../contexts/LanguageContext';

export default class ErrorBoundary extends Component {
  static contextType = LanguageContext;

  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('React error boundary caught an error:', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const t = this.context?.t || ((key) => key);

    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{t('app_error_title')}</h1>
        <p className="text-pubg-muted text-sm mb-6">{t('app_error_message')}</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <RefreshCw size={14} />
            {t('app_error_reload')}
          </button>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Home size={14} />
            {t('app_error_home')}
          </Link>
        </div>
      </div>
    );
  }
}
