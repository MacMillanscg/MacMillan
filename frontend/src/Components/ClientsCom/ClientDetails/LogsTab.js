import React from "react";
import { LogsTabHeader } from "./LogsTabHeader";

export const LogsTab = () => {
  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h2>Logs</h2>
        <LogsTabHeader />
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore alias
        at laboriosam rem aspernatur repudiandae totam minus voluptates iste sit
        beatae quaerat cumque suscipit in, tempore, perspiciatis ipsum quod
        maxime!
      </p>
    </div>
  );
};
