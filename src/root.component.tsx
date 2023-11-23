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
          <Layout>
            <Content style={{ minHeight: 280 }}>
              <Routes>
                <Route
                  path="/system/company-vision"
                  element={<>This is company vision flexa admin system</>}
                />
              </Routes>
            </Content>
          </Layout>
        </>
      }
    />
  );
};
