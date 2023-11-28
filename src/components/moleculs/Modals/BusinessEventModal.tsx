import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { BlocklyWorkspace } from "react-blockly";
import { blocklyToolbox } from "../../../config/blockly/blocklySetup";
import { javascriptGenerator } from "blockly/javascript";
import CodeEditor from "@uiw/react-textarea-code-editor";
// @ts-ignore
import * as Utils from "@intellinum/flexa-util";
const { CustomSelect, Config, callApi } = Utils;
type Props = {
  open: boolean;
  isLoading: boolean;
  setOpen: any;
  formik: any;
  mode: string;
};

const BusinessEventModal = (props: Props) => {
  const [javascriptCode, setJavascriptCode] = useState("");
  const { open, setOpen, formik, isLoading, mode } = props;
  const [xml, setXml] = useState("");
  const [showBlockly, setShowBlockly] = useState(false);
  const [workFlowData, setWorkFlowData] = useState([]);
  const [isWorkFlowLoading, setIsWorkFlowLoading] = useState(false);
  const [workflowKeyword, setWorkflowKeyword] = useState("");

  const workflowOption = useMemo(() => {
    return workFlowData.map((r: any) => {
      return {
        label: r.name,
        value: r.id,
      };
    });
  }, [workFlowData]);

  const handleWorkSpaceChange = (workspace) => {
    const code = javascriptGenerator.workspaceToCode(workspace);

    setJavascriptCode(code);
  };

  useEffect(() => {
    // this is for wait until modal ready, beacuse we need refresh blockly
    if (open) {
      setTimeout(() => {
        setShowBlockly(true);
      }, 300);
    } else {
      setShowBlockly(false);
    }
  }, [open]);

  useEffect(() => {
    formik.setFieldValue("script", javascriptCode);
  }, [javascriptCode]);

  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearchWorkFlow();
    }, 1000);

    return () => clearTimeout(getData);
  }, [workflowKeyword]);

  const handleSearchWorkFlow = useCallback(async () => {
    let user = JSON.parse(localStorage.getItem("flexa_auth"));
    const companyId = user.company?.id;
    console.log("workflowKeyword", workflowKeyword);

    try {
      const result = await callApi(
        `${Config.prefixUrl}/messaging/workflow/search?company=${companyId}&value=${workflowKeyword}&pageNumber=0&size=10`,
        "GET"
      );

      setWorkFlowData(result.data.content);
    } catch (error) {
      console.log("error", error);
    }
  }, [workflowKeyword]);
  console.log(workFlowData);

  return (
    <div>
      <Modal
        title={mode + " business event"}
        open={true}
        width={1200}
        centered
        onCancel={() => setOpen(false)}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <Form
          name="basic"
          // labelWrap
          layout="vertical"
          onFinish={formik.handleSubmit}
        >
          <div style={{ padding: "20px" }}>
            <Space.Compact className="w-100 gap-4 mb-0">
              <Form.Item label="Name" required className="w-100 mb-0">
                <Input
                  id="name"
                  {...formik.getFieldProps("name")}
                  type="text"
                  status={
                    formik.touched.name && formik.errors.name ? "error" : null
                  }
                />
                {formik.touched.name && formik.errors.name ? (
                  <Typography.Text type="danger">
                    {formik.errors.name}
                  </Typography.Text>
                ) : null}
              </Form.Item>
              <Form.Item label="Workflow" required className="w-100">
                <Select
                  showSearch
                  placeholder="Search to Select Workflow"
                  optionFilterProp="children"
                  onSearch={(val) => {
                    setWorkflowKeyword(val);
                  }}
                  dropdownRender={(menu) => {
                    return <>{workFlowData.length ? menu : "kosong"}</>;
                  }}
                  options={workflowOption}
                />
              </Form.Item>

              <Form.Item label="Active" required className="w-100 mb-0">
                <Switch
                  checked={formik.values.isActive}
                  onChange={(val) => {
                    if (val) {
                      formik.setFieldValue("isActive", 1);
                    } else {
                      formik.setFieldValue("isActive", 0);
                    }
                  }}
                />
              </Form.Item>
            </Space.Compact>

            <div className="d-flex w-100 gap-3 ">
              <div className="w-100">
                {showBlockly && (
                  <BlocklyWorkspace
                    className="h-600 " // you can use whatever classes are appropriate for your app's CSS
                    toolboxConfiguration={blocklyToolbox} // this must be a JSON toolbox definition
                    initialXml={formik.values.xml}
                    onXmlChange={(val) => {
                      formik.setFieldValue("xml", val);
                      setXml(val);
                    }}
                    onWorkspaceChange={handleWorkSpaceChange}
                  />
                )}
                {formik.touched.script && formik.errors.script ? (
                  <Typography.Text type="danger">
                    {formik.errors.script}
                  </Typography.Text>
                ) : null}
              </div>
              <div style={{ minHeight: "500px" }}>
                <CodeEditor
                  value={javascriptCode}
                  data-color-mode="dark"
                  language="js"
                  readOnly
                  placeholder="Your javascript code will appear here"
                  // style={{ height: "100%" }}
                  style={{
                    height: "100%",
                    minWidth: "250px",
                    fontSize: 12,
                    // backgroundColor: "#ddd",
                    overflow: "scroll",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end mt-2">
              <Button type="primary" htmlType="submit" disabled={isLoading}>
                {isLoading ? (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
                  </span>
                ) : (
                  <span className="indicator-label"> Save</span>
                )}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessEventModal;
