import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './routeTypes';
import { useAuthStore } from '../../features/auth/store/authStore';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { WorkspaceScreen } from '../../features/workspace/screens/WorkspaceScreen';
import { BDHShell } from '../../features/bdh/BDHShell';
import { SalesScreen } from '../../features/sales/screens/SalesScreen';
import { MarketingScreen } from '../../features/marketing/screens/MarketingScreen';
import { HRScreen } from '../../features/hr/screens/HRScreen';
import { AgencyScreen } from '../../features/agency/screens/AgencyScreen';
import { SHomesScreen } from '../../features/shomes/screens/SHomesScreen';
import { ProjectScreen } from '../../features/project/screens/ProjectScreen';
import { FinanceScreen } from '../../features/finance/screens/FinanceScreen';
import { LegalScreen } from '../../features/legal/screens/LegalScreen';
import { EmployeeProfileScreen } from '../../features/hr/screens/EmployeeProfileScreen';
import { AccessDeniedScreen } from './AccessDeniedScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const user = useAuthStore((s) => s.user);
  const restore = useAuthStore((s) => s.restore);

  React.useEffect(() => {
    restore();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Workspace" component={WorkspaceScreen} />
            <Stack.Screen name="BDHModule" component={BDHShell} />
            <Stack.Screen name="SalesModule" component={SalesScreen} />
            <Stack.Screen name="MarketingModule" component={MarketingScreen} />
            <Stack.Screen name="HRModule" component={HRScreen} />
            <Stack.Screen name="AgencyModule" component={AgencyScreen} />
            <Stack.Screen name="SHomesModule" component={SHomesScreen} />
            <Stack.Screen name="ProjectModule" component={ProjectScreen} />
            <Stack.Screen name="FinanceModule" component={FinanceScreen} />
            <Stack.Screen name="LegalModule" component={LegalScreen} />
            <Stack.Screen name="EmployeeProfile" component={EmployeeProfileScreen} />
            <Stack.Screen name="AccessDenied" component={AccessDeniedScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
