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
exports.activate = exports.diagnosticCollection = void 0;
const vscode = require("vscode");
const HelloWorldPanel_1 = require("./panels/HelloWorldPanel");
const fileUtils_1 = require("./utilities/fileUtils");
exports.diagnosticCollection = vscode.languages.createDiagnosticCollection("spacingIssues");
function activate(context) {
    // Create the show hello world command
    const showHelloWorldCommand = vscode.commands.registerCommand("hello-world.showHelloWorld", () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        HelloWorldPanel_1.HelloWorldPanel.render(context.extensionUri);
        const activeDocument = activeEditor.document;
        const folderUri = (_a = vscode.workspace.getWorkspaceFolder(activeDocument.uri)) === null || _a === void 0 ? void 0 : _a.uri;
        if (!folderUri) {
            vscode.window.showErrorMessage('No workspace folder found!');
            return;
        }
        // Search for all files in the current folder
        const files = yield vscode.workspace.findFiles(new vscode.RelativePattern(folderUri, '**/*'));
        const diagnostics = [];
        const brokenFiles = [];
        for (const file of files) {
            const fileErrors = yield (0, fileUtils_1.processFile)(file, diagnostics, exports.diagnosticCollection);
            brokenFiles.push(...fileErrors);
        }
        (_b = HelloWorldPanel_1.HelloWorldPanel.currentPanel) === null || _b === void 0 ? void 0 : _b._postToWebview({
            command: 'brokenFiles',
            files: brokenFiles
        });
    }));
    // Add command to the extension context
    context.subscriptions.push(showHelloWorldCommand);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map