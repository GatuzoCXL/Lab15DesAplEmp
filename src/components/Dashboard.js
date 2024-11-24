import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        // Verificar token expirado
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            navigate('/');
            return;
        }

        axios.get('http://localhost:8000/api/privado', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setMessage(response.data.mensaje))
        .catch(() => {
            localStorage.removeItem('token');
            navigate('/');
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container">
            <div className="card dashboard">
                <h2>Panel de Control</h2>
                {message && <p className="message">{message}</p>}
                <button className="logout-btn" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default Dashboard;