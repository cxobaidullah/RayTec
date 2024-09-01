import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Color from '../style/Color'
import Style from '../style/Style'
import Spacing from './Spacing'
import DatePicker from 'react-native-date-picker'
import { useState } from 'react'
import moment from 'moment'

export default CustomDateInput = ({
    label,
    value,
    placeholder,
    onChangeDate,
    validation,
    validationFn,
    error,
}) => {
    const [open, setOpen] = useState(false)

    const onChange = (selectedDate) => {
        const currentDate = selectedDate
        if (onChangeDate) {
            onChangeDate(currentDate)
            setOpen(false)
        }
    }

    const onPressShow = () => {
        setOpen(true)
    }
    return (
        <View>
            <Text style={[Style.label14, Style.fontMedium, Style.colorBlack]}>
                {label}
            </Text>
            <Spacing />
            <View
                style={[
                    style.container,
                    validation &&
                        validationFn &&
                        !validationFn(value) &&
                        style.errorBorder,
                ]}
            >
                <Text
                    style={[
                        // Style.fontSemiBold,
                        Style.label14,
                        value ? Style.colorBlack : Style.colorTextDisabled,
                    ]}
                >
                    {value ? moment(value).format('DD/MM/YYYY') : placeholder}
                </Text>
                <DatePicker
                    modal
                    open={open}
                    mode={'date'}
                    date={value || new Date()}
                    // maximumDate={new Date()}
                    onConfirm={onChange}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
                <TouchableOpacity onPress={onPressShow}>
                    <Text style={style.calendarText}>📅</Text>
                </TouchableOpacity>
            </View>
            {validation && validationFn && !validationFn(value) && (
                <>
                    <Spacing />
                    <Text
                        style={[
                            Style.subTitle,
                            // Style.fontSemiBold,
                            Style.colorError,
                        ]}
                    >
                        {error}
                    </Text>
                </>
            )}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: Color.inputBackground,
        borderRadius: 10,
        height: Platform.OS == 'android' ? 48 : 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    errorBorder: {
        borderBottomWidth: 2.5,
        borderBottomColor: Color.red,
    },
    calendarText: {
        fontSize: 30, // Adjust size as needed
        color: 'black', // Adjust color as needed
    },
})
