import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../actions/authActions';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import bg1 from '../../assets/personal-project-management.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Password validation with regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long and contain at least one numeric digit, one uppercase, and one lowercase letter'
      );
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await dispatch(register({ email, username, password }));
      setLoading(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/'); // Redirect to login page after successful registration
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.email[0] || err.response?.data?.detail[0] || 'Registration failed'
      );
      setTimeout(() => setError(''), 5000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block relative w-3/4 bg-cover bg-center" style={{ backgroundImage: `url(${bg1})` }}>
        <div className="absolute inset-0 bg-orange-600 opacity-25"></div>
        <div className="flex flex-col justify-center items-center text-white absolute inset-0 px-10">
          <h1 className="text-4xl font-bold mb-4 text-center text-black">Project Management Tool</h1>
          <div className="text-lg text-center">
            <p className='text-black'>Efficiently manage projects and tasks</p>
            <p className='text-black'>Track milestones and progress</p>
            <p className='text-black'>Collaborate with team members effectively</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 bg-orange-900 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 mt-5 right-0 pr-3 flex items-center text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 mt-5 right-0 pr-3 flex items-center text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                disabled={loading}
              >
                {loading && <ClipLoader color="white" size={20} className="mr-2" />}
                Register
              </button>
            </div>
            <div className="text-center">
              <Link to="/" className="text-blue-500 hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
