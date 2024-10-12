import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useState } from "react";

function App() {
  const [name, setName] = useState("John");

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: `Hey there ${name}!`,
    });
  }

  const errors = [
    { fileName: "C:/Test/f1.ts", line: 3, type: -1 },
    { fileName: "C:/Test/f1.ts", line: 4, type: 1 },
    { fileName: "C:/Test/f2.ts", line: 7, type: -1 },
  ];

  //TODO: group by fileName, group by Type

  return (
    <main>
      <h1>Hello World!</h1>
      <VSCodeButton onClick={handleHowdyClick}>ALOOO!</VSCodeButton>
      <VSCodeTextField onChange={(event: any) => setName(event.target.value)} value={name} />
    </main>
  );
}

export default App;
