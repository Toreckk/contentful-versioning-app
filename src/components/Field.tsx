import React, { useEffect, useState } from "react";
import { PlainClientAPI } from "contentful-management";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import "codemirror/lib/codemirror.css";
import "@contentful/field-editor-date/styles/styles.css";
import { Field } from "@contentful/default-field-editors";
import * as diff from "diff";

interface FieldProps {
  sdk: FieldExtensionSDK;
  cma: PlainClientAPI;
}

const FieldEditor = (props: FieldProps) => {
  const { sdk, cma } = props;

  const field = sdk.field.id;
  const locale = sdk.field.locale;
  const entryId = sdk.ids.entry;
  let currentSnapshot = sdk.field.getValue();
  const [newValue, setNewValue] = useState<diff.Change[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(0);
  let sel = sessionStorage.getItem('selectedSnapshot');

 
  useEffect(() => {
    sdk.window.startAutoResizer();
    currentSnapshot = sdk.field.getValue();
    sel = sessionStorage.getItem('selectedSnapshot');
    setSelectedSnapshot(parseInt(sel || "0") || 0);
    console.log(sel);
    cma.snapshot
    .getManyForEntry({ entryId })
    .then((res) => {
      const previousSnapshot = res.items[selectedSnapshot].snapshot.fields[field][locale];
      const dif = diff.diffWordsWithSpace(previousSnapshot, currentSnapshot);
      setNewValue(dif);
    });
  }, [selectedSnapshot, newValue]);

  return (
    <>
      <Field sdk={sdk} />
      {selectedSnapshot !== 0 && <p>
        {newValue.map((part) => (
          <span
            style={{
              color: part.added ? "green" : part.removed ? "red" : "gray",
              textDecorationLine: part.removed ? "line-through" : "initial",
            }}
          >
            {part.value}
          </span>
        ))}
      </p>  }
    </>
  );
};

export default FieldEditor;
