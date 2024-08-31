import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
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
import { err } from 'react-native-svg/lib/typescript/xml'
import { getAuth } from '@react-native-firebase/auth'
import { useDispatch } from 'react-redux'
import { setUser } from '../../app/userSlice'
import TopBar from '../../components/TopBar'

export default LoginScreen = ({}) => {
    const navigation = useNavigation()
    const route = useRoute()
    const [validation, setValidation] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState()
    const [error, setError] = useState()
    const[userRole ,setUserRole]=useState('')
    const dispatch = useDispatch()
    useEffect(() => {
        handleRoutes()
    }, [route?.params])
    const handleRoutes =() =>{
        setUserRole(route?.params.role)
        console.log('first', route?.params.role)
    }
    const onLogin = ({}) => {
       
        if (!validateEmail(email) || !validatePassword(password)) {
            setValidation(true)
            return
        }

        setValidation(false)
        setError(false)
        setLoading(true)

    
        getAuth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            let currentUser = {
                photoURL: userCredentials.user.photoURL,
                displayName: userCredentials.user.displayName,
            }

            dispatch(setUser(currentUser))
            if(userRole ==='User'){
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeRouter' }],
                })
            }else{
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AdminRoute' }],
                })
            }
          
        })
        .catch((error) => {
            setLoading(false)
            console.log('error', error.message)
            setError(error.message)
        })
    }

   

    return (
        <View style={[Style.container, Style.centerJustify]}>
        
            <View style={Style.hPadding}>
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
                <Spacing val={20} />
    
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

                <PrimaryButton onPress={onLogin}>Login</PrimaryButton>
                <Spacing val={20} />
                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup',{
                        role:userRole
                    })}
                    style={{ alignItems: 'center' }}
                >
                    <Text>
                        <Text style={[Style.label, Style.colorPrimary]}>
                            Do not have an account?{' '}
                        </Text>
                        <Text
                            style={[
                                Style.label,
                                Style.colorPrimary,
                                Style.fontBold,
                            ]}
                        >
                            Signup
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
