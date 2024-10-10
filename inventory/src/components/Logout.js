// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Implement any necessary logout logic here, such as clearing tokens
        // localStorage.removeItem('token'); // Example of clearing a token

        // Redirect to login after a brief delay
        const timer = setTimeout(() => {
            navigate('/'); // Redirect to login page
        }, 1000); // Redirect after 2 seconds

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, [navigate]);

    // return (
    //     <div style={{ textAlign: 'center', marginTop: '50px' }}>
    //         <h1>You have been logged out</h1>
    //         <p>Thank you for using our application!</p>
    //     </div>
    // );
};

export default Logout;
