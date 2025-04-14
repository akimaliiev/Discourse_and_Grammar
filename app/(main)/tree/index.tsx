import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, IconButton, Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

interface SavedTree {
  id: string;
  sentence: string;
  language: string;
  created_at: string;
}

export default function HistoryScreen() {
  const [trees, setTrees] = useState<SavedTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadSavedTrees();
  }, [user]);

  const loadSavedTrees = async () => {
    setLoading(true);
    try {
      // Load saved trees from Supabase
      // Will be implemented with actual data fetching
      setTrees([]);
    } catch (error) {
      console.error('Error loading trees:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTreeItem = ({ item }: { item: SavedTree }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <Text variant="titleMedium" style={styles.sentence}>
          {item.sentence}
        </Text>
        <Text variant="bodySmall" style={styles.metadata}>
          Language: {item.language}
        </Text>
        <Text variant="bodySmall" style={styles.metadata}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="eye" onPress={() => {}} />
        <IconButton icon="delete" onPress={() => {}} />
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Searchbar
          placeholder="Search trees"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <FlatList
          data={trees}
          renderItem={renderTreeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text variant="bodyLarge" style={styles.emptyText}>
              {loading ? 'Loading...' : 'No saved trees found'}
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  sentence: {
    marginBottom: 8,
  },
  metadata: {
    color: '#666',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
}); 