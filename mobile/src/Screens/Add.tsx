// Add.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Add() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  //  If coming from Edit → article exists
  const editingArticle = route.params?.article;

  //  Pre-fill fields when editing
  const [url, setUrl] = useState(editingArticle?.url || '');
  const [title, setTitle] = useState(editingArticle?.title || '');
  const [description, setDescription] = useState(
    editingArticle?.description || ''
  );

  const [errors, setErrors] = useState({
    url: '',
    title: '',
    description: '',
    category: '',
  });

  const [categories, setCategories] = useState([
    'Reading',
    'Technology',
    'Design',
    'Finance',
  ]);

  const [selectedCategory, setSelectedCategory] = useState(
    editingArticle?.category || null
  );

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, newCategory]);
    setNewCategory('');
    setShowCategoryInput(false);
  };

  const validateForm = () => {
    const newErrors = {
      url: '',
      title: '',
      description: '',
      category: '',
    };

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    const isValidUrl = (value: string) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (!trimmedUrl) newErrors.url = 'URL is required';
    else if (!isValidUrl(trimmedUrl))
      newErrors.url = 'Enter a valid URL';

    if (!trimmedTitle) newErrors.title = 'Title is required';
    if (!trimmedDescription)
      newErrors.description = 'Description is required';
    if (!selectedCategory)
      newErrors.category = 'Select a category';

    setErrors(newErrors);

    return (
      !newErrors.url &&
      !newErrors.title &&
      !newErrors.description &&
      !newErrors.category
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
      category: selectedCategory,
    };

    try {
      setLoading(true);

      if (editingArticle) {
        // ✅ Update existing bookmark
        await axios.put(
          `http://10.0.2.2:5000/bookmarks/${editingArticle._id}`,
          data
        );
        Alert.alert('Updated!');
      } else {
        // ✅ Create new bookmark
        await axios.post(
          'http://10.0.2.2:5000/bookmarks',
          data
        );
        Alert.alert('Saved!');
      }

      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingArticle
          ? 'Edit Bookmark'
          : 'Add New Bookmark'}
      </Text>

      {/* URL */}
      <View style={styles.inputBox}>
        <Text style={styles.label}>
          Article URL *
        </Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={text => {
            setUrl(text);
            setErrors(prev => ({ ...prev, url: '' }));
          }}
          placeholder="https://example.com/article"
          placeholderTextColor="grey"
        />
        {errors.url ? (
          <Text style={styles.errorText}>
            {errors.url}
          </Text>
        ) : null}
      </View>

      {/* Title */}
      <View style={styles.inputBox}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={text => {
            setTitle(text);
            setErrors(prev => ({ ...prev, title: '' }));
          }}
          placeholder="Enter article title"
          placeholderTextColor="grey"
        />
        {errors.title ? (
          <Text style={styles.errorText}>
            {errors.title}
          </Text>
        ) : null}
      </View>

      {/* Description */}
      <View style={styles.inputBox}>
        <Text style={styles.label}>
          Description *
        </Text>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={text => {
            setDescription(text);
            setErrors(prev => ({
              ...prev,
              description: '',
            }));
          }}
          multiline
          placeholder="Enter description..."
          placeholderTextColor="grey"
        />
        {errors.description ? (
          <Text style={styles.errorText}>
            {errors.description}
          </Text>
        ) : null}
      </View>

      {/* Category */}
      <View style={styles.categoryBox}>
        <Text style={styles.label}>
          Category *
        </Text>

        <View style={styles.chipContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                setErrors(prev => ({
                  ...prev,
                  category: '',
                }));
              }}
              style={[
                styles.chip,
                selectedCategory === cat &&
                  styles.activeChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat &&
                    styles.activeChipText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() =>
              setShowCategoryInput(true)
            }
            style={styles.addChip}
          >
            <Text style={styles.addText}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        {errors.category ? (
          <Text style={styles.errorText}>
            {errors.category}
          </Text>
        ) : null}

        {showCategoryInput && (
          <View style={styles.addCategoryRow}>
            <TextInput
              style={[
                styles.input,
                { flex: 1 },
              ]}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Type category..."
              placeholderTextColor="grey"
            />
            <TouchableOpacity
              onPress={addCategory}
              style={styles.addBtn}
            >
              <Text
                style={{ color: '#fff' }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Button
        title={
          loading
            ? 'Saving...'
            : editingArticle
            ? 'Update'
            : 'Submit'
        }
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E9',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#3A2A1A',
    marginBottom: 10,
  },
  inputBox: { marginBottom: 15 },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  descriptionInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    color: '#000',
  },
  categoryBox: { marginBottom: 15 },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  activeChip: {
    backgroundColor: '#3A2A1A',
  },
  chipText: { color: '#333' },
  activeChipText: { color: '#fff' },
  addChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#aaa',
    backgroundColor: 'white',
  },
  addText: { fontWeight: 'bold' },
  addCategoryRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  addBtn: {
    backgroundColor: '#3A2A1A',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 8,
  },
});
