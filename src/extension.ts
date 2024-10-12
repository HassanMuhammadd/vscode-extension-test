import * as vscode from "vscode";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";

export function activate(context: vscode.ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = vscode.commands.registerCommand("hello-world.showHelloWorld", async() => {

    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    const activeDocument = activeEditor.document;
    const folderUri = vscode.workspace.getWorkspaceFolder(activeDocument.uri)?.uri;

    if (!folderUri) {
      vscode.window.showErrorMessage('No workspace folder found!');
      return;
    }

    // Search for all files in the current folder
    const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(folderUri, '**/*'), // Match all files in the folder
      );

    //found all files in the project
    files.forEach(file => {
        console.log(`File: ${file.fsPath}`);
      });


    //const file = vscode.window.activeTextEditor?.document;
    //if (file) {
    //  for (let lineNumber = 0; lineNumber < file.lineCount; lineNumber++) {
    //      const lineText = file.lineAt(lineNumber).text;
    //      console.log(`Line ${lineNumber + 1}: ${lineText}`);
    //  }
    //}

    HelloWorldPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
}
