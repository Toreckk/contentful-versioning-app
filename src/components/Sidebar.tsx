import React, { useEffect, useState } from "react";
import {
  EntryProps,
  KeyValueMap,
  PlainClientAPI,
  SnapshotProps,
} from "contentful-management";
import {
  Tag,
  RadioButton,
  RelativeDate,
} from "@contentful/forma-36-react-components";
import { SidebarExtensionSDK } from "@contentful/app-sdk";
interface SidebarProps {
  sdk: SidebarExtensionSDK;
  cma: PlainClientAPI;
}

interface ISnapshotRow {
  snapshot: SnapshotProps<EntryProps<KeyValueMap>>;
  id: number;
  selectedSnapshot: number;
  setSelectedSnapshot: (id: number) => void;
}

const snapshotRow = ({
  snapshot,
  id,
  selectedSnapshot,
  setSelectedSnapshot,
}: ISnapshotRow) => {
  const publishTime = snapshot.snapshot.sys.publishedAt;
  const TagText = id === 0 ? "CURRENT" : "PUBLISHED";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "122px",
          color: "#67728A",
          fontWeight: "500",
          gap: "6px",
        }}
      >
        <RadioButton
          labelText=""
          checked={selectedSnapshot === id}
          onClick={() => {
            setSelectedSnapshot(id);
            sessionStorage.setItem("selectedSnapshot", `${id}`);
          }}
        />
        <RelativeDate date={publishTime || Date.now()} />
      </div>
      <div>
        <Tag tagType={id === 0 ? "secondary" : "positive"}>{TagText}</Tag>
      </div>
    </div>
  );
};

const Sidebar = (props: SidebarProps) => {
  const { sdk, cma } = props;
  const entryId = sdk.ids.entry;
  const [selectedSnapshot, setSelectedSnapshot] = useState(-1);
  const [snapshots, setSnapshots] = useState<
    SnapshotProps<EntryProps<KeyValueMap>>[]
  >([]);

  useEffect(() => {
    sdk.window.startAutoResizer();
    if (snapshots.length === 0) {
      cma.snapshot.getManyForEntry({ entryId }).then((res) => {
        setSnapshots(res.items.slice(0, 7));
      });
    }
  }, [cma.snapshot, sdk.window, entryId, snapshots, selectedSnapshot]);
  return (
    <>
      {snapshots?.map((snapshot, i) =>
        snapshotRow({ snapshot, id: i, selectedSnapshot, setSelectedSnapshot })
      )}
    </>
  );
};

export default Sidebar;
