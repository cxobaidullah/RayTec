import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

export const validateEmail = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    return reg.test(email)
}
export const validatePassword = (password) => {
    return password && password.length >= 5
}

export const getUserToken = async () => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        return ''
    }
    const data = JSON.parse(value)
    return `Bearer ${data}`
}
export const validateTextField = (text) => {
    return text?.length >= 4
}
// export const validateDate = (date) => {
//     return !isNaN(date?.getTime())
// }
export const validateDate = (date) => {
    // Check if the date is already a valid Date object
    if (date instanceof Date) {
        return !isNaN(date.getTime());
    }
    
    // Check if the date is a string and try to parse it with moment
    if (typeof date === 'string') {
        const parsedDate = moment(date, moment.ISO_8601, true); // true for strict parsing
        return parsedDate.isValid();
    }
    
    // If it's neither a Date object nor a valid string, it's invalid
    return false;
};
export const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
};
