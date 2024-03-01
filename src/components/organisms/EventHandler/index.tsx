import { CaretRightOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Collapse,
  Empty,
  Input,
  Pagination,
  Row,
  Spin,
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CollapseEvent } from "../../moleculs";

// @ts-ignore
import * as Utils from "@intellinum/flexa-util";
import toast, { Toaster } from "react-hot-toast";
const { Config, callApi } = Utils;
type Props = {};

const EventHandler = (props: Props) => {
  const [dataSource, setDataSource] = useState([]);
  const [activePagination, setActivePagination] = useState({
    page: 1,
    totalPage: 0,
    totalData: 0,
    size: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(
    Config.prefixUrl + "/messaging/businessevent"
  );
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/messaging/businessevent/search"
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    initData(1, 10);
  }, [searchValue]);

  const initData = useCallback(
    async (pageNumber = 1, size = 10) => {
      pageNumber = pageNumber - 1;
      const company = user.company.id;
      setIsLoading(true);
      let url = "";
      if (searchValue) {
        url = searchUrl.includes("?") ? searchUrl + "&" : searchUrl + "?";
        url += `value=${searchValue}&company=${
          company || "-1"
        }&pageNumber=${pageNumber}&size=${size}`;
      } else {
        url = apiUrl.includes("?") ? apiUrl + "&" : apiUrl + "?";
        url += `pageNumber=${pageNumber}&size=${size}&company=${
          company || "-1"
        }`;
      }
      console.log(url);
      try {
        const result = await callApi(url, "GET");
        setActivePagination({
          page: pageNumber + 1,
          totalPage: result.data.totalPages,
          totalData: result.data.totalElements,
          size: result.data.size,
        });
        setDataSource(result.data.content);
      } catch (error) {}
      setIsLoading(false);
    },
    [searchValue, searchUrl]
  );

  const handlePlay = useCallback(async (req) => {
    const company = user?.company?.id || "-1";

    setIsLoading(true);
    let payload = {
      businessEvent: req,
      status: "1",
      message: "",
      company,
    };
    try {
      eval(req.workflow.script);
    } catch (e) {
      payload = { ...payload, status: "0", message: String(e) };
    }
    try {
      await callApi(
        Config.prefixUrl + "/messaging/transactionhistory",
        "POST",
        payload
      );
    } catch (error) {
      toast.success("Error when create log");
    }

    setIsLoading(false);
  }, []);

  const items = useMemo(() => {
    const panelStyle = {
      marginBottom: 16,
      background: "white",
      borderRadius: "8px",
      border: "1px solid lightgray",
    };
    return dataSource.map((r: any, i: number) => {
      return {
        key: Math.random() + i,
        label: (
          <>
            <Typography.Title level={4}>{r.name}</Typography.Title>
          </>
        ),
        children: (
          <CollapseEvent
            workflow={r.workflow}
            onPlay={() => {
              handlePlay(r);
            }}
          />
        ),
        style: panelStyle,
      };
    });
  }, [dataSource]);

  return (
    <>
      <Toaster />

      <Spin spinning={isLoading}>
        <Card title="Event Handler">
          <div className="mb-4 ">
            <Row>
              <Col xs={24} md={12}>
                <Input.Search
                  placeholder="input search text"
                  allowClear
                  enterButton="Search"
                  onSearch={(val) => {
                    setSearchValue(val);
                  }}
                  size="middle"
                />
              </Col>
            </Row>
          </div>
          {dataSource.length === 0 ? (
            <div
              className="flex justify-center my-6"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <Empty />
              </div>
            </div>
          ) : (
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined
                  rotate={isActive ? 90 : 0}
                  className="mt-3"
                />
              )}
              // style={{
              //   background: token.colorBgContainer,
              // }}
              items={items}
            />
          )}

          <div className="d-flex justify-content-end">
            <Pagination
              current={activePagination.page}
              total={activePagination.totalData}
              pageSize={activePagination.size}
              onChange={(page, size) => {
                initData(page);
              }}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            />
          </div>
        </Card>
      </Spin>
    </>
  );
};

export default EventHandler;
