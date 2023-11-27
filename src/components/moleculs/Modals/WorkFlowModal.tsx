import { Modal } from "antd";
import React, { useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import { blocklyToolbox } from "../../../config/blockly/blocklySetup";
import { javascriptGenerator } from "blockly/javascript";
type Props = {
  open: boolean;
  setOpen: any;
  formik: any;
};

const WorkflowModal = (props: Props) => {
  const [javascriptCode, setJavascriptCode] = useState("");
  const { open, setOpen, formik } = props;
  const [xml, setXml] = useState(
    '<xml xmlns="https://developers.google.com/blockly/xml"><block type="print_to_console" id="|Bx^_?qPmuh9G(^x`YYd" x="16" y="8"></block></xml>'
  );

  const handleWorkSpaceChange = (workspace) => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    setJavascriptCode(code);
  };

  return (
    <div>
      <Modal open={open} width={1000} onCancel={() => setOpen(false)}>
        <div style={{ padding: "20px" }}>
          <BlocklyWorkspace
            className="h-600 " // you can use whatever classes are appropriate for your app's CSS
            toolboxConfiguration={blocklyToolbox} // this must be a JSON toolbox definition
            initialXml={xml}
            onXmlChange={setXml}
            onWorkspaceChange={handleWorkSpaceChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default WorkflowModal;
