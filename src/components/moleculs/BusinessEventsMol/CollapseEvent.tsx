import React from "react";
import { blocklyToolbox } from "../../../config/blockly/blocklySetup";
import { BlocklyWorkspace } from "react-blockly";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Button, Typography } from "antd";
import { FaPlay } from "react-icons/fa";

type Props = {
  workflow: any;
  onPlay: any;
};

const CollapseEvent = (props: Props) => {
  const { workflow, onPlay } = props;
  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <Typography.Title level={5}>
          Workflow <span className="text-info">{workflow.name}</span>
        </Typography.Title>
        <div>
          <Button
            type="primary"
            className="d-flex gap-2 align-items-center"
            onClick={() => {
              onPlay();
            }}
          >
            {" "}
            <FaPlay /> Run business event
          </Button>
        </div>
      </div>
      <div className="d-flex w-100 gap-3 ">
        <div className="w-100">
          <BlocklyWorkspace
            className="h-600 " // you can use whatever classes are appropriate for your app's CSS
            toolboxConfiguration={blocklyToolbox} // this must be a JSON toolbox definition
            initialXml={workflow.xml}
            workspaceConfiguration={{
              readOnly: true,
              scrollbars: true,
            }}
          />
        </div>
        <div style={{ minHeight: "500px", border: "1px solid lightgray" }}>
          <CodeEditor
            value={workflow.script}
            language="js"
            readOnly
            placeholder="Your javascript code will appear here"
            // style={{ height: "100%" }}
            style={{
              height: "100%",
              maxHeight: "500px",
              minWidth: "250px",
              fontSize: 12,
              backgroundColor: "white",
              overflowY: "auto",
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CollapseEvent;
