import { useEffect, useState } from 'react';
import Container from '../Container';
import { API_BASE_URL } from '../../../config';
import { useNavigate } from 'react-router-dom';
import { Authentication } from '../../../utils/Authentication';
const id = require('uuid-readable')

const SessionsPage = () => {
    const [sessions, setSessions] = useState(undefined)
    const navigate = useNavigate();

    const fetchSessions = async () => {
        const jwt = await Authentication.getInstance().getJwt();
        if (!jwt) navigate("/");
        fetch(`${API_BASE_URL}/v1/auth/sessions`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then(res => res.json())
            .then(data => setSessions(data))
        // we're not gonna catch because i can't think of any way to make this code worse
    }

    const handleInvalidateSession = async (session_id) => {
        const jwt = await Authentication.getInstance().getJwt();
        if (!jwt) navigate("/");
        setSessions((current) => current.filter(session => session.session_id !== session_id))
        fetch(`${API_BASE_URL}/v1/auth/signout/${session_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
    }

    const daysTillExpiration = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)) + 28;

    useEffect(() => {
        fetchSessions()
    }, [])

    if (sessions === undefined) {
        return (
            <Container>
                <h1>Loading sessions.</h1>
            </Container>
        )
    } else {
        return (
            <Container>
                <h1>Sessions</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>Last IP</th>
                            <th>Last Used</th>
                            <th>Created</th>
                            <th>Deactivate</th>
                            <th>Expires in</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(session => (
                            <tr key={session.session_id}>
                                <td>{id.short(session.session_id)}</td>
                                <td>{session.last_ip}</td>
                                <td>{new Date(session.last_used).toLocaleString()}</td>
                                <td>{new Date(session.created_at).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleInvalidateSession(session.session_id)}>{session.is_self ? "Sign out" : "🗑"}</button>
                                </td>
                                <td>
                                    {daysTillExpiration(session.created_at)} days
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Container>
        );
    }
};

export default SessionsPage;
