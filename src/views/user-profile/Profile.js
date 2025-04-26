import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    BackHandler,
} from 'react-native'
import { getAuth } from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../app/userSlice'
import Style from '../../style/Style'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'
import Spacing from '../../components/Spacing'
import { getDataById, updateDataInDb } from '../../network/firbaseNetwork'
import ErrorLabel from '../../components/ErrorLabel'

export default Profile = () => {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [emergencyPhone, setEmergencyPhone] = useState('')

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const currentUser = useSelector((state) => state.user.user)

    useEffect(() => {
        fetchUserData()

        // Add back handler
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (saving) {
                    return true // Prevent back navigation while saving
                }
                return false
            }
        )

        return () => backHandler.remove()
    }, [saving])

    const fetchUserData = async () => {
        try {
            setLoading(true)
            const auth = getAuth()
            const userId = auth.currentUser?.uid
            if (userId) {
                const data = await getDataById('users', userId)
                if (data) {
                    setUserData(data)
                    setName(data.name || '')
                    setEmail(data.email || '')
                    setEmergencyPhone(data.emergencyPhone || '')
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
            setError('Failed to load user data')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async () => {
        try {
            setSaving(true)
            setError(null)
            const auth = getAuth()
            const userId = auth.currentUser?.uid

            if (userId) {
                // Update Firebase Realtime Database
                await updateDataInDb('users', userId, {
                    name,
                    email,
                    emergencyPhone,
                })

                // Update Firebase Auth profile
                await auth.currentUser.updateProfile({
                    displayName: name,
                })

                // Update Redux store
                dispatch(
                    setUser({
                        ...currentUser,
                        displayName: name,
                    })
                )

                setIsEditing(false)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            setError('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const onLogout = () => {
        setLoading(true)
        getAuth()
            .signOut()
            .then(() => {
                dispatch(setUser(null))
                setLoading(false)
                navigation.reset({
                    index: 1,
                    routes: [
                        {
                            name: 'Auth',
                        },
                    ],
                })
            })
            .catch((error) => {
                setLoading(false)
                console.log('Logout error:', error.message)
            })
    }

    return (
        <SafeAreaView style={[Style.container]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[Style.heading, Style.colorBlack]}>
                        Profile
                    </Text>
                </View>

                <View style={styles.content}>
                    {error && (
                        <>
                            <ErrorLabel>{error}</ErrorLabel>
                            <Spacing val={10} />
                        </>
                    )}

                    <InputField
                        label='Name'
                        value={name}
                        onChangeText={setName}
                        editable={isEditing && !saving}
                    />
                    <Spacing val={10} />

                    <InputField
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
                        editable={isEditing && !saving}
                        keyboardType='email-address'
                    />
                    <Spacing val={10} />

                    <InputField
                        label='Emergency Phone'
                        value={emergencyPhone}
                        onChangeText={setEmergencyPhone}
                        editable={isEditing && !saving}
                        keyboardType='phone-pad'
                    />
                    <Spacing val={20} />

                    {isEditing ? (
                        <>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    saving && styles.disabledButton,
                                ]}
                                onPress={handleUpdateProfile}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color='white' />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Save Changes
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <Spacing val={10} />
                            <TouchableOpacity
                                onPress={() => setIsEditing(false)}
                                style={[
                                    styles.cancelButton,
                                    saving && styles.disabledButton,
                                ]}
                                disabled={saving}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setIsEditing(true)}
                            style={styles.editButton}
                        >
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}

                    <Spacing val={20} />
                    <TouchableOpacity
                        onPress={onLogout}
                        style={[
                            styles.logoutButton,
                            saving && styles.disabledButton,
                        ]}
                        disabled={saving}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    content: {
        padding: 20,
    },
    saveButton: {
        backgroundColor: Style.colorPrimary.color,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    editButton: {
        backgroundColor: Style.colorPrimary.color,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    cancelButton: {
        backgroundColor: '#666',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#ff4444',
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
