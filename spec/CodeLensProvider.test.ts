import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as vscode from 'vscode';
import { RubyTestCodeLensProvider } from '../src/CodeLensProvider';

describe('RubyTestCodeLensProvider', () => {
    let provider: RubyTestCodeLensProvider;
    let mockDocument: vscode.TextDocument;

    beforeEach(() => {
        provider = new RubyTestCodeLensProvider();
        mockDocument = {
            uri: vscode.Uri.parse('file:///test.rb'),
            version: 1,
            lineCount: 0,
            fileName: '/test.rb',
            isUntitled: false,
            languageId: 'ruby',
            isDirty: false,
            isClosed: false,
            eol: 1,
            scheme: 'file',
            lineAt: vi.fn(),
            getText: vi.fn(),
            offsetAt: vi.fn(),
            positionAt: vi.fn(),
            validateRange: vi.fn(),
            validatePosition: vi.fn(),
            save: vi.fn().mockResolvedValue(true),
            getWordRangeAtPosition: vi.fn().mockReturnValue(undefined),
        } as unknown as vscode.TextDocument;
    });

    describe('provideCodeLenses', () => {
        it('should return cached results if document version matches', async () => {
            const cachedLenses = [new vscode.CodeLens(new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(0, 0)
            ))];
            (provider as any).cache.set(mockDocument.uri.toString(), cachedLenses);
            (provider as any).documentVersion.set(mockDocument.uri.toString(), 1);

            const result = await provider.provideCodeLenses(mockDocument);
            expect(result).toBe(cachedLenses);
        });

        it('should find and return code lenses for RSpec tests', async () => {
            const content = 'describe "MyClass" do\n  it "should do something" do\n    # test code\n  end\nend';
            const lines = content.split('\n');

            (mockDocument.lineAt as Mock).mockImplementation((index) => ({ text: lines[index] }));
            Object.defineProperty(mockDocument, 'lineCount', { value: lines.length });

            const result = await provider.provideCodeLenses(mockDocument);
            expect(result.length).toBe(2); // One for describe, one for it
        });

        it('should find and return code lenses for Minitest tests', async () => {
            const content = 'def test_something\n  # test code\nend';
            const lines = content.split('\n');

            (mockDocument.lineAt as Mock).mockImplementation((index) => ({ text: lines[index] }));
            Object.defineProperty(mockDocument, 'lineCount', { value: lines.length });

            const result = await provider.provideCodeLenses(mockDocument);
            expect(result.length).toBe(1);
        });

        it('should skip empty lines', async () => {
            const content = '\ndescribe "MyClass" do\n  \nend';
            const lines = content.split('\n');

            (mockDocument.lineAt as Mock).mockImplementation((index) => ({ text: lines[index] }));
            Object.defineProperty(mockDocument, 'lineCount', { value: lines.length });

            const result = await provider.provideCodeLenses(mockDocument);
            expect(result.length).toBe(1);
        });

        it('should handle errors gracefully and return cached results', async () => {
            const cachedLenses = [new vscode.CodeLens(new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(0, 0)
            ))];
            (provider as any).cache.set(mockDocument.uri.toString(), cachedLenses);

            Object.defineProperty(mockDocument, 'lineCount', { value: 1 });
            (mockDocument.lineAt as Mock).mockImplementation(() => {
                throw new Error('Test error');
            });

            const result = await provider.provideCodeLenses(mockDocument);
            expect(result).toEqual(cachedLenses);
        });
    });

    describe('createCodeLensesForLine', () => {
        it('should create a code lens with correct command and arguments', () => {
            const range = new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(0, 10)
            );
            const lineNumber = 5;

            const result = (provider as any).createCodeLensesForLine(range, lineNumber);

            expect(result.length).toBe(1);
            expect(result[0].command).toBeDefined();
            expect(result[0].command?.command).toBe('extension.runLineOnRspec');
            expect(result[0].command?.arguments).toEqual([lineNumber]);
        });
    });
}); 
