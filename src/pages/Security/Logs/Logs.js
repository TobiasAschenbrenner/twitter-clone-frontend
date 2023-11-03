import { useState, useEffect } from "react";
import Container from "../Container";
import { API_BASE_URL } from "../../../config";
import { Authentication } from "../../../utils/Authentication";
import { useNavigate } from "react-router-dom";

const LogsPage = () => {
    const [logs, setLogs] = useState(undefined)
    const navigate = useNavigate();

    
    const fetchLogs = async () => {
        const jwt = await Authentication.getInstance().getJwt();
        if (!jwt) navigate("/");
        fetch(`${API_BASE_URL}/v1/auth/logs`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then(res => res.json())
            .then(data => setLogs(data))
        // we're not gonna catch because i can't think of any way to make this code worse
    }

    const handleInvalidateSession = async (session_id) => {
        const jwt = await Authentication.getInstance().getJwt();
        if (!jwt) navigate("/");
        fetch(`${API_BASE_URL}/v1/auth/signout/${session_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    const actionNames = {
        "register": "Account registered",
        "login": "User logged in",
        "change_password": "Password changed",
        "request_password_reset": "Password reset requested",
        "change_username": "Username changed",
        "change_email": "Email changed",
        "close_session": "Session closed",
        "close_all_sessions": "All sessions closed",
    }

    if (logs === undefined) {
        return (
            <Container>
                <h1>Loading logs.</h1>
            </Container>
        )
    } else {
        return (
            <Container>
                <h1>Logs</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Timestamp</th>
                            <th>IP</th>
                            <th>Deactivate</th>
                            <th>Session ID</th>
                            <th>Auth ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{actionNames[log.action] || log.action}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.ip}</td>
                                <td>
                                    {log.session_active ?

                                        <button onClick={() => handleInvalidateSession(log.session_id)}>Deactivate session</button>
                                        : "Deactivated"
                                    }
                                </td>
                                <td>{log.session_id || "-"}</td>
                                <td>{log.auth_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Container>
        );
    }
};

export default LogsPage;
