import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../views/home/HomeScreen'
import SettingScreen from '../views/home/SettingScreen'
import Profile from '../views/user-profile/Profile'
import UserTasks from '../views/home/UserTasks'
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator()

export default HomeTabs = () => {
    return (
        <Tab.Navigator initialRouteName='Task'
           screenOptions={{
                tabBarLabelStyle: { fontSize: 16 }, // Optional: Adjust font size
                tabBarStyle: styles.tabBar, // Apply custom styles
            }}
        >
            <Tab.Screen
                name='Task'
                component={UserTasks}
                options={{
                    headerShown: false,
                    tabBarLabel: '📅 Task',  // Emoji-based icon
                    tabBarIcon: () => null, // Disable default icon
                }}
            />

            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    headerShown: false,
                    tabBarLabel: '👤 Profile',  // Emoji-based icon
                    tabBarIcon: () => null, // Disable default icon
                }}
            />
        </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    tabBar: {
        // marginBottom: 10, // Adjust the bottom margin here
        paddingBottom:10
    },
});