import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Card, Text, Divider, IconButton, Button, Appbar, Portal, Dialog, Paragraph } from 'react-native-paper';
import { getData, storeData } from '../../utils/AsyncStorageUtils';
import { useCart } from '../../context/CartContext';
import LottieView from 'lottie-react-native';
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  email: string;
  total: number;
  items: OrderItem[];
}

export default function OrderHistory() {
  const [history, setHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { addToCart, increaseQuantity, cart } = useCart();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const historyOrders: Order[] = (await getData('historyOrders')) || [];
    setHistory(historyOrders);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => setLoading(false), 1000); // Simulate a short loading duration
  };

  const showDialog = (orderId: string) => {
    setCurrentOrder(orderId);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setCurrentOrder(null);
  };

  const confirmDeleteOrder = async () => {
    if (currentOrder) {
      const updatedHistory = history.filter((order) => order.id !== currentOrder);
      setHistory(updatedHistory);
      await storeData('historyOrders', updatedHistory);
    }
    hideDialog();
  };

  const handleOrderAgain = (order: Order) => {
    order.items.forEach((item: OrderItem) => {
      const existingCartItem = cart.find((cartItem) => cartItem.item.id === item.id);
      if (existingCartItem) {
        increaseQuantity(existingCartItem.item);
      } else {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          category: '',
          available: true,
          veg: false,
          description: '',
          tag: null,
          image: item.image || null,
        });
      }
    });

    Alert.alert('Success', 'Items have been added to your cart.');
  };

  const renderEmptyPlaceholder = () => (
    <View style={styles.emptyContainer}>
       <LottieView
      source={require('../../assets/UI/empty.json')} 
      autoPlay
      loop={false}
      style={styles.lottieTick}
    />
      <Text style={styles.emptyText}>No orders yet! Start Orderig some food.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Order History" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="history" color="#fff" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={history}
          keyExtractor={(order) => order.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.orderDetails}>
                  <Text variant="titleMedium" style={styles.orderTitle}>
                    Order by: {item.email}
                  </Text>
                  <Divider style={styles.divider} />
                  <View style={styles.detailRow}>
                    <Text style={styles.text}>Total Price:</Text>
                    <Text style={styles.totalPrice}>₹{item.total}</Text>
                  </View>
                  <Text variant="bodyLarge" style={styles.itemHeading}>
                    Items:
                  </Text>
                  <FlatList
                    data={item.items}
                    keyExtractor={(product) => product.id}
                    renderItem={({ item }) => (
                      <View style={styles.itemRow}>
                        <Text style={styles.itemText}>
                          {item.name} x{item.quantity}
                        </Text>
                        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                      </View>
                    )}
                  />
                </View>

                <View style={styles.imageContainer}>
                  {item.items.map((item) =>
                    item.image ? (
                      <Image key={item.id} source={{ uri: item.image }} style={styles.itemImage} />
                    ) : null
                  )}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  icon="cart"
                  onPress={() => handleOrderAgain(item)}
                  style={styles.orderAgainButton}
                >
                  Order Again
                </Button>
                <IconButton
                  icon="delete"
                  onPress={() => showDialog(item.id)}
                  style={styles.deleteButton}
                />
              </View>
            </Card>
          )}
          ListEmptyComponent={renderEmptyPlaceholder}
        />
      )}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Icon icon="alert" size={30} color="#FF5722" />
          <Dialog.Title style={styles.dialogTitle}>Delete Order?</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>
              Are you sure you want to remove this order from your history? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#555">
              Cancel
            </Button>
            <Button onPress={confirmDeleteOrder} textColor="#FF5722">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 10,
    borderRadius: 15,
    elevation: 10,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  orderDetails: {
    flex: 1,
    paddingRight: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
  },
  itemHeading: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#FF5722',
  },
  imageContainer: {
    flexDirection: 'column',
    marginTop: 10,
    flex: 0.5,
    paddingVertical: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  orderAgainButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#FF5722',
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
  },
  dialog: {
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  dialogTitle: {
    color: '#333',
    fontWeight: '500',
  },
  dialogText: {
    color: '#555',
    fontSize: 14,
  },
  divider: {
    marginVertical: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  lottieTick: {
    width: 350, 
    height: 350,
  },
});
