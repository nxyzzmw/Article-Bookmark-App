import React, { useCallback, useContext, useState } from 'react';
import { API_BASE } from '../config/api';
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
import { useFocusEffect } from '@react-navigation/native';
import { SegmentedButtons } from 'react-native-paper';
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
  const { readingSearchText, setReadingSearchText } =
    useContext(SearchContext);
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

  const fetchBookmarks = async (
    status?: 'read' | 'unread'
  ) => {
    try {
      setLoading(true);

      const url = status
        ? `${API_BASE}/api/bookmark?status=${status}`
        : `${API_BASE}/api/bookmark`;
      const res = await axios.get(
        url
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
      fetchBookmarks(
        tab === 'finished' ? 'read' : 'unread'
      );
    }, [tab])
  );

  const filteredArticles =
    readingSearchText.trim() === ''
      ? articles
      : articles.filter(a => {
          const q = readingSearchText.toLowerCase();
          return (
            a.title.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.description
              .toLowerCase()
              .includes(q) ||
            a.url.toLowerCase().includes(q)
          );
        });

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
  }) => {
    const timeLabel =
      item.status === 'read'
        ? `Finished ${getTimeAgo(
            item.updatedAt || item.createdAt
          )}`
        : `Added ${getTimeAgo(
            item.createdAt
          )}`;

    return (
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

        {/*  Time label */}
        <Text style={styles.timeText}>
          {timeLabel}
        </Text>

        <TouchableOpacity
          style={styles.openBtn}
          onPress={() => openUrl(item.url)}
        >
          <Text style={styles.openText}>
            Open
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={value => {
          setReadingSearchText('');
          setTab(
            value as
              | 'reading'
              | 'finished'
          );
        }}
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
        style={styles.segmented}
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
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
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
    segmented: {
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 4,
    },
    listContent: {
      paddingBottom: 96,
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
    timeText: {
      fontSize: 12,
      color: '#8B7E6D',
      marginTop: 4,
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
    empty: {
      textAlign: 'center',
      marginTop: 50,
      color: '#777',
    },
    openBtn: {
      alignSelf: 'flex-start',
      backgroundColor: '#2E241A',
      paddingVertical: 9,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginTop: 12,
    },
    openText: {
      color: '#fff',
      fontWeight: '700',
    },
  });
