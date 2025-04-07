import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../lib/api';

function ClientRegister() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    // profile_photo: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [registerButtonActive, setRegisterButtonActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      formData.first_name &&
      formData.last_name &&
      formData.username &&
      formData.email &&
      isValidEmail(formData.email) &&
      formData.password &&
      formData.password_confirmation &&
      formData.password === formData.password_confirmation
    ) {
      setRegisterButtonActive(true);
    } else {
      setRegisterButtonActive(false);
    }
  }, [formData]);

  // Validate email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle email validation
    if (name === 'email') {
      if (!isValidEmail(value) && value !== '') {
        setErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address',
        }));
        setRegisterButtonActive(false);
      } else {
        setErrors((prev) => ({
          ...prev,
          email: '',
        }));
      }
    }

    // Clear other errors except email
    if (errors[name] && name !== 'email') {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profile_photo: 'Image size should be less than 2MB',
        }));
        return;
      }
      // setFormData((prev) => ({
      //   ...prev,
      //   profile_photo: file,
      // }));
      setPreviewImage(URL.createObjectURL(file));
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
        setRegisterButtonActive(false);
      } else if (
        formData.password_confirmation &&
        value !== formData.password_confirmation
      ) {
        setErrors((prev) => ({
          ...prev,
          password_confirmation: 'Passwords do not match',
        }));
        setRegisterButtonActive(false);
      } else if (
        formData.password_confirmation &&
        value === formData.password_confirmation
      ) {
        setRegisterButtonActive(true);
      }
    }

    if (name === 'password_confirmation') {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          password_confirmation: 'Passwords do not match',
        }));
        setRegisterButtonActive(false);
      } else if (!isValidPassword(formData.password).isValid) {
        setRegisterButtonActive(false);
      } else {
        setRegisterButtonActive(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      // Append all necessary form fields (rename password_confirmation to password_confirmation)
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append(
        'password_confirmation',
        formData.password_confirmation
      );

      const response = await api.post('/api/client/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Registration successful!', {
        onClose: () => navigate('/client/login'),
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
          toast.error('Please check your inputs and try again.');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
      console.error('Registration error:', error);
      console.log(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 custom-scrollbar">
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Glass morphism effect header */}
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
                      Create your account
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </h2>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/client/login"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Already have an account?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              id="registration-form"
              autoComplete="off"
            >
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-full h-full text-gray-300" />
                  )}
                  <label
                    htmlFor="profile_photo"
                    className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <input
                      type="file"
                      id="profile_photo"
                      name="profile_photo"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                {errors.profile_photo && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.profile_photo}
                  </p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    autoComplete="given-name"
                    value={formData.first_name}
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
                      errors.first_name
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                    focus:ring-opacity-50
                    `}
                    required
                  />
                  {errors.first_name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    autoComplete="family-name"
                    value={formData.last_name}
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
                      errors.last_name
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                    focus:ring-opacity-50
                    `}
                    required
                  />
                  {errors.last_name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Username and Email */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={formData.username}
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
                      errors.username
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                    focus:ring-opacity-50
                    `}
                    required
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
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
                      errors.email
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                    focus:ring-opacity-50
                    `}
                    required
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
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
                  disabled={!registerButtonActive || isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !registerButtonActive || isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      <span>Registering...</span>
                    </div>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Toast Container */}
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

export default ClientRegister;
