import { useEffect, useCallback, useState, useMemo } from "react";
import Switch from "react-switch";
// @ts-ignore
import { callApi, TableAntd, CustomSelect } from "@intellinum/flexa-util";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import mqtt from "mqtt";
// import mqtt from "mqtt/dist/mqtt";
import {
  Space,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Card,
  message,
  Popconfirm,
  Typography,
} from "antd";
import { Config } from "../../../config/config";
import {
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { navigateToUrl } from "single-spa";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const MqttOrg = () => {
  const [userId, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/messaging/mqttserver/search"
  );
  const [apiUrl, setApiUrl] = useState(
    Config.prefixUrl + "/messaging/mqttserver"
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );

  const validationSchema = () => {
    let validation = Yup.object().shape({
      host: Yup.string().required("Host is required"),
      port: Yup.string().required("Port is required"),
      clientId: Yup.string().required("ClientID is required"),
    });
    if (user.userType == "Admin") {
      validation = Yup.object().shape({
        host: Yup.string().required("Host is required"),
        port: Yup.string().required("Port is required"),
        clientId: Yup.string().required("ClientID is required"),
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
        host: values.host,
        port: values.port,
        clientId: values.clientId,
        userName: values.username,
        password: values.password,
        keepAlive: values.keepAlive,
        cleanSession: values.cleanSession,
        company: values.company == "" ? user.company.id : values.company,
        creationDate: new Date(),
        createdBy: user.id,
        updateDate: new Date(),
        updatedBy: user.id,
        active: values.active,
        ssl: values.ssl,
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
      } else {
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
      host: "",
      port: "0",
      clientId: "",
      username: "",
      password: "",
      keepAlive: "60",
      ssl: false,
      cleanSession: false,
      active: false,
      company: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setIsLoading(false);
        setConnectionStatus("connect");
        console.log("koneksi berhasil");
      });

      client.on("error", (err) => {
        setIsLoading(false);
        setConnectionStatus("error");
        console.log("koneksi gagal: ", err);
        client.end();
      });

      client.on("reconnect", () => {
        console.log("Reconnecting");
        //jika reconnecting lebih dari 5 detik maka terputus
        setTimeout(() => {
          setIsLoading(false);
          client.end();
          setConnectionStatus("error");
        }, 5000);
      });
    }
  }, [client]);

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
      console.log(row);
      setMode("edit");
      setId(row.id);
      setConnectionStatus("");
      formik.setFieldValue("host", row.host);
      formik.setFieldValue("port", row.port);
      formik.setFieldValue("clientId", row.clientId);
      formik.setFieldValue("username", row.userName);
      formik.setFieldValue("password", row.password);
      formik.setFieldValue("ssl", row.ssl);
      formik.setFieldValue("keepAlive", row.keepAlive);
      formik.setFieldValue("cleanSession", row.cleanSession);
      formik.setFieldValue("active", row.active);
      formik.setFieldValue("company", row.company);
      showModal();
    },
    []
  );

  //validation host

  const handleValidation = () => {
    setConnectionStatus("connecting");
    setIsLoading(true);
    const opt = {
      clientID: formik.getFieldProps("clientId").value,
      password: formik.getFieldProps("password").value,
      username: formik.getFieldProps("username").value,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    };
    const host = formik.getFieldProps("host").value;
    const port = formik.getFieldProps("port").value;
    const url = `${host}:${port}/mqtt`;
    console.log("yy", url, opt, "");
    try {
      setClient(mqtt.connect(url, opt));
    } catch (error) {
      console.log("e", error);
      setIsLoading(false);
      setConnectionStatus("error");
    }
  };

  const handleTopicAction = useCallback(
    (row) => async () => {
      setMode("topicaction");
      setId(row.id);
      navigateToUrl(`/system/mqtt-topic/${row.id}`);
    },
    []
  );

  const handleChangeSwitch = (value) => {
    return value == false ? true : false;
  };

  const columns = useMemo(
    () => [
      {
        title: "Host",
        dataIndex: "host",
      },
      {
        title: "Port",
        dataIndex: "port",
        sorter: true,
      },
      {
        title: "ClientID",
        dataIndex: "clientId",
      },
      {
        title: "Action",
        key: "action",
        render: (row) => (
          <Space size="middle">
            <span
              onClick={handleTopicAction(row)}
              title="Mqtt Topic"
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
    [handleDelete, handleEdit, handleTopicAction]
  );

  const searchSection = "";
  const handleSelectChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <FormikProvider value={formik}>
      <Modal
        open={open}
        title={mode == "edit" ? `Edit` : "New"}
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
            <Form.Item label="Host" required>
              <Input
                id="host"
                {...formik.getFieldProps("host")}
                type="text"
                status={
                  formik.touched.host && formik.errors.host ? "error" : null
                }
              />
              {formik.touched.host && formik.errors.host ? (
                <Typography.Text type="danger">
                  {formik.errors.host}
                </Typography.Text>
              ) : null}
            </Form.Item>
            <Form.Item label="Port" required>
              <Input
                id="port"
                {...formik.getFieldProps("port")}
                type="number"
                status={
                  formik.touched.port && formik.errors.port ? "error" : null
                }
              />
              {formik.touched.port && formik.errors.port ? (
                <Typography.Text type="danger">
                  {formik.errors.port}
                </Typography.Text>
              ) : null}
            </Form.Item>
            <Form.Item label="ClientID" required>
              <Input
                id="clientId"
                {...formik.getFieldProps("clientId")}
                type="text"
                status={
                  formik.touched.clientId && formik.errors.clientId
                    ? "error"
                    : null
                }
              />
              {formik.touched.clientId && formik.errors.clientId ? (
                <Typography.Text type="danger">
                  {formik.errors.clientId}
                </Typography.Text>
              ) : null}
            </Form.Item>
            <Form.Item label="username">
              <Input
                id="username"
                {...formik.getFieldProps("username")}
                type="text"
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                placeholder="input password"
                id="password"
                {...formik.getFieldProps("password")}
                type="text"
              />
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
            </Form.Item>

            <Form.Item label="KeepAlive">
              <Input
                id="keepAlive"
                {...formik.getFieldProps("keepAlive")}
                type="number"
              />
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
            <Form.Item name="ssl" label="SSL">
              {/* <Switch defaultChecked={formik.getFieldProps("ssl").value} onChange={(checked) => handleSelectChange("ssl", checked)}/> */}
              <Switch
                name="ssl"
                onChange={(checked) => handleSelectChange("ssl", checked)}
                checked={formik.getFieldProps("ssl").value}
                checkedIcon={false}
                uncheckedIcon={false}
              />
            </Form.Item>
            <Form.Item name="cleanSession" label="CleanSession">
              {/* <Switch defaultChecked={formik.getFieldProps("cleanSession").value} onChange={(checked) => handleSelectChange("cleanSession", checked)}/> */}
              <Switch
                name="cleanSession"
                onChange={(checked) =>
                  handleSelectChange("cleanSession", checked)
                }
                checked={formik.getFieldProps("cleanSession").value}
                checkedIcon={false}
                uncheckedIcon={false}
              />
            </Form.Item>
            <Form.Item name="active" label="IsActive">
              {/* <Switch defaultChecked={formik.getFieldProps("active").value} onChange={(checked) => handleSelectChange("active", checked)}/> */}
              <Switch
                name="active"
                onChange={(checked) => handleSelectChange("active", checked)}
                checked={formik.getFieldProps("active").value}
                checkedIcon={false}
                uncheckedIcon={false}
              />
            </Form.Item>
            {connectionStatus == "connect" ? (
              <div className="alert alert-success" role="alert">
                Successful Connection
              </div>
            ) : connectionStatus == "error" ? (
              <div className="alert alert-danger" role="alert">
                Connection Failed
              </div>
            ) : connectionStatus == "connecting" ? (
              <div className="alert alert-info" role="alert">
                Connecting
              </div>
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
              <Space size="middle">
                <Button onClick={handleValidation} loading={isLoading}>
                  Validate
                </Button>
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
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <div>
        <TableAntd
          title="Mqtt List"
          loading={tableLoading}
          setLoading={setTableLoading}
          columns={columns}
          searchUrl={searchUrl}
          useCard={true}
          apiUrl={apiUrl}
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

export default MqttOrg;
