import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { setUser } from '../../app/userSlice'
import Color from '../../style/Color'
import { getAuth } from '@react-native-firebase/auth'

const SplashScreen = ({}) => {
    const navigation = useNavigation()

    const dispatch = useDispatch()

    const onAuthStateChanged = (user) => {
        setTimeout(() => {
            if (user) {
                let currentUser = {
                    photoURL: user.photoURL,
                    displayName: user.displayName,
                }
                console.log('Current User', currentUser)
                dispatch(setUser(currentUser))
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'HomeRouter',
                        },
                    ],
                })
                // name: 'AdminRoute',
            } else {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Auth',
                        },
                    ],
                })
            }
        }, 2000)
    }
    useEffect(() => {
        const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged)
        return subscriber // unsubscribe on unmount
    }, [])
    return (
        <>
            <View style={style.container} />
        </>
    )
}
export default SplashScreen

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.primary,
    },
})
