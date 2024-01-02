import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eyeCloseImage from './images/eye-close.png';
import eyeOpenImage from './images/eye-open.png';
import axios from 'axios';
import Cookies from 'js-cookie';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
  });

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: email,
        password: password,
      });
  
      Cookies.remove('user');
      const userData = response.data;
      console.log('User data:', userData.user);
      Cookies.set('user', JSON.stringify(userData.user), { expires: 7 })
      
      setUser(userData.user);

  
      navigate('/passwordManager');
    } catch (error) {
      console.error('Login error:', error.message);
  
      if (error.response && error.response.status === 404) {
        setErrorMessage('Invalid email or password');
      } else {
        setErrorMessage('An error occurred during login');
      }
    }
  };
  



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-to-r text-white from-green-500 to-sky-600 min-h-screen">
      <div className="pt-28 text-center text-3xl font-extrabold mb-8">Welcome to my cryptography project</div>
      <div className="flex items-center justify-center">
        <div className="w-3/4">
          <h2 className="text-center my-10 text-lg font-extrabold">
            Sign in to your account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative w-full flex ">

                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
            </div>

            <div className='flex flex-col items-center'>
              <button
                type="submit"
                className="group relative w-1/5 mx-auto py-2 px-2 border border-transparent text-base font-medium rounded-md text-white bg-cyan-900 hover:bg-cyan-950 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Sign in
              </button>
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}
              <div className="text-center text-slate-200">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-white hover:text-cyan-950">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
