import { Platform, StyleSheet, Text, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import Color from '../style/Color'
import Style from '../style/Style'
import Spacing from './Spacing'
// import DropDown from '../assets/svg/drop-down.svg'
export default CustomDropDown = ({
    label,
    placeholder,
    data,
    value,
    setValue,
    search,
    searchPlaceholder,
    validation,
    error,
    country,
}) => {
    return (
        <View>
            <Text style={[Style.label14, Style.fontMedium, Style.colorBlack]}>
                {label}
            </Text>
            <Spacing />
            <View
                style={[
                    styles.container,
                    validation && value.length == 0 && styles.errorBorder,
                ]}
            >
                <Dropdown
                    style={[styles.dropdown]}
                    placeholderStyle={[
                        Style.fontSemiBold,

                        value?.length > 0
                            ? Style.colorBlack
                            : Style.colorTextDisabled,
                    ]}
                    selectedTextStyle={[
                        Style.fontSemiBold,
                        Style.label14,
                        Style.colorBlack,
                    ]}
                    itemTextStyle={[
                        Style.fontSemiBold,
                        Style.label14,
                        Style.colorBlack,
                    ]}
                    inputSearchStyle={[
                        Style.fontSemiBold,
                        Style.label14,
                        Style.colorBlack,
                    ]}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search={search}
                    maxHeight={300}
                    labelField='label'
                    valueField='value'
                    placeholder={placeholder}
                    searchPlaceholder={searchPlaceholder}
                    value={value}
                    onChange={(item) => {
                        setValue(country ? item : item.value)
                    }}
                    renderRightIcon={() => {
                        return  <Text style={styles.arrowText}>▼</Text> 
                    }}
                />
            </View>
            {validation && value.length == 0 && (
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.inputBackground,
        borderRadius: 10,
        height: Platform.OS == 'android' ? 48 : 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    dropdown: {
        height: 36,
    },

    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 36,
        fontSize: 16,
    },
    errorBorder: {
        borderBottomWidth: 2.5,
        borderBottomColor: Color.errorTextColor,
    },
})
