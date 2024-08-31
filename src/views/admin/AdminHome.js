import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import Style from '../../style/Style'
import InputField from '../../components/InputField'
import Spacing from '../../components/Spacing'
import ErrorLabel from '../../components/ErrorLabel'
import PrimaryButton from '../../components/PrimaryButton'
// import CustomDropDown from '../../components/CustomDropDown'
import {
    validateDate,
    validateEmail,
    validatePassword,
    validateTextField,
} from '../../utils/common'
import TextField from '../../components/TextField'
import CustomDropDown from '../../components/CustomDropDown'
import CustomDateInput from '../../components/CustomDateInput'
import {
    addDataToDb,
    getDataFromDb,
    updateDataInDb,
} from '../../network/firbaseNetwork'
import moment from 'moment'
import Color from '../../style/Color'

const AdminHome = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const [validation, setValidation] = useState(false)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState()
    const [error, setError] = useState()
    const [userRole, setUserRole] = useState('')
    const [priority, setPriority] = useState()
    const [members, setMember] = useState([])
    const [assignedMember, setAssignedMember] = useState({})
    const [assignedMemberId, setAssignedMemberId] = useState()
    const [describeSelf, setDescribeSelf] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [tasks, setTasks] = useState()

    const dispatch = useDispatch()
    const priorityData = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
    ]
    useEffect(() => {
        handleRoute()
    }, [route?.params])
    useEffect(() => {
        fetchMembers()
    }, [])
    const handleRoute = () => {
        if (route?.params?.task) {
            const task = route?.params?.task
            console.log('ROUTE======>', route?.params)
            setTasks(task)
            setDescribeSelf(task?.description)
            setTitle(task?.title)
            setPriority(task?.priority)
            setAssignedMember({
                label: task?.assignedMember,
                value: task?.assignedMember?.toLowerCase().replace(/\s+/g, '-'),
                uid: task?.assignedMemberId,
            })
            console.log('data', {
                label: task?.assignedMember,
                value: task?.assignedMember?.toLowerCase().replace(/\s+/g, '-'),
                uid: task?.assignedMemberId,
            })
            // const formateDate =moment(task?.dueDate).format('ddd MMM DD YYYY HH:mm:ss');
            // console.log('formateDate', formateDate)
            // // setDueDate(formateDate)

            return
        }
    }
    const handleCreateTask = async () => {
        setLoading(true)
        setError('')

        // Basic validation
        if (
            title.length < 4 ||
            !priority ||
            !describeSelf ||
            !dueDate ||
            !assignedMember
        ) {
            setValidation(true)
            setLoading(false)
            return
        }
        const data = {
            title,
            description: describeSelf,
            priority: priority,
            dueDate: dueDate.toString(),
            createdAt: new Date().toISOString(), // Add timestamp
            assignedMember: assignedMember?.label,
            assignedMemberId: assignedMember?.uid,
        }

        try {
            const result = await addDataToDb('tasks', data)
            console.log('result', result)
            setTitle(''), setDescribeSelf('')
            setPriority('')
            setAssignedMember(null)
            // Optionally navigate to another screen or show a success message
            // navigation.goBack();
            Alert.alert('Task Created Successfully')
        } catch (err) {
            console.log('err====>', err)
            setError('Failed to create task. Please try again.')
        } finally {
            setLoading(false)
        }
    }
    const handleUpdateTask = async () => {
        setLoading(true)
        setError('')

        // Basic validation
        if (title.length < 4 || !priority || !describeSelf || !dueDate) {
            setValidation(true)
            setLoading(false)
            return
        }
        const data = {
            title,
            description: describeSelf,
            priority: priority,
            dueDate: dueDate ? dueDate.toString() : tasks?.dueDate,
            createdAt: new Date().toISOString(), // Add timestamp
            assignedMember: assignedMember?.label,
            assignedMemberId: assignedMember?.uid,
        }
        console.log('data', data)
        try {
            const result = await updateDataInDb('tasks', tasks?.id, data)
            console.log('result', result)
            setTasks(null)
            setTitle(''), setDescribeSelf('')
            setPriority('')
            setAssignedMember(null)
            Alert.alert('Task Updated Successfully')
        } catch (err) {
            console.log('err====>', err)
            setError('Failed to create task. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const fetchMembers = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getDataFromDb('users')
            if (data) {
                // Create an array of tasks with their unique keys
                let tasksArray = Object.keys(data).map((key) => ({
                    id: key, // Unique ID for the task
                    ...data[key], // The rest of the task data
                }))
                const newNembers = tasksArray.map((user) => ({
                    label: `${user?.name}`,
                    value: user?.name.toLowerCase().replace(/\s+/g, '-'),
                    uid: user?.id,
                }))
                setMember(newNembers) // Update the state with tasks and their IDs
                console.log('MEMBERS=====>', newNembers)
                setLoading(false)
            }
        } catch (err) {
            console.log('err======>', err)
            setError('Failed to load tasks')
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    return (
        <View style={[Style.container, Style.centerJustify, Style.hPadding]}>
            <Spacing val={30} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {' '}
                    {!tasks ? 'Create New Task' : 'Update Task'}
                </Text>
            </View>
            <Spacing val={50} />
            <ScrollView showsVerticalScrollIndicator ={false}>
                <View>
                    <InputField
                        styles={styles.inputFieldStyle}
                        label={'Title'}
                        placeholder='title'
                        keyboard={'email-address'}
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text)
                        }}
                        error={
                            validation && title.length < 4
                                ? 'Please provide proper title'
                                : null
                        }
                    />
                    <Spacing val={10} />
                    <TextField
                        label={'Description'}
                        placeholder={'Description'}
                        keyboard={'default'}
                        value={describeSelf}
                        onChangeText={(text) => {
                            setDescribeSelf(text)
                        }}
                        validation={validation}
                        validationFn={validateTextField}
                        error={'Required Field'}
                    />

                    <Spacing val={20} />

                    <CustomDropDown
                        label='Priority'
                        data={priorityData}
                        value={priority}
                        setValue={setPriority}
                        placeholder='Select'
                        error={
                            validation && !priority
                                ? 'Please select a priority'
                                : null
                        }
                    />
                    <Spacing val={20} />
                    <CustomDateInput
                        label='Due Date'
                        placeholder={'Enter due date'}
                        keyboard={'default'}
                        value={dueDate}
                        onChangeDate={(date) => {
                            console.log('DATA', date)
                            setDueDate(date)
                        }}
                        validation={validation}
                        validationFn={validateDate}
                        error={'Due Date Required'}
                    />
                    <Spacing val={20} />
                    <CustomDropDown
                        search={true}
                        country={true}
                        label='Assign to Member'
                        data={members}
                        value={assignedMember?.label}
                        setValue={setAssignedMember}
                        placeholder={
                            assignedMember?.label
                                ? assignedMember?.label
                                : 'Select'
                        }
                        error={
                            validation && !assignedMember
                                ? 'Please select a priority'
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
                    <Spacing val={30} />
                    <PrimaryButton
                        onPress={() => {
                            !tasks ? handleCreateTask() : handleUpdateTask()
                        }}>
                        {!tasks ? 'Create Task' : 'Update Task'}
                    </PrimaryButton>
                    <Spacing val={20} />
                </View>
            </ScrollView>
        </View>
    )
}

export default AdminHome

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#4c669f',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: Color.white,
    },
    inputFieldStyle: {
        borderWidth: null,
        borderColor: null,
        backgroundColor:Color.inputBackground
    },
})
