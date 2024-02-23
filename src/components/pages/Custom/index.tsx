import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  Button,
  Form,
  Input,
  message,
  Space,
  Spin,
  Typography,
} from "antd";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Buffer from "buffer";

import { callApi } from "../../../config/callApi";
import { Config } from "../../../config/config";

const Custom = () => {
  const [loading, setLoading] = useState(false);
  const [printerSelect, setPrinterSelect] = useState<
    { value: string; label: string }[]
  >([]);
  const [apiUrl, setApiUrl] = useState(
    Config.prefixUrl + "/integration/load_print"
  );
  const [apiUrlExpress, setApiUrlExpress] = useState(
    Config.expressUrl + "/api/Rest/GetPrinter?AppUserName=admin%40odl.com"
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );

  useEffect(() => {
    fetchPrinter();
  }, []);

  const validationSchema = Yup.object().shape({
    loadNumber: Yup.string().required("Load Number is required"),
    printerName: Yup.string().required("Printer Name is required"),
    copies: Yup.number()
      .required("Copies Number is required")
      .min(1, "Copies must be at least 1")
      .nullable(),
  });

  const handleSubmit = async (values, setSubmitting) => {
    setLoading(true);
    message.info("Validating...");
    try {
      const passwordUser = Buffer.Buffer.from(user.wmsPassword).toString(
        "base64"
      );
      const body = {
        username: user.wmsUser,
        password: passwordUser,
        url: user.wmsUrl,
        email: user.email,
        loadNumber: values.loadNumber,
        printerName: values.printerName,
        copies: values.copies,
      };
      console.log(body);
      await callApi(apiUrl, "POST", body);
      message.success("Success");
    } catch (error) {
      message.error(error.response.data.message, 7);
      console.error(error);
    }
    setLoading(false);
    setSubmitting(false);
  };

  const fetchPrinter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrlExpress, {
        headers: {
          Authorization: Config.token,
        },
      });
      const printers = response.data.map((printer: any) => ({
        value: printer.name,
        label: printer.name,
      }));
      setPrinterSelect(printers);
    } catch (error) {
      console.error("Error fetching printers:", error);
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      loadNumber: "",
      printerName: "",
      copies: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <Form
        name="basic"
        wrapperCol={{ flex: 1 }}
        labelCol={{ flex: "110px" }}
        style={{ width: 600 }}
        onFinish={formik.handleSubmit}
      >
        <Form.Item label="Load Number" name="loadNumber" required>
          <Input
            id="loadNumber"
            disabled={loading}
            {...formik.getFieldProps("loadNumber")}
            placeholder="Input Load Number"
            status={
              formik.touched.loadNumber && formik.errors.loadNumber
                ? "error"
                : null
            }
          />
          {formik.touched.loadNumber && formik.errors.loadNumber ? (
            <Typography.Text type="danger">
              {formik.errors.loadNumber}
            </Typography.Text>
          ) : null}
        </Form.Item>
        <Form.Item label="Printer Name" name="printerName" required>
          <Select
            id="printerName"
            options={printerSelect}
            disabled={loading}
            onChange={(value) => formik.setFieldValue("printerName", value)}
            value={formik.values.printerName}
            placeholder="Select Printer Name"
            status={
              formik.touched.printerName && formik.errors.printerName
                ? "error"
                : null
            }
          />
          {formik.touched.printerName && formik.errors.printerName ? (
            <Typography.Text type="danger">
              {formik.errors.printerName}
            </Typography.Text>
          ) : null}
        </Form.Item>
        <Form.Item label="Copies" name="copies" required>
          <Input
            id="copies"
            type="number"
            disabled={loading}
            {...formik.getFieldProps("copies")}
            placeholder="Input Copies Number"
            status={
              formik.touched.copies && formik.errors.copies ? "error" : null
            }
          />
          {formik.touched.copies && formik.errors.copies ? (
            <Typography.Text type="danger">
              {formik.errors.copies}
            </Typography.Text>
          ) : null}
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
              {!loading ? (
                <span className="indicator-label"> Print </span>
              ) : (
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
    </div>
  );
};

export default Custom;
