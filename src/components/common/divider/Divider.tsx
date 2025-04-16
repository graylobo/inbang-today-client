import React from "react";
import styles from "./Divider.module.scss";

interface DividerProps {
  className?: string;
  variant?: "default" | "thick" | "thin";
  marginY?: string | number;
}

const Divider: React.FC<DividerProps> = ({
  className = "",
  variant = "default",
  marginY = "1rem",
}) => {
  const style = {
    marginTop: marginY,
    marginBottom: marginY,
  };

  return (
    <hr
      className={`${styles.divider} ${styles[variant]} ${className}`}
      style={style}
    />
  );
};

export default Divider;
