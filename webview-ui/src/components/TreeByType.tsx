import React, { useState } from "react";
import Checkbox from "./Checkbox";
import { Error } from "../App";

export default function TreeByType({
  errors,
  setErrors,
  handleLineClick,
}: {
  errors: Error[];
  setErrors: (e: Error[]) => void;
  handleLineClick: (e: Error) => void;
}) {
  const [fixAllMissing, setFixAllMissing] = useState<boolean>(false);
  const [fixAllExtra, setFixAllExtra] = useState<boolean>(false);
  const [fileTypeFix, setFileTypeFix] = useState<string[]>([]);

  const errorsByType = errors.reduce(
    (acc: Record<number, Record<string, Error[]>>, error: Error) => {
      const { type, fileName } = error;

      if (!acc[type]) {
        acc[type] = {};
      }

      if (!acc[type][fileName]) {
        acc[type][fileName] = [];
      }

      acc[type][fileName].push(error);
      return acc;
    },
    {}
  );

  const handleTypeClick = (type: string) => {
    //extra space
    if (type === "1") {
      setFixAllExtra(!fixAllExtra);
      setErrors(
        errors.map((error: Error) => {
          if (error.type === 1) {
            error.checked = !fixAllExtra;
          }
          return error;
        })
      );
    } else {
      setFixAllMissing(!fixAllMissing);
      setErrors(
        errors.map((error: Error) => {
          if (error.type === -1) {
            error.checked = !fixAllMissing;
          }
          return error;
        })
      );
    }
  };
  const handleFileClick = (fileName: string, type: string) => {
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
  return (
    <>
      {/* <Checkbox 
            text={"Missing Space"} 
            checked={fixAllMissing} 
            nestingLevel={0} 
            onChange={() => setFixAllMissing(!fixAllMissing)} 
          /> */}
      {Object.keys(errorsByType).map((type) => {
        const numericType = Number(type); // Convert type to a number for consistent comparisons
        return (
          <div key={numericType} className="group">
            <Checkbox
              text={(numericType === -1 ? "Missing" : "Extra") + " Spaces"}
              checked={(numericType === -1 && fixAllMissing) || (numericType === 1 && fixAllExtra)}
              nestingLevel={0}
              onChange={() => handleTypeClick(type)}
            />

            {Object.keys(errorsByType[numericType]).map((fileName) => (
              <div key={fileName} className="group">
                <Checkbox
                  text={fileName}
                  checked={
                    (fixAllExtra && numericType === 1) ||
                    (fixAllMissing && numericType === -1) ||
                    fileTypeFix.includes(fileName + "?type=" + type)
                  }
                  nestingLevel={1}
                  onChange={() => handleFileClick(fileName, type)}
                />
                {errorsByType[numericType][fileName].map((error, index) => (
                  <Checkbox
                    key={String(error.fileName + error.line + error.type)}
                    text={"Line " + error.line}
                    checked={error.checked}
                    nestingLevel={2}
                    onChange={() => handleLineClick(error)}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
