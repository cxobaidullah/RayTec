import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ForgotScreen from '../views/auth/ForgotScreen'
import LoginScreen from '../views/auth/LoginScreen'
import SignupScreen from '../views/auth/SignupScreen'
import StartingScreen from '../views/auth/StartingScreen'

const Stack = createNativeStackNavigator()

export default AuthRouter = () => {
    return (
        <Stack.Navigator initialRouteName='Start'>
          <Stack.Screen
                name='Start'
                options={{
                    headerShown: false,
                }}
                component={StartingScreen}
            />
            <Stack.Screen
                name='Login'
                options={{
                    headerShown: false,
                }}
                component={LoginScreen}
            />
            <Stack.Screen
                name='Signup'
                options={{
                    headerShown: false,
                }}
                component={SignupScreen}
            />
            <Stack.Screen
                name='ForgotPassword'
                options={{
                    headerShown: false,
                }}
                component={ForgotScreen}
            />
        </Stack.Navigator>
    )
}
