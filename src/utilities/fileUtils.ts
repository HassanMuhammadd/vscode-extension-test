import * as vscode from "vscode";
import {Error, ReturnedError} from "../types/Error";

export async function processFile(file: vscode.Uri, diagnostics: vscode.Diagnostic[], diagnosticCollection: vscode.DiagnosticCollection): Promise<Error[]> {

  const document = await vscode.workspace.openTextDocument(file);
  const fileErrors: Error[] = [];

  for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
    const lineText = document.lineAt(lineNumber).text;
    checkLine(lineText, file.fsPath, lineNumber+1, fileErrors, diagnostics);
  }

  diagnosticCollection.set(document.uri, diagnostics);
  return fileErrors;
}

const correctPattern = /[^ ]{1} =[ ]{1}[^ ]/;

const noSpaceAroundEquals = /([^ ]+?)\s*=\s*([^ ]+)/g; // Matches anything without spaces around '='
const tooManySpacesBeforeEquals = / {2,}=/g; // Matches more than one space before '='
const tooManySpacesAfterEquals = /= {2,}/g; // Matches more than one space after '='


function checkLine(line: string, filePath: string, lineNumber: number, fileErrors: Error[], diagnostics: vscode.Diagnostic[]) {

  if(correctPattern.test(line)){
    return;
  }

  const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);

  const diagnostic = new vscode.Diagnostic(range, "Spacing issue around '='.", vscode.DiagnosticSeverity.Warning);
  diagnostics.push(diagnostic);
  if(noSpaceAroundEquals.test(line)){
    fileErrors.push({
      fileName: filePath,
      type: -1,
      line: lineNumber,
    });
  }

  if(tooManySpacesAfterEquals.test(line)){
    fileErrors.push({
      fileName: filePath,
      type: 1,
      line: lineNumber,
    });
  }
  else if(tooManySpacesBeforeEquals.test(line)){
    fileErrors.push({
      fileName: filePath,
      type: 1,
      line: lineNumber,
    });
  }
}

export async function fixFiles(errors: ReturnedError[], diagnosticCollection: vscode.DiagnosticCollection) {
  for (const error of errors) {
    if (error.checked) {

      const document = await vscode.workspace.openTextDocument(error.fileName);
      const editor = await vscode.window.showTextDocument(document);

      // Get the text of the line where the error is located
      const lineText = document.lineAt(error.line - 1).text;

      // Fix spaces around '='
      let fixedLine = fixLine(lineText);

      const edit = new vscode.WorkspaceEdit();
      const range = new vscode.Range(error.line - 1, 0, error.line - 1, lineText.length);
      edit.replace(document.uri, range, fixedLine);
      await vscode.workspace.applyEdit(edit);

      // If the line was fixed, remove the diagnostic
      const diagnostics = diagnosticCollection.get(document.uri) || [];
      const updatedDiagnostics = diagnostics.filter((diag) => diag.range.start.line !== error.line - 1);
      diagnosticCollection.set(document.uri, updatedDiagnostics);

      await editor.edit(editBuilder => {
        const range = document.lineAt(error.line - 1).range;
        editBuilder.replace(range, fixedLine);
      });

      await document.save();
    }
  }
}

function fixLine(line: string): string {
  const equalSignIndex = line.indexOf('=');

  if (equalSignIndex === -1) {
    return line;
  }

  const beforeEq = line.slice(0, equalSignIndex);
  const afterEq= line.slice(equalSignIndex + 1);

  const beforeFinal = beforeEq.trimEnd(); // Remove before '='
  const afterFinal = afterEq.trimStart(); // Remove after '='
  return `${beforeFinal} = ${afterFinal}`;
}
