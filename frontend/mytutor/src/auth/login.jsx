// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import './login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const loginData = { email, password };

//     try {
//       const response = await fetch('http://localhost:4000/api/mytutor/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(loginData),
//       });

//       const data = await response.json();
//       console.log('Full response data:', data);  // Debugging log

//       if (!response.ok) {
//         toast.error('Login failed: Invalid credentials');
//         return;
//       }

//       // Check if response contains necessary information
//       if (data && data.role) {
//         toast.success('Login successful');

//         if (data.role === 'tutor' && data.tutor_id) {
//           navigate(`/tutordash/${data.tutor_id}`);
//         } else if (data.role === 'student' && data.student_id) { 
//           navigate(`/studentdash/${data.student_id}`); 
//         } else {
//           throw new Error('Invalid role or missing ID in response');
//         }
//       } else {
//         throw new Error('Incomplete data in response');
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       setErrorMessage('An error occurred during login.');
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
      const response = await fetch('http://localhost:4000/api/mytutor/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error('Login failed: Invalid credentials');
        return;
      }

      toast.success('Login successful');
      if (data.role === 'tutor') navigate(`/tutordash/${data.tutor_id}`);
      else if (data.role === 'student') navigate(`/studentdash/${data.student_id}`);
      else throw new Error('Invalid role');
    } catch (error) {
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <div className="welcome-section">
        <h1>Welcome<br />Back!</h1>
      </div>
      <div className="form-section">
        <h2>Login</h2>
        <p>Welcome back! Please login to your account.</p>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="extra-options">
            <a href="#">Forgot Password?</a>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
        <div className="signup-link">
          New User? <a href="/signup">Signup</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
