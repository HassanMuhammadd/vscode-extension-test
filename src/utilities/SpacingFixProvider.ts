//import * as vscode from "vscode";

//export class SpacingFixProvider implements vscode.CodeActionProvider {
//  private diagnosticCollection: vscode.DiagnosticCollection;

//  constructor(diagnosticCollection: vscode.DiagnosticCollection) {
//    this.diagnosticCollection = diagnosticCollection;
//  }

//  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

//  public provideCodeActions(
//    document: vscode.TextDocument,
//    range: vscode.Range,
//    context: vscode.CodeActionContext,
//    token: vscode.CancellationToken
//  ): vscode.CodeAction[] {
//    // Filter the diagnostics to only show a fix for spacing issues
//    const diagnostics = context.diagnostics.filter((diagnostic) => diagnostic.source === "spacingChecker");

//    return diagnostics.map((diagnostic) => this.createFix(document, diagnostic));
//  }

//  private createFix(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
//    const fix = new vscode.CodeAction(`Fix spacing around "="`, vscode.CodeActionKind.QuickFix);
//    fix.edit = new vscode.WorkspaceEdit();

//    const lineText = document.lineAt(diagnostic.range.start.line).text;
//    const fixedLine = fixLine(lineText); // Apply your fix here

//    // Replace the line with the fixed version
//    fix.edit.replace(document.uri, new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line, lineText.length), fixedLine);

//    // Associate this fix with the specific diagnostic
//    fix.diagnostics = [diagnostic];

//    return fix;
//  }
//}
