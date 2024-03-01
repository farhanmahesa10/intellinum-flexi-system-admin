import { Button, Tabs } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import TabPane from "antd/es/tabs/TabPane";
//@ts-ignore
import { themeToken, useGlobalContext } from "@intellinum/flexa-util";
import { Toaster } from "react-hot-toast";
import { FaDynamicIcons } from "../../atoms";
import {
  BusinessEvent,
  CompanyVision,
  EventHandler,
  EventLog,
  MqttOrg,
  Workflow,
} from "../../organisms";
type Props = {
  isDarkMode: boolean;
  location: any;
};

const TabMenu = (props: any) => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(params.activetab);
  useEffect(() => {
    setActiveTab(params.activetab);
  }, [params.activetab]);
  const callComponent = useCallback(
    (activeTab) => {
      switch (activeTab.split(" ").join("-").toLowerCase()) {
        case "company-vision":
          return <CompanyVision />;
        case "business-event":
          return <BusinessEvent />;
        case "workflow":
          return <Workflow />;
        case "event-handler":
          return <EventHandler />;
        case "event-log":
          return <EventLog />;
        case "mqtt":
          return <MqttOrg />;
        default:
          return "";
      }
    },
    [params.tabmenu]
  );

  const menus = useMemo(() => {
    let userMenu = JSON.parse(localStorage.getItem("userMenu"));
    userMenu = userMenu.find((r) => r.name.toLowerCase() === "system admin");

    const result = userMenu.menu.map((r) => {
      return {
        path: r.menu?.find((res: any, ind: number) => ind === 0)?.path || "/",
        icon: r.icon,
        key: r.path.replace("/system/", "").toLowerCase(),
        label: (
          <span className="d-flex gap-2 align-items-center">
            {r.icon?.startsWith("/assets") ? (
              <img src={r.icon} width={14} />
            ) : (
              <FaDynamicIcons name={r.icon} style={{ color: "#0A2647" }} />
            )}

            <span className="ms-1" style={{ color: "#0A2647" }}>
              {" "}
              {r.name}
            </span>
          </span>
        ),
        children: (
          <>
            <div>
              {callComponent(r.path.replace("/system/", "").toLowerCase())}
            </div>
          </>
        ),
      };
    });
    return result;
  }, [props.isDarkMode]);

  return (
    <div className="card-container">
      <Toaster />
      <Tabs
        activeKey={activeTab}
        // type="card"
        style={{ padding: "0 16px" }}
        onTabClick={(active) => {
          setActiveTab(active);
          props.location(active);
        }}
      >
        {menus.map((r: any, i: number) => {
          return (
            <TabPane
              tab={r.label}
              key={r.key}
              style={{
                backgroundColor: props.isDarkMode
                  ? themeToken.colorDark100
                  : "white",
              }}
            >
              <div className="p-4">{r.children}</div>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default TabMenu;
