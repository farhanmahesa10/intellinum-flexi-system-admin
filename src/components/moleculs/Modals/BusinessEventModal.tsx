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
import AsyncSelect from "react-select/async";
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
  const [showBlockly, setShowBlockly] = useState(false);

  const [workFlowSelected, setWorkFlowSelected] = useState<any>();

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
    if (mode === "Edit") {
      setWorkFlowSelected({
        label: formik.values.workflow?.name,
        value: formik.values.workflow?.id,
        data: formik.values.workflow,
      });
    } else {
      setWorkFlowSelected(null);
    }
  }, [mode, open]);

  useEffect(() => {
    formik.setFieldValue("script", javascriptCode);
  }, [javascriptCode]);

  const handleSearchWorkFlow = useCallback(async (keyword) => {
    let user = JSON.parse(localStorage.getItem("flexa_auth"));
    const companyId = user.company?.id;
    let data = [];
    try {
      const result = await callApi(
        `${Config.prefixUrl}/messaging/workflow/search?company=${companyId}&value=${keyword}&pageNumber=0&size=10`,
        "GET"
      );

      data = result.data.content.map((r: any) => {
        return {
          label: r.name,
          value: r.id,
          data: r,
        };
      });
    } catch (error) {
      console.log("error", error);
    }

    return data;
  }, []);
  const loadOptions: any = async (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    let data = await handleSearchWorkFlow(inputValue);

    callback(data);
  };

  return (
    <div>
      <Modal
        title={mode + " business event"}
        open={open}
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
              <Form.Item label="Name" required className="w-100 mb-0 ">
                <Input
                  id="name"
                  {...formik.getFieldProps("name")}
                  type="text"
                  status={
                    formik.touched.name && formik.errors.name ? "error" : null
                  }
                  style={{ height: "36px" }}
                />
                {formik.touched.name && formik.errors.name ? (
                  <Typography.Text type="danger">
                    {formik.errors.name}
                  </Typography.Text>
                ) : null}
              </Form.Item>
              <Form.Item label="Workflow" required className="w-100">
                <AsyncSelect
                  cacheOptions
                  styles={{
                    control: (provided, state) => ({
                      ...provided,

                      borderColor:
                        formik.touched.workflow && formik.errors.workflow
                          ? "red"
                          : provided.borderColor,
                      boxShadow: "none",
                    }),
                  }}
                  loadOptions={loadOptions}
                  value={workFlowSelected}
                  placeholder="Type to search workflow"
                  onChange={(val: any) => {
                    console.log(val);
                    setShowBlockly(false);
                    formik.setFieldValue("workflow", val.data);
                    setWorkFlowSelected(val);
                    setTimeout(() => {
                      setShowBlockly(true);
                    }, 300);
                  }}
                  noOptionsMessage={(val) => {
                    return !val.inputValue ? "Search something" : "No Option";
                  }}
                />
                {formik.touched.workflow && formik.errors.workflow ? (
                  <Typography.Text type="danger">
                    {formik.errors.workflow}
                  </Typography.Text>
                ) : null}
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

            {workFlowSelected ? (
              <div className="d-flex w-100 gap-3 ">
                <div className="w-100">
                  {showBlockly && (
                    <BlocklyWorkspace
                      className="h-600 " // you can use whatever classes are appropriate for your app's CSS
                      toolboxConfiguration={blocklyToolbox} // this must be a JSON toolbox definition
                      initialXml={formik.values.workflow?.xml}
                      onWorkspaceChange={handleWorkSpaceChange}
                      workspaceConfiguration={{
                        readOnly: true,
                      }}
                    />
                  )}
                  {formik.touched.script && formik.errors.script ? (
                    <Typography.Text type="danger">
                      {formik.errors.script}
                    </Typography.Text>
                  ) : null}
                </div>
                <div
                  style={{ minHeight: "500px", border: "1px solid lightgray" }}
                >
                  <CodeEditor
                    value={javascriptCode}
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
            ) : (
              ""
            )}
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
