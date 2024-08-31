import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { setUser } from '../../app/userSlice'
import Color from '../../style/Color'
import { getAuth } from '@react-native-firebase/auth'
import { getDataById } from '../../network/firbaseNetwork'

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
                
                dispatch(setUser(currentUser))
                getMe()
               
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
    const getMe = async() =>{
        const uid = getAuth()?.currentUser?.uid
      
        const user = await getDataById('users',uid)
         
        if(user?.role === 'Admin'){
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'AdminRoute',
                    },
                ],
            })
            // name: 'AdminRoute',
        }else{
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'HomeRouter',
                    },
                ],
            })
            // name: 'AdminRoute',
        }
    }
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
