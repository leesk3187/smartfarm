// App.js
import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 화면 컴포넌트 임포트
import Icon from './Screen/Icon';
import Home from './Screen/Home';
import Settings from './Screen/EnvironmentSettings';
import Chatbot from './Screen/Chatbot';
import LiveData from './Screen/Live'; 
import Profile from './Screen/Profile';
import Graph from './Screen/Graph';  // Graph 컴포넌트 임포트
import { WebSocketProvider } from './Screen/WebSocketContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation, route }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'Icon') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = require('./assets/home.png');
          } else if (route.name === 'Settings') {
            iconName = require('./assets/control.png');
          } else if (route.name === 'Chatbot') {
            iconName = require('./assets/chat.png');
          } else if (route.name === 'LiveData') {
            iconName = require('./assets/live.png');
          } else if (route.name === 'Graph') {
            iconName = require('./assets/graph.png');  // Graph 아이콘 추가
          }
          return iconName ? <Image source={iconName} style={{ width: size, height: size, tintColor: color }} /> : null;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#ffffff' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Settings" component={Settings} options={{ tabBarLabel: '환경 설정' }} />
      <Tab.Screen name="LiveData" component={LiveData} options={{ tabBarLabel: '실시간 정보' }} />
      <Tab.Screen name="Chatbot" component={Chatbot} options={{ tabBarLabel: '챗봇' }} />
      <Tab.Screen name="Graph" component={Graph} options={{ tabBarLabel: '그래프' }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Icon">
      <Stack.Screen name="Icon" component={Icon} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <WebSocketProvider> {/* WebSocketProvider로 감싸줌 */}
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainStack} options={{ headerShown: false }} />
        </Stack.Navigator>
      </WebSocketProvider>
    </NavigationContainer>
  );
}
