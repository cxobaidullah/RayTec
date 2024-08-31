import { StyleSheet, Text, TextInput, View } from 'react-native'
import Color from '../style/Color'
import Style from '../style/Style'
import Spacing from './Spacing'

export default TextField = ({
    label,
    value,
    placeholder,
    keyboard,
    onChangeText,
    validation,
    validationFn,
    error,
    ...rest
}) => {
    return (
        <View>
            <Text style={[Style.label14, Style.fontMedium, Style.colorBlack]}>
                {label}
            </Text>
            <Spacing />
            <View style={style.container}>
                <TextInput
                    multiline
                    style={[
                        style.inputHeight,
                        Style.label14,
                        Style.fontSemiBold,
                        Style.colorBlack,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={Color.textDisabled}
                    keyboardType={keyboard}
                    value={value}
                    onChangeText={onChangeText}
                    {...rest}
                />
            </View>
            {validation && validationFn && !validationFn(value) && (
                <>
                    <Spacing />
                    <Text
                        style={[
                            Style.subTitle,
                            Style.fontSemiBold,
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

        paddingTop: 5,
        paddingHorizontal: 10,
    },
    inputHeight: {
        height: 130,
        textAlignVertical: 'top',
    },
})
