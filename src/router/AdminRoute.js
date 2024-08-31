import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHome from '../views/admin/AdminHome';
import AdminTask from '../views/admin/AdminTask';
import Profile from '../views/user-profile/Profile';
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    tabBar: {
        // marginBottom: 10, // Adjust the bottom margin here
        paddingBottom:10
    },
});

export default AdminHomeTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName='Task'
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16 }, // Optional: Adjust font size
                tabBarStyle: styles.tabBar, // Apply custom styles
            }}
        >
          <Tab.Screen
                name='Task'
                component={AdminTask}
                options={{
                    headerShown: false,
                    tabBarLabel: '📅 Task',  // Emoji-based icon
                    tabBarIcon: () => null, // Disable default icon
                }}
            />
            <Tab.Screen
                name='AdminHome'
                component={AdminHome}
                options={{
                    headerShown: false,
                    tabBarLabel: '🏠 Add New Task',  // Emoji-based icon
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
    );
};
