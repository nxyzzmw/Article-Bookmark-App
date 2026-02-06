import React, { useEffect, useState } from 'react';
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
import { SegmentedButtons } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Bookmark {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  read: boolean;
  createdAt: string;
  finishedAt?: string;
}

export default function Home() {
  const navigation = useNavigation<any>();
  const [articles, setArticles] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'reading' | 'finished'>('reading');

  // ✅ Manual time-ago function
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);

    const diffMs = now.getTime() - past.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0)
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

    if (diffHr > 0)
      return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;

    if (diffMin > 0)
      return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;

    return 'Just now';
  };

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

  // ✅ Filter by tab
  const filteredArticles = articles.filter(article =>
    tab === 'reading'
      ? !article.read
      : article.read
  );

  const renderCard = ({
    item,
  }: {
    item: Bookmark;
  }) => {
    const timeLabel = item.read
      ? `Finished ${getTimeAgo(
          item.finishedAt ||
            item.createdAt
        )}`
      : `Added ${getTimeAgo(
          item.createdAt
        )}`;

    return (
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

        {/* ✅ Time label */}
        <Text style={styles.timeText}>
          {timeLabel}
        </Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            toggleRead(
              item._id,
              item.read
            )
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
              item.read
                ? 'green'
                : '#555'
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
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={value =>
          setTab(
            value as
              | 'reading'
              | 'finished'
          )
        }
        buttons={[
          {
            value: 'reading',
            label: 'Reading',
            checkedColor: '#3A2A1A',
            style:
              tab === 'reading' && {
                backgroundColor:
                  '#E7CBA3',
              },
          },
          {
            value: 'finished',
            label: 'Finished',
            checkedColor: '#3A2A1A',
            style:
              tab === 'finished' && {
                backgroundColor:
                  '#E7CBA3',
              },
          },
        ]}
        style={{
          margin: 10,
          marginTop: 30,
        }}
      />

      <FlatList
        data={filteredArticles}
        keyExtractor={item =>
          item._id
        }
        renderItem={renderCard}
        refreshing={loading}
        onRefresh={
          fetchBookmarks
        }
        ListEmptyComponent={
          <Text
            style={styles.empty}
          >
            {tab === 'reading'
              ? 'No articles to read'
              : 'No finished articles'}
          </Text>
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F9F3E9',
    },
    card: {
      backgroundColor:
        '#fff',
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
    },
    timeText: {
      fontSize: 12,
      color: '#666',
      marginBottom: 6,
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
      justifyContent:
        'space-between',
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
    },
  });
