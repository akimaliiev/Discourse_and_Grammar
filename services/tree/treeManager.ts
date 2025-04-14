import { TreeData } from '../../types/tree';
import { supabase } from '../supabase/client';

interface TreeVersion {
  id: string;
  tree_id: string;
  tree_data: TreeData;
  version: number;
  created_at: string;
  description?: string;
}

interface TreeFilter {
  type?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

export class TreeManager {
  /**
   * Save a tree to the database with versioning
   */
  public async saveTree(tree: TreeData, userId: string, title?: string, description?: string): Promise<string> {
    try {
      // Start a transaction
      const { data: treeData, error: treeError } = await supabase
        .from('syntax_trees')
        .insert({
          user_id: userId,
          tree_data: tree,
          title: title || 'Untitled Tree',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (treeError) throw treeError;

      // Create initial version
      const { error: versionError } = await supabase
        .from('tree_versions')
        .insert({
          tree_id: treeData.id,
          tree_data: tree,
          version: 1,
          created_at: new Date().toISOString(),
          description: description || 'Initial version',
        });

      if (versionError) throw versionError;

      return treeData.id;
    } catch (error) {
      console.error('Error saving tree:', error);
      throw new Error('Failed to save tree');
    }
  }

  /**
   * Create a new version of an existing tree
   */
  public async createVersion(treeId: string, tree: TreeData, description?: string): Promise<void> {
    try {
      // Get current version
      const { data: currentVersion, error: versionError } = await supabase
        .from('tree_versions')
        .select('version')
        .eq('tree_id', treeId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (versionError) throw versionError;

      // Create new version
      const { error: insertError } = await supabase
        .from('tree_versions')
        .insert({
          tree_id: treeId,
          tree_data: tree,
          version: (currentVersion?.version || 0) + 1,
          created_at: new Date().toISOString(),
          description: description || `Version ${(currentVersion?.version || 0) + 1}`,
        });

      if (insertError) throw insertError;

      // Update main tree data
      const { error: updateError } = await supabase
        .from('syntax_trees')
        .update({ tree_data: tree })
        .eq('id', treeId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error creating version:', error);
      throw new Error('Failed to create version');
    }
  }

  /**
   * Get tree versions
   */
  public async getVersions(treeId: string): Promise<TreeVersion[]> {
    try {
      const { data, error } = await supabase
        .from('tree_versions')
        .select('*')
        .eq('tree_id', treeId)
        .order('version', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching versions:', error);
      throw new Error('Failed to fetch versions');
    }
  }

  /**
   * Get a user's saved trees with filtering
   */
  public async getSavedTrees(userId: string, filter?: TreeFilter): Promise<TreeData[]> {
    try {
      let query = supabase
        .from('syntax_trees')
        .select('tree_data, created_at')
        .eq('user_id', userId);

      // Apply filters
      if (filter?.type) {
        query = query.ilike('tree_data->>type', `%${filter.type}%`);
      }

      if (filter?.dateRange) {
        query = query
          .gte('created_at', filter.dateRange.start.toISOString())
          .lte('created_at', filter.dateRange.end.toISOString());
      }

      if (filter?.searchTerm) {
        query = query.or(
          `tree_data->>type.ilike.%${filter.searchTerm}%,tree_data->>value.ilike.%${filter.searchTerm}%`
        );
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => item.tree_data);
    } catch (error) {
      console.error('Error fetching saved trees:', error);
      throw new Error('Failed to fetch saved trees');
    }
  }

  /**
   * Share a tree with other users
   */
  public async shareTree(treeId: string, userId: string, shareWithUserId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('shared_trees')
        .insert({
          tree_id: treeId,
          shared_by: userId,
          shared_with: shareWithUserId,
          shared_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sharing tree:', error);
      throw new Error('Failed to share tree');
    }
  }

  /**
   * Delete a tree
   */
  public async deleteTree(treeId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('syntax_trees')
        .delete()
        .eq('id', treeId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting tree:', error);
      throw new Error('Failed to delete tree');
    }
  }

  /**
   * Export tree as JSON
   */
  public exportAsJSON(tree: TreeData): string {
    return JSON.stringify(tree, null, 2);
  }

  /**
   * Export tree as text
   */
  public exportAsText(tree: TreeData): string {
    const formatNode = (node: TreeData, level: number = 0): string => {
      const indent = '  '.repeat(level);
      let text = `${indent}${node.type}`;
      if (node.value) {
        text += `: ${node.value}`;
      }
      text += '\n';
      
      if (node.children) {
        node.children.forEach(child => {
          text += formatNode(child, level + 1);
        });
      }
      
      return text;
    };

    return formatNode(tree);
  }

  /**
   * Export tree as image (placeholder - would need actual implementation)
   */
  public async exportAsImage(tree: TreeData): Promise<string> {
    // TODO: Implement actual image generation
    // This would require a canvas or SVG rendering library
    throw new Error('Image export not implemented yet');
  }
} 