import { vi } from 'vitest';
import * as mockVscode from './__mocks__/vscode';

vi.mock('vscode', () => mockVscode); 
