import 'react-native-get-random-values';
import { TreeData } from '../../types/tree';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase/client';
import nlp from 'compromise';

interface GeneratorOptions {
  language: string;
  includeMetadata?: boolean;
}

export class TreeGenerator {
  private language: string;
  private includeMetadata: boolean;

  constructor(options: GeneratorOptions) {
    this.language = options.language;
    this.includeMetadata = options.includeMetadata ?? false;
  }

  /**
   * Generate a new empty tree
   */
  public generateEmptyTree(): TreeData {
    return {
      id: uuidv4(),
      label: 'S',
      type: 'SENTENCE',
      children: [],
    };
  }

  /**
   * Add a new node to the tree
   */
  public addNode(
    tree: TreeData,
    parentId: string,
    label: string,
    type: string
  ): TreeData {
    const newNode: TreeData = {
      id: uuidv4(),
      label,
      type,
      children: [],
      ...(this.includeMetadata && {
        metadata: {
          createdAt: new Date().toISOString(),
        },
      }),
    };

    return this.modifyTree(tree, (node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }
      return node;
    });
  }

  /**
   * Remove a node from the tree
   */
  public removeNode(tree: TreeData, nodeId: string): TreeData {
    return this.modifyTree(tree, (node) => {
      if (node.id === nodeId) {
        return null; // Remove the node
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.filter(child => child.id !== nodeId),
        };
      }
      return node;
    });
  }

  /**
   * Update a node in the tree
   */
  public updateNode(
    tree: TreeData,
    nodeId: string,
    updates: Partial<TreeData>
  ): TreeData {
    return this.modifyTree(tree, (node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          ...updates,
          ...(this.includeMetadata && {
            metadata: {
              ...node.metadata,
              updatedAt: new Date().toISOString(),
            },
          }),
        };
      }
      return node;
    });
  }

  /**
   * Move a node to a new parent
   */
  public moveNode(
    tree: TreeData,
    nodeId: string,
    newParentId: string
  ): TreeData {
    let nodeToMove: TreeData | null = null;
    
    // First, find and remove the node
    const treeWithoutNode = this.modifyTree(tree, (node) => {
      if (node.id === nodeId) {
        nodeToMove = { ...node };
        return null;
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.filter(child => child.id !== nodeId),
        };
      }
      return node;
    });

    if (!nodeToMove) {
      throw new Error(`Node with id ${nodeId} not found`);
    }

    // Then, add it to the new parent
    return this.modifyTree(treeWithoutNode, (node) => {
      if (node.id === newParentId) {
        return {
          ...node,
          children: [...(node.children || []), nodeToMove!],
        };
      }
      return node;
    });
  }

  /**
   * Helper method to modify the tree recursively
   */
  private modifyTree(
    tree: TreeData,
    modifier: (node: TreeData) => TreeData | null
  ): TreeData {
    const modifiedNode = modifier(tree);
    if (modifiedNode === null) {
      throw new Error('Cannot remove root node');
    }

    if (modifiedNode.children) {
      return {
        ...modifiedNode,
        children: modifiedNode.children
          .map(child => this.modifyTree(child, modifier))
          .filter((child): child is TreeData => child !== null),
      };
    }

    return modifiedNode;
  }

  /**
   * Validate the tree structure
   */
  public validateTree(tree: TreeData): boolean {
    // Check for required fields
    if (!tree.id || !tree.label) {
      return false;
    }

    // Check for unique IDs
    const ids = new Set<string>();
    const hasDuplicateIds = this.traverseTree(tree, (node) => {
      if (ids.has(node.id)) {
        return true;
      }
      ids.add(node.id);
      return false;
    });

    if (hasDuplicateIds) {
      return false;
    }

    // Check for valid node types
    const validTypes = ['SENTENCE', 'NP', 'VP', 'AP', 'ADVP', 'UNKNOWN'];
    const hasInvalidTypes = this.traverseTree(tree, (node) => {
      return node.type && !validTypes.includes(node.type);
    });

    return !hasInvalidTypes;
  }

  /**
   * Helper method to traverse the tree
   */
  private traverseTree(
    tree: TreeData,
    callback: (node: TreeData) => boolean
  ): boolean {
    if (callback(tree)) {
      return true;
    }

    if (tree.children) {
      for (const child of tree.children) {
        if (this.traverseTree(child, callback)) {
          return true;
        }
      }
    }

    return false;
  }
}

