import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { TreeData } from '../../types/tree';
import Svg, { Line, G, Rect, Text as SvgText } from 'react-native-svg';

interface TreeViewProps {
  data: TreeData;
  width?: number;
  height?: number;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
}

export function TreeView({ data, width = 350, height = 500 }: TreeViewProps) {
  const [positions, setPositions] = React.useState<Map<string, NodePosition>>(new Map());
  const [treeHeight, setTreeHeight] = React.useState(0);
  const levelHeight = 60;
  const nodePadding = 20;

  React.useEffect(() => {
    const calculatePositions = (
      node: TreeData,
      level: number = 0,
      offset: number = 0
    ): { width: number; positions: Map<string, NodePosition> } => {
      const positions = new Map<string, NodePosition>();
      
      if (!node.children || node.children.length === 0) {
        const width = 100; // Increased minimum width for better text display
        positions.set(node.id, { x: offset + width / 2, y: level * levelHeight, width });
        return { width, positions };
      }

      let totalWidth = 0;
      const childPositions = node.children.map((child) => {
        const result = calculatePositions(child, level + 1, offset + totalWidth);
        totalWidth += result.width;
        result.positions.forEach((pos, id) => positions.set(id, pos));
        return result;
      });

      const nodeWidth = Math.max(100, totalWidth);
      positions.set(node.id, {
        x: offset + totalWidth / 2,
        y: level * levelHeight,
        width: nodeWidth,
      });

      setTreeHeight(Math.max(treeHeight, (level + 1) * levelHeight));
      return { width: totalWidth, positions };
    };

    const { positions: newPositions } = calculatePositions(data);
    setPositions(newPositions);
  }, [data]);

  const renderNode = (node: TreeData) => {
    const pos = positions.get(node.id);
    if (!pos) return null;

    const nodeWidth = 80;
    const nodeHeight = 30;
    const x = pos.x - nodeWidth / 2;
    const y = pos.y;

    return (
      <G key={node.id}>
        <G x={x} y={y}>
          <Rect
            width={nodeWidth}
            height={nodeHeight}
            rx={5}
            fill={node.type === 'WORD' ? '#e3f2fd' : '#fff'}
            stroke="#2196f3"
            strokeWidth={1}
          />
          <SvgText
            x={nodeWidth / 2}
            y={nodeHeight / 2 + 5}
            fontSize={12}
            textAnchor="middle"
            fill="#000"
          >
            {node.label}
          </SvgText>
        </G>
        {node.children?.map((child) => {
          const childPos = positions.get(child.id);
          if (!childPos) return null;
          return (
            <Line
              key={`${node.id}-${child.id}`}
              x1={pos.x}
              y1={y + nodeHeight}
              x2={childPos.x}
              y2={childPos.y}
              stroke="#2196f3"
              strokeWidth={1}
            />
          );
        })}
        {node.children?.map((child) => renderNode(child))}
      </G>
    );
  };

  return (
    <ScrollView 
      horizontal 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Svg width={Math.max(width, 500)} height={Math.max(height, treeHeight + 100)}>
          {renderNode(data)}
        </Svg>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
  },
}); 