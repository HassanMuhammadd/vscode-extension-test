import * as vscode from "vscode";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";
import {processFile} from "./utilities/fileUtils";
import {Error} from "./types/Error";

export const diagnosticCollection = vscode.languages.createDiagnosticCollection("spacingIssues");
export function activate(context: vscode.ExtensionContext) {


  // Create the show hello world command
  const showHelloWorldCommand = vscode.commands.registerCommand("hello-world.showHelloWorld", async() => {

    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }
    HelloWorldPanel.render(context.extensionUri);

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

    const diagnostics: vscode.Diagnostic[] = [];
    const brokenFiles: Error[] = [];
    for (const file of files) {
      const fileErrors: Error[] = await processFile(file, diagnostics, diagnosticCollection);
      brokenFiles.push(...fileErrors);
    }

    HelloWorldPanel.currentPanel?._postToWebview({
      command: 'brokenFiles',
      files: brokenFiles
    });

  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
}
