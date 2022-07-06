import React from "react";
import "./box.css";

const Box = ({ item, onClick }) => {
  return (
    <div className="box" onClick={onClick}>
      {item}
    </div>
  );
};

export default Box;
