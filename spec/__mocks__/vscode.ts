export class Uri {
    static parse(value: string): Uri {
        return new Uri(value);
    }
    constructor(
        public readonly fsPath: string,
        public readonly scheme: string = 'file',
        public readonly authority: string = '',
        public readonly path: string = '',
        public readonly query: string = '',
        public readonly fragment: string = ''
    ) {}
    toString(): string {
        return this.fsPath;
    }
    toJSON(): any {
        return {
            scheme: this.scheme,
            authority: this.authority,
            path: this.path,
            query: this.query,
            fragment: this.fragment,
            fsPath: this.fsPath
        };
    }
    with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri {
        return new Uri(
            this.fsPath,
            change.scheme ?? this.scheme,
            change.authority ?? this.authority,
            change.path ?? this.path,
            change.query ?? this.query,
            change.fragment ?? this.fragment
        );
    }
}

export class Range {
    constructor(
        public readonly start: Position,
        public readonly end: Position
    ) {}
}

export class Position {
    constructor(
        public readonly line: number,
        public readonly character: number
    ) {}
}

export class CodeLens {
    constructor(
        public readonly range: Range,
        public readonly command?: {
            command: string;
            arguments?: any[];
        }
    ) {}
}

export class TextLine {
    constructor(
        public readonly text: string,
        public readonly isEmptyOrWhitespace: boolean,
        public readonly lineNumber: number,
        public readonly firstNonWhitespaceCharacterIndex: number
    ) {}
}

export interface TextDocument {
    readonly uri: Uri;
    readonly version: number;
    readonly lineCount: number;
    readonly fileName: string;
    readonly isUntitled: boolean;
    readonly languageId: string;
    readonly isDirty: boolean;
    readonly isClosed: boolean;
    readonly eol: number;
    readonly scheme: string;
    lineAt(line: number): TextLine;
    getText(): string;
    offsetAt(position: Position): number;
    positionAt(offset: number): Position;
    validateRange(range: Range): Range;
    validatePosition(position: Position): Position;
    save(): Promise<boolean>;
    getWordRangeAtPosition(position: Position): Range | undefined;
}

// Export everything as default
export default {
    Uri,
    Range,
    Position,
    CodeLens,
    TextLine
}; 
