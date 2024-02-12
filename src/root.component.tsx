//@ts-ignore
import { PageLayout, themeToken } from "@intellinum/flexa-util";
import { ConfigProvider, Layout, Space } from "antd";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Custom, TabMenu } from "./components/pages";
import "./app.css";
import Blockly from "./components/pages/Blockly";
import { useEffect, useState } from "react";
export default function Root(props) {
  return (
    <ConfigProvider theme={{ token: themeToken }}>
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  );
}
const { Header, Footer, Sider, Content } = Layout;
const App = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const current = useLocation();
  useEffect(() => {
    if (current.pathname == "/system") {
      setLocation([]);
    } else {
      setLocation([
        {
          title: "Home",
          href: "/",
        },
        {
          title: "System",
          href: "/system/menu",
        },
        {
          title: `${capitalizeFirstLetter(getUrl(current.pathname))}`,
          href: `${current.pathname}`,
        },
      ]);
    }
  }, [current]);
  const getUrl = (input) => {
    const str = input;
    const regex = /\/([^/]+)\/([^/]+)/;
    const match = str.match(regex);

    if (match && match.length >= 3) {
      const valueAfterSecondSlash = match[2];
      return valueAfterSecondSlash;
    }
  };
  const capitalizeFirstLetter = (word) => {
    if (typeof word !== "string" || word.length === 0) {
      return "";
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const showLocation = (value) => {
    setLocation([
      {
        title: "Home",
        href: "/",
      },
      {
        title: "System",
        href: "/offline/menu",
      },
      {
        title: `${capitalizeFirstLetter(value)}`,
        href: `/system/${value}`,
      },
    ]);
  };
  return (
    <PageLayout
      navigate={navigate}
      location={location}
      pageContent={
        <>
          <Routes>
            <Route
              path="/system/:activetab"
              element={<TabMenu location={showLocation} />}
            />
            <Route path="/system/blockly" element={<Blockly />} />
            <Route path="/system/custom" element={<Custom />} />
          </Routes>
        </>
      }
    />
  );
};
