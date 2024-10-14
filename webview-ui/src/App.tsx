import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useEffect, useState } from "react";
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
  const [errors, setErrors] = useState<Error[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // const vscode = (window as any).acquireVsCodeApi();
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "brokenFiles") {
        setName("Hassan");
        setErrors(message.files);
        setLoading(false);
      }
    });
  }, []);

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: `Hey there ${name}!`,
    });
  }

  function handleFixFiles() {
    vscode.postMessage({
      command: "fixFiles",
      files: errors,
    });
  }

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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h4>{name}</h4>
          <VSCodeButton onClick={() => setGroupByType(!groupByType)}>Switch View</VSCodeButton>
          <VSCodeButton onClick={handleFixFiles}>Fix Selected Files</VSCodeButton>

          {groupByType ? (
            <TreeByType errors={errors} setErrors={setErrors} handleLineClick={handleLineClick} />
          ) : (
            <TreeByFile errors={errors} setErrors={setErrors} handleLineClick={handleLineClick} />
          )}
        </>
      )}
    </main>
  );
}

export default App;
