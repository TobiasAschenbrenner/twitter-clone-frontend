import EmailForm from "./emailform";

const ResetPassword = () => {
  const token = undefined;

  if (token) {
    return <></>;
  } else {
    return <EmailForm />;
  }
};

export default ResetPassword;
