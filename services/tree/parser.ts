import { TreeData } from '../../types/tree';
import { TreeError, TreeErrorCode, TreeValidationError } from '../../types/errors';
import { LanguageRules } from './languageRules';

export class TreeParser {
  private languageRules: LanguageRules;

  constructor(language: string) {
    this.languageRules = new LanguageRules(language as any);
  }

  /**
   * Parse a sentence into a syntax tree
   */
  public async parse(sentence: string): Promise<TreeData> {
    try {
      // Basic sentence validation
      if (!sentence || typeof sentence !== 'string') {
        throw new TreeValidationError([{
          code: TreeErrorCode.PARSING_ERROR,
          message: 'Invalid sentence input',
          details: {
            actual: typeof sentence,
            expected: 'string',
          },
        }]);
      }

      // Split sentence into words
      const words = sentence.trim().split(/\s+/);
      if (words.length === 0) {
        throw new TreeValidationError([{
          code: TreeErrorCode.PARSING_ERROR,
          message: 'Empty sentence',
        }]);
      }

      // Create initial tree structure
      const tree: TreeData = {
        id: 'root',
        type: 'S',
        children: [],
      };

      // Parse each word and add to tree
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordType = await this.determineWordType(word);
        
        if (!wordType) {
          throw new TreeValidationError([{
            code: TreeErrorCode.PARSING_ERROR,
            message: `Could not determine type for word: ${word}`,
            details: {
              position: i,
              actual: word,
            },
          }]);
        }

        const node: TreeData = {
          id: `word-${i}`,
          type: wordType,
          value: word,
        };

        // Add node to appropriate phrase
        this.addNodeToPhrase(tree, node, wordType);
      }

      // Validate the complete tree
      this.languageRules.validateTree(tree);

      return tree;
    } catch (error) {
      if (error instanceof TreeValidationError) {
        throw error;
      }
      
      // Convert unknown errors to TreeValidationError
      throw new TreeValidationError([{
        code: TreeErrorCode.PARSING_ERROR,
        message: error instanceof Error ? error.message : 'Unknown parsing error',
        details: {
          actual: sentence,
        },
      }]);
    }
  }

  /**
   * Determine the type of a word
   */
  private async determineWordType(word: string): Promise<string | null> {
    // TODO: Implement actual word type determination using NLP or dictionary
    // For now, use a simple heuristic
    const lowerWord = word.toLowerCase();
    
    if (['the', 'a', 'an'].includes(lowerWord)) {
      return 'DET';
    }
    if (lowerWord.endsWith('ly')) {
      return 'ADV';
    }
    if (lowerWord.endsWith('ing') || lowerWord.endsWith('ed')) {
      return 'VERB';
    }
    if (lowerWord.endsWith('s') || lowerWord.endsWith('es')) {
      return 'NOUN';
    }
    if (lowerWord.endsWith('y') || lowerWord.endsWith('ful')) {
      return 'ADJ';
    }
    
    return null;
  }

  /**
   * Add a node to the appropriate phrase in the tree
   */
  private addNodeToPhrase(tree: TreeData, node: TreeData, wordType: string): void {
    const allowedPhrases = this.languageRules.getAllowedNodeTypes(wordType);
    
    // Find existing phrase that can accept this node type
    let targetPhrase = tree.children?.find(phrase => 
      allowedPhrases.includes(phrase.type)
    );

    // If no suitable phrase exists, create a new one
    if (!targetPhrase) {
      const phraseType = this.determinePhraseType(wordType);
      targetPhrase = {
        id: `phrase-${tree.children?.length || 0}`,
        type: phraseType,
        children: [],
      };
      if (!tree.children) {
        tree.children = [];
      }
      tree.children.push(targetPhrase);
    }

    // Add node to phrase
    if (!targetPhrase.children) {
      targetPhrase.children = [];
    }
    targetPhrase.children.push(node);
  }

  /**
   * Determine the appropriate phrase type for a word type
   */
  private determinePhraseType(wordType: string): string {
    switch (wordType) {
      case 'NOUN':
      case 'DET':
      case 'ADJ':
        return 'NP';
      case 'VERB':
      case 'ADV':
        return 'VP';
      case 'ADJ':
        return 'AP';
      case 'ADV':
        return 'ADVP';
      default:
        return 'NP'; // Default to noun phrase
    }
  }
} 