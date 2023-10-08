import { Button as MuiButton, IconButton } from "@mui/material";

interface IButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  content: string;
  icon?: React.ReactNode; 
  onClick?: () => void;
}

const Button = (props: IButtonProps) => {
  const { type, className, content, icon, onClick, ...rest } = props;

  return (
    <MuiButton
      type={type || "button"}
      className={className || "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
      style={{ textTransform: "none" , fontSize: "1rem", backgroundColor: "#1E3A8A", color: "#fff", fontWeight: 400, padding: "0.5rem 1rem", borderRadius: "0.5rem"}}
      onClick={onClick}
      {...rest}
      startIcon={icon && <span className="mr-2">{icon}</span>}
    >
      {content}
    </MuiButton>
  );
};

export default Button;
