import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import {
  Appbar,
  Card,
  Button,
  Text,
  Divider,
  IconButton,
  Banner,
  ActivityIndicator,
} from 'react-native-paper';
import { useCart } from '../../context/CartContext';
import { getData, storeData } from '../../utils/AsyncStorageUtils';
import { Order } from '../../types';
import LottieView from 'lottie-react-native';
export default function Cart() {
  const { cart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [totalSavings, setTotalSavings] = useState(0);
  const [showSavingsBanner, setShowSavingsBanner] = useState(false);

  const animatedProgress = useState(new Animated.Value(0))[0];
  const spinnerScale = useState(new Animated.Value(0))[0];
  const tickOpacity = useState(new Animated.Value(0))[0];

  const showOrderPlacedModal = () => {
    setIsOrderModalVisible(true);

    Animated.sequence([
      // Fade-in spinner
      Animated.timing(spinnerScale, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Fade-out spinner and fade-in tick
      Animated.parallel([
        Animated.timing(spinnerScale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(tickOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Close modal after a short delay
      setTimeout(() => {
        setIsOrderModalVisible(false);
        spinnerScale.setValue(0);
        tickOpacity.setValue(0);
      }, 1000);
    });
  };

  useEffect(() => {
    loadActiveOrders();
  }, []);

  useEffect(() => {
    const savings = calculateSavings();
    setTotalSavings(savings);
    setShowSavingsBanner(savings > 0);
  }, [cart]);

  const loadActiveOrders = async () => {
    const storedOrders: Order[] = (await getData('activeOrders')) || [];
    setActiveOrders(storedOrders);
    if (storedOrders.length > 0) {
      setCurrentOrder(storedOrders[storedOrders.length - 1]);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, cartItem) => {
      const price = cartItem.item.discountedPrice || cartItem.item.price;
      return sum + price * cartItem.quantity;
    }, 0);
  };

  const calculateSavings = () => {
    return cart.reduce((savings, cartItem) => {
      if (cartItem.item.discountedPrice) {
        savings += (cartItem.item.price - cartItem.item.discountedPrice) * cartItem.quantity;
      }
      return savings;
    }, 0);
  };

  const placeOrder = async () => {
    const totalPrice = calculateTotal();
    const userEmail = await getData('userEmail');
    const order: Order = {
      id: Date.now().toString(),
      email: userEmail,
      items: cart.map((cartItem) => ({
        id: cartItem.item.id,
        name: cartItem.item.name,
        quantity: cartItem.quantity,
        price: cartItem.item.discountedPrice || cartItem.item.price,
        image: cartItem.item.image || null,
      })),
      status: 'Received',
      total: totalPrice,
    };

    const storedOrders: Order[] = (await getData('activeOrders')) || [];
    const updatedOrders = [...storedOrders, order];
    await storeData('activeOrders', updatedOrders);

    clearCart();
    setActiveOrders(updatedOrders);
    setCurrentOrder(order);
    showOrderPlacedModal();
  };

  const handleDeleteFinishedOrder = async (orderId: string) => {
    const updatedActiveOrders = activeOrders.filter((order) => order.id !== orderId);
    setActiveOrders(updatedActiveOrders);
    await storeData('activeOrders', updatedActiveOrders);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Your Cart" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="cart" color="#fff" />
      </Appbar.Header>

      {/* Savings Banner */}
      {showSavingsBanner && (
        <Banner
          visible={showSavingsBanner}
          icon="sale"
          style={styles.savingsBanner}
        >
          <Text style={styles.savingsText}>You saved ₹{totalSavings} on your order!</Text>
        </Banner>
      )}

      {/* Cart and Orders */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.item.id.toString()}
        ListHeaderComponent={
          <>
            {/* Empty Cart */}
            {cart.length === 0 && (
              <View style={styles.emptyCart}>
                <Image
                  source={require('../../assets/UI/emptycart.png')}
                  style={styles.emptyCartImage}
                />
                <Text variant="titleLarge" style={styles.emptyCartTitle}>
                  Your cart is empty
                </Text>
                <Text style={styles.emptyCartSubtitle}>
                  Add items to your cart to get started!
                </Text>
              </View>
            )}

            {/* Total and Place Order */}
            {cart.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.totalContainer}>
                  <Text variant="titleMedium">Total:</Text>
                  <Text variant="titleMedium">₹{calculateTotal()}</Text>
                </View>
                <Button
                  mode="contained"
                  style={styles.placeOrderButton}
                  onPress={placeOrder}
                >
                  Place Order
                </Button>
              </>
            )}

            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <>
                <View style={styles.categoryContainer2}>
                  <View style={styles.line} />
                  <Text style={styles.mainTitle}>Active Orders</Text>
                  <View style={styles.line} />
                </View>
                <FlatList
                  data={activeOrders}
                  keyExtractor={(order) => order.id}
                  renderItem={({ item }) => (
                    <Card style={styles.orderItem}>
                      <View style={styles.orderContent}>
                        <View style={styles.leftContent}>
                          <Text variant="titleMedium" style={styles.orderTitle}>
                            Order by: {item.email}
                          </Text>
                          <Text>Total Items: {item.items.length}</Text>
                          <Text>Total Price: ₹{item.total}</Text>
                        </View>
                        <View style={styles.rightContent}>
                          <FlatList
                            data={item.items}
                            keyExtractor={(i, index) => `${i.id}-${index}`}
                            horizontal
                            renderItem={({ item: i }) =>
                              i.image ? (
                                <Image
                                  source={{ uri: i.image }}
                                  style={styles.orderImage}
                                />
                              ) : null
                            }
                          />
                          <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>Status: {item.status}</Text>
                          </View>
                        </View>
                      </View>
                      {item.status === 'Finished' && (
                        <Banner
                          visible
                          actions={[
                            {
                              label: 'Delete',
                              onPress: () => handleDeleteFinishedOrder(item.id),
                            },
                          ]}
                          icon="check-circle-outline"
                          style={styles.finishedBanner}
                        >
                          <Text style={styles.finishedText}>Order Finished</Text>
                        </Banner>
                      )}
                    </Card>
                  )}
                />
              </>
            )}
          </>
        }
        renderItem={({ item }) => (
          <Card style={styles.cartItem}>
            <View style={styles.cartItemContent}>
              {item.item.image && (
                <Image
                  source={{ uri: item.item.image }}
                  style={styles.cartItemImage}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={styles.cartItemName}>
                  {item.item.name}
                </Text>
                <Text style={styles.cartItemDetails}>
                  ₹{item.item.discountedPrice || item.item.price} x {item.quantity} = ₹
                  {(item.item.discountedPrice || item.item.price) * item.quantity}
                </Text>
              </View>
              <View style={styles.cartItemActions}>
                <IconButton icon="minus" onPress={() => decreaseQuantity(item.item)} />
                <Text>{item.quantity}</Text>
                <IconButton icon="plus" onPress={() => increaseQuantity(item.item)} />
                <IconButton icon="delete" onPress={() => removeFromCart(item.item.id)} />
              </View>
            </View>
          </Card>
        )}
      />

      {/* Order Placed Modal */}
      <Modal visible={isOrderModalVisible} transparent animationType="fade">
  <View style={styles.modalContainer}>
    <LottieView
      source={require('../../assets/UI/tick.json')} 
      autoPlay
      loop={false}
      style={styles.lottieTick}
    />
    <Text style={styles.successText}>Order Placed Successfully!</Text>
  </View>
</Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    backgroundColor: '#FF5722',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  headerTitle: { color: '#fff', fontWeight: '400', fontSize: 20 },
  content: { padding: 16 },
  emptyCart: { alignItems: 'center', marginTop: 80 },
  emptyCartImage: { width: 200, height: 200 },
  emptyCartTitle: { marginTop: 20, fontWeight: '400' },
  emptyCartSubtitle: { color: '#777' },
  cartItem: { marginBottom: 10, borderRadius: 10, elevation: 4 },
  cartItemContent: { flexDirection: 'row', padding: 10 },
  cartItemImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  cartItemName: { fontWeight: '400', fontSize: 16 },
  cartItemDetails: { color: '#777' },
  cartItemActions: { flexDirection: 'row', alignItems: 'center' },
  divider: { marginVertical: 10 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  placeOrderButton: { backgroundColor: '#FF5722', paddingVertical: 5, borderRadius: 30 },
  mainTitle: {
      fontWeight: '400',
      fontSize: 18,
      marginHorizontal: 10,
      textAlign: 'center',
      color: '#FF5722',
  },
  orderItem: {
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 4,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContent: {
    justifyContent: 'flex-start',
  },
  orderTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  orderImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  statusContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FF9800',
  },
  finishedBanner: {
    backgroundColor: '#E8F5E9',
    marginTop: 15,
    borderRadius: 10,
  },
  finishedText: {
    color: '#388E3C',
    fontWeight: '400',
  },
  savingsBanner: { 
    backgroundColor: '#FFEB3B', 
    marginTop: 10, 
    borderRadius: 20, 
    padding: 10 
  },
  savingsText: { fontWeight: '400', color: '#FF5722' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  lottieTick: {
    width: 250, 
    height: 250,
  },
  spinnerWrapper: {
    width: 100,
    height: 100, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTick: {
    position: 'absolute',
    fontSize: 80,
    color: '#FF5722',
  },
  successText: {
    marginTop: 20,
    fontSize: 24,
    color: '#FF5722',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  categoryTitle: {
    fontWeight: '400',
    fontSize: 18,
    marginHorizontal: 10,
    textAlign: 'center',
    color: '#333',
  },
});
