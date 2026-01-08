import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordInput({ value, onChange, placeholder = "Mật khẩu", readOnly = false, className = "form-control" }) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(prev => !prev);

  return (
    <div className="input-group mb-3">
      {/* Icon trái */}
      <span className="input-group-text">
        <FaLock />
      </span>

      {/* Input */}
      <input
        type={show ? "text" : "password"}
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {/* Icon ẩn/hiện */}
      <span
        className="input-group-text"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={toggleShow}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}

export default PasswordInput;
