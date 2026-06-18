import React, { useState } from 'react';
import './Logincreateaccount.css';
import { FaUserAlt } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [action, setAction] = useState('');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const API_URL = "https://connecthive-connectbackend.onrender.com"; 
    const createAccountLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Login Successful");

                // Store user info in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({ id: data.userId, name: data.name }));

                // Redirect to Post page
                navigate("/home");
            } else {
                alert(data.message); // Fix: Show proper error message
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();  // Fix: Prevent form submission from reloading
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registration Successful! Please log in.');
                loginLink(); // Switch back to login form
            } else {
                alert(data.error); // Fix: Show error if email already exists
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className={`wrapper${action}`}>
            {/* Login Form */}
            <div className='form-box login'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input
                            type="email"
                            placeholder='Email'
                            required
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                        <MdEmail className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                            type="password"
                            placeholder='Password'
                            required
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <IoMdLock className='icon' />
                    </div>
                    <div className='forgot'>
                        <a href="#">Forgot Password</a>
                    </div>
                    <button className='sign' type="submit">Sign in</button>
                    <div className='sign-up-link'>
                        <p>New to ConnectHive? <a href='#' onClick={createAccountLink}>Create Account</a></p>
                    </div>
                </form>
            </div>

            {/* Create Account Form */}
            <div className='form-box createaccount'>
                <form onSubmit={handleRegister}>  {/* Fix: Use onSubmit instead of onClick */}
                    <h1>Create Account</h1>
                    <div className='input-box'>
                        <input
                            type="text"
                            placeholder='First Name'
                            required
                            value={registerData.name}
                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        />
                        <FaUserAlt className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                            type="text"
                            placeholder='Last Name'
                        />
                        <FaUserAlt className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                            type="email"
                            placeholder='Email'
                            required
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        />
                        <MdEmail className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                            type="password"
                            placeholder='Password'
                            required
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        />
                        <IoMdLock className='icon' />
                    </div>
                    <button className='sign' type="submit">Sign up</button>
                    <div className='sign-up-link'>
                        <p>Already have an account? <a href='#' onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
