import { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import * as FlexaUtil from "@intellinum/flexa-util";
const { callApi, TableAntd, CustomSelect, Config } = FlexaUtil;
import { useFormik, FormikProvider } from "formik";
import {
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Space,
  Modal,
  Popconfirm,
  Button,
  Form,
  Input,
  Select,
  Typography,
  Card,
  message,
} from "antd";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { navigateToUrl } from "single-spa";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const { Option } = Select;

export const MqttTopic = () => {
  const [mode, setMode] = useState("");
  const [userId, setId] = useState(0);
  const [mqttServer, setMqttServer] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [open, setOpen] = useState(false);
  const { mqttId } = useParams();
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/messaging/mqttsubscribe/search"
  );
  const [apiUrl, setApiUrl] = useState(
    Config.prefixUrl + "/messaging/mqttsubscribe"
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );

  useEffect(() => {
    const mqttData = callApi(
      Config.prefixUrl + "/messaging/mqttserver/" + mqttId,
      "GET"
    );
    mqttData.then(({ data }) => setMqttServer(data));
  }, [open]);

  const validationSchema = () => {
    let validation = Yup.object().shape({
      topic: Yup.string().required("Topic is required"),
      qos: Yup.string().required("Qos is required"),
      retain: Yup.string().required("Retain is required"),
      templateMessage: Yup.string().required("Template Message is required"),
      variable: Yup.string().required("Variable is required"),
    });
    if (user.userType == "Admin") {
      validation = Yup.object().shape({
        topic: Yup.string().required("Topic is required"),
        qos: Yup.string().required("Qos is required"),
        retain: Yup.string().required("Retain is required"),
        templateMessage: Yup.string().required("Template Message is required"),
        variable: Yup.string().required("Variable is required"),
        company: Yup.string().required("Company is required"),
      });
    }
    return validation;
  };

  const showModal = () => {
    setOpen(true);
  };

  const showModalNew = () => {
    setMode("new");
    formik.resetForm();
    setIsLoading(false);
    setOpen(true);
  };

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = useCallback(
    async (values, setSubmitting) => {
      const payload = {
        topic: values.topic,
        qos: values.qos,
        retain: values.retain,
        mqttServer: mqttServer,
        templateMessage: values.templateMessage,
        variable: values.variable,
        company: values.company,
        creationDate: new Date(),
        createdBy: user.id,
        updateDate: new Date(),
        updatedBy: user.id,
      };
      setIsLoading(true);
      if (mode == "edit") {
        try {
          await callApi(apiUrl + `/${userId}`, "PUT", payload);
          message.success("Succesfully edited data");
          setFetch(true);
          setOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        }
      } else if (mode == "new") {
        try {
          await callApi(apiUrl, "POST", payload);
          message.success("Succesfully added data");
          setFetch(true);
          setOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        }
      }
      setSubmitting(false);
      setIsLoading(false);
    },
    [isLoading, fetch, mode]
  );

  const formik = useFormik({
    initialValues: {
      topic: "",
      qos: "0",
      retain: "",
      mqttServer: mqttServer,
      templateMessage: "",
      variable: "",
      company: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

  const handleDelete = useCallback(
    async (row) => {
      setTableLoading(true);
      try {
        await callApi(apiUrl + `/${row.id}`, "DELETE", null);
        message.success("Successfully deleted data");
        setFetch(true);
      } catch (error) {
        message.error("Failed | Something went wrong");
        setTableLoading(false);
      }
    },
    [fetch]
  );

  const handleEdit = useCallback(
    (row) => async () => {
      setMode("edit");
      setId(row.id);
      formik.setFieldValue("topic", row.topic);
      formik.setFieldValue("qos", row.qos);
      formik.setFieldValue("retain", row.retain);
      formik.setFieldValue("variable", row.variable);
      formik.setFieldValue("templateMessage", row.templateMessage);
      formik.setFieldValue("company", row.company);
      showModal();
    },
    []
  );

  const handleRuleAction = useCallback(
    (row) => async () => {
      setMode("ruleaction");
      setId(row.id);
      navigateToUrl(`/system/mqtt-rule/${row.id}`);
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        title: "Topic",
        dataIndex: "topic",
      },
      {
        title: "Qos",
        dataIndex: "qos",
        // sorter: true,
      },
      {
        title: "Template Message",
        dataIndex: "templateMessage",
      },
      {
        title: "Action",
        key: "action",
        render: (row) => (
          <Space size="middle">
            <span
              onClick={handleRuleAction(row)}
              title="Mqtt Rule"
              style={{ cursor: "pointer" }}
            >
              <UnorderedListOutlined />
            </span>
            <a onClick={handleEdit(row)}>
              <EditOutlined />
            </a>
            <Popconfirm
              title={<span className="ms-2">Delete the task</span>}
              description={
                <span className="ms-2">Are you sure to delete this data?</span>
              }
              okText="Yes"
              cancelText="No"
              icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
              onConfirm={() => {
                handleDelete(row);
              }}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, handleEdit, handleRuleAction]
  );
  const searchSection = "";
  const handleSelectChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <FormikProvider value={formik}>
      <Modal
        open={open}
        title={mode == "edit" ? `Edit id: ${userId}` : "New"}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Card>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={formik.handleSubmit}
            style={{ maxWidth: 600, marginTop: "20px" }}
          >
            <Form.Item label="Topic" required>
              <Input
                id="topic"
                {...formik.getFieldProps("topic")}
                type="text"
                status={
                  formik.touched.topic && formik.errors.topic ? "error" : null
                }
              />
              {formik.touched.topic && formik.errors.topic ? (
                <Typography.Text type="danger">
                  {formik.errors.topic}
                </Typography.Text>
              ) : null}
            </Form.Item>
            <Form.Item label="Qos" required>
              <Select
                placeholder="Select Qos"
                onBlur={formik.handleBlur}
                value={formik.values.qos}
                id="qos"
                onChange={(value) => handleSelectChange("qos", value)}
                status={
                  formik.touched.qos && formik.errors.qos ? "error" : null
                }
              >
                <Option value="0">0</Option>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
              </Select>
              {formik.touched.qos && formik.errors.qos ? (
                <p style={{ marginTop: "-20px", color: "#ff0000" }}>
                  {" "}
                  {formik.errors.qos}
                </p>
              ) : null}
            </Form.Item>
            <Form.Item label="Retain" required>
              <Input
                id="retain"
                {...formik.getFieldProps("retain")}
                type="number"
                status={
                  formik.touched.retain && formik.errors.retain ? "error" : null
                }
              />
              {formik.touched.retain && formik.errors.retain ? (
                <Typography.Text type="danger">
                  {formik.errors.retain}
                </Typography.Text>
              ) : null}
            </Form.Item>
            <Form.Item label="Template Message" required>
              <Input.TextArea
                id="templateMessage"
                {...formik.getFieldProps("templateMessage")}
                status={
                  formik.touched.templateMessage &&
                  formik.errors.templateMessage
                    ? "error"
                    : null
                }
              />
              {formik.touched.templateMessage &&
              formik.errors.templateMessage ? (
                <Typography.Text type="danger">
                  {formik.errors.templateMessage}
                </Typography.Text>
              ) : null}
            </Form.Item>
            <Form.Item label="Variable Name" required>
              <Input
                id="variable"
                {...formik.getFieldProps("variable")}
                type="text"
                status={
                  formik.touched.variable && formik.errors.variable
                    ? "error"
                    : null
                }
              />
              {formik.touched.variable && formik.errors.variable ? (
                <Typography.Text type="danger">
                  {formik.errors.variable}
                </Typography.Text>
              ) : null}
            </Form.Item>
            {user.userType == "Admin" ? (
              <Form.Item label="Company" required>
                <CustomSelect
                  apiUrl={Config.prefixUrl + "/common/company"}
                  field={formik.getFieldProps("company")}
                  form={formik}
                  label="Company"
                  status={
                    formik.touched.company && formik.errors.company
                      ? "error"
                      : null
                  }
                />
                {formik.touched.company && formik.errors.company ? (
                  <p style={{ marginTop: "-20px", color: "#ff0000" }}>
                    {" "}
                    {formik.errors.company}
                  </p>
                ) : null}
              </Form.Item>
            ) : (
              ""
            )}
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "16px",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={formik.isSubmitting}
              >
                {!isLoading && <span className="indicator-label"> Save</span>}
                {isLoading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
                  </span>
                )}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <div>
        <TableAntd
          title="Mqtt Topic List"
          loading={tableLoading}
          setLoading={setTableLoading}
          columns={columns}
          searchUrl={searchUrl}
          useCard={true}
          apiUrl={apiUrl + "/findByMqttServer?mqttServer=" + mqttId}
          readonly={false}
          targetNew="#dataModal"
          targetEdit="#dataModal"
          searchSection={searchSection}
          showModal={showModalNew}
          fetch={fetch}
          setFetch={setFetch}
        />
      </div>
    </FormikProvider>
  );
};
