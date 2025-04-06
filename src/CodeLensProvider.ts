import vscode from 'vscode';

export class RubyTestCodeLensProvider implements vscode.CodeLensProvider {
    private readonly TEST_PATTERNS = [
        /^\s*(?:RSpec\.)?(describe|context)\s+['"](.+?)['"].*do\b/,
        /^\s*(?:it|specify)\s+['"](.+?)['"].*do\b/
    ];

    private documentVersion = new Map<string, number>();
    private cache = new Map<string, vscode.CodeLens[]>();

    async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        const uri = document.uri.toString();
        const version = document.version;

        // Return cached results if document hasn't changed
        if (this.cache.has(uri) && this.documentVersion.get(uri) === version) {
            return this.cache.get(uri);
        }
        
        try {
            const codeLenses = this.findTestsInDocument(document);
            
            this.cache.set(uri, codeLenses);
            this.documentVersion.set(uri, version);
            
            return codeLenses;
        } catch (e) {
            console.error('Error providing code lenses:', e);
            return this.cache.get(uri) || [];
        }
    }

    private findTestsInDocument(document: vscode.TextDocument): vscode.CodeLens[] {
        const codeLenses: vscode.CodeLens[] = [];
        const lineCount = document.lineCount;

        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            const line = document.lineAt(lineIndex);
            
            if (line.isEmptyOrWhitespace) {
                continue;
            }

            if (this.TEST_PATTERNS.some(pattern => pattern.test(line.text))) {
                const range = this.getLineRange(line);
                codeLenses.push(...this.createCodeLensesForLine(range, lineIndex + 1));
            }
        }

        return codeLenses;
    }

    private getLineRange(line: vscode.TextLine): vscode.Range {
        return new vscode.Range(
            new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex),
            new vscode.Position(line.lineNumber, line.text.length)
        );
    }

    private createCodeLensesForLine(range: vscode.Range, lineNumber: number): vscode.CodeLens[] {
        return [
            new vscode.CodeLens(range, {
                title: 'Run Test',
                command: 'extension.runLineOnRspec',
                arguments: [lineNumber]
            })
        ];
    }
  }
