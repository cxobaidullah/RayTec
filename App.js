import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import store from './src/app/store'
import AuthRouter from './src/router/AuthRouter'
import HomeRouter from './src/router/HomeRouter'
import SplashScreen from './src/views/splash/SplashScreen'
import AdminRoute from './src/router/AdminRoute'
import { LogBox } from 'react-native'

const Stack = createNativeStackNavigator()
LogBox.ignoreAllLogs()
const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Splash'>
                    <Stack.Screen
                        name='Splash'
                        component={SplashScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='Auth'
                        component={AuthRouter}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='HomeRouter'
                        component={HomeRouter}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='AdminRoute'
                        component={AdminRoute}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

export default App
