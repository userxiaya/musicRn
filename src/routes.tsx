import React from 'react';
import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './pages/Home';
import Detail from './pages/songGroupDetail';
import SearchPage from './pages/search';

const options = {
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  // 过渡动效
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
interface RouterConfig {
  name: string;
  component: React.ComponentType<any>;
}
const routesList: RouterConfig[] = [
  {name: 'Home', component: Home},
  {name: 'songGroupDetail', component: Detail},
  {name: 'search', component: SearchPage},
];
const Stack = createStackNavigator();
const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {routesList.map(e => {
          return (
            <Stack.Screen
              key={e.name}
              name={e.name}
              component={e.component}
              options={options}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Router;
