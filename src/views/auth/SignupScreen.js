import { useNavigation, useRoute } from '@react-navigation/native'
import react, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import ErrorLabel from '../../components/ErrorLabel'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'
import Spacing from '../../components/Spacing'
import { Post } from '../../network/network'
import Style from '../../style/Style'
import { validateEmail, validatePassword } from '../../utils/common'
import auth, { getAuth } from '@react-native-firebase/auth'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { useDispatch } from 'react-redux'
import { setUser } from '../../app/userSlice'
import { addDataToDb, storeUserData } from '../../network/firbaseNetwork'
export default SignupScreen = ({}) => {
    const navigation = useNavigation()
    const route = useRoute()
    const [validation, setValidation] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState()
    const [error, setError] = useState()
    const [userRole, setUserRole] = useState('')
    const dispatch = useDispatch()
    useEffect(() => {
        handleRoutes()
    }, [route?.params])
    const handleRoutes = () => {
        setUserRole(route?.params.role)
        console.log('first', route?.params.role)
    }

    const register = () => {
        if (
            !validateEmail(email) ||
            !validatePassword(password) ||
            name.length < 4
        ) {
            setValidation(true)
            return
        }

        console.log('Here')

        setValidation(false)
        setError(false)
        setLoading(true)
        getAuth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredentials) => {
                const user = userCredentials.user.updateProfile({
                    displayName: name,
                })

                let currentUser = {
                    photoURL: null,
                    displayName: name,
                }
                const uid = getAuth()?.currentUser?.uid
                storeUserData(uid, {
                    email: email,
                    role: userRole,
                    uid: getAuth()?.currentUser?.uid,
                    name: name,
                })
                dispatch(setUser(currentUser))
                setLoading(false)

                if (userRole === 'User') {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeRouter' }],
                    })
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AdminRoute' }],
                    })
                }
            })
            .catch((error) => {
                setLoading(false)

                setError(error.message)
                console.log('error', error.message)
            })
    }

    return (
        <View style={[Style.container, Style.centerJustify]}>
            <View style={Style.hPadding}>
                <InputField
                    label={'Name'}
                    placeholder='John Doe'
                    keyboard={'default'}
                    value={name}
                    onChangeText={(text) => {
                        setName(text)
                    }}
                    error={
                        validation && name.length < 4
                            ? 'Please provide proper name'
                            : null
                    }
                />
                <Spacing val={10} />
                <InputField
                    label={'Email'}
                    placeholder='example@gmail.com'
                    keyboard={'email-address'}
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text)
                    }}
                    error={
                        validation && !validateEmail(email)
                            ? 'Please add correct email'
                            : null
                    }
                />
                <Spacing val={10} />
                <InputField
                    label={'Password'}
                    placeholder='••••••••••'
                    keyboard={'default'}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text)
                    }}
                    secureTextEntry={true}
                    error={
                        validation && !validatePassword(password)
                            ? 'Password should be of 5 letters minimum'
                            : null
                    }
                />
                <Spacing val={10} />
                {loading && (
                    <>
                        <ActivityIndicator animating={true} />
                        <Spacing val={10} />
                    </>
                )}
                {error && (
                    <>
                        <ErrorLabel>{error}</ErrorLabel>
                        <Spacing val={10} />
                    </>
                )}

                <PrimaryButton onPress={register}>Sign up</PrimaryButton>
                <Spacing val={20} />
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ alignItems: 'center' }}
                >
                    <Text>
                        <Text style={[Style.label, Style.colorPrimary]}>
                            Already an account?{' '}
                        </Text>
                        <Text
                            style={[
                                Style.label,
                                Style.colorPrimary,
                                Style.fontBold,
                            ]}
                        >
                            Login
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
