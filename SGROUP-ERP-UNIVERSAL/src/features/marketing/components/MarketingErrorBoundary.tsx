import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MarketingErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[MarketingErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{
          flex: 1, alignItems: 'center', justifyContent: 'center',
          padding: 40, backgroundColor: 'rgba(217,119,6,0.03)',
          borderRadius: 24, margin: 24,
        }}>
          <View style={{
            width: 64, height: 64, borderRadius: 20,
            backgroundColor: 'rgba(217,119,6,0.1)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 20,
          }}>
            <AlertTriangle size={32} color="#D97706" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 8 }}>
            Đã xảy ra lỗi
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b', textAlign: 'center', maxWidth: 400, marginBottom: 24 }}>
            {this.state.error?.message || 'Không thể tải nội dung này. Vui lòng thử lại.'}
          </Text>
          <TouchableOpacity
            onPress={this.handleRetry}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: '#D97706', paddingHorizontal: 24, paddingVertical: 12,
              borderRadius: 14,
              ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
            } as any}
          >
            <RefreshCw size={16} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
