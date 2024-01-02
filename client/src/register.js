import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PasswordGenerator from './password_generator.js';
import eyeCloseImage from './images/eye-close.png';
import eyeOpenImage from './images/eye-open.png';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [emailErrors, setEmailErrors] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
        alert('All fields are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3001/signup', {
            username: name,
            email: email,
            password: password,
        });

        console.log(response.data);
        navigate('/');
        // Redirect to passwordManager page without attempting to fetch passwords here
    } catch (error) {
        console.error('Signup error:', error);
    }
};


  const validateEmail = (value) => {
    const errors = [];

    if (!value) {
      errors.push('Email is required');
    }

    if (!value.includes('@')) {
      errors.push('Email must contain an @ symbol');
    }

    if (!value.includes('.')) {
      errors.push('Email must contain a "." symbol');
    }

    setEmailErrors(errors);
  }

  const validatePassword = (value) => {
    const errors = [];

    if (value.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(value)) {
      errors.push('Password must contain at least one capital letter');
    }

    if (!/[a-z]/.test(value)) {
      errors.push('Password must contain at least one small letter');
    }

    if (!/[\d!@#$%^&*()_\-+]/.test(value)) {
        errors.push('Password must contain at least one digit or special character (!@#$%^&*()_-+)');
      }

    setPasswordErrors(errors);
  };


  const handlePasswordGenerated = (generatedPassword) => {
    // console.log('Generated Password:', generatedPassword);
    validatePassword(generatedPassword);
    setPassword(generatedPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-to-r text-white from-green-500 to-sky-600 min-h-screen">
      <div className="py-10 flex items-center justify-center">
        <div className="w-3/4">
          <h2 className="text-center my-10 text-lg font-extrabold">
            Sign up for a new account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="rounded-md shadow-sm ">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Your Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => 
                    { validateEmail(e.target.value);
                    setEmail(e.target.value)}
                  }
                />
                {emailErrors.length > 0 && (
                <p className="text-red-600 bg-white bg-opacity-30 p-1 rounded font-extrabold text-sm my-1">{emailErrors.join(', ')}</p>
              )}
              </div>
              
              <div className="relative w-full flex">
                <label htmlFor="password" className="sr-only">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        validatePassword(e.target.value);
                        setPassword(e.target.value);
                      }}
                > 
                </input>
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    onClick={togglePasswordVisibility}
                >
                {showPassword ? (
                    <img src={eyeCloseImage} alt="Hide password" className="h-4" />
                  ) : (
                    <img src={eyeOpenImage} alt="Show password" className="h-4" />
                  )}
                </button>
                </div>
                {passwordErrors.length > 0 && (
                <p className="text-red-600 bg-white bg-opacity-30 p-1 rounded font-extrabold text-sm my-1">{passwordErrors.join(', ')}</p>
              )}
             </div>

            <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} /> 
             
            <div className='flex flex-col items-center'>
              <button
                type="submit"
                className="group relative w-1/5 mx-auto py-2 px-2 border border-transparent text-base font-medium rounded-md text-white bg-cyan-900 hover:bg-cyan-950 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Sign up
              </button>
              <div className="text-center mt-4">
                Already have an account?{' '}
                < div className="font-bold text-white hover:text-cyan-950">
                {/* {/* <Router> */}
                     <Link to="/">Sign in</Link>  
                {/* </Router> */} 
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
