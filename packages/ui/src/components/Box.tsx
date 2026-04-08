import { View, ViewProps } from 'react-native';

export interface BoxProps extends ViewProps {}

export function Box({ className, ...props }: BoxProps) {
  return <View className={className} {...props} />;
}
