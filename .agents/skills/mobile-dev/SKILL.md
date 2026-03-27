---
name: Mobile Developer
description: React Native mobile-specific patterns, native modules, performance optimization, and app store deployment for SGROUP ERP
---

# Mobile Developer Skill — SGROUP ERP

## Role Overview
The Mobile Dev builds and optimizes the React Native mobile experience for iOS and Android, ensuring native-quality performance and UX.

## Mobile-Specific Patterns

### 1. Navigation Architecture
```
AppNavigator
├── AuthStack (login, register, forgot-password)
└── MainStack (authenticated)
    ├── BottomTabs
    │   ├── DashboardTab → DashboardScreen
    │   ├── SalesTab → SalesStackNavigator
    │   │   ├── SalesPipeline
    │   │   ├── LeadDetail
    │   │   └── CreateLead
    │   ├── PlanningTab → PlanningScreen
    │   └── ProfileTab → ProfileScreen
    └── Modal Screens
        ├── NotificationsModal
        └── SettingsModal
```

### 2. Performance Optimization

#### FlatList Best Practices
```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // Performance keys:
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

// Memoize renderItem
const renderItem = useCallback(({ item }: { item: Lead }) => (
  <LeadCard lead={item} onPress={() => navigateToDetail(item.id)} />
), []);
```

#### Component Optimization
```tsx
// ✅ Memoize expensive components
export const LeadCard = React.memo<LeadCardProps>(({ lead, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text>{lead.name}</Text>
    </Pressable>
  );
});

// ✅ Use useCallback for handlers passed as props
const handlePress = useCallback(() => {
  navigation.navigate('Detail', { id: item.id });
}, [item.id]);

// ✅ Use useMemo for expensive calculations
const sortedLeads = useMemo(() =>
  leads.sort((a, b) => b.value - a.value),
  [leads]
);
```

### 3. Offline-First Architecture

```typescript
// Pattern: Queue + Sync
interface OfflineQueue {
  actions: QueuedAction[];
  addAction: (action: QueuedAction) => void;
  syncAll: () => Promise<void>;
}

export const useOfflineQueue = create<OfflineQueue>((set, get) => ({
  actions: [],
  addAction: (action) => {
    set((state) => ({ actions: [...state.actions, action] }));
    // Save to AsyncStorage
    saveQueueToStorage(get().actions);
  },
  syncAll: async () => {
    const { actions } = get();
    for (const action of actions) {
      try {
        await executeAction(action);
        set((state) => ({
          actions: state.actions.filter((a) => a.id !== action.id),
        }));
      } catch (error) {
        // Keep in queue for retry
        break;
      }
    }
  },
}));

// Network listener
import NetInfo from '@react-native-community/netinfo';

NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    useOfflineQueue.getState().syncAll();
  }
});
```

### 4. Push Notifications
```typescript
import * as Notifications from 'expo-notifications';

// Setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push
async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // Send token to backend
  await api.post('/users/push-token', { token });
  return token;
}
```

### 5. Deep Linking
```typescript
// app.json
{
  "expo": {
    "scheme": "sgroup-erp",
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "data": [{ "scheme": "sgroup-erp" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }]
    }
  }
}

// Navigation linking config
const linking = {
  prefixes: ['sgroup-erp://', 'https://erp.sgroup.vn'],
  config: {
    screens: {
      Main: {
        screens: {
          Sales: {
            screens: {
              LeadDetail: 'lead/:id',
              DealDetail: 'deal/:id',
            },
          },
        },
      },
    },
  },
};
```

### 6. Biometric Authentication
```typescript
import * as LocalAuthentication from 'expo-local-authentication';

async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Xác thực để truy cập SGROUP ERP',
    cancelLabel: 'Hủy',
    disableDeviceFallback: false,
  });

  return result.success;
}
```

### 7. App Store Deployment

#### EAS Build Configuration
```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "team@sgroup.vn",
        "ascAppId": "123456789"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "production"
      }
    }
  }
}
```

#### Release Checklist
- [ ] Version bumped in app.json
- [ ] All features tested on both iOS and Android
- [ ] Performance profiled (no memory leaks, smooth scrolling)
- [ ] Deep links tested
- [ ] Push notifications tested
- [ ] Offline mode tested
- [ ] App icons and splash screen updated
- [ ] Screenshots for app store updated
- [ ] Release notes written
- [ ] `eas build --platform all` succeeds
- [ ] `eas submit --platform all` succeeds

### 8. Platform-Specific Code
```tsx
import { Platform } from 'react-native';

// Style differences
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
    },
  }),
});

// Feature flags
const canUseBiometrics = Platform.OS !== 'web';
const canUseCamera = Platform.OS !== 'web';
```

### 9. Mobile Error Handling (from Bug-fixing Experience)

#### Crash Prevention
```tsx
// ✅ ALWAYS guard data from API before rendering
const MyScreen = () => {
  const { data, loading, error } = useMyStore();

  // Guard: normalize data
  const items = Array.isArray(data) ? data : [];

  if (loading) return <SGSkeleton />;
  if (error) return <SGEmptyState title="Lỗi" description={error} />;
  if (!items.length) return <SGEmptyState title="Chưa có dữ liệu" />;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item?.id ?? String(Math.random())}
      renderItem={({ item }) => <ItemCard item={item} />}
    />
  );
};
```

#### Web ↔ Mobile Compatibility
```tsx
// ⚠️ These APIs don't exist on web:
// - AsyncStorage (works on web via @react-native-async-storage/async-storage)
// - NetInfo (needs polyfill on web)
// - Camera, Biometrics, Push Notifications (mobile only)

// ✅ Always check platform before using native APIs
if (Platform.OS !== 'web') {
  // Use native features
  const result = await LocalAuthentication.authenticateAsync();
}

// ✅ Web-specific error: backdrop-filter not supported in all mobile browsers
// Use sgds.glass helper which handles this
```

#### Common Mobile Bugs
| Bug | Platform | Fix |
|-----|----------|-----|
| Keyboard covers input | iOS/Android | Use `KeyboardAvoidingView` |
| Safe area cut off | iOS | Use `SafeAreaView` from `react-native-safe-area-context` |
| Touch target too small | All | Min 44x44px, add `hitSlop` |
| List scroll performance | Android | `removeClippedSubviews={true}`, use `FlashList` |
| Font not loading | Web | Check `expo-font` loaded before render |



## ?? MANDATORY ARCHITECTURE RULES
**CRITICAL:** You MUST read and strictly adhere to the `docs/architecture/backend-architecture-rules.md` and `docs/architecture/api-architecture-rules.md`. Follow Clean Architecture, DTO validation, UUID v7, Soft Delete, and Decimal precision rules.