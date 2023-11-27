import { useMemo, useState } from "react";
import { WorkflowModal } from "../../moleculs";
import moment from "moment";
import { Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AiOutlineQuestionCircle } from "react-icons/ai";
// @ts-ignore
import * as Utils from "@intellinum/flexa-util";
import { useFormik } from "formik";
const { ModalDraggable, Config, callApi, TableAntd } = Utils;
type Props = {};

const Workflow = (props: Props) => {
  const [userId, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/common/company/"
  );
  const [apiUrl, setapiUrl] = useState(Config.prefixUrl + "/common/");
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const handleEdit = (id) => {};
  const handleDelete = (id) => {};
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
        title: "Program language",
        dataIndex: "address",
      },
      {
        title: "Script",
        dataIndex: "script",
      },

      {
        title: "Action",
        key: "action",
        render: (row) => (
          <Space size="middle">
            <div
              onClick={() => {
                handleEdit(row);
              }}
            >
              <span title="Edit">
                {" "}
                <EditOutlined />
              </span>
            </div>
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
              <span title="Delete" style={{ cursor: "pointer" }}>
                <DeleteOutlined />
              </span>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, handleEdit]
  );
  const searchSection = "";
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });
  const showModalNew = () => {
    setMode("new");
    formik.resetForm();
    setIsLoading(false);
    setOpen(true);
  };
  return (
    <>
      <WorkflowModal open={open} setOpen={setOpen} formik={formik} />
      <TableAntd
        title="Company"
        columns={columns}
        searchUrl={searchUrl}
        loading={tableLoading}
        setLoading={setTableLoading}
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

export default Workflow;
