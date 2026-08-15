import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./PasswordInput.css";

function PasswordInput({ value, onChange, required = false, placeholder }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="password-input-wrapper">
      <input
        type={visivel ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisivel(!visivel)}
        tabIndex={-1}
      >
        {visivel ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default PasswordInput;