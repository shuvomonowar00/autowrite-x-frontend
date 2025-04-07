import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ResendEmailVerification from './ResendEmailVerification';

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const didVerify = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (didVerify.current) return;
      didVerify.current = true;

      if (!token) {
        setStatus('error');
        setErrorMessage('Verification token is missing');
        return;
      }

      try {
        await api.post(`/api/client/verify-email/${token}`);
        setStatus('success');
        toast.success('Email verified successfully!', {
          onClose: () => {
            navigate('/client/login');
          },
        });
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error.response?.data?.message ||
            'The verification link is invalid or has expired'
        );
        toast.error('Email verification failed');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying your email...
            </h2>
            <div className="mt-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-green-600">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting to login page...
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-red-600">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
            <ResendEmailVerification email={token} />
            <button
              onClick={() => navigate('/client/login')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent 
                text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-colors duration-200"
            >
              Return to Login
            </button>
          </div>
        );

      default:
        return null;
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
                      Email Verification
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </h2>
                  </div>
                </div>
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
        <div className="flex items-center justify-center bg-gray-50 bg-hero-texture px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            {renderContent()}
          </div>
        </div>
      </div>
      <div>
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
      </div>
    </>
  );
};

export default EmailVerification;
