import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SearchContext } from '../context/SearchContext';

interface Bookmark {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  read: boolean;
}

export default function Home() {
  const navigation = useNavigation<any>();
  const { searchText } = useContext(SearchContext);

  const [articles, setArticles] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        'http://10.0.2.2:5000/bookmarks'
      );

      setArticles(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (err: any) {
      console.log(err);

      if (!err.response) {
        Alert.alert(
          'Network error',
          'Check your server connection'
        );
      } else if (err.response.status >= 500) {
        Alert.alert('Server error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const toggleRead = async (
    id: string,
    current: boolean
  ) => {
    try {
      await axios.patch(
        `http://10.0.2.2:5000/bookmarks/${id}`,
        { read: !current }
      );
      fetchBookmarks();
    } catch {
      Alert.alert('Failed to update');
    }
  };

  const deleteArticle = async (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await axios.delete(
            `http://10.0.2.2:5000/bookmarks/${id}`
          );
          fetchBookmarks();
        },
      },
    ]);
  };

  const updateArticle = (item: Bookmark) => {
    navigation.navigate('Add', { article: item });
  };

  // ✅ Smart search filtering
  const filteredArticles =
    searchText.trim() === ''
      ? articles
      : articles.filter(a => {
          const q = searchText.toLowerCase();
          return (
            a.title.toLowerCase().includes(q) ||
            a.category
              .toLowerCase()
              .includes(q)
          );
        });

  const renderCard = ({
    item,
  }: {
    item: Bookmark;
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        Linking.openURL(item.url)
      }
    >
      <Text style={styles.title}>
        {item.title}
      </Text>

      {item.description && (
        <Text style={styles.desc}>
          {item.description}
        </Text>
      )}

      <Text style={styles.category}>
        {item.category}
      </Text>

      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          toggleRead(item._id, item.read)
        }
      >
        <MaterialIcons
          name={
            item.read
              ? 'check-circle'
              : 'radio-button-unchecked'
          }
          size={22}
          color={
            item.read ? 'green' : '#555'
          }
        />
        <Text style={styles.readText}>
          {item.read
            ? ' Read'
            : ' Mark as Read'}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconRow}
          onPress={() =>
            updateArticle(item)
          }
        >
          <MaterialIcons
            name="edit"
            size={22}
            color="#3A2A1A"
          />
          <Text style={styles.edit}>
            {' '}
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconRow}
          onPress={() =>
            deleteArticle(item._id)
          }
        >
          <MaterialIcons
            name="delete"
            size={22}
            color="red"
          />
          <Text style={styles.delete}>
            {' '}
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredArticles}
        keyExtractor={item => item._id}
        renderItem={renderCard}
        refreshing={loading}
        onRefresh={fetchBookmarks}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>
            {articles.length === 0
              ? 'No bookmarks yet'
              : 'No matching bookmarks'}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E9',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2A1A',
  },
  desc: {
    marginVertical: 5,
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  readText: {
    fontWeight: '600',
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  edit: {
    color: '#3A2A1A',
    fontWeight: '600',
  },
  delete: {
    color: 'red',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
    fontSize: 16,
  },
});
