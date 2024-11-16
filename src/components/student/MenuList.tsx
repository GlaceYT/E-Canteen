import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Searchbar,
  Divider,
  Text,
  Appbar,
} from 'react-native-paper';
import MenuItemCard from './MenuItemCard';
import { useCart } from '../../context/CartContext';
import { getData } from '../../utils/AsyncStorageUtils';
import Categories from './Categories';
import SearchModal from './SearchModal';

const { width: screenWidth } = Dimensions.get('window');

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

const CATEGORY_OPTIONS = [
  'Biryani',
  'Noodles',
  'Fried Rice',
  'Snacks',
  'Drinks',
  'Ice Creams',
  'Meals',
  'Combo',
  'Salads',
  'Desserts',
];

const BANNER_IMAGES = [
  'https://cdn.discordapp.com/attachments/1064169512351563847/1306959830186983517/Beige_And_Orange_Modern_Indian_Food_Poha_YouTube_Thumbnail_3.png?ex=673890b1&is=67373f31&hm=8bcaed42083e2bc84444faf46f56f3d4c79ac10e66f7e3660568391f464a6cf6&',
  'https://media.discordapp.net/attachments/1064169512351563847/1306946793732309042/1.png?ex=6738848d&is=6737330d&hm=5b1770d7ede44951dee9f5b5612e0ae325ddd29192cc512dab7cc11da30a369b&=&format=webp&quality=lossless&width=1177&height=662',
  'https://media.discordapp.net/attachments/1064169512351563847/1306946795171090483/3.png?ex=6738848d&is=6737330d&hm=3cb78425db9d467e49a372e43de2924eec4bded6491960d0afcaa2762d67a2b6&=&format=webp&quality=lossless&width=1177&height=662',
  'https://media.discordapp.net/attachments/1064169512351563847/1306946795737448488/4.png?ex=6738848e&is=6737330e&hm=48230fdcfe3fb4f29c79210a858186cd5c18fb5d8e3fbfa249ff29c8c31ed061&=&format=webp&quality=lossless&width=1177&height=662',
];

export default function MenuList() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cart, favorites, addToCart, decreaseQuantity, toggleFavorite } = useCart();

  useEffect(() => {
    loadMenu();
    const interval = setInterval(() => {
      handleScrollToNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMenu = async () => {
    const items = (await getData('menuItems')) as MenuItem[];
    setMenuItems(items || []);
  };

  const handleScrollToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
  };

  const openSearchModal = () => {
    setSearchModalVisible(true);
  };

  const closeSearchModal = () => {
    setSearchModalVisible(false);
  };

  return (
    <>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Appbar.Header style={styles.header}>
                <Appbar.Content title="E Canteen" titleStyle={styles.headerTitle} />
                <Appbar.Action icon="food" color="#fff" onPress={() => {}} />
              </Appbar.Header>
              <View style={styles.searchContainer}>
                <TouchableOpacity onPress={openSearchModal}>
                  <Searchbar
                    value={searchQuery}
                    placeholder="Search for dishes..."
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.bannerContainer}>
                <Image
                  source={{ uri: 'https://cdn.discordapp.com/attachments/1064169512351563847/1306955519172415589/aaaa.gif?ex=6739356d&is=6737e3ed&hm=ddb4eb8aae90cfd575dc4c04de312f298c5563553ca68f2068241a63efe57d75&' }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Carousel Section */}
            <View style={styles.carouselContainer}>
              <FlatList
                data={BANNER_IMAGES}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(_, index) => index.toString()}
                onMomentumScrollEnd={(e) => {
                  const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                  setCurrentBanner(newIndex);
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                )}
              />
              <View style={styles.dotsContainer}>
                {BANNER_IMAGES.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentBanner === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.categoryContainer}>
              <View style={styles.line} />
              <Text style={styles.categoryTitle}>What's on your mind?</Text>
              <View style={styles.line} />
            </View>
            <Categories categories={CATEGORY_OPTIONS} />

            {/* Recommendations */}
            <View style={styles.categoryContainer}>
              <View style={styles.line} />
              <Text style={styles.categoryTitle}>Daily Recommendations!</Text>
              <View style={styles.line} />
            </View>
          </>
        }
        renderItem={({ item }) => {
          const cartItem = cart.find((cartItem) => cartItem.item.id === item.id);
          return (
            <MenuItemCard
              item={item}
              isFavorite={favorites.includes(item.id)}
              quantity={cartItem ? cartItem.quantity : null}
              addToCart={() => addToCart(item)}
              decreaseQuantity={() => decreaseQuantity(item)}
              toggleFavorite={() => toggleFavorite(item.id)}
            />
          );
        }}
        ItemSeparatorComponent={() => <Divider />}
      />

      <SearchModal
        visible={isSearchModalVisible}
        onClose={closeSearchModal}
        menuItems={menuItems}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#FF5722',
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  searchInput: {
    fontSize: 16,
  },
  carouselContainer: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  carouselImage: {
    width: screenWidth - 30,
    height: 200,
    borderRadius: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FF5722',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 15,
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
  bannerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
});
