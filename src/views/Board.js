import axios from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../constant";
import { useTimer } from "react-timer-hook";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Board() {
  const [BTCPrice, setBTCPrice] = useState(0);
  const [startPrice, setStartPrice] = useState(0);
  const [isUp, setIsUp] = useState(0);
  const [score, setScore] = useState(0);
  const time = new Date();

  const { seconds, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      checkResult();
    },
  });

  const checkResult = async () => {
    const currentPrice = await getBTCPrice();
    setBTCPrice(currentPrice);
    if (isUp !== 0) {
      if (
        (isUp === 1 && currentPrice > startPrice) ||
        (!isUp === -1 && currentPrice < startPrice)
      ) {
        toast.success("You won!");
        setScore(score + 1);
      } else {
        toast.error("You lost!");
        setScore(score - 1);
      }
    }
    setStartPrice(0);
    setTimeout(() => {
        setIsUp(0);
    }, 1000);
  };

  const guess = (up) => {
    setIsUp(up);
    const time = new Date();
    time.setSeconds(time.getSeconds() + 6);
    restart(time);
    setStartPrice(BTCPrice);
  };

  const getBTCPrice = async () => {
    const result = await axios.get(api.BTCPriceAPI);
    return result.data.price;
  };

  const getScore = async () => {
    return 10;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      setBTCPrice(await getBTCPrice());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onLoad = async () => {
      setScore(await getScore());
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="board">
      <div style={{ margin: "8rem 10rem" }}>
        <div style={{ fontSize: "4rem" }}>Your Score: {score}</div>
        <div style={{ fontSize: "3rem", marginTop: "40px" }}>
          Guess:
          <button className="guessBtn" onClick={() => guess(1)} disabled={isUp !== 0}>
            Up
          </button>
          <button className="guessBtn" onClick={() => guess(-1)} disabled={isUp !== 0}>
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
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
