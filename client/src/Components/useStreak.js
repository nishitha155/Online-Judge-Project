// hooks/useStreak.js
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useStreak = () => {
    const authToken = Cookies.get('authToken');
    console.log(authToken);

    const [currentStreak, setCurrentStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:2000/api/users/streak`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                console.log(data);
                setCurrentStreak(data.currentStreak);
                setMaxStreak(data.maxStreak);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStreak();
    }, [authToken]);

    return { currentStreak, maxStreak, loading, error, setCurrentStreak, setMaxStreak };
};

export default useStreak;