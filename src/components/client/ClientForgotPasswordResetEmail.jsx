import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../lib/api';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

function ClientForgotPasswordResetEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sentResetLinkActive, setSentResetLinkActive] = useState(false);

  useEffect(() => {
    if (email) {
      setSentResetLinkActive(true);
    } else {
      setSentResetLinkActive(false);
    }
  }, [email]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      await api.post('/api/client/forgot-password', { email });
      toast.success('Password reset link sent successfully!');
      setIsLoading(false);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      } else {
        toast.error('Failed to send reset link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-hero-texture">
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="backdrop-blur-md bg-white/80 shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-500 hover:to-blue-300">
                    AutoWriteX
                  </span>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Reset Password
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </h2>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/client/login"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Want to login?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className={`
                    mt-1 block w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 appearance-none
                    ${errors.email ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'}
                    focus:ring-4 focus:ring-opacity-50
                  `}
                  required
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!sentResetLinkActive || isLoading}
                  className={`
                    w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
                    ${!sentResetLinkActive || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                  `}
                >
                  {/* {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    'Send Reset Link'
                  )} */}
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      <span>Reset Link Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default ClientForgotPasswordResetEmail;
