import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountedPrice?: number;
  veg: boolean;
  description: string;
  tag: string | null;
  image: string | null;
};

type MenuItemCardProps = {
  item: MenuItem;
  isFavorite: boolean;
  quantity: number | null;
  addToCart: () => void;
  decreaseQuantity: () => void;
  toggleFavorite: () => void;
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  isFavorite,
  quantity,
  addToCart,
  decreaseQuantity,
  toggleFavorite,
}) => {
  const vegIcon = require('../../assets/UI/veg.png');
  const nonVegIcon = require('../../assets/UI/nonveg.png');

  return (
    <Card
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
      }}
    >
      {/* Image Section with Overlays */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/150' }}
          style={{
            height: 160,
            width: '100%',
            resizeMode: 'cover',
          }}
        />
        {/* Veg/Non-Veg Icon */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: '#ffffffcc',
            borderRadius: 12,
            padding: 4,
          }}
        >
          <Image
            source={item.veg ? vegIcon : nonVegIcon}
            style={{ width: 24, height: 24 }}
          />
        </View>
        {/* Tag */}
        {item.tag && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#ffd740',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#333' }}>
              {item.tag}
            </Text>
          </View>
        )}
        {/* Favorite Icon */}
        <IconButton
          icon={isFavorite ?  'heart' : 'heart-off'}
          onPress={toggleFavorite}
          style={{ position: 'absolute', top: -5, right: 80 }}
          background= '#ffffff'
          iconColor={isFavorite ? '#FF4081' : '#bdbdbd'}
        />
      </View>

      {/* Content Section */}
      <View
        style={{
          padding: 16,
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {/* Title & Category */}
        <View style={{ marginBottom: 8 }}>
          <Text variant="titleLarge" style={{ fontWeight: '400', fontSize: 20, color: '#333' }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#9e9e9e' }}>{item.category}</Text>
        </View>

        {/* Description */}
        <Text
          numberOfLines={2}
          style={{
            fontSize: 14,
            color: '#555',
            lineHeight: 20,
            marginBottom: 8,
          }}
        >
          {item.description}
        </Text>

        {/* Price & Discount */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          {item.discountedPrice ? (
            <>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: '#bbb',
                  fontSize: 14,
                  marginRight: 8,
                }}
              >
                ₹{item.price}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '400', color: '#ff5722' }}>
                ₹{item.discountedPrice}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 18, fontWeight: '400', color: '#333' }}>
              ₹{item.price}
            </Text>
          )}
        </View>

        {/* Bottom Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Rating Section (Bottom-Left) */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <MaterialCommunityIcons
                key={i}
                name="star"
                size={16}
                color={i < 4 ? '#FFD700' : '#E0E0E0'}
                style={{ marginHorizontal: 2 }}
              />
            ))}
            <Text style={{ fontSize: 12, color: '#888', marginLeft: 4 }}>4.0( 1.2k+ )</Text>
          </View>

          {/* Quantity Controller or Add to Cart (Bottom-Right) */}
          <View>
            {quantity ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={decreaseQuantity}>
                  <MaterialCommunityIcons name="minus-circle" size={28} color="#FF5722" />
                </TouchableOpacity>
                <Text
                  style={{
                    marginHorizontal: 12,
                    fontWeight: '400',
                    fontSize: 16,
                  }}
                >
                  {quantity}
                </Text>
                <TouchableOpacity onPress={addToCart}>
                  <MaterialCommunityIcons name="plus-circle" size={28} color="#FF5722" />
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={addToCart}
                style={{
                  backgroundColor: '#ff5722',
                  borderRadius: 20,
                }}
                labelStyle={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#fff',
                }}
              >
                Add to Cart
              </Button>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};




export default MenuItemCard;
