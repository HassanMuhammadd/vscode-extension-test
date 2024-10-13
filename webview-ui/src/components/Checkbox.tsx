import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import React from "react";

export default function Checkbox({
  text,
  checked,
  nestingLevel,
  onChange,
}: {
  text: string;
  checked: boolean;
  nestingLevel: number;
  onChange: any;
}) {
  return (
    <div className={`checkbox-container nesting-${nestingLevel}`}>
      <VSCodeCheckbox checked={checked} onClick={onChange}>
        {text}
      </VSCodeCheckbox>
    </div>
  );
}
