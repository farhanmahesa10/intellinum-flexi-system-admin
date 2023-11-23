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
import { TabMenu } from "./components/pages";
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
  //
  return (
    <PageLayout
      navigate={navigate}
      pageContent={
        <>
          <Routes>
            <Route path="/system/:activetab" element={<TabMenu />} />
          </Routes>
        </>
      }
    />
  );
};
