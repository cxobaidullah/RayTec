import React, { useState } from 'react'
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native'

import Style from '../../style/Style'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setUser } from '../../app/userSlice'
import { getAuth } from '@react-native-firebase/auth'

export default Profile = () => {
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()
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
                console.log('object :>> ', error.message)
            })
    }
    return (
        <SafeAreaView style={[Style.container]}>
            <TouchableOpacity onPress={onLogout} style={[styles.main]}>
                <Text style={[Style.fontBold, Style.heading, Style.colorBlack]}>
                    Logot
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 200,
    },
})
