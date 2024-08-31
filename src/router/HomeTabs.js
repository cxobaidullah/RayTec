import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../views/home/HomeScreen'
import SettingScreen from '../views/home/SettingScreen'
import Profile from '../views/user-profile/Profile'

const Tab = createBottomTabNavigator()

export default HomeTabs = () => {
    return (
        <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name='Task'
                component={SettingScreen}
                options={{ headerShown: false }}
            />

            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    )
}
