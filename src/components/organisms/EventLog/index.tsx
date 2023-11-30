import { useCallback, useMemo, useState } from "react";
// @ts-ignore
import * as Utils from "@intellinum/flexa-util";
import CodeEditor from "@uiw/react-textarea-code-editor";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
const { ModalDraggable, Config, callApi, TableAntd } = Utils;
type Props = {};

const EventLog = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/messaging/transactionhistory/search"
  );
  const [apiUrl, setapiUrl] = useState(
    Config.prefixUrl + "/messaging/transactionhistory"
  );
  const [tableLoading, setTableLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Business Event",
        render: (row, record) => {
          return record.businessEvent.name;
        },
      },
      {
        title: "Workflow",
        render: (row, record) => {
          return record.businessEvent.workflow.name;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (row) => {
          return row == 1 ? "Success" : "Error";
        },
      },
      {
        title: "Message",
        dataIndex: "message",
      },
      {
        title: "Executed At",
        render: (row, record) => {
          return moment(record.creationDate).format("YYYY-MM-DD h:i:s");
        },
      },

      {
        title: "Active",
        dataIndex: "isActive",
        render: (row, record) => {
          return <>{record.isActive === 1 ? "Yes" : "No"}</>;
        },
      },
    ],
    []
  );
  const searchSection = "";

  return (
    <>
      <Toaster />

      <TableAntd
        title="Event Log"
        loading={tableLoading}
        setLoading={setTableLoading}
        columns={columns}
        searchUrl={searchUrl}
        useCard={true}
        apiUrl={apiUrl}
        readonly={true}
        targetNew="#dataModal"
        targetEdit="#dataModal"
        searchSection={searchSection}
        fetch={fetch}
        setFetch={setFetch}
      />
    </>
  );
};

export default EventLog;
