import React, { useEffect, useState } from "react";
import { Modal, Rate, Typography, message } from "antd";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

const updateRatingCount = (rating, ratingCount, oldRatingCount) => {
  if (oldRatingCount) {
    const decreaseOldCount = ratingCount?.map((i, index) =>
      index === Number(oldRatingCount) - 1 ? String(i - 1) : String(i)
    );
    return decreaseOldCount?.map((i, index) =>
      index === rating - 1 ? String(++i) : String(i)
    );
  }
  return ratingCount?.map((i, index) =>
    index === rating - 1 ? String(++i) : String(i)
  );
};

const App = (props) => {
  const {
    rateModalOpen,
    setRateModalOpen,
    resDetails,
    user,
    menuDetails,
    setResDetails,
    setMenuDetails,
  } = props;

  const [rating, setRating] = useState();
  const [myCode, setMyCode] = useState();
  const [oldComment, setOldComment] = useState();

  useEffect(() => {
    const citiesRef = collection(db, "Review");
    const q = menuDetails
      ? query(
          citiesRef,
          where("rId", "==", resDetails?.id),
          where("mId", "==", menuDetails?.id),
          where("userId", "==", user?.email)
        )
      : query(
          citiesRef,
          where("rId", "==", resDetails?.id),
          where("userId", "==", user?.email)
        );
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRating(data[0]?.rating);
      setOldComment(data[0]);
    });
     
      
  }, [menuDetails, resDetails?.id, user?.email]);

  const handleOk = async () => {
    if (myCode) {
      setRateModalOpen(false);
    } else {
      if (oldComment) {
        const commentRef = doc(db, "Review", oldComment?.id);
        await updateDoc(commentRef, {
          ...oldComment,
          rating,
        });
        setRateModalOpen(false);
        if (menuDetails) {
          const menuRef = doc(db, "Menu", menuDetails?.id);
          const ratingCount = updateRatingCount(
            rating,
            menuDetails.ratingCount,
            oldComment?.rating
          );
          setMenuDetails({
            ...menuDetails,
            ratingCount,
          });
          await updateDoc(menuRef, {
            ...menuDetails,
            ratingCount,
          });
        } else {
          const rRef = doc(db, "Restaurants", resDetails?.id);
          const ratingCount = updateRatingCount(
            rating,
            resDetails.ratingCount,
            oldComment?.rating
          );
          setResDetails({
            ...resDetails,
            ratingCount,
          });
          await updateDoc(rRef, {
            ...resDetails,
            ratingCount,
          });
        }
        message.success(
          "Rating is updated! We hope that you used your coupan!"
        );
      } else {
        const coupan = (Math.random() + 1).toString(36).substring(7);
        const myCollection = collection(db, "Review");
        addDoc(myCollection, {
          coupon: coupan,
          mId: menuDetails ? menuDetails?.id : "",
          rId: resDetails.id,
          rating: rating,
          userId: user.email,
        });
        if (menuDetails) {
          const menuRef = doc(db, "Menu", menuDetails?.id);
          const ratingCount = updateRatingCount(
            rating,
            menuDetails.ratingCount
          );
          setMenuDetails({
            ...menuDetails,
            ratingCount,
          });
          await updateDoc(menuRef, {
            ...menuDetails,
            ratingCount,
          });
        } else {
          const rRef = doc(db, "Restaurants", resDetails?.id);
          const ratingCount = updateRatingCount(rating, resDetails.ratingCount);
          setResDetails({
            ...resDetails,
            ratingCount,
          });
          await updateDoc(rRef, {
            ...resDetails,
            ratingCount,
          });
        }
        setMyCode(coupan);
      }
    }
  };
  const handleCancel = () => {
    setRateModalOpen(false);
  };

  return (
    <>
      <Modal
        title={menuDetails ? menuDetails?.name : resDetails.name}
        open={rateModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={myCode ? "Ok" : "Rate"}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {myCode ? (
            <Typography.Text
              style={{ marginBottom: 20 }}
            >{`here is your code!!! ${myCode}`}</Typography.Text>
          ) : (
            <>
              <Typography.Text
                style={{ marginBottom: 20 }}
              >{`You are rating as ${user.email}`}</Typography.Text>
              <Rate value={rating} onChange={(value) => setRating(value)} />
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
export default App;
