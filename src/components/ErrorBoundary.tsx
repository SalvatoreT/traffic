import { Component, type ReactNode } from 'react';
import { LoadError } from './Loading';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <LoadError title="Something went wrong." message="The page hit an unexpected problem. Reloading usually fixes it, and your scenario link still works." onRetry={() => location.reload()} />;
  }
}
