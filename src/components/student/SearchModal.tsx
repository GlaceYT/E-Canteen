import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Switch,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  Searchbar,
  Appbar,
  Divider,
  Chip,
} from 'react-native-paper';
import MenuItemCard from './MenuItemCard';
import { useCart } from '../../context/CartContext';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  discountedPrice?: number;
  available: boolean;
  veg: boolean;
  description: string;
  tag: string | null;
  image: string | null;
}

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export default function SearchModal({ visible, onClose, menuItems }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [isVeg, setIsVeg] = useState<boolean>(false);  // false for Non-Veg
  const [isNonVeg, setIsNonVeg] = useState<boolean>(false);  // false for Non-Veg
  const [sortPrice, setSortPrice] = useState<'low' | 'high' | null>(null);  // null for no sorting
  const { cart, favorites, addToCart, decreaseQuantity, toggleFavorite } = useCart();
  const [loading, setLoading] = useState<boolean>(false);  // Loading state for spinner

  const translateY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (visible) {
      // Start loading when modal is visible
      setLoading(true);
      // Simulate a loading delay (e.g., 2 seconds)
      setTimeout(() => {
        setLoading(false);  // Stop loading after 2 seconds
      }, 2000);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFilteredItems(menuItems));
    }
  }, [visible]);

  useEffect(() => {
    let updatedItems = [...menuItems];

    // Filter based on Veg/Non-Veg toggles
    if (isVeg && isNonVeg) {
      updatedItems = updatedItems.filter(item => item.veg === isVeg || !item.veg);
    } else {
      if (isVeg) {
        updatedItems = updatedItems.filter(item => item.veg === true);
      }
      if (isNonVeg) {
        updatedItems = updatedItems.filter(item => item.veg === false);
      }
    }

    // Apply sorting based on price
    if (sortPrice) {
      updatedItems.sort((a, b) =>
        sortPrice === 'low'
          ? a.price - b.price
          : b.price - a.price
      );
    }

    // Apply search query filter
    if (searchQuery) {
      updatedItems = updatedItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(updatedItems);
  }, [isVeg, isNonVeg, sortPrice, searchQuery, menuItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setFilteredItems(menuItems); // Reset items
      onClose(); // Call parent close handler
    });
  };

  return visible ? (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Search" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="close" color="#fff" onPress={handleClose} />
      </Appbar.Header>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for dishes..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#FF5722"
        />
      </View>

      {/* Filter Toggles */}
      <View style={styles.toggleContainer}>
        <View style={styles.switchContainer}>
          <Chip
            selected={isVeg}
            onPress={() => setIsVeg(!isVeg)}
            style={[styles.chip, isVeg && { backgroundColor: '#FF5722', borderColor: '#FF5722' }]}>
            Veg
          </Chip>
        </View>

        <View style={styles.switchContainer}>
          <Chip
            selected={isNonVeg}
            onPress={() => setIsNonVeg(!isNonVeg)}
            style={[styles.chip, isNonVeg && { backgroundColor: '#FF5722', borderColor: '#FF5722' }]}>
            Non-Veg
          </Chip>
        </View>

        <View style={styles.priceSortContainer}>
          <Chip
            selected={sortPrice === 'low'}
            onPress={() => setSortPrice(sortPrice === 'low' ? null : 'low')}
            style={[styles.chip, sortPrice === 'low' && { backgroundColor: '#FF5722', borderColor: '#FF5722' }]}>
            Low to High
          </Chip>
          <Chip
            selected={sortPrice === 'high'}
            onPress={() => setSortPrice(sortPrice === 'high' ? null : 'high')}
            style={[styles.chip, sortPrice === 'high' && { backgroundColor: '#FF5722', borderColor: '#FF5722' }]}>
            High to Low
          </Chip>
        </View>
      </View>

      {/* Display the spinner if loading */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              isFavorite={favorites.includes(item.id)}
              quantity={cart.find((cartItem) => cartItem.item.id === item.id)?.quantity || null}
              addToCart={() => addToCart(item)}
              decreaseQuantity={() => decreaseQuantity(item)}
              toggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </Animated.View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  header: {
    backgroundColor: '#FF5722',
  },
  headerTitle: {
    color: '#fff',
  },
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF5722',
  },
  searchInput: {
    fontSize: 16,
  },
  toggleContainer: {
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    marginHorizontal: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF5722',
    color: '#FF5722',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
