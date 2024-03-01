import { Button, Card, Col, Form, message, Row, Input, Spin } from "antd";
import React, { useCallback, useState, useEffect } from "react";
// @ts-ignore
import { Config, callApi } from "@intellinum/flexa-util";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";

const CompanyVision = () => {
  const apiUrl = Config.prefixUrl + "/common/company";
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    vision: "",
    ethic: "",
    goal: "",
  });

  // Gunakan useEffect untuk mengisi ulang nilai textarea saat komponen dimuat
  useEffect(() => {
    const flexaAuth = JSON.parse(localStorage.getItem("flexa_auth")) || {};
    const { company } = flexaAuth;
    setInitialValues({
      vision: company.vision || "",
      goal: company.goal || "",
      ethic: company.ethic || "",
    });
  }, []);

  const handleSubmit = useCallback(
    async (val) => {
      setIsLoading(true);
      const flexaAuth = JSON.parse(localStorage.getItem("flexa_auth")) || {};

      const { company } = flexaAuth;
      const payload = {
        ...company,
        vision: val.vision,
        goal: val.goal,
        ethic: val.ethic,
      };
      try {
        await callApi(`${apiUrl}/${company.id}`, "PUT", payload);
        toast.success("Success updated data!");
        localStorage.setItem(
          "flexa_auth",
          JSON.stringify({ ...flexaAuth, company: payload })
        );
      } catch (error) {
        toast.error("Something went wrong!");
      }

      setIsLoading(false);
    },
    [apiUrl]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <Spin spinning={isLoading}>
      <Toaster />

      <Card
        style={{
          padding: 20,
        }}
        title="Company Vision"
      >
        <form
          name="basic"
          style={{ width: "100%", height: "100%" }}
          onSubmit={formik.handleSubmit}
        >
          <Form.Item>
            <label
              htmlFor="vision"
              style={{ display: "block", padding: "7px" }}
            >
              Vision :
            </label>
            <Input.TextArea
              rows={4}
              id="vision"
              name="vision"
              value={formik.values.vision}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item>
            <label htmlFor="goal" style={{ display: "block", padding: "7px" }}>
              Goal :
            </label>
            <Input.TextArea
              rows={4}
              id="goal"
              name="goal"
              value={formik.values.goal}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item>
            <label htmlFor="ethic" style={{ display: "block", padding: "7px" }}>
              Ethic :
            </label>
            <Input.TextArea
              rows={4}
              id="ethic"
              name="ethic"
              value={formik.values.ethic}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <div style={{ textAlign: "end" }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </form>
      </Card>
    </Spin>
  );
};

export default CompanyVision;
