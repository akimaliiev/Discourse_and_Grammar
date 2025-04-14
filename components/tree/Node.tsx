import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { TreeData } from '../../types/tree';

interface NodeProps {
  node: TreeData;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onExpand: () => void;
  onCollapse: () => void;
}

export const Node: React.FC<NodeProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  onSelect,
  onExpand,
  onCollapse,
}) => {
  const theme = useTheme();
  const hasChildren = node.children && node.children.length > 0;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the expand/collapse icon
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const handlePress = () => {
    // Animate the press effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect();
    if (hasChildren) {
      if (isExpanded) {
        onCollapse();
      } else {
        onExpand();
      }
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          backgroundColor: isSelected ? theme.colors.primaryContainer : 'transparent',
          marginLeft: level * 16,
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.content}>
          <Text
            style={[
              styles.type,
              {
                color: theme.colors.primary,
                fontWeight: isSelected ? 'bold' : 'normal',
              },
            ]}
          >
            {node.type}
          </Text>
          {node.value && (
            <Text
              style={[
                styles.value,
                {
                  color: theme.colors.onSurface,
                },
              ]}
            >
              {node.value}
            </Text>
          )}
          {hasChildren && (
            <Animated.Text
              style={[
                styles.expandIcon,
                {
                  transform: [{ rotate }],
                },
              ]}
            >
              ▶
            </Animated.Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 4,
    marginVertical: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 16,
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    marginRight: 8,
  },
  expandIcon: {
    fontSize: 12,
    marginLeft: 'auto',
  },
}); 