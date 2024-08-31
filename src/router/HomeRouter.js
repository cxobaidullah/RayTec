import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Profile from '../views/user-profile/Profile'
import HomeDrawer from './HomeDrawer'
import HomeTabs from './HomeTabs'

const Stack = createNativeStackNavigator()

export default HomeRouter = () => {
    return (
        <Stack.Navigator initialRouteName='HomeTabs'>
            <Stack.Screen
                name='HomeDrawer'
                component={HomeDrawer}
                options={{
                    headerShown: false,
                }}
            />
              <Stack.Screen
                name='HomeTabs'
                component={HomeTabs}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Profile'
                options={{
                    headerShown: false,
                }}
                component={Profile}
            />
        </Stack.Navigator>
    )
}
