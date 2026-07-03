import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; isReloading: boolean; }

function isChunkLoadError(error: Error | null): boolean {
  if (!error) return false;
  const message = error.message?.toLowerCase() || '';
  return (
    message.includes('dynamically imported module') ||
    message.includes('loading chunk') ||
    message.includes('loading css chunk') ||
    message.includes('failed to fetch dynamically')
  );
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, isReloading: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isReloading: false };
  }

  handleReload = () => {
    this.setState({ isReloading: true });
    if (isChunkLoadError(this.state.error) && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .finally(() => {
          window.location.reload();
        });
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isChunk = isChunkLoadError(this.state.error);
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
          <div className="text-6xl">💥</div>
          <h2 className="text-xl font-bold text-white">{isChunk ? '版本已更新' : '出错了'}</h2>
          <p className="text-sm text-gray-400 max-w-xs">
            {isChunk
              ? '页面资源已更新，点击刷新后会重新注册并使用最新版本。如果仍有问题，请尝试 Ctrl + Shift + R 强制刷新。'
              : '应用遇到了意外错误，请尝试刷新页面'}
          </p>
          {this.state.error && !isChunk && (
            <pre className="text-xs text-red-400/60 bg-red-500/5 rounded-xl p-3 max-w-full overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReload}
            disabled={this.state.isReloading}
            className="px-6 py-2.5 bg-indigo-500 rounded-xl text-white text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {this.state.isReloading ? '刷新中...' : '刷新页面'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
