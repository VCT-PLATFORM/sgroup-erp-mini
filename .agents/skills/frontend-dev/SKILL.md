---
name: Frontend Development (React Native / Expo)
description: Skill for developing React Native / Expo frontend components in the SGROUP ERP project
---

# Frontend Development Skill — SGROUP ERP

## Tech Stack
- **Framework**: React Native 0.83 + Expo SDK 55
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **State Management**: Zustand v5
- **Data Fetching**: TanStack React Query v5
- **HTTP Client**: Axios
- **Icons**: Lucide React Native
- **Animations**: React Native Reanimated v4
- **Fonts**: Plus Jakarta Sans (Google Fonts via expo-font)
- **Styling**: React Native StyleSheet (no Tailwind)
- **Platform**: Universal (iOS, Android, Web via react-native-web)

## Project Structure

```
src/
├── core/           # App-level config, providers, navigation
├── features/       # Feature modules (sales, planning, etc.)
│   └── <feature>/
│       ├── screens/      # Screen components
│       ├── components/   # Feature-specific components
│       ├── stores/       # Zustand stores
│       ├── hooks/        # Custom hooks
│       ├── types/        # TypeScript interfaces
│       └── utils/        # Helper functions
├── shared/         # Shared components, hooks, utils
└── system/         # System-level configs, themes
```

## Coding Standards

### Component Pattern
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
```

### Zustand Store Pattern
```tsx
import { create } from 'zustand';

interface MyStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
}));
```

### File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `SalesDashboard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useSalesData.ts`)
- Stores: `camelCase.ts` with `use` prefix + `Store` suffix (e.g., `useSalesStore.ts`)
- Types: `camelCase.ts` (e.g., `salesTypes.ts`)
- Utils: `camelCase.ts` (e.g., `formatCurrency.ts`)

### ID Generation
- Use UUID v7 for all entity identifiers: `import { v7 as uuidv7 } from 'uuid';`

## Key Patterns

### Navigation
```tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: '123' });
```

### Responsive Design
- Use `Dimensions.get('window')` or `useWindowDimensions()` for responsive layouts
- Always support web via `react-native-web` — avoid platform-specific code unless necessary
- Use `Platform.OS` checks only when truly needed

### Animations
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

## Don'ts
- ❌ Don't use inline styles — always use `StyleSheet.create()`
- ❌ Don't import from `node_modules` directly — use package exports
- ❌ Don't use `any` type — always define proper TypeScript interfaces
- ❌ Don't hardcode colors — use theme constants from `system/`
- ❌ Don't use `console.log` in production code
