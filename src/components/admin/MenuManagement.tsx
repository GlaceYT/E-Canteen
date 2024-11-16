import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Button,
  TextInput,
  List,
  Dialog,
  Portal,
  FAB,
  Text,
  Checkbox,
  HelperText,
  Menu,
  RadioButton,
  Divider,
  Chip,
  Card,Appbar,
} from 'react-native-paper';
import { storeData, getData } from '../../utils/AsyncStorageUtils';
import * as ImagePicker from 'expo-image-picker';

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

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [veg, setVeg] = useState(true);
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [tagMenuVisible, setTagMenuVisible] = useState(false);

  const tags = ['Best Seller', 'Popular', 'New Item'];

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    const items = await getData('menuItems');
    setMenuItems(items || []);
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setDiscountedPrice('');
    setAvailable(true);
    setVeg(true);
    setDescription('');
    setTag(null);
    setImage(null);
    setEditingItem(null);
  };

  const addOrEditItem = async () => {
    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name,
      category,
      price: parseFloat(price),
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
      available,
      veg,
      description,
      tag,
      image,
    };

    const updatedMenu = editingItem
      ? menuItems.map(item => (item.id === editingItem.id ? newItem : item))
      : [...menuItems, newItem];

    setMenuItems(updatedMenu);
    await storeData('menuItems', updatedMenu);
    resetForm();
    setIsDialogVisible(false);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price.toString());
    setDiscountedPrice(item.discountedPrice?.toString() || '');
    setAvailable(item.available);
    setVeg(item.veg);
    setDescription(item.description);
    setTag(item.tag);
    setImage(item.image);
    setIsDialogVisible(true);
  };

  const openDeleteDialog = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteDialogVisible(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete) {
      const updatedMenu = menuItems.filter(item => item.id !== itemToDelete.id);
      setMenuItems(updatedMenu);
      await storeData('menuItems', updatedMenu);
      setIsDeleteDialogVisible(false);
      setItemToDelete(null);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
         <Appbar.Header style={styles.header}>
        <Appbar.Content title="Order History" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="clipboard-list" color="#fff" />
      </Appbar.Header>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>No Image</Text>
                </View>
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>
                  {item.name} {item.veg ? '🌱' : '🍖'}
                </Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>
                  ₹{item.discountedPrice ?? item.price}{' '}
                  {item.discountedPrice && <Text style={styles.strikethrough}>₹{item.price}</Text>}
                </Text>
                <Text style={styles.itemAvailability}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Text>
                {item.tag && <Chip style={styles.itemTag}>{item.tag}</Chip>}
              </View>
              <View style={styles.actionButtons}>
                <Button mode="outlined" onPress={() => openEditItem(item)} style={styles.editButton}>
                  Edit
                </Button>
                <Button mode="text" onPress={() => openDeleteDialog(item)} color="red">
                  Delete
                </Button>
              </View>
            </View>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          resetForm();
          setIsDialogVisible(true);
        }}
      />

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>{editingItem ? 'Edit Item' : 'Add Item'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Product Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setCategoryMenuVisible(true)} style={styles.input}>
                  <TextInput
                    label="Category"
                    value={category}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                  />
                </TouchableOpacity>
              }
            >
              {['Biryani', 'Fried Rice', 'Noodles', 'Tiffins', 'Starters', 'Snacks', 'Meals', 'Desserts', 'Ice Creams','Drinks'].map(cat => (
                <Menu.Item
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setCategoryMenuVisible(false);
                  }}
                  title={cat}
                />
              ))}
            </Menu>
            <TextInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Discounted Price (optional)"
              value={discountedPrice}
              onChangeText={setDiscountedPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              style={styles.input}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={available ? 'checked' : 'unchecked'}
                onPress={() => setAvailable(!available)}
              />
              <Text>Available</Text>
            </View>
            <RadioButton.Group
              onValueChange={value => setVeg(value === 'veg')}
              value={veg ? 'veg' : 'nonVeg'}
            >
              <View style={styles.radioButtonContainer}>
                <RadioButton value="veg" />
                <Text>Veg</Text>
                <View style={styles.radioMargin}>
                  <RadioButton value="nonVeg" />
                  <Text>Non-Veg</Text>
                </View>
              </View>
            </RadioButton.Group>
            <Menu
              visible={tagMenuVisible}
              onDismiss={() => setTagMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setTagMenuVisible(true)} style={styles.input}>
                  <TextInput
                    label="Tag (optional)"
                    value={tag ?? ''}
                    editable={false}
                    right={<TextInput.Icon icon="tag" />}
                  />
                </TouchableOpacity>
              }
            >
              {tags.map(tagOption => (
                <Menu.Item
                  key={tagOption}
                  onPress={() => {
                    setTag(tagOption);
                    setTagMenuVisible(false);
                  }}
                  title={tagOption}
                />
              ))}
            </Menu>
            <Button mode="outlined" onPress={pickImage} style={styles.uploadButton}>
              {image ? 'Change Image' : 'Upload Image'}
            </Button>
            {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
            <HelperText type="error" visible={!name || !category || !price}>
              All fields except discounted price, tag, and image are mandatory.
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={addOrEditItem} disabled={!name || !category || !price}>
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={isDeleteDialogVisible} onDismiss={() => setIsDeleteDialogVisible(false)}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this item?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDeleteItem} color="red">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  listContent: {
    padding: 10,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#888',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemCategory: {
    fontSize: 14,
    color: '#777',
    marginVertical: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF5722',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 12,
  },
  itemAvailability: {
    fontSize: 12,
    color: '#555',
    marginVertical: 2,
  },
  itemTag: {
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF5722',
  },
  input: {
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioMargin: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButton: {
    marginBottom: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
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
});
