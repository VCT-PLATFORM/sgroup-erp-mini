import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ModuleBusinessScreen } from '../../workspace/moduleHub/ModuleBusinessScreen';
import { sgds } from '../../../shared/theme/theme';

export function HRScreen() {
  const navigation = useNavigation<any>();

  return (
    <ModuleBusinessScreen 
      moduleId="hr" 
      rightContent={
        <TouchableOpacity 
          onPress={() => navigation.navigate('EmployeeProfile')}
          style={[
            {
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(219, 39, 119, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            },
            Platform.OS === 'web' ? (sgds.cursor as any) : null,
          ]}
        >
          <User size={18} color="#DB2777" />
        </TouchableOpacity>
      }
    />
  );
}
