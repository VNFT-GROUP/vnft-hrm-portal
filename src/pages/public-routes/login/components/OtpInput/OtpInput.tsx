import React, { useRef } from "react";

export default function OtpInput({ length = 6, value, onChange }: { length?: number; value: string; onChange: (v: string) => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpArray = Array(length).fill("");
  value.split('').slice(0, length).forEach((d, i) => {
    otpArray[i] = d;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;

    const newOtp = [...otpArray];
    newOtp[index] = val.slice(-1);
    onChange(newOtp.join(''));

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otpArray];
      newOtp[index] = "";
      onChange(newOtp.join(''));
      if (index > 0 && !otpArray[index]) {
        // move back if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (index > 0 && otpArray[index]) {
        // delete current and stay
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, '').slice(0, length);
    if (!pastedData) return;

    const newOtp = Array(length).fill("");
    pastedData.split('').forEach((d, i) => {
      newOtp[i] = d;
    });
    onChange(newOtp.join(''));

    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="otp-input-group">
      {otpArray.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="otp-box"
          required={i === 0}
        />
      ))}
    </div>
  );
}
