export interface TreeData {
  id: string;
  label: string;
  type: string;
  children: TreeData[];
  metadata?: {
    pos?: string;
    language?: string;
    features?: Record<string, string>;
  };
}

export interface TreeState {
  data: TreeData;
  selectedNodeId?: string;
  expandedNodes: Set<string>;
}

export interface TreeControls {
  onNodeSelect: (nodeId: string) => void;
  onNodeExpand: (nodeId: string) => void;
  onNodeCollapse: (nodeId: string) => void;
  onTreeSave: () => void;
  onTreeShare: () => void;
} 