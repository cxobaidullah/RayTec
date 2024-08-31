import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { deleteDataFromDb, getDataFromDb } from '../../network/firbaseNetwork';
import moment from 'moment';
import { formatDate } from '../../utils/common';
import TaskListItem from './components/TaskListItem';


const AdminTask = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState()
    const [error, setError] = useState()
    const isFocused =useIsFocused()
    const navigation = useNavigation()
    useEffect(() =>{
        fetchTasks()
    },[isFocused])
    const fetchTasks = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getDataFromDb('tasks');
            if (data) {
                // Create an array of tasks with their unique keys
                const tasksArray = Object.keys(data).map(key => ({
                    id: key, // Unique ID for the task
                    ...data[key], // The rest of the task data
                }));
    
                setTasks(tasksArray); // Update the state with tasks and their IDs
                console.log('Tasks with IDs:', tasksArray);
                setLoading(false)
            }
        } catch (err) {
            setError('Failed to load tasks');
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };
 
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Total Tasks: {tasks.length}</Text>
    </View>
  );

  const renderItem = ({item}) => {
    return <TaskListItem item={item} onEdit={onEdit} onDelete={onDelete}/>
  }
  const onEdit =(item) =>{
    navigation.navigate('AdminHome',{
        task:item
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
              await deleteDataFromDb('tasks', item.id);
              setTasks(prevTasks => prevTasks.filter(task => task.id !== item.id));
            } catch (err) {
              setError('Failed to delete task');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item,index) =>index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AdminTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
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
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
  },
  
});
