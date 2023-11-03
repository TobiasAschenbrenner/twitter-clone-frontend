import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { Authentication } from "./Authentication";

const ValidateToken = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateJwt = async () => {
      const jwt = await Authentication.getInstance().getJwt();

      if (!jwt) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/v1/auth/whoami`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (response.status === 200) {
          setIsValid(true);
        } else {
          localStorage.removeItem("jwt");
          navigate("/");
        }
      } catch (error) {
        console.error("Error validating JWT:", error);
      } finally {
        setLoading(false);
      }
    };

    validateJwt();
  }, [navigate]);

  return loading ? <div>Loading...</div> : isValid ? children : null;
};

export default ValidateToken;
