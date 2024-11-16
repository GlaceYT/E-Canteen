import React from 'react';
import { ScrollView, TouchableOpacity, View, Image } from 'react-native';
import { Text } from 'react-native-paper';

// Importing images from the assets folder
import placeholderImage1 from '../../assets/categories/biryani.png';
import placeholderImage2 from '../../assets/categories/noodles.png';
import placeholderImage3 from '../../assets/categories/friedrice.png';
import placeholderImage4 from '../../assets/categories/samosa.png';
import placeholderImage5 from '../../assets/categories/drinks.png';
import placeholderImage6 from '../../assets/categories/icecream.png';
import placeholderImage7 from '../../assets/categories/meals.png';
import placeholderImage8 from '../../assets/categories/combo.png';
import placeholderImage9 from '../../assets/categories/salad.png';
import placeholderImage10 from '../../assets/categories/desert.png';

interface CategoriesProps {
  categories: string[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const images = [
    placeholderImage1,
    placeholderImage2,
    placeholderImage3,
    placeholderImage4,
    placeholderImage5,
    placeholderImage6,
    placeholderImage7,
    placeholderImage8,
    placeholderImage9,
    placeholderImage10,
  ];

  const renderCategory = (category: string, image: any) => (
    <TouchableOpacity key={category} style={styles.categoryContainer}>
      <View style={styles.card}>
        <Image source={image} style={styles.image} />
        <Text style={styles.text}>{category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      {categories.slice(0, 10).map((category, index) =>
        renderCategory(category, images[index])
      )}
    </ScrollView>
  );
};

const styles = {
  scrollContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  categoryContainer: {
    width: 80,
    alignItems: 'center',
    marginRight: 20,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  text: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
};

export default Categories;
