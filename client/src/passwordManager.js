import React, { useState, useEffect } from 'react';
import PasswordGenerator from './password_generator.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import eyeCloseImage from './images/eye-close.png';
import eyeOpenImage from './images/eye-open.png';
import { useNavigate } from 'react-router-dom';


const PasswordManager = () => {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordsList, setPasswordsList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [masterPassword, setMasterPassword] = useState('');
  const [masterPasswordError, setMasterPasswordError] = useState('');
  const [masterPasswordSuccess, setMasterPasswordSuccess] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isMasterPasswordEntered, setIsMasterPasswordEntered] = useState(false); 

  const [triggerRender, setTriggerRender] = useState(false);

  const navigate = useNavigate();
  
  const handleMasterPasswordChange = (e) => {
    setMasterPassword(e.target.value);
  };

  const handleShowMasterPassword = (e) => {
    setShowMasterPassword(!showMasterPassword);
  };

  
  useEffect(() => {
    const cookieContent = Cookies.get('user');
    const user = JSON.parse(cookieContent);
    const userId = user.id;

    if (userId) {
      axios.get(`http://localhost:3001/showpasswords?userId=${userId}`).then((response) => {
        setPasswordsList(response.data.map((password) => ({ ...password, clicked: false })));
      });
    }
  }, [triggerRender]);

  const handleSubmit = (e) => {
    const cookieContent = Cookies.get('user');
    const user = JSON.parse(cookieContent);
    const userId = user.id;
    const userPassword = user.password;

    axios.post('http://localhost:3001/addpassword', {
      password: password,
      title: title,
      userId: userId,
      userPassword: userPassword,
    })
      .then(() => {
        console.log('Password added successfully');
        setTriggerRender(!triggerRender);
      })
      .catch((error) => {
        console.error('Error adding password:', error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handlePasswordGenerated = (generatedPassword) => {
    validatePassword(generatedPassword);
    setPassword(generatedPassword);
  };
  
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
  
  const decryptPassword = (encryptedPassword) => {
    if (!isMasterPasswordEntered) {
      alert('Please enter your master password to view passwords');
      setTimeout(() => setMasterPasswordError(''), 3000);
      return;
    }

    const cookieContent = Cookies.get('user');
    const user = JSON.parse(cookieContent);
    const userPassword = user.password;

    axios.post('http://localhost:3001/decryptpassword', {
      password: encryptedPassword.password,
      salt: encryptedPassword.salt,
      iv: encryptedPassword.iv,
      userPassword: userPassword,
    })
    .then((response) => {
      setPasswordsList((prevPasswordsList) => {
        return prevPasswordsList.map((val) => {
          return val.id === encryptedPassword.id
          ? { ...val, password: val.clicked ? val.title : response.data, title: val.clicked ? response.data : val.password, clicked: !val.clicked }
          : val;
        });
      });
    });
  };
  
  const validateMasterPassword = () => {
    const cookieContent = Cookies.get('user');
    const user = JSON.parse(cookieContent);
    const userId = user.id;
    // const userPassword = user.password;

    axios.post('http://localhost:3001/validatemasterpassword', {
      userId: userId,
      masterPassword: masterPassword,
      // userPassword: userPassword,
    })
    .then((response) => {
      if (response.data.success === true) {
        setMasterPasswordSuccess('Your password is correct');
        setTimeout(() => {
          setMasterPasswordSuccess('');
        }, 3000);
        setIsMasterPasswordEntered(true);
        setTimeout(() => {
          setIsMasterPasswordEntered(false);
          setMasterPassword('');
        }, 10000);
      } else {
        setMasterPasswordError('Your master password was incorrect');
        setTimeout(() => setMasterPasswordError(''), 3000);
      }
    })
    .catch((error) => {
      setMasterPasswordError('Invalid master password');
      setTimeout(() => setMasterPasswordError(''), 3000);
      console.error('Master password validation error:', error);
    });
  };

  const handleSignOut = () => {
    Cookies.remove('user');
    navigate('/');
  };

  const handleDeletePassword = (passwordId) => {
    

    axios.post('http://localhost:3001/deletepassword', {
      passwordId: passwordId,
    })
    .then(() => {
      console.log('Password deleted successfully');
      setTriggerRender(!triggerRender);
    })
    .catch((error) => {
      console.error('Error deleting password:', error);
    });
  };

  return (
    <div className="bg-gradient-to-r relative text-white from-green-500 to-sky-600 min-h-screen flex flex-col items-center ">
    <div className="fixed flex flex-col items-center w-52 top-2 left-2 m-4 mt-14">
      <div className="relative w-full flex items-center justify-center">
        <label htmlFor="master-password" className="sr-only">
          Master Password
        </label>
        <input
          id="master-password"
          name="masterPassword"
          type={ showMasterPassword? 'text':"password"}
          autoComplete="current-password"
          required
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 text-sm"
          placeholder="Master Password"
          value={masterPassword}
          onChange={handleMasterPasswordChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-2"
          onClick={handleShowMasterPassword}
        >
          {showMasterPassword ? (
            <img src={eyeCloseImage} alt="Hide password" className="h-4" />
          ) : (
            <img src={eyeOpenImage} alt="Show password" className="h-4" />
          )}
        </button>
      </div>
        <button 
        type='button' 
        className='flex text-xs rounded-lg font-normal w-3/7 bg-cyan-900 hove:bg-cyan-950 items-center mt-1 p-2 '
        onClick = {validateMasterPassword}>
          Check Password
        </button>
      {masterPasswordError && (
        <p className="text-red-600 w-full bg-white bg-opacity-20 p-1 rounded font-semibold text-xs mt-1">
          {masterPasswordError}
        </p>
      )}
      {masterPasswordSuccess && (
          <p className="text-lime-400 w-full bg-white bg-opacity-20 p-1 rounded font-semibold text-xs mt-1">
            {masterPasswordSuccess}
          </p>
        )}
    </div>
          <div className="mt-16 p-3 rounded-md text-center text-3xl  font-extrabold mb-8">Welcome to my Password Manager </div>
            <h2 className="text-center my-6 text-2xl font-extrabold">
                Add your passwords here
            </h2>
        <div className=" flex items-center justify-center">
            <div className=" w-96">
              <div className='relative flex'>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
              <input
                id="password"
                name="password"
                type= { showPassword? 'text':"password"}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:z-10 text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  validatePassword(e.target.value);
                  setPassword(e.target.value)}
                }
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
                <label htmlFor="title" className="sr-only"> Title </label>
                <input 
                id="title"
                name="title"
                placeholder='Title' 
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value = {title} 
                onChange={ (e) => setTitle(e.target.value)} />
              
            </div>
                            
        </div>
            <div className=' items-center justify-center'>
            <button
                type="submit"
                className="group relative mt-3 w-40 mx-auto py-2 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-cyan-900 hover:bg-cyan-950 focus:outline-none focus:ring-2 focus:ring-offset-2"
                onClick={handleSubmit}
            >
                Add Password
            </button>
            </div>
        {passwordErrors.length > 0 && (
                <p className="text-red-600 w-1/2 bg-white bg-opacity-30 p-1 rounded font-semibold text-xs my-1">{passwordErrors.join(', ')}</p>
              )}
        <div className="pt-4 text-center text-3xl font-extrabold mb-3">Password suggestions: 
            <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} /> 
        </div>
        <div className="pt-3 text-center text-3xl font-extrabold mb-8">
        Your passwords:
        <div className="flex flex-col items-center justify-center">
          <div className="">
            {passwordsList.map((val, key) => (
              <div key={key} className="flex items-center">
                <button
                  onClick={() => decryptPassword({ password: val.password, iv: val.iv, salt: val.salt, id: val.id })}
                  className="my-2 w-64 py-3 flex items-center justify-center rounded-lg bg-cyan-900 hover:bg-cyan-950"
                >
                  <div>
                    <p className="text-lg font-bold text-white">{val.clicked ? val.password : val.title}</p>
                  </div>
                </button>
                <button
                  className="ml-1 p-4 text-sm bg-red-700 text-white rounded-lg hover:bg-red-800 focus:outline-none focus:ring focus:border-blue-300"
                  onClick={() => handleDeletePassword(val.id)}
                >
                  Delete
                </button>
              </div>
            ))}
            </div>

        </div>
      </div>
      <button
        className="fixed bottom-4 right-4 p-2 bg-red-700 text-white rounded-lg hover:bg-red-800 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div> 
  );
};

export default PasswordManager;