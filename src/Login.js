import React from "react";
import { Button, Form, Input, Modal, Typography, message } from "antd";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const App = (props) => {
 const { isModalOpen, setIsModalOpen,user, setUser}= props
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    const { username, password } = values;
    await createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setIsModalOpen(false);
        setUser(user);
        const myCollection = collection(db, 'Users');
      addDoc(myCollection, { email:username });
        message.success('Thank you for coonecting with us!')
      })
      .catch((error) => {
        setIsModalOpen(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        signInWithEmailAndPassword(auth, username, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("🚀 ~ .then ~ user:", user);
            setUser(user);
            message.success('Thank you for coonecting with us!')
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
        // ..
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser();
        alert("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <>
      {user ? (
        <>
          <Typography.Text style={{ color: "white" }}>
            {user.email}
          </Typography.Text>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Button type="primary" onClick={showModal}>
          Sign Up / Log In
        </Button>
      )}

      <Modal
        title="Sign Up / Log In"
        open={isModalOpen}
        onCancel={()=>setIsModalOpen(false)}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default App;
