"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixFiles = exports.processFile = void 0;
const vscode = require("vscode");
function processFile(file, diagnostics, diagnosticCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield vscode.workspace.openTextDocument(file);
        const fileErrors = [];
        for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
            const lineText = document.lineAt(lineNumber).text;
            checkLine(lineText, file.fsPath, lineNumber + 1, fileErrors, diagnostics);
        }
        diagnosticCollection.set(document.uri, diagnostics);
        return fileErrors;
    });
}
exports.processFile = processFile;
const correctPattern = /[^ ]{1} =[ ]{1}[^ ]/;
const noSpaceAroundEquals = /([^ ]+?)\s*=\s*([^ ]+)/g; // Matches anything without spaces around '='
const tooManySpacesBeforeEquals = / {2,}=/g; // Matches more than one space before '='
const tooManySpacesAfterEquals = /= {2,}/g; // Matches more than one space after '='
function checkLine(line, filePath, lineNumber, fileErrors, diagnostics) {
    if (correctPattern.test(line)) {
        return;
    }
    const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
    const diagnostic = new vscode.Diagnostic(range, "Spacing issue around '='.", vscode.DiagnosticSeverity.Warning);
    diagnostics.push(diagnostic);
    if (noSpaceAroundEquals.test(line)) {
        fileErrors.push({
            fileName: filePath,
            type: -1,
            line: lineNumber,
        });
    }
    if (tooManySpacesAfterEquals.test(line)) {
        fileErrors.push({
            fileName: filePath,
            type: 1,
            line: lineNumber,
        });
    }
    else if (tooManySpacesBeforeEquals.test(line)) {
        fileErrors.push({
            fileName: filePath,
            type: 1,
            line: lineNumber,
        });
    }
}
function fixFiles(errors, diagnosticCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const error of errors) {
            if (error.checked) {
                const document = yield vscode.workspace.openTextDocument(error.fileName);
                const editor = yield vscode.window.showTextDocument(document);
                // Get the text of the line where the error is located
                const lineText = document.lineAt(error.line - 1).text;
                // Fix spaces around '='
                let fixedLine = fixLine(lineText);
                const edit = new vscode.WorkspaceEdit();
                const range = new vscode.Range(error.line - 1, 0, error.line - 1, lineText.length);
                edit.replace(document.uri, range, fixedLine);
                yield vscode.workspace.applyEdit(edit);
                // If the line was fixed, remove the diagnostic
                const diagnostics = diagnosticCollection.get(document.uri) || [];
                const updatedDiagnostics = diagnostics.filter((diag) => diag.range.start.line !== error.line - 1);
                diagnosticCollection.set(document.uri, updatedDiagnostics);
                yield editor.edit(editBuilder => {
                    const range = document.lineAt(error.line - 1).range;
                    editBuilder.replace(range, fixedLine);
                });
                yield document.save();
            }
        }
    });
}
exports.fixFiles = fixFiles;
function fixLine(line) {
    const equalSignIndex = line.indexOf('=');
    if (equalSignIndex === -1) {
        return line;
    }
    const beforeEq = line.slice(0, equalSignIndex);
    const afterEq = line.slice(equalSignIndex + 1);
    const beforeFinal = beforeEq.trimEnd(); // Remove before '='
    const afterFinal = afterEq.trimStart(); // Remove after '='
    return `${beforeFinal} = ${afterFinal}`;
}
//# sourceMappingURL=fileUtils.js.map