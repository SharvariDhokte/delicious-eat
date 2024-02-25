import React, { useEffect, useState } from "react";
import { Layout, Typography, theme, Card, Avatar, List, Rate } from "antd";
import { db } from "./firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { CloseOutlined } from "@ant-design/icons";
import { average } from "average-rating";
import RateUs from "./RateUs";
const { Header, Content, Footer } = Layout;

const getRateCount = (array) => {
  return array.map((i) => Number(i));
};

const App = (props) => {
  const { selected, onClose, user } = props;
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateMenu, setRateMenu] = useState();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [rlist, setrlist] = useState();

  useEffect(() => {
    if (selected?.id) {
      const citiesRef = collection(db, "Menu");
      const q = query(citiesRef, where("rId", "==", selected?.id));
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          ratingCount: getRateCount(doc.data()?.ratingCount || []),
        }));
        setrlist(data);
      });
    }
  }, [selected]);

  const onRateUs =(item)=>{
    setRateMenu(item)
    setRateModalOpen(true)
  }

  return (
    <>
      {rateModalOpen && (
        <RateUs
          rateModalOpen={rateModalOpen}
          setRateModalOpen={setRateModalOpen}
          resDetails={selected}
          user={user}
          menuDetails={rateMenu}
          setMenuDetails={setRateMenu}
        />
      )}
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CloseOutlined
            style={{ color: "white", fontSize: 30 }}
            onClick={onClose}
          />
          <Typography.Title style={{ color: "white" }}>
            {selected?.name}
          </Typography.Title>
        </Header>
        <Content
          style={{
            padding: "0 48px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 380,
              marginTop: 20,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Typography.Title style={{ fontSize: 16 }}>Menu</Typography.Title>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={rlist}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src={item?.url} />}
                  >
                    <Card.Meta
                      avatar={
                        <Avatar
                          size={50}
                          shape="square"
                          src={selected?.photo}
                        />
                      }
                      title={item.name}
                      description={<Rate disabled allowHalf defaultValue={average(
                        item.ratingCount ? item.ratingCount : [1, 1, 1, 1, 5]
                      )} />}
                    />
                    <Typography.Text style={{ marginTop: 20, fontWeight: 200 }}>
                      Visited?{" "}
                      <Typography.Link onClick={() => onRateUs(item)}>
                        Rate now
                      </Typography.Link>{" "}
                      and snag an exciting discount on your first order! Hurry!
                    </Typography.Text>
                  </Card>
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
      </Layout>
    </>
  );
};
export default App;