// Language-specific rules
const LANGUAGE_RULES = {
  english: {
    S: ['NP VP', 'S CONJ S'],
    NP: ['DET N', 'DET ADJ N', 'PRON', 'NP PP', 'N', 'ADJ N'],
    VP: ['V', 'V NP', 'V ADJ', 'V PP', 'AUX V', 'V ADV'],
    PP: ['PREP NP'],
    ADJP: ['ADJ', 'ADV ADJ'],
    ADVP: ['ADV'],
  },
  spanish: {
    S: ['NP VP', 'S CONJ S'],
    NP: ['DET N', 'N', 'DET ADJ N', 'N ADJ', 'PRON'],
    VP: ['V', 'V NP', 'V PP', 'V ADJ'],
    PP: ['PREP NP'],
    ADJP: ['ADJ', 'ADV ADJ'],
  },
  russian: {
    S: ['NP VP', 'S CONJ S'],
    NP: ['N', 'ADJ N', 'PRON', 'NUM N'],
    VP: ['V', 'V NP', 'V PP', 'ADV V'],
    PP: ['PREP NP'],
    ADJP: ['ADJ'],
  },
  kazakh: {
    S: ['NP VP', 'S CONJ S'],
    NP: ['N', 'ADJ N', 'PRON', 'NUM N', 'N GEN N'],
    VP: ['V', 'NP V', 'ADV V', 'PP V'],
    PP: ['N POST', 'NP POST'],
  },
};

// Part of Speech dictionaries for each language
const POS_DICTIONARIES = {
  english: {
    DET: ['the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her'],
    NOUN: ['cat', 'dog', 'book', 'tree', 'house', 'car', 'computer', 'phone', 'person', 'city'],
    VERB: ['is', 'are', 'was', 'were', 'run', 'jump', 'eat', 'sleep', 'write', 'read', 'walk', 'talk'],
    ADJ: ['big', 'small', 'red', 'blue', 'fast', 'slow', 'happy', 'sad', 'good', 'bad'],
    PRON: ['I', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her'],
    PREP: ['in', 'on', 'at', 'with', 'by', 'for', 'to', 'from', 'under', 'over'],
    CONJ: ['and', 'or', 'but', 'because', 'if', 'when', 'while'],
    ADV: ['quickly', 'slowly', 'well', 'badly', 'very', 'really', 'always', 'never'],
    AUX: ['will', 'would', 'can', 'could', 'should', 'must', 'may', 'might'],
  },
  spanish: {
    DET: ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'este', 'esta'],
    NOUN: ['gato', 'perro', 'libro', 'árbol', 'casa', 'coche', 'computadora', 'teléfono'],
    VERB: ['es', 'son', 'era', 'estar', 'corre', 'salta', 'come', 'duerme'],
    ADJ: ['grande', 'pequeño', 'rojo', 'azul', 'rápido', 'lento', 'feliz', 'triste'],
    PRON: ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas'],
    PREP: ['en', 'sobre', 'con', 'por', 'para', 'de', 'a', 'desde'],
    CONJ: ['y', 'o', 'pero', 'porque', 'si', 'cuando', 'mientras'],
    ADV: ['rápidamente', 'lentamente', 'bien', 'mal', 'muy', 'siempre', 'nunca'],
  },
  russian: {
    NOUN: ['кошка', 'собака', 'книга', 'дерево', 'дом', 'машина', 'компьютер', 'телефон'],
    VERB: ['есть', 'быть', 'бежать', 'прыгать', 'есть', 'спать', 'писать', 'читать'],
    ADJ: ['большой', 'маленький', 'красный', 'синий', 'быстрый', 'медленный', 'счастливый'],
    PRON: ['я', 'ты', 'он', 'она', 'оно', 'мы', 'вы', 'они'],
    PREP: ['в', 'на', 'с', 'у', 'к', 'от', 'из', 'под'],
    CONJ: ['и', 'или', 'но', 'потому что', 'если', 'когда', 'пока'],
    ADV: ['быстро', 'медленно', 'хорошо', 'плохо', 'очень', 'всегда', 'никогда'],
    NUM: ['один', 'два', 'три', 'четыре', 'пять'],
  },
  kazakh: {
    NOUN: ['мысық', 'ит', 'кітап', 'ағаш', 'үй', 'машина', 'компьютер', 'телефон'],
    VERB: ['бар', 'жүгіру', 'секіру', 'жеу', 'ұйықтау', 'жазу', 'оқу'],
    ADJ: ['үлкен', 'кіші', 'қызыл', 'көк', 'жылдам', 'баяу', 'бақытты'],
    PRON: ['мен', 'сен', 'ол', 'біз', 'сіз', 'олар'],
    POST: ['да', 'де', 'та', 'те', 'мен', 'бен', 'пен'],
    CONJ: ['және', 'немесе', 'бірақ', 'өйткені', 'егер', 'кезде'],
    ADV: ['жылдам', 'баяу', 'жақсы', 'жаман', 'өте', 'әрқашан'],
    NUM: ['бір', 'екі', 'үш', 'төрт', 'бес'],
  },
};

