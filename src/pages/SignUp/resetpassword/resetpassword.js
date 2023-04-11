import EmailForm from "./emailform";
import PasswordForm from "./passwordform";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    return <PasswordForm token={token} />;
  } else {
    return <EmailForm />;
  }
};

export default ResetPassword;
