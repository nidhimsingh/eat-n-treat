import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";

import OrderIns from "./OrderIns";

function Chatbotcomp(props) {
  let [showChat, setShowChat] = useState(false);

  const startChat = () => setShowChat(true);
  const hideChat = () => setShowChat(false);

  return (
    <>
      {!props.disabled ? (
        <>
          <div
            style={{
              marginTop: "70px",
              position: "fixed",
              zIndex: 100,
              padding: "5px",
              bottom: "10px",
              right: "23px",
              marginRight: "50px",
              display: showChat ? "block" : "none",
            }}
          >
            <ChatBot
              steps={[
                {
                  id: "1",
                  message: "Hello welcome to Eat and Treat How can i help you?",
                  trigger: "2",
                },
                {
                  id: "2",
                  options: [
                    {
                      value: 1,
                      label: "Delivery related questions",
                      trigger: "3",
                    },
                    { value: 2, label: "how to place order", trigger: "5" },
                    {
                      value: 3,
                      label: "return/refund isssue",
                      trigger: "hotels",
                    },
                  ],
                },
                {
                  id: "3",
                  options: [
                    {
                      value: 1,
                      label: "Order not yet Delivered",
                      trigger: "4",
                    },
                    {
                      value: 2,
                      label: "Contact Delivery patter",
                      trigger: "delPart",
                    },
                    { value: 3, label: "Track the order", trigger: "4" },
                  ],
                },
                {
                  id: "5",
                  component: <OrderIns />,
                  trigger: "2",
                  end: false,
                },
                {
                  id: "hotels",
                  options: [
                    {
                      value: 1,
                      label: "Different Food items recieved",
                      trigger: "different",
                    },
                    {
                      value: 2,
                      label: "Order not recieved on time",
                      trigger: "lateDelivery",
                    },
                    {
                      value: 3,
                      label: "Food spilled out  through the wrapper of order",
                      trigger: "food",
                    },
                  ],

                  end: false,
                },
                {
                  id: "food",
                  message:
                    "Apologise for your inconvinience,you can mail images to EatNTreat@gmail.com our Agent will contact you as soon as possible",
                  trigger: "2",
                  end: false,
                },
                {
                  id: "different",
                  message:
                    "Apologise for your inconvinience,you can mail images to EatNTreat@gmail.com our Agent will contact you as soon as possible",
                  trigger: "2",
                  end: false,
                },
                {
                  id: "lateDelivery",
                  message:
                    "We uderstand your concern,you can rate your delivery service, next time we will take care of delivery on time",
                  trigger: "2",
                  end: false,
                },

                {
                  id: "4",
                  message: "Kindly wait our delivery partners are on the way",
                  trigger: "2",
                  end: false,
                },
                {
                  id: "delPart",
                  message:
                    "We understand your concern kindly wait once order is dispatached we wil let you know details of delivery partner",
                  trigger: "2",
                  end: false,
                },
              ]}
            />
          </div>
          <div style={{ position: "fixed", zIndex: 10, float: "right" }}>
            {!showChat ? (
              <button
                className="open-button"
                onClick={() => {
                  startChat();
                }}
              >
                <img
                  src="https://img.icons8.com/ios/50/000000/bot.png"
                  style={{ zIndex: 10 }}
                />
              </button>
            ) : (
              <button
                className="close-button"
                onClick={() => {
                  hideChat();
                }}
              >
                <img
                  src="https://img.icons8.com/ios/50/000000/bot.png"
                  style={{ zIndex: 10 }}
                />
              </button>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Chatbotcomp;
