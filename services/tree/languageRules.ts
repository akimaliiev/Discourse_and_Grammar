import { TreeData } from '../../types/tree';
import { TreeError, TreeErrorCode, TreeValidationError } from '../../types/errors';

export type LanguageCode = 'en' | 'es' | 'ru' | 'kk';

interface LanguageRule {
  phraseOrder: string[];
  requiredPhrases: string[];
  optionalPhrases: string[];
  phraseRules: {
    [key: string]: {
      minChildren: number;
      maxChildren: number;
      allowedTypes: string[];
    };
  };
}

const ENGLISH_RULES: LanguageRule = {
  phraseOrder: ['NP', 'VP', 'AP', 'ADVP'],
  requiredPhrases: ['NP', 'VP'],
  optionalPhrases: ['AP', 'ADVP'],
  phraseRules: {
    NP: {
      minChildren: 1,
      maxChildren: 4,
      allowedTypes: ['NOUN', 'ADJ', 'DET'],
    },
    VP: {
      minChildren: 1,
      maxChildren: 3,
      allowedTypes: ['VERB', 'ADV'],
    },
    AP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADJ', 'ADV'],
    },
    ADVP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADV'],
    },
  },
};

const SPANISH_RULES: LanguageRule = {
  phraseOrder: ['NP', 'VP', 'AP', 'ADVP'],
  requiredPhrases: ['NP', 'VP'],
  optionalPhrases: ['AP', 'ADVP'],
  phraseRules: {
    NP: {
      minChildren: 1,
      maxChildren: 4,
      allowedTypes: ['NOUN', 'ADJ', 'DET'],
    },
    VP: {
      minChildren: 1,
      maxChildren: 3,
      allowedTypes: ['VERB', 'ADV'],
    },
    AP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADJ', 'ADV'],
    },
    ADVP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADV'],
    },
  },
};

const RUSSIAN_RULES: LanguageRule = {
  phraseOrder: ['NP', 'VP', 'AP', 'ADVP'],
  requiredPhrases: ['NP', 'VP'],
  optionalPhrases: ['AP', 'ADVP'],
  phraseRules: {
    NP: {
      minChildren: 1,
      maxChildren: 5,
      allowedTypes: ['NOUN', 'ADJ', 'DET'],
    },
    VP: {
      minChildren: 1,
      maxChildren: 3,
      allowedTypes: ['VERB', 'ADV'],
    },
    AP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADJ', 'ADV'],
    },
    ADVP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADV'],
    },
  },
};

const KAZAKH_RULES: LanguageRule = {
  phraseOrder: ['NP', 'VP', 'AP', 'ADVP'],
  requiredPhrases: ['NP', 'VP'],
  optionalPhrases: ['AP', 'ADVP'],
  phraseRules: {
    NP: {
      minChildren: 1,
      maxChildren: 4,
      allowedTypes: ['NOUN', 'ADJ', 'DET'],
    },
    VP: {
      minChildren: 1,
      maxChildren: 3,
      allowedTypes: ['VERB', 'ADV'],
    },
    AP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADJ', 'ADV'],
    },
    ADVP: {
      minChildren: 1,
      maxChildren: 2,
      allowedTypes: ['ADV'],
    },
  },
};

const LANGUAGE_RULES: Record<LanguageCode, LanguageRule> = {
  en: ENGLISH_RULES,
  es: SPANISH_RULES,
  ru: RUSSIAN_RULES,
  kk: KAZAKH_RULES,
};

export class LanguageRules {
  private rules: LanguageRule;

  constructor(language: LanguageCode) {
    this.rules = LANGUAGE_RULES[language] || ENGLISH_RULES;
  }

