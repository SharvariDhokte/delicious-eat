import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  theme,
  List,
  Rate,
  Image,
  Row,
  Modal,
  FloatButton,
  Drawer,
} from "antd";
import { db } from "./firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import MenuList from "./MenuList";
import Login from "./Login";
import { average } from "average-rating";
import RateUs from "./RateUs";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { WechatOutlined } from "@ant-design/icons";
import ActionProvider from "./chatbot/ActionProvider";
import MessageParser from "./chatbot/MessageParser";
import config from "./chatbot/config";
const { Header, Content, Footer } = Layout;

const getRateCount = (array) => {
  return array.map((i) => Number(i));
};

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [currentScreen, setCurrentScreen] = useState();
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState();
  const [openChatbot, setOpenChatbot] = useState(false);

  const [rlist, setrlist] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState();
  const [modal, contextHolder] = Modal.useModal();

  const showChatbot = () => {
    setOpenChatbot(true);
  };
  const closChatbot = () => {
    setOpenChatbot(false);
  };

  const onRateClick = (item) => {
    setSelectedRes(item);
    if (user) {
      setRateModalOpen(true);
    } else {
      modal.confirm({
        title: "Thank you!",
        content:
          "Thank you for choosing to share your valuable experience and rate our service! To unlock an exclusive offer tailored just for you, please sign in now.",
        onOk: () => {
          setIsModalOpen(true);
        },
      });
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Restaurants"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        ratingCount: getRateCount(doc.data()?.ratingCount || []),
      }));
      console.log("🚀 ~ data ~ data:", data)
      setrlist(data);
    });
  }, []);

  const onClose = () => {
    setCurrentScreen();
  };

  return (
    <>
      {rateModalOpen && (
        <RateUs
          rateModalOpen={rateModalOpen}
          setRateModalOpen={setRateModalOpen}
          setResDetails={setSelectedRes}
          resDetails={selectedRes}
          user={user}
        />
      )}
      {currentScreen ? (
        <MenuList selected={currentScreen} onClose={onClose} user={user} />
      ) : (
        <Layout>
          <Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography.Title style={{ color: "white" }}>
              Delicious Eats
            </Typography.Title>
            <Login
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              user={user}
              setUser={setUser}
            />
          </Header>
          <Content
            style={{
              padding: "0 48px",
            }}
          >
            <Drawer
              title="Basic Drawer"
              onClose={closChatbot}
              open={openChatbot}
              style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center'
              }}
              styles={{
                header:{
                  display:'none'
                },
                footer:{
                  display:'none'
                }
              }}
            >
              
              <Chatbot
                config={config}
                actionProvider={ActionProvider}
                messageParser={MessageParser}
              />
            </Drawer>

            <div
              style={{
                padding: 24,
                minHeight: 380,
                marginTop: 20,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <List
                itemLayout="vertical"
                size="large"
                dataSource={rlist}
                renderItem={(item) => (
                  <List.Item
                    key={item.name}
                    extra={
                      <Rate
                        disabled
                        allowHalf
                        defaultValue={average(
                          item.ratingCount ? item.ratingCount : [5, 4, 3, 3, 2]
                        )}
                      />
                    }
                  >
                    <List.Item.Meta
                      avatar={<Image width={272} alt="logo" src={item.photo} />}
                      title={item.name}
                      description={
                        <Row justify="space-between">
                          {item.description ? (
                            <Typography.Text>
                              {item.description}
                            </Typography.Text>
                          ) : (
                            <Typography.Text
                              style={{ whiteSpace: "pre-line" }}
                            >{`Address: ${item.address}\nEmail: ${
                              item.email || "deliciouseats@gmail.com"
                            }`}</Typography.Text>
                          )}
                          <Typography.Text
                            style={{ marginTop: 20, fontWeight: 200 }}
                          >
                            Visited?{" "}
                            <Typography.Link onClick={() => onRateClick(item)}>
                              Rate now
                            </Typography.Link>{" "}
                            and snag an exciting discount on your first order!
                            Hurry!{" "}
                            <Typography.Link
                              onClick={() => setCurrentScreen(item)}
                            >
                              Discover our menus!
                            </Typography.Link>
                          </Typography.Text>
                        </Row>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            DeliciousFood ©{new Date().getFullYear()} Created by SharvariDhokte
          </Footer>
          <FloatButton
            type="primary"
            style={{ height: "60px", width: "60px" }}
            icon={<WechatOutlined style={{ fontSize: 20 }} />}
            onClick={() => showChatbot()}
          />
          {contextHolder}
        </Layout>
      )}
    </>
  );
};
export default App;
