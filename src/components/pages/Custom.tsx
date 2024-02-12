import { Select, Button, Form, Input, message, Space, Spin } from "antd";
import { useState } from "react";
import axios from "axios";
import { callApi } from "../../config/callApi";
import { Config } from "../../config/config";

const Custom = () => {
  const [loading, setLoading] = useState(false);
  const [loadNumber, setLoadNumber] = useState("");
  const [apiUrl, setApiUrl] = useState(
    Config.prefixUrl + "/integration/load_print"
  );

  const onFinish = async (value) => {
    setLoading(true);
    message.info("Validating...");
    const body = {
      loadNumber: value.loadNumber,
    };
    await callApi(apiUrl, "POST", body)
      .then((res) => message.success("Success"))
      .catch((error) => {
        message.error(error.response.data.error, 7);
        console.log(error);
      });
    setLoading(false);
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      {loading ? (
        <div
          className="flex justify-center my-6"
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "84vh",
            alignItems: "center",
          }}
        >
          <div>
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <Form
          name="basic"
          wrapperCol={{ flex: 1 }}
          labelCol={{ flex: "110px" }}
          style={{
            width: 600,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="Load Number" name="loadNumber">
            <Input
              id="loadNumber"
              defaultValue={loadNumber}
              type="text"
              disabled={loading}
              placeholder="Input Load Number"
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <Space size="middle">
              <Button type="primary" htmlType="submit" disabled={loading}>
                {!loading && <span className="indicator-label"> Print </span>}
                {loading && (
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
      )}
    </div>
  );
};

export default Custom;
