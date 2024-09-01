import React, { memo } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { formatDate } from '../../../utils/common'
import Color from '../../../style/Color'
import Spacing from '../../../components/Spacing'

// Component for individual task list item
const TaskListItem = ({ item, onEdit, onDelete, role, onMarkAsComplete }) => {
    return (
        <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item?.title}</Text>
                <Text style={styles.description}>{item?.description}</Text>
                <Text style={styles.dueDate}>
                    Due: {formatDate(item?.dueDate) ?? ''}
                </Text>
                <Text style={styles.dueDate}>
                    Priority: {item?.priority ?? ''}
                </Text>
                <Text style={styles.dueDate}>
                    Assigned to: {item?.assignedMember ?? ''}
                </Text>
                <Text style={styles.dueDate}>
                    Status: {item?.taskStatus ?? ''}
                </Text>
            </View>
            <Spacing val={10} />
            {role === 'Admin' ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => onEdit(item)}
                    >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDelete(item)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {item?.taskStatus !== 'Completed' && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.editButton]}
                                onPress={() => onMarkAsComplete(item)}
                            >
                                <Text style={styles.buttonText}>
                                    {'Mark as Complete'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    )
}

export default memo(TaskListItem)

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: Color.white,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: Color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 5,
        flexDirection: 'column',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,

        color: Color.black,
        marginBottom: 4,
    },
    description: {
        fontSize: 15,
        color: '#666666',
        marginBottom: 6,
    },
    dueDate: {
        fontSize: 15,
        color: '#999999',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    editButton: {
        backgroundColor: '#4caf50',
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 6,
    },
    isComplete: {
        color: Color.primary,

        fontSize: 12,
    },
    deleteButton: {
        backgroundColor: Color.red,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 12,
    },
})
