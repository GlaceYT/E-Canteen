import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Text,
  Button,
  Divider,
  IconButton,
  Portal,
  Dialog,
  useTheme,
  Appbar,
} from 'react-native-paper';
import { getData, storeData } from '../../utils/AsyncStorageUtils';
import { Order } from '../../types';

export default function OrderManagement() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const storedOrders: Order[] = (await getData('activeOrders')) || [];
    setOrders(storedOrders);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    await storeData('activeOrders', updatedOrders);
  };

  const deleteOrder = async (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    await storeData('activeOrders', updatedOrders);
  };

  const confirmFinishOrder = (order: Order) => {
    setSelectedOrder(order);
    setConfirmDialogVisible(true);
  };

  const handleConfirmFinish = async () => {
    if (selectedOrder) {
      await updateOrderStatus(selectedOrder.id, 'Finished');
      const historyOrders: Order[] = (await getData('historyOrders')) || [];
      await storeData('historyOrders', [
        ...historyOrders,
        { ...selectedOrder, status: 'Finished' },
      ]);
      setSelectedOrder(null);
    }
    setConfirmDialogVisible(false);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.orderDetails}>
        <Text variant="titleMedium" style={styles.orderTitle}>
          Order by: {item.email}
        </Text>
        <Text style={styles.orderText}>Total Items: {item.items.length}</Text>
        <Text style={styles.orderText}>Total Price: ₹{item.total}</Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>

        <Divider style={styles.divider} />

        <FlatList
          data={item.items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name} x{item.quantity} - </Text>
              <Text style={styles.itemPrice}> ₹ {item.price * item.quantity}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        {item.status !== 'Finished' ? (
          <>
            <Button
              mode="outlined"
              onPress={() => updateOrderStatus(item.id, 'Preparing')}
              style={styles.button}
            >
              Preparing
            </Button>
            <Button
              mode="contained"
              onPress={() => confirmFinishOrder(item)}
              style={[styles.button, styles.finishButton]}
            >
              Finish
            </Button>
          </>
        ) : (
          <Text style={styles.finishedMessage}>
            Order has been marked as finished.
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.imageContainer}
        showsHorizontalScrollIndicator={false}
      >
        {item.items.map((i, index) =>
          i.image ? (
            <Image
              key={index}
              source={{ uri: i.image }}
              style={styles.itemImage}
            />
          ) : null
        )}
      </ScrollView>

      <IconButton
        icon="delete"
        onPress={() => deleteOrder(item.id)}
        style={styles.deleteIcon}
      />
    </View>
  </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Orders Panel" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="format-list-checks" color="#fff" />
      </Appbar.Header>

      <FlatList
        data={orders}
        keyExtractor={order => order.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <Divider />}
      />

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={confirmDialogVisible}
          onDismiss={() => setConfirmDialogVisible(false)}
        >
          <Dialog.Title>Confirm Order Completion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to mark this order as finished?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleConfirmFinish}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#FF5722',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    elevation: 8,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 22,
  },
  listContent: {
    padding: 10,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    padding: 10,
  },
  cardContent: {
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'space-between',
  },
  orderDetails: {
    flex: 1,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  orderText: {
    fontSize: 14,
    color: '#555',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FF5722',
    marginTop: 5,
  },
  finishedMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#28a745',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  finishButton: {
    backgroundColor: '#FF5722',
  },
  divider: {
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#FF5722',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Images flow from left
    marginTop: 10, // Space from buttons
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 5, // Space between images
  },
  deleteIcon: {
    alignSelf: 'flex-end', // Align delete button to the right
    marginTop: 10,
  },
});
