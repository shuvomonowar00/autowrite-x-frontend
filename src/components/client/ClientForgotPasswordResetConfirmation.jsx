import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/api';

function ClientForgotPasswordResetConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const [formData, setFormData] = useState({
    email: decodeURIComponent(email || ''),
    password: '',
    password_confirmation: '',
    token: token || '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [resetButtonActive, setResetButtonActive] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        toast.error('Invalid password reset token');
        return;
      }

      if (!email) {
        setTokenValid(false);
        toast.error('Email address is missing');
        return;
      }

      try {
        await api.post(`/api/client/verify-password-reset-token`, {
          token,
          email: decodeURIComponent(email),
        });
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
        toast.error('This password reset link is invalid or has expired');
      }
    };

    verifyToken();
  }, [token, email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Password validation
  const isValidPassword = (password) => {
    const minLength = password.length >= 8;
    const maxLength = password.length <= 24;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        minLength &&
        maxLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSymbols,
      errors: {
        minLength: !minLength ? 'Password must be at least 8 characters' : '',
        maxLength: !maxLength ? 'Password must not exceed 24 characters' : '',
        hasUpperCase: !hasUpperCase
          ? 'Password must contain an uppercase letter'
          : '',
        hasLowerCase: !hasLowerCase
          ? 'Password must contain a lowercase letter'
          : '',
        hasNumbers: !hasNumbers ? 'Password must contain a number' : '',
        hasSymbols: !hasSymbols
          ? 'Password must contain a special character'
          : '',
      },
    };
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear existing password errors
    setErrors((prev) => ({
      ...prev,
      password: '',
      password_confirmation: '',
    }));

    if (name === 'password') {
      const { isValid } = isValidPassword(value);
      if (!isValid) {
        setResetButtonActive(false);
      } else if (
        formData.password_confirmation &&
        value !== formData.password_confirmation
      ) {
        setErrors((prev) => ({
          ...prev,
          password_confirmation: 'Passwords do not match',
        }));
        setResetButtonActive(false);
      } else if (
        formData.password_confirmation &&
        value === formData.password_confirmation
      ) {
        setResetButtonActive(true);
      }
    }

    if (name === 'password_confirmation') {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          password_confirmation: 'Passwords do not match',
        }));
        setResetButtonActive(false);
      } else if (!isValidPassword(formData.password).isValid) {
        setResetButtonActive(false);
      } else {
        setResetButtonActive(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    if (formData.password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      await api.post(`/api/client/reset-password`, {
        email: formData.email,
        token: formData.token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      toast.success('Password has been reset successfully!', {
        onClose: () => navigate('/client/login'),
      });
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-hero-texture">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-red-600">
              Invalid Link
            </h2>
            <p className="mt-2 text-gray-600">
              This password reset link is invalid or has expired.
            </p>
            <Link
              to="/client/forgot-password"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`
                      mt-1 
                      block 
                      w-full 
                      px-4 
                      py-2.5
                      rounded-lg
                      border
                      outline-none
                      transition-all
                      duration-200
                      appearance-none
                      ${
                        errors.password
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                      }
                      focus:ring-4
                      focus:ring-opacity-50
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className={`
                      mt-1 
                      block 
                      w-full 
                      px-4 
                      py-2.5
                      rounded-lg
                      border
                      outline-none
                      transition-all
                      duration-200
                      appearance-none
                      ${
                        errors.password_confirmation
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                      }
                      focus:ring-4
                      focus:ring-opacity-50
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password_confirmation}
                  </p>
                )}
              </div> */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`
                    mt-1 
                    block 
                    w-full 
                    px-4 
                    py-2.5
                    rounded-lg
                    border
                    outline-none
                    transition-all
                    duration-200
                    appearance-none
                    ${
                      errors.password
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                    focus:ring-opacity-50
                    `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      required
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isValidPassword(formData.password).isValid
                                ? 'bg-green-500 w-full'
                                : Object.values(
                                      isValidPassword(formData.password).errors
                                    ).filter((e) => !e).length >= 3
                                  ? 'bg-yellow-500 w-2/3'
                                  : 'bg-red-500 w-1/3'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {isValidPassword(formData.password).isValid
                            ? 'Strong'
                            : Object.values(
                                  isValidPassword(formData.password).errors
                                ).filter((e) => !e).length >= 3
                              ? 'Medium'
                              : 'Weak'}
                        </span>
                      </div>
                    </div>
                  )}
                  {formData.password && (
                    <div className="mt-4 space-y-2 text-sm">
                      <h4 className="font-medium text-gray-700">
                        Password requirements:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div
                          className={`flex items-center gap-2 ${
                            formData.password.length >= 8
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              formData.password.length >= 8
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span>At least 8 characters long</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            /[A-Z]/.test(formData.password)
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              /[A-Z]/.test(formData.password)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span>One uppercase letter</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            /[a-z]/.test(formData.password)
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              /[a-z]/.test(formData.password)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span>One lowercase letter</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            /\d/.test(formData.password)
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              /\d/.test(formData.password)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span>One number</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span>
                            One special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            formData.password.length <= 24
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              formData.password.length <= 24
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span>Maximum 24 characters</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      autoComplete="new-password"
                      value={formData.password_confirmation}
                      onChange={handlePasswordChange}
                      className="
                        mt-1 
                        block 
                        w-full 
                        px-4 
                        py-2.5
                        rounded-lg
                        border
                        outline-none
                        transition-all
                        duration-200
                        appearance-none
                        border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200
                        focus:ring-4
                        focus:ring-opacity-50
                        "
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      required
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!resetButtonActive || isLoading}
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    !resetButtonActive || isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
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
                    'Reset Password'
                  )} */}

                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Reset Password'
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

export default ClientForgotPasswordResetConfirmation;
