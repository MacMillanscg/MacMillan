import React, { useState } from "react";
// import renderData from "./XMLData/renderXml";
import data from "./XMLData/Data";
import { JSONTree } from "react-json-tree";
import styles from "./OutputLogs.module.css";

const theme = {
  base00: "#ffffff",
  base01: "#f5f5f5",
  base02: "#e0e0e0",
  base03: "#d5d5d5",
  base04: "#aaaaaa",
  base05: "#333333",
  base06: "#000000",
  base07: "#333333",
  base08: "#d73a49",
  base09: "#d73a49",
  base0A: "#d73a49",
  base0B: "#6f42c1",
  base0C: "#005cc5",
  base0D: "#005cc5",
  base0E: "#6f42c1",
  base0F: "#d73a49",
};

const DataTreeView = ({ data }) => {
  return (
    <div style={{ margin: "20px" }}>
      <JSONTree data={data} theme={theme} invertTheme={false} />
    </div>
  );
};

export const OutputLogs = () => {
  return (
    <div className={styles.outputlog}>
      <h4 className="fs-5 m-0 mb-3">Output logs</h4>
      <DataTreeView data={data} />
    </div>
  );
};