function getPOS(word: string, language: string): string {
  const dictionary = POS_DICTIONARIES[language as keyof typeof POS_DICTIONARIES];
  if (!dictionary) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const lowercaseWord = word.toLowerCase();
  for (const [pos, words] of Object.entries(dictionary)) {
    if (words.includes(lowercaseWord)) {
      return pos;
    }
  }

  // If not found in dictionary, use compromise for English
  if (language === 'english') {
    const doc = nlp(word);
    if (doc.has('#Noun')) return 'NOUN';
    if (doc.has('#Verb')) return 'VERB';
    if (doc.has('#Adjective')) return 'ADJ';
    if (doc.has('#Adverb')) return 'ADV';
    if (doc.has('#Preposition')) return 'PREP';
    if (doc.has('#Conjunction')) return 'CONJ';
    if (doc.has('#Determiner')) return 'DET';
    if (doc.has('#Pronoun')) return 'PRON';
  }

  return 'UNKNOWN';
}

function buildPhrase(words: string[], pos: string[], language: string): TreeData {
  const rules = LANGUAGE_RULES[language as keyof typeof LANGUAGE_RULES];
  if (!rules) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // Create the sentence node
  const tree: TreeData = {
    id: uuidv4(),
    label: 'S',
    type: 'SENTENCE',
    children: [],
    metadata: {
      language,
    },
  };

  let currentPhrase: TreeData | null = null;
  
  words.forEach((word, index) => {
    const posTag = pos[index];
    
    const wordNode: TreeData = {
      id: uuidv4(),
      label: word,
      type: posTag,
      children: [],
      metadata: {
        pos: posTag,
      },
    };

    // Create phrases based on language-specific rules
    if (posTag === 'DET' || posTag === 'PRON' || (posTag === 'NOUN' && !currentPhrase)) {
      currentPhrase = {
        id: uuidv4(),
        label: 'NP',
        type: 'PHRASE',
        children: [],
      };
      tree.children.push(currentPhrase);
    } else if (posTag === 'VERB' || posTag === 'AUX') {
      currentPhrase = {
        id: uuidv4(),
        label: 'VP',
        type: 'PHRASE',
        children: [],
      };
      tree.children.push(currentPhrase);
    } else if (posTag === 'PREP') {
      currentPhrase = {
        id: uuidv4(),
        label: 'PP',
        type: 'PHRASE',
        children: [],
      };
      tree.children.push(currentPhrase);
    }

    // Add word to current phrase or create a new one
    if (currentPhrase) {
      currentPhrase.children.push(wordNode);
    } else {
      currentPhrase = {
        id: uuidv4(),
        label: posTag,
        type: 'PHRASE',
        children: [wordNode],
      };
      tree.children.push(currentPhrase);
    }

    // Reset current phrase at certain boundaries
    if (posTag === 'VERB' || index === words.length - 1) {
      currentPhrase = null;
    }
  });

  return tree;
}

export async function generateSyntaxTree(
  sentence: string,
  language: string
): Promise<TreeData> {
  if (!sentence || typeof sentence !== 'string') {
    throw new Error('Invalid input: sentence must be a non-empty string');
  }

  if (!language || typeof language !== 'string') {
    throw new Error('Invalid input: language must be a non-empty string');
  }

  try {
    const words = sentence.trim().split(/\s+/);
    if (words.length === 0) {
      throw new Error('Empty sentence after trimming');
    }

    // Get POS tags for each word
    const pos = words.map(word => getPOS(word, language));
    
    // Build the syntax tree
    return buildPhrase(words, pos, language);
  } catch (error) {
    console.error('Error in generateSyntaxTree:', error);
    throw error;
  }
} 