  /**
   * Validate a phrase against language rules
   */
  public validatePhrase(phrase: TreeData): TreeError[] {
    const errors: TreeError[] = [];
    const phraseType = phrase.type;
    
    if (!phraseType || !this.rules.phraseRules[phraseType]) {
      errors.push({
        code: TreeErrorCode.UNKNOWN_PHRASE_TYPE,
        message: `Unknown phrase type: ${phraseType}`,
        details: {
          nodeId: phrase.id,
          phraseType,
        },
      });
      return errors;
    }

    const rule = this.rules.phraseRules[phraseType];
    const children = phrase.children || [];

    // Check number of children
    if (children.length < rule.minChildren) {
      errors.push({
        code: TreeErrorCode.INVALID_CHILDREN_COUNT,
        message: `Phrase ${phraseType} has too few children`,
        details: {
          nodeId: phrase.id,
          phraseType,
          expected: rule.minChildren,
          actual: children.length,
        },
      });
    }

    if (children.length > rule.maxChildren) {
      errors.push({
        code: TreeErrorCode.INVALID_CHILDREN_COUNT,
        message: `Phrase ${phraseType} has too many children`,
        details: {
          nodeId: phrase.id,
          phraseType,
          expected: rule.maxChildren,
          actual: children.length,
        },
      });
    }

    // Check child types
    children.forEach((child, index) => {
      if (!child.type || !rule.allowedTypes.includes(child.type)) {
        errors.push({
          code: TreeErrorCode.INVALID_NODE_TYPE,
          message: `Invalid node type in ${phraseType}`,
          details: {
            nodeId: child.id,
            phraseType,
            expected: rule.allowedTypes,
            actual: child.type,
            position: index,
          },
        });
      }
    });

    return errors;
  }

  /**
   * Validate the overall tree structure
   */
  public validateTreeStructure(tree: TreeData): TreeError[] {
    const errors: TreeError[] = [];
    const phrases = tree.children || [];
    
    // Check required phrases
    const phraseTypes = phrases.map(p => p.type || '');
    this.rules.requiredPhrases.forEach(required => {
      if (!phraseTypes.includes(required)) {
        errors.push({
          code: TreeErrorCode.MISSING_REQUIRED_PHRASE,
          message: `Missing required phrase: ${required}`,
          details: {
            expected: this.rules.requiredPhrases,
            actual: phraseTypes,
          },
        });
      }
    });

    // Check phrase order
    const orderErrors = this.validatePhraseOrder(phraseTypes);
    errors.push(...orderErrors);

    // Validate each phrase
    phrases.forEach(phrase => {
      const phraseErrors = this.validatePhrase(phrase);
      errors.push(...phraseErrors);
    });

    return errors;
  }

  /**
   * Validate phrase order
   */
  private validatePhraseOrder(phraseTypes: string[]): TreeError[] {
    const errors: TreeError[] = [];
    const order = this.rules.phraseOrder;
    let lastIndex = -1;

    for (let i = 0; i < phraseTypes.length; i++) {
      const type = phraseTypes[i];
      const currentIndex = order.indexOf(type);
      
      if (currentIndex === -1) {
        errors.push({
          code: TreeErrorCode.UNKNOWN_PHRASE_TYPE,
          message: `Unknown phrase type in order: ${type}`,
          details: {
            position: i,
            expected: order,
            actual: type,
          },
        });
      } else if (currentIndex < lastIndex) {
        errors.push({
          code: TreeErrorCode.INVALID_PHRASE_ORDER,
          message: `Phrase ${type} is out of order`,
          details: {
            position: i,
            expected: order,
            actual: phraseTypes,
          },
        });
      }
      
      lastIndex = currentIndex;
    }

    return errors;
  }

  /**
   * Get allowed node types for a phrase
   */
  public getAllowedNodeTypes(phraseType: string): string[] {
    return this.rules.phraseRules[phraseType]?.allowedTypes || [];
  }

  /**
   * Get minimum and maximum children for a phrase
   */
  public getChildrenLimits(phraseType: string): { min: number; max: number } {
    const rule = this.rules.phraseRules[phraseType];
    return {
      min: rule?.minChildren || 0,
      max: rule?.maxChildren || Infinity,
    };
  }

  /**
   * Validate a tree and throw if invalid
   */
  public validateTree(tree: TreeData): void {
    const errors = this.validateTreeStructure(tree);
    if (errors.length > 0) {
      throw new TreeValidationError(errors);
    }
  }
} 