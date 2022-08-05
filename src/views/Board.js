/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../constant";
import { useTimer } from "react-timer-hook";

export default function Board() {
  const [BTCPrice, setBTCPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const [startPrice, setStartPrice] = useState(0);
  const [isUp, setIsUp] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const time = new Date();

  const userScore = useSelector((state) => state?.app?.userScore ?? 0);
  const userName = useSelector((state) => state?.app?.userName ?? "");
  const dispatch = useDispatch();

  const { seconds, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      checkResult();
    },
  });

  const toggleModal = () => {
    if (isOpen) {
      setIsUp(0);
    }
    setIsOpen(!isOpen);
  };

  const checkResult = async () => {
    const currentPrice = await getBTCPrice();
    setEndPrice(currentPrice);
    if (isUp !== 0) {
      if (
        (isUp == 1 && currentPrice >= startPrice) ||
        (!isUp == -1 && currentPrice < startPrice)
      ) {
        axios.post(`${config.BackendBaseURL}/update-score`, {
          name: userName,
          isUp: true,
        });
        dispatch({
          type: "SET_APP",
          payload: (prev = {}) => ({
            ...(prev ?? {}),
            userScore: userScore + 1,
          }),
        });
      } else {
        axios.post(`${config.BackendBaseURL}/update-score`, {
          name: userName,
          isUp: false,
        });
        dispatch({
          type: "SET_APP",
          payload: (prev = {}) => ({
            ...(prev ?? {}),
            userScore: userScore - 1,
          }),
        });
      }
      setIsOpen(true);
    }
  };

  const guess = (up) => {
    setStartPrice(BTCPrice);
    setIsUp(up);
    const time = new Date();
    time.setSeconds(time.getSeconds() + 6);
    restart(time);
  };

  const getBTCPrice = async () => {
    const result = await axios.get(config.BTCPriceAPI);
    return result.data.price;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      setBTCPrice(await getBTCPrice());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="board">
      <div style={{ margin: "8rem 10rem" }}>
        <div style={{ fontSize: "4rem" }}>Your Score: {userScore}</div>
        <div style={{ fontSize: "3rem", marginTop: "40px" }}>
          Guess:
          <button
            className="guessBtn"
            onClick={() => guess(1)}
            disabled={isUp !== 0}
          >
            Up
          </button>
          <button
            className="guessBtn"
            onClick={() => guess(-1)}
            disabled={isUp !== 0}
          >
            Down
          </button>
        </div>
        <div className="price">
          <div>BTC PRICE</div>
          <div className={BTCPrice >= startPrice ? "green" : "red"}>
            {(+BTCPrice).toLocaleString()} USD
          </div>
        </div>
        <div className="timer">Timer: {seconds} sec</div>
        <div className="predict">
          {isUp !== 0 && (
            <>
              Your guess is{" "}
              <label className={isUp > 0 ? "green" : "red"}>
                {isUp > 0 ? "UP" : "DOWN"}
              </label>
            </>
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="Guess Result"
      >
        <div style={{ fontSize: "1.5rem" }}>Guess Result</div>
        {((endPrice > startPrice && isUp == 1) || (endPrice <= startPrice && isUp == -1)) && (
          <div
            className="green result"
          >
            You Won!
          </div>
        )}
        {((endPrice > startPrice && isUp == -1) || (endPrice <= startPrice && isUp == 1)) && (
          <div
            className="red result"
          >
            You Lost!
          </div>
        )}

        <div>Start Price: {(+startPrice).toLocaleString()}</div>
        <div>End Price: {(+endPrice).toLocaleString()}</div>
        <button className="confirm" onClick={toggleModal}>
          Confirm
        </button>
      </Modal>
    </div>
  );
}
