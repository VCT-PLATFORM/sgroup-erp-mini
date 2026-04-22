import React, { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class MKTErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-black text-sg-heading mb-2">Đã xảy ra lỗi</h3>
          <p className="text-sm font-medium text-sg-subtext max-w-md mb-4">{this.state.error?.message || 'Một lỗi không mong muốn đã xảy ra trong module Marketing.'}</p>
          <button onClick={() => this.setState({ hasError: false })} className="px-6 py-2.5 rounded-xl bg-sg-red text-white font-bold text-sm hover:bg-sg-red-light transition-colors">Thử lại</button>
        </div>
      );
    }
    return this.props.children;
  }
}
