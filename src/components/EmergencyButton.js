import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Style from '../style/Style'

/**
 * EmergencyButton Component
 * A prominent button for emergency calls
 * @param {Object} props - Component props
 * @param {Function} props.onPress - Callback when button is pressed
 */
const EmergencyButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>Emergency Call</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FF4444',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default EmergencyButton
