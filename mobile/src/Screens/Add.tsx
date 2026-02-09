// Add.tsx

import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/api';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';

export default function Add() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  //  If coming from Edit → article exists
  const editingArticle = route.params?.article;
  const isEditing = !!editingArticle;

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

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setSelectedCategory(null);
    setShowCategoryInput(false);
    setNewCategory('');
    setErrors({
      url: '',
      title: '',
      description: '',
      category: '',
    });
  };

  useEffect(() => {
    if (editingArticle) {
      setUrl(editingArticle.url || '');
      setTitle(editingArticle.title || '');
      setDescription(editingArticle.description || '');
      setSelectedCategory(editingArticle.category || null);

      if (editingArticle.category) {
        setCategories(prev =>
          prev.includes(editingArticle.category)
            ? prev
            : [...prev, editingArticle.category]
        );
      }
    } else {
      resetForm();
    }
  }, [editingArticle]);

  useFocusEffect(
    React.useCallback(() => {
      if (!editingArticle) {
        resetForm();
      }
    }, [editingArticle])
  );

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
        console.log(data)

    try {
      setLoading(true);

      if (editingArticle) {
        // Update existing bookmark
        await axios.put(
          `${API_BASE}/api/bookmark/${editingArticle._id}`,
          data
        );
        Alert.alert('Updated!');
      } else {
        //  Create new bookmark
        console.log("post")
        await axios.post(
          `${API_BASE}/api/bookmark`,
          data
        );
        Alert.alert('Saved!');
      }

      resetForm();
      navigation.setParams({ article: undefined });
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
        {isEditing
          ? 'Edit Bookmark'
          : 'Add New Bookmark'}
      </Text>

      <View style={styles.formCard}>
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
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.cancelBtn]}
          onPress={() => {
            resetForm();
            navigation.setParams({ article: undefined });
            navigation.goBack();
          }}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.submitBtn]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading
              ? 'Saving...'
            : isEditing
            ? 'Update'
            : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E9',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#2E241A',
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    marginBottom: 12,
  },
  inputBox: { marginBottom: 15 },
  label: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#5E5448',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderColor: '#E3D9CC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFF',
    color: '#2E241A',
  },
  descriptionInput: {
    borderColor: '#E3D9CC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 110,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    color: '#2E241A',
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
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E3D9CC',
    backgroundColor: '#F7F2EA',
  },
  activeChip: {
    backgroundColor: '#2E241A',
    borderColor: '#2E241A',
  },
  chipText: { color: '#5E5448', fontWeight: '600' },
  activeChipText: { color: '#fff' },
  addChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C9BBA8',
    backgroundColor: 'white',
  },
  addText: { fontWeight: 'bold', color: '#6E5D4A' },
  addCategoryRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  addBtn: {
    backgroundColor: '#2E241A',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 6,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E241A',
  },
  cancelText: {
    color: '#2E241A',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#2E241A',
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
  },
});
