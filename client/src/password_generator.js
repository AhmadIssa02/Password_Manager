import React, { useState } from 'react';
import Modal from 'react-modal';

const PasswordGenerator = ({ onPasswordGenerated }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=!@#$%^&*()_-+=';

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
    setModalIsOpen(true);
  };

  const handleUsePassword = () => {
    onPasswordGenerated(password);
    setModalIsOpen(false);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      {/* <div className = "text-xl font-extrabold rounded-lg">Password Generator</div> */}
      <button className = "text-sm bg-orange-600 hover:bg-orange-700 rounded-lg mt-2 py-1 px-4  " onClick={generatePassword}>Generate Password</button>

      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}
       className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border  border-gray-300 p-6 rounded-md"
       overlayClassName="fixed inset-0 bg-black opacity-90">
        <div>
          <p>Suggested Password:</p>
          <p>{password}</p>
          <button onClick={handleUsePassword} className="bg-green-500 text-white py-2 px-4 rounded-md mr-2 ">
             Use This Password
          </button>
          <button onClick={handleCloseModal} className="bg-red-500 text-white py-2 px-4 rounded-md">
            Close
          </button>

        </div>
      </Modal>
    </div>
  );
};

export default PasswordGenerator;
