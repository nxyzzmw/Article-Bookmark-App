import React, { useCallback, useContext, useState } from 'react';
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
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SearchContext } from '../context/SearchContext';

interface Bookmark {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  status: 'unread' | 'read';
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const navigation = useNavigation<any>();
  const { homeSearchText } =
    useContext(SearchContext);

  const [articles, setArticles] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        'http://10.0.2.2:2000/api/bookmark'
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

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  const toggleRead = async (
    id: string,
    currentStatus: Bookmark['status']
  ) => {
    const nextStatus =
      currentStatus === 'read'
        ? 'unread'
        : 'read';
    setArticles(prev =>
      prev.map(item =>
        item._id === id
          ? {
              ...item,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    try {
      await axios.put(
        `http://10.0.2.2:2000/api/bookmark/${id}`,
        { status: nextStatus }
      );
      fetchBookmarks();
    } catch {
      setArticles(prev =>
        prev.map(item =>
          item._id === id
            ? { ...item, status: currentStatus }
            : item
        )
      );
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
            `http://10.0.2.2:2000/api/bookmark/${id}`
          );
          fetchBookmarks();
        },
      },
    ]);
  };

  const updateArticle = (item: Bookmark) => {
    navigation.navigate('Add', { article: item });
  };

  // Smart search filtering
  const filteredArticles =
    homeSearchText.trim() === ''
      ? articles
      : articles.filter(a => {
          const q = homeSearchText.toLowerCase();
          return (
            a.title.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.description
              .toLowerCase()
              .includes(q) ||
            a.url.toLowerCase().includes(q)
          );
        });

  const totalCount = articles.length;
  const readCount = articles.filter(
    a => a.status === 'read'
  ).length;
  const unreadCount = totalCount - readCount;

  const openUrl = async (rawUrl?: string) => {
    const trimmed = rawUrl?.trim();
    if (!trimmed) {
      Alert.alert(
        'Invalid URL',
        'This bookmark has no URL.'
      );
      return;
    }

    const hasScheme =
      /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(
        trimmed
      );
    const normalized = trimmed.replace(/\s+/g, '');
    const candidates = hasScheme
      ? [normalized]
      : [`https://${normalized}`, `http://${normalized}`];

    for (const url of candidates) {
      const encoded = encodeURI(url);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        Linking.openURL(encoded);
        return;
      }
    }

    try {
      const fallback = encodeURI(candidates[0]);
      await Linking.openURL(fallback);
      return;
    } catch {
      Alert.alert('Cannot open URL', normalized);
    }
  };

  const renderCard = ({
    item,
  }: {
    item: Bookmark;
  }) => (
      <View style={styles.card}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {item.category}
            </Text>
          </View>
          {item.status === 'read' && (
            <View style={styles.readBadge}>
              <MaterialIcons
                name="check-circle"
                size={14}
                color="#1E9C4B"
              />
              <Text style={styles.readBadgeText}>
                Read
              </Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.desc}>
            {item.description}
          </Text>
        )}

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() =>
              toggleRead(item._id, item.status)
            }
          >
            <MaterialIcons
              name={
                item.status === 'read'
                  ? 'check-circle'
                  : 'radio-button-unchecked'
              }
              size={20}
              color={
                item.status === 'read'
                  ? '#1E9C4B'
                  : '#8B7E6D'
              }
            />
          </TouchableOpacity>
          <Text style={styles.readText}>
            {item.status === 'read'
              ? ' Read'
              : ' Mark as Read'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.openBtn}
            onPress={() => openUrl(item.url)}
          >
            <Text style={styles.openText}>
              Open
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              updateArticle(item)
            }
          >
            <MaterialIcons
              name="edit"
              size={18}
              color="#3A2A1A"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, styles.dangerBtn]}
            onPress={() =>
              deleteArticle(item._id)
            }
          >
            <MaterialIcons
              name="delete"
              size={18}
              color="#E24B4B"
            />
          </TouchableOpacity>
        </View>
      </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>
          OVERVIEW
        </Text>
        <View style={styles.overviewRow}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>
              Total
            </Text>
            <Text style={styles.overviewValue}>
              {totalCount}
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>
              Read
            </Text>
            <Text style={styles.overviewValue}>
              {readCount}
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>
              Unread
            </Text>
            <Text style={styles.overviewValue}>
              {unreadCount}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredArticles}
        keyExtractor={item => item._id}
        renderItem={renderCard}
        refreshing={loading}
        onRefresh={fetchBookmarks}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: 96,
  },
  overviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B7E6D',
    letterSpacing: 1,
    marginBottom: 10,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 8,
  },
  overviewItem: {
    flex: 1,
    backgroundColor: '#F7F2EA',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#9B8E7C',
    marginBottom: 6,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E241A',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    elevation: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E241A',
    marginBottom: 6,
  },
  desc: {
    color: '#5E5448',
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 19,
  },
  readText: {
    fontWeight: '600',
    marginLeft: 6,
    color: '#5E5448',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    backgroundColor: '#EFE7DB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C6A55',
    letterSpacing: 0.5,
  },
  readBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E9F7EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  readBadgeText: {
    color: '#1E9C4B',
    fontWeight: '700',
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  openBtn: {
    flex: 1,
    backgroundColor: '#2E241A',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  openText: {
    color: '#fff',
    fontWeight: '700',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F5EFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerBtn: {
    backgroundColor: '#FCECEC',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
    fontSize: 16,
  },
});
