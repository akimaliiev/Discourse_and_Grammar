export enum TreeErrorCode {
  INVALID_PHRASE_ORDER = 'INVALID_PHRASE_ORDER',
  MISSING_REQUIRED_PHRASE = 'MISSING_REQUIRED_PHRASE',
  INVALID_NODE_TYPE = 'INVALID_NODE_TYPE',
  INVALID_CHILDREN_COUNT = 'INVALID_CHILDREN_COUNT',
  UNKNOWN_PHRASE_TYPE = 'UNKNOWN_PHRASE_TYPE',
  INVALID_TREE_STRUCTURE = 'INVALID_TREE_STRUCTURE',
  PARSING_ERROR = 'PARSING_ERROR',
}

export interface TreeError {
  code: TreeErrorCode;
  message: string;
  details?: {
    nodeId?: string;
    phraseType?: string;
    expected?: any;
    actual?: any;
    position?: number;
  };
}

export class TreeValidationError extends Error {
  public errors: TreeError[];

  constructor(errors: TreeError[]) {
    super('Tree validation failed');
    this.name = 'TreeValidationError';
    this.errors = errors;
  }

  public toString(): string {
    return this.errors
      .map(error => `${error.code}: ${error.message}`)
      .join('\n');
  }
} 