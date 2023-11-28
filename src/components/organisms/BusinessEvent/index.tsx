import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import { useCallback, useMemo, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BusinessEventModal } from "../../moleculs";
// @ts-ignore
import * as Utils from "@intellinum/flexa-util";
import { useFormik } from "formik";
import CodeEditor from "@uiw/react-textarea-code-editor";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
const { ModalDraggable, Config, callApi, TableAntd } = Utils;
type Props = {};

const BusinessEvent = (props: Props) => {
  const [actionId, setActionId] = useState(null);
  const [mode, setMode] = useState("New");
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/messaging/businessevent/search"
  );
  const [apiUrl, setapiUrl] = useState(
    Config.prefixUrl + "/messaging/businessevent"
  );
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const handleEdit = (value) => {
    formik.setFieldValue("xml", value.xml);
    setMode("Edit");
    setActionId(value.id);
    formik.setFieldValue("name", value.name);
    formik.setFieldValue("company", value.company);
    formik.setFieldValue("type", value.type);
    formik.setFieldValue("script", value.script);
    formik.setFieldValue("isActive", value.isActive);
    setOpen(true);
  };

  const handleDelete = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await callApi(
        Config.prefixUrl + "/messaging/businessevent/" + id,
        "DELETE"
      );
      setFetch(true);
      setOpen(false);
      toast.success("Data has been deleted!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Active",
        dataIndex: "isActive",
        render: (row, record) => {
          return <>{record.isActive === 1 ? "Yes" : "No"}</>;
        },
      },

      {
        title: "Script",
        dataIndex: "script",
        render: (row, record) => {
          return (
            <CodeEditor
              value={record.script}
              data-color-mode="dark"
              language="js"
              readOnly
              placeholder="Your javascript code will appear here"
              // style={{ height: "100%" }}
              style={{
                height: "100%",
                minWidth: "250px",
                maxHeight: "200px",
                fontSize: 12,
                // backgroundColor: "#ddd",
                overflowY: "auto",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
            />
          );
        },
      },

      {
        title: "Action",
        key: "action",
        render: (row) => {
          return (
            <Space size="middle">
              <div
                onClick={() => {
                  handleEdit(row);
                }}
                className="clickable"
              >
                <span title="Edit">
                  {" "}
                  <EditOutlined />
                </span>
              </div>

              <Popconfirm
                title={<span className="ms-2">Delete the task</span>}
                description={
                  <span className="ms-2">
                    Are you sure to delete this data?
                  </span>
                }
                placement="topLeft"
                okText="Yes"
                cancelText="No"
                icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
                onConfirm={() => {
                  handleDelete(row.id);
                }}
              >
                <span title="Delete" className="clickable">
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    []
  );
  const searchSection = "";

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    company: Yup.string().required("This field is required"),
    script: Yup.string().required("This field is required"),
  });

  const handleSubmit = useCallback(
    async (value, setSubmitting) => {
      setIsLoading(true);
      try {
        if (mode === "New") {
          await callApi(
            Config.prefixUrl + "/messaging/businessevent",
            "POST",
            value
          );
          toast.success("New data has been added!");
        } else {
          await callApi(
            Config.prefixUrl + "/messaging/businessevent/" + actionId,
            "PUT",
            value
          );
          toast.success("New data has been edited!");
        }
        setFetch(true);
        setOpen(false);
      } catch (error) {
        toast.error("Something went wrong!");
      }
      setSubmitting(false);
      setIsLoading(false);
    },
    [mode, actionId]
  );

  const formik = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      name: "",
      company: "",
      type: "Javascript",
      xml: "",
      isActive: 1,
      script: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

  const showModalNew = () => {
    setMode("New");
    formik.resetForm();
    setIsLoading(false);
    setOpen(true);
  };
  return (
    <>
      <Toaster />
      <BusinessEventModal
        mode={mode}
        isLoading={isLoading}
        open={open}
        setOpen={setOpen}
        formik={formik}
      />
      <TableAntd
        title="Business Event"
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
    </>
  );
};

export default BusinessEvent;
