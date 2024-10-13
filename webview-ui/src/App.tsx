import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useEffect, useState } from "react";
import Checkbox from "./components/Checkbox";
import TreeByType from "./components/TreeByType";
import TreeByFile from "./components/TreeByFile";

export type Error = {
  fileName: string;
  line: number;
  type: number;
  checked: boolean;
};

function App() {
  const [name, setName] = useState<string>("John");
  const [groupByType, setGroupByType] = useState<boolean>(false);

  useEffect(() => {
    // const vscode = (window as any).acquireVsCodeApi();

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "lintFiles") {
        console.log("A");
        // setErrors(message.errors);
      }
    });
  }, []);

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: `Hey there ${name}!`,
    });
  }

  const [errors, setErrors] = useState<Error[]>([
    { fileName: "C:/Test/f1.ts", line: 3, checked: false, type: -1 },
    { fileName: "C:/Test/f1.ts", line: 4, checked: false, type: 1 },
    { fileName: "C:/Test/f1.ts", line: 5, checked: false, type: -1 },
    { fileName: "C:/Test/f1.ts", line: 12, checked: false, type: -1 },
    { fileName: "C:/Test/f1.ts", line: 30, checked: false, type: -1 },

    { fileName: "C:/Test/f2.ts", line: 7, checked: false, type: -1 },
    { fileName: "C:/Test/f2.ts", line: 10, checked: false, type: -1 },

    { fileName: "C:/Test/f3.ts", line: 3, checked: false, type: 1 },
    { fileName: "C:/Test/f3.ts", line: 14, checked: false, type: 1 },
  ]);

  // if (checked.includes(fileName + "?type=file")) {
  //   console.log("ALL", checked);
  //   const filteredCheck = checked.filter(
  //     (item: string) =>
  //       !(
  //         item.includes(fileName) &&
  //         (item.includes("?type=" + type) || item.includes("?type=file"))
  //       )
  //   );
  //   console.log("FILTER", filteredCheck);
  //   setChecked(filteredCheck);
  // } else {
  //   const filesToCheck = errorsByType[Number(type)][fileName].map(
  //     (error: Error) => error.fileName + "?line=" + error.line + "?type=" + error.type
  //   );
  //   filesToCheck.push(fileName + "?type=file");
  //   console.log("ADDING", filesToCheck);
  //   setChecked([...checked, ...filesToCheck]);
  // }

  const handleLineClick = (error: Error) => {
    const updates = errors.map((err: Error) => {
      if (err.fileName === error.fileName && err.line === error.line) {
        return { ...err, checked: !error.checked }; // Create a new object, don't mutate
      }
      return err;
    });
    setErrors(updates);
  };

  return (
    <main>
      <h1 className="title">Space Checker</h1>

      <VSCodeButton onClick={() => setGroupByType(!groupByType)}>Switch View</VSCodeButton>

      {groupByType ? (
        <TreeByType errors={errors} setErrors={setErrors} handleLineClick={handleLineClick} />
      ) : (
        <TreeByFile errors={errors} setErrors={setErrors} handleLineClick={handleLineClick} />
      )}
    </main>
  );
}

export default App;
