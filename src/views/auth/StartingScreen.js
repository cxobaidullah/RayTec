import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PrimaryButton from '../../components/PrimaryButton'
import Spacing from '../../components/Spacing'
import Style from '../../style/Style'
import { useNavigation } from '@react-navigation/native'

const StartingScreen = () => {
    const navigation = useNavigation()
    const startAsAdmin = () =>{
        navigation.navigate('Auth', {
            screen: 'Login',
            params: { role: 'Admin' } // Pass parameters as an object
          });
          
    }
    const startAsUser = () =>{
        navigation.navigate('Auth', {
            screen: 'Login',
            params: { role: 'User' } // Pass parameters as an object
          });
          

    }
  return (
    <View style ={[Style.container,Style.alignCenter,Style.justifyEnd,Style.hPadding]}>
    <View style = {[styles.innerView]}>
    <PrimaryButton onPress={startAsAdmin}>
     {'Get Started as Admin'}
     </PrimaryButton>
     <Spacing val={20}/>
     <PrimaryButton onPress={startAsUser}>
     {'Get Started as User'}
     </PrimaryButton>
    </View>
 <Spacing val={50}/>
    </View>
  )
}

export default StartingScreen

const styles = StyleSheet.create({
    selfAlignBottom:{
        alignSelf:'flex-end'
    },
    innerView:{
        width:'100%'
    }
})