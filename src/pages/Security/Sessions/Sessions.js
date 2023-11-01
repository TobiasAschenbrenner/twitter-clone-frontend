import { useEffect, useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Container from '../Container';

const SessionsPage = () => {
    const [sessions, setSessions] = useState(undefined)

    const fetchSessions = () => {
        fetch(`https://api.thechirp.de/v1/auth/sessions`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
            .then(res => res.json())
            .then(data => setSessions(data))
        // we're not gonna catch because i can't think of any way to make this code worse
    }

    const handleInvalidateSession = (session_id) => {
        setSessions((current) => current.filter(session => session.session_id !== session_id))
        fetch(`https://api.thechirp.de/v1/auth/signout/${session_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
    }

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
                            <th>Created</th>
                            <th>Deactivate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(session => (
                            <tr key={session.session_id}>
                                <td>{session.session_id}</td>
                                <td>{new Date(session.created_at).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleInvalidateSession(session.session_id)}>{session.is_self ? "Sign out" : "🗑"}</button>
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
