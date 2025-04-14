import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton, Menu, useTheme } from 'react-native-paper';
import { TreeData } from '../../types/tree';

interface TreeControlsProps {
  tree: TreeData;
  onSave?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
  tree,
  onSave,
  onShare,
  onEdit,
  onDelete,
  onExport,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <IconButton
          icon="content-save"
          size={24}
          onPress={onSave}
          iconColor={theme.colors.primary}
        />
        <IconButton
          icon="share-variant"
          size={24}
          onPress={onShare}
          iconColor={theme.colors.primary}
        />
        <IconButton
          icon="pencil"
          size={24}
          onPress={onEdit}
          iconColor={theme.colors.primary}
        />
        <IconButton
          icon="delete"
          size={24}
          onPress={onDelete}
          iconColor={theme.colors.error}
        />
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="contained"
            onPress={() => setMenuVisible(true)}
            icon="export"
          >
            Export
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            onExport?.();
            setMenuVisible(false);
          }}
          title="Export as JSON"
        />
        <Menu.Item
          onPress={() => {
            onExport?.();
            setMenuVisible(false);
          }}
          title="Export as Image"
        />
        <Menu.Item
          onPress={() => {
            onExport?.();
            setMenuVisible(false);
          }}
          title="Export as Text"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 