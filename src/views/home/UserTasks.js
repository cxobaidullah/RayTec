import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    getDataFromDb,
    getUsersByRole,
    updateDataInDb,
} from '../../network/firbaseNetwork'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import TaskListItem from '../admin/components/TaskListItem'
import { getAuth } from '@react-native-firebase/auth'
import PrimaryButton from '../../components/PrimaryButton'
import { validateDate } from '../../utils/common'
import HeaderComponent from '../../components/HeaderComponent'
import Style from '../../style/Style'
import moment from 'moment'

const UserTasks = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState()
    const [error, setError] = useState()
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const [isModalVisible, setModalVisible] = useState(false)
    const [validation, setValidation] = useState(false)

    const [priority, setPriority] = useState()
    const [members, setMember] = useState([])
    const [assignedMember, setAssignedMember] = useState({})
    const [dueDate, setDueDate] = useState('')
    const priorityData = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
    ]
    useEffect(() => {
        fetchTasks()
        fetchMembers()
    }, [isFocused])
    const fetchTasks = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getDataFromDb('tasks')
            if (data) {
                const useID = getAuth()?.currentUser?.uid
                console.log('useID', useID)
                // Create an array of tasks with their unique keys

                const tasksArray = Object.keys(data)
                    .map((key) => ({
                        id: key, // Unique ID for the task
                        ...data[key], // The rest of the task data
                    }))
                    .filter((task) => task?.assignedMemberId === useID) // Filter tasks where task.uid matches the user's UID
                console.log('taskArrak-=====>', tasksArray)
                setTasks(tasksArray) // Update the state with tasks and their IDs

                setLoading(false)
            }
        } catch (err) {
            setError('Failed to load tasks')
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    const fetchMembers = async () => {
        try {
            const data = await getUsersByRole('users', 'User')
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
            }
        } catch (err) {
            console.log('err======>', err)
            setError('Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }
    const onMarkAsComplete = async (item) => {
        const data = {
            ...item,
            taskStatus: 'Completed',
        }

        try {
            const result = await updateDataInDb('tasks', item?.id, data)
            console.log('result', result)

            Alert.alert((title = 'Success!'), 'Task Completed')
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task?.id === item?.id
                        ? { ...task, taskStatus: 'Completed' }
                        : task
                )
            )
        } catch (err) {
            console.log('err====>', err)
            Alert.alert(
                (title = 'Error'),
                'Failed to Complete task. Please try again.'
            )
            setError('Failed to create task. Please try again.')
        } finally {
            setLoading(false)
        }
    }
    const handleFilterApply = () => {
        const formatDate = moment(dueDate).format('YYYY-M-D')

        const filteredTasks = tasks.filter(
            (item) =>
                item.priority === priority &&
                item.dueDate === formatDate.toString()
        )

        setTasks(filteredTasks)
        setModalVisible(false)
    }

    const handleFilterReset = () => {
        fetchTasks() // Reset to all tasks
        setPriority('')
        setDueDate('')
        setAssignedMember({})
        setModalVisible(false)
    }

    const renderItem = ({ item }) => {
        return (
            <TaskListItem
                role={'User'}
                item={item}
                onMarkAsComplete={onMarkAsComplete}
            />
        )
    }
    const handleFilterPress = () => setModalVisible(true)

    return (
        <View style={styles.container}>
            <HeaderComponent
                title={`Total Tasks: ${tasks.length}`}
                onFilterPress={handleFilterPress}
            />
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
            {/* Filter Modal */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={[Style.label18, styles.modalTitle]}>
                            Filter Tasks
                        </Text>

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
                        {/* <CustomDropDown
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
                        <Spacing val={20} /> */}

                        <PrimaryButton onPress={handleFilterApply}>
                            {'Apply Filter'}
                        </PrimaryButton>
                        <Spacing val={20} />
                        <PrimaryButton onPress={handleFilterReset}>
                            {'Reset'}
                        </PrimaryButton>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default UserTasks

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    listContent: {
        paddingBottom: 20,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Color.white,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        marginBottom: 10,
    },
})
