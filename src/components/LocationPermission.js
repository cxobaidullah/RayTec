import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert,
    Platform,
} from 'react-native'
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions'
import Style from '../style/Style'

const LocationPermission = ({ onPermissionGranted }) => {
    const [permissionStatus, setPermissionStatus] = useState('')

    useEffect(() => {
        checkLocationPermission()
    }, [])

    const checkLocationPermission = async () => {
        try {
            const permission = Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            })

            const status = await check(permission)
            setPermissionStatus(status)

            if (status === RESULTS.GRANTED) {
                onPermissionGranted?.()
            }
        } catch (error) {
            console.error('Error checking permission:', error)
        }
    }

    const requestLocationPermission = async () => {
        try {
            const permission = Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            })

            const status = await request(permission)
            setPermissionStatus(status)

            if (status === RESULTS.GRANTED) {
                onPermissionGranted?.()
            } else if (status === RESULTS.DENIED) {
                Alert.alert(
                    'Permission Required',
                    'Location permission is required to show nearby emergency services and your position on the map.',
                    [
                        {
                            text: 'Open Settings',
                            onPress: () => Linking.openSettings(),
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                    ]
                )
            }
        } catch (error) {
            console.error('Error requesting permission:', error)
        }
    }

    if (permissionStatus === RESULTS.GRANTED) {
        return null
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Location Permission Required</Text>
            <Text style={styles.description}>
                We need your location to show nearby emergency services and your
                position on the map.
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={requestLocationPermission}
            >
                <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    button: {
        backgroundColor: Style.colorPrimary.color,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default LocationPermission
