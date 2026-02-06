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

import {} from 'react-native-image-picker';
import axios from 'axios';

export default function Add() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({
    url: '',
    title: '',
    category: '',
  });

  const [categories, setCategories] = useState([
    'Reading',
    'Technology',
    'Design',
    'Finance',
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
      category: '',
    };

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    const isValidUrl = value => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (!trimmedUrl) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(trimmedUrl)) {
      newErrors.url = 'Enter a valid URL';
    }

    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    }

    if (!selectedCategory) {
      newErrors.category = 'Select a category';
    }

    setErrors(newErrors);

    return !newErrors.url && !newErrors.title && !newErrors.category;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      url: url.trim(),
      title: title.trim(),
      description,
      category: selectedCategory,
      image: coverImage,
    };

    try {
      setLoading(true);
      await axios.post('http://10.0.2.2:5000/bookmarks', data); //jana TODO endpoints
      Alert.alert('Saved!');
    } catch (err) {
      Alert.alert('Failed to save');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Bookmark</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>
          Article URL <Text style={styles.required}>*</Text>
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
        {errors.url ? <Text style={styles.errorText}>{errors.url}</Text> : null}
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>
          Title <Text style={styles.required}>*</Text>
        </Text>
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
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : null}
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>
          Description <Text style={styles.hint}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Enter a brief description..."
          placeholderTextColor="grey"
        />
      </View>

      <View style={styles.categoryBox}>
        <Text style={styles.label}>
          Category <Text style={styles.required}>*</Text>
        </Text>

        <View style={styles.chipContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                setErrors(prev => ({ ...prev, category: '' }));
              }}
              style={[
                styles.chip,
                selectedCategory === cat && styles.activeChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat && styles.activeChipText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setShowCategoryInput(true)}
            style={styles.addChip}
          >
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>

        {errors.category ? (
          <Text style={styles.errorText}>{errors.category}</Text>
        ) : null}

        {showCategoryInput && (
          <View style={styles.addCategoryRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Type category..."
              placeholderTextColor="grey"
            />
            <TouchableOpacity onPress={addCategory} style={styles.addBtn}>
              <Text style={{ color: '#fff' }}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Button title={loading ? 'Saving...' : 'Submit'} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E9',
    padding: 16,
  },

  hint: { color: 'grey' },
  required: { color: 'red' },

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

  activeChip: { backgroundColor: '#3A2A1A' },

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

  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderStyle: 'dashed',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
