import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Alert,
    Modal,
    TouchableOpacity,
} from 'react-native'
import {
    deleteDataFromDb,
    getDataFromDb,
    getUsersByRole,
} from '../../network/firbaseNetwork'
import TaskListItem from './components/TaskListItem'
import CustomDateInput from '../../components/CustomDateInput'
import CustomDropDown from '../../components/CustomDropDown'
import { validateDate } from '../../utils/common'
import PrimaryButton from '../../components/PrimaryButton'
import { getAuth } from '@react-native-firebase/auth'
import Color from '../../style/Color'
import Style from '../../style/Style'
import HeaderComponent from '../../components/HeaderComponent'
import moment from 'moment'

const AdminTask = () => {
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
                // Create an array of tasks with their unique keys
                const tasksArray = Object.keys(data).map((key) => ({
                    id: key, // Unique ID for the task
                    ...data[key], // The rest of the task data
                }))

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


    const renderItem = ({ item }) => {
        return (
            <TaskListItem
                role={'Admin'}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        )
    }
    const onEdit = (item) => {
        navigation.navigate('HomeRouter', {
            screen: 'EditTask',
            params: {
                task: item, // Pass the item as a parameter
            },
        })
    }

    const onDelete = (item) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this task?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await deleteDataFromDb('tasks', item.id)
                            setTasks((prevTasks) =>
                                prevTasks.filter((task) => task.id !== item.id)
                            )
                        } catch (err) {
                            setError('Failed to delete task')
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        )
    }

    const handleFilterApply = () => {
        const formatDate = moment(dueDate).format('YYYY-M-D');

  
        const filteredTasks = tasks.filter(item => 
            item.priority === priority && item.dueDate === formatDate.toString() && item?.assignedMemberId ===assignedMember?.uid
          );
     
        
        setTasks(filteredTasks)
        setModalVisible(false)
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
                onRequestClose={() => setModalVisible(false)}>
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

                        <PrimaryButton onPress={handleFilterApply}>
                            {'Apply Filter'}
                        </PrimaryButton>
                        <Spacing val={20} />
                        <PrimaryButton
                            onPress={() => {
                                setModalVisible(false)
                                fetchTasks()
                            }}>
                            {'Reset'}
                        </PrimaryButton>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default AdminTask

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    headerContainer: {
        backgroundColor: '#4c669f',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
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
    listContent: {
        paddingBottom: 20,
    },
    filterButton: {
        backgroundColor: Color.white,
        padding: 8,
        borderRadius: 5,
    },
    filterButtonText: {
        color: '#4c669f',
        fontWeight: '600',
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
