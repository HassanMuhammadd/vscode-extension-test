import React, { useState } from "react";
import { Error } from "../App";
import Checkbox from "./Checkbox";

export default function TreeByFile({
  errors,
  setErrors,
  handleLineClick,
}: {
  errors: Error[];
  setErrors: (e: Error[]) => void;
  handleLineClick: (e: Error) => void;
}) {
  const [fixAllFile, setFixAllFile] = useState<string[]>([]);
  const [fileTypeFix, setFileTypeFix] = useState<string[]>([]);
  const handleFileClick = (fileName: string) => {
    if (fixAllFile.includes(fileName)) {
      setFixAllFile(fixAllFile.filter((f) => f !== fileName));
      setErrors(
        errors.map((error: Error) => {
          if (error.fileName === fileName) error.checked = false;
          return error;
        })
      );
    } else {
      setFixAllFile([...fixAllFile, fileName]);
      setErrors(
        errors.map((error: Error) => {
          if (error.fileName === fileName) error.checked = true;
          return error;
        })
      );
    }
  };

  const handleTypeClick = (fileName: string, type: string) => {
    if (fileTypeFix.includes(fileName + "?type=" + type)) {
      setFileTypeFix(fileTypeFix.filter((f) => f !== fileName + "?type=" + type));
      setErrors(
        errors.map((error: Error) => {
          if (error.fileName === fileName && error.type === Number(type)) error.checked = false;
          return error;
        })
      );
    } else {
      setFileTypeFix([...fileTypeFix, fileName + "?type=" + type]);
      setErrors(
        errors.map((error: Error) => {
          if (error.fileName === fileName && error.type === Number(type)) error.checked = true;
          return error;
        })
      );
    }
  };
  const errorsByFile = errors.reduce(
    (acc: Record<string, Record<number, Error[]>>, error: Error) => {
      if (!acc[error.fileName]) {
        acc[error.fileName] = {};
      }

      if (!acc[error.fileName][error.type]) {
        acc[error.fileName][error.type] = [];
      }

      acc[error.fileName][error.type].push(error);
      return acc;
    },
    {}
  );
  return (
    <>
      {Object.keys(errorsByFile).map((fileName) => (
        <div key={fileName} className="group">
          <Checkbox
            text={fileName}
            checked={fixAllFile.includes(fileName)}
            nestingLevel={0}
            onChange={() => handleFileClick(fileName)}
          />
          {Object.keys(errorsByFile[fileName]).map((type: string) => (
            <div key={type} className="group">
              <Checkbox
                text={(Number(type) === -1 ? "Missing" : "Extra") + " Spaces"}
                checked={
                  fixAllFile.includes(fileName) || fileTypeFix.includes(fileName + "?type=" + type)
                }
                nestingLevel={1}
                onChange={() => handleTypeClick(fileName, type)}
              />
              {errorsByFile[fileName][Number(type)].map((error, index) => (
                <Checkbox
                  key={index}
                  text={"Line " + error.line}
                  checked={error.checked}
                  nestingLevel={2}
                  onChange={() => handleLineClick(error)}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
