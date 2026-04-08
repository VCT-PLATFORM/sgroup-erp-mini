import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleSheet } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'glass';
}

export const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  ({ className, title, variant = 'primary', ...props }, ref) => {
    let variantStyles = 'bg-blue-600';
    let textStyles = 'text-white font-bold';

    if (variant === 'glass') {
      variantStyles = 'bg-white/30 border-white/20 border';
      textStyles = 'text-gray-800 font-bold';
    }

    return (
      <TouchableOpacity
        ref={ref}
        className={`px-4 py-3 rounded-xl flex items-center justify-center ${variantStyles} ${className || ''}`}
        activeOpacity={0.8}
        {...props}
      >
        <Text className={textStyles}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
