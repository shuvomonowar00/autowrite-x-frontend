import React, { useState } from 'react';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  QuestionMarkCircleIcon,
  SparklesIcon,
  XMarkIcon,
  EyeIcon,
  ArrowUturnLeftIcon,
  EyeSlashIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  LinkIcon,
} from '@heroicons/react/24/solid';
import { FaWordpress, FaBlogger, FaMedium } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../lib/api';
import FloatingButtonForScrollTop from '../commonFeatures/FloatingButtonForScrollTop';

function BulkArticleGeneration() {
  const [keywords, setKeywords] = useState('');
  const [language, setLanguage] = useState('English');
  const [numFAQs, setNumFAQs] = useState(0);
  const [gptVersion, setGptVersion] = useState('gpt-4');
  const [aiGeneratedTitle, setAiGeneratedTitle] = useState(true);
  const [postTo, setPostTo] = useState('WordPress');
  const [wordCount, setWordCount] = useState(1500);
  const [articleType, setArticleType] = useState('Long Article');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const gptVersionMap = {
    'GPT-4o': 'gpt-4',
    'o1-preview': 'gpt-4-turbo',
    'o1-mini': 'gpt-3.5-turbo',
  };
  const [wordPressSites, setWordPressSites] = useState([]);
  const [showWordPressSiteModal, setShowWordPressSiteModal] = useState(false);
  const [wordPressSite, setWordPressSite] = useState(null);

  // WordPress Site Modal Component
  const WordPressSiteModal = ({ isOpen, onClose }) => {
    const [wordPressSiteData, setWordPressSiteData] = useState({
      wpUrl: '',
      wpUsername: '',
      wpPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [WordPressPublishFormErrors, setWordPressPublishFormErrors] =
      useState({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
      });

    if (!showWordPressSiteModal) return null;

    const handleChange = (e) => {
      setWordPressSiteData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleVerify = async (e) => {
      e.preventDefault();
      setIsVerifying(true);

      try {
        const response = await api.post(
          '/api/contents/articles/verify-wordpress-site',
          wordPressSiteData
        );
        if (response.data.success) {
          setWordPressSites((prev) => [...prev, wordPressSiteData]);
          setWordPressSiteData({
            wpUrl: '',
            wpUsername: '',
            wpPassword: '',
          });
          toast.success('WordPress site verified successfully!');
          setIsVerifying(false);
          onClose();
        }
      } catch (error) {
        if (error.response?.status === 401) {
          const errorMessage = error.response.data.error;

          if (errorMessage.includes('username')) {
            setWordPressPublishFormErrors((prev) => ({
              ...prev,
              wpUsername: 'Invalid WordPress username',
            }));
          } else if (errorMessage.includes('password')) {
            setWordPressPublishFormErrors((prev) => ({
              ...prev,
              wpPassword: 'Invalid WordPress password',
            }));
          }
        }

        toast.error(error.response?.data?.error || 'Failed to verify site');
        setIsVerifying(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 ml-[21rem] mt-[4rem]">
        <div className="bg-white rounded-lg shadow-xl w-[45rem] p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-row gap-2">
              <FaWordpress className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-semibold text-blue-500">
                Publish to WordPress
              </h3>
            </div>
            <button
              onClick={() => onClose()}
              className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <XMarkIcon className="h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          <form onSubmit={handleVerify}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WordPress Site URL
                </label>
                <input
                  type="url"
                  name="wpUrl"
                  value={wordPressSiteData.wpUrl}
                  onChange={handleChange}
                  placeholder="https://your-site.com"
                  className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="wpUsername"
                  value={wordPressSiteData.wpUsername}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="wpPassword"
                    value={wordPressSiteData.wpPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onClose()}
                className="flex flex-row gap-2 px-4 py-2 text-red-400 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className={`flex items-center justify-center gap-2 px-4 py-2 ${
                  isVerifying
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-lg transition-colors`}
              >
                {isVerifying ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Add Site'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // WordPress Sites Table Component
  const WordPressSitesTable = ({ sites }) => {
    if (sites.length === 0) return null;

    return (
      <div className=" mt-4">
        <div className="mb-6 border p-4 rounded-lg">
          <div className="relative border rounded-lg overflow-hidden">
            {/* Fixed Header */}
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-2/5 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Site URL
                  </th>
                  <th className="w-2/5 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Username
                  </th>
                  <th className="w-1/5 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>

            {/* Scrollable Body */}
            <div className="max-h-[15rem] overflow-y-auto custom-scrollbar">
              <table className="w-full table-fixed">
                <tbody className="bg-white divide-y divide-gray-200">
                  {wordPressSites.map((site, index) => (
                    <tr key={index}>
                      <td className="w-2/5 px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={site.wpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                        >
                          {site.wpUrl}
                          <LinkIcon className="h-4 w-4" />
                        </a>
                        {/* <a
                              href={site.wpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                              {site.wpUrl}
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a> */}
                      </td>
                      <td className="w-2/5 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {site.wpUsername}
                      </td>
                      <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            setWordPressSites((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Generate article
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numFAQs <= 0) {
      toast.error('Number of FAQs must be a positive number');
      return;
    }

    if (wordCount === 1500) {
      setArticleType('Long Article');
    } else if (wordCount === 750) {
      setArticleType('Short Article');
    }
    // if (wordCount === 200) {
    //   setArticleType('Long Article');
    // } else if (wordCount === 100) {
    //   setArticleType('Short Article');
    // }

    // Handle form submission logic here
    const formData = {
      keywords,
      language,
      numFAQs,
      gptVersion,
      aiGeneratedTitle,
      wordPressSites,
      wordCount,
      articleType,
    };

    // Show loading modal
    setIsLoading(true);

    try {
      const response = await api.post(
        '/api/contents/articles/generate',
        formData
      );

      toast.success(response.data.message, {
        onClose: () => navigate('/all-post-history'),
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to generate article'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-full w-full bg-white pt-3 pb-6 rounded-lg shadow-lg">
        {/* <div className="min-h-full bg-white shadow-2xl"> */}
        <div className="relative z-10">
          {/* <div className="bg-white mt-1 mx-[2rem] shadow-lg -z-10 py-[3rem]"> */}
          <div className="mx-[6rem] mt-2">
            <div className="flex flex-row items-center mb-2">
              <div className="bg-blue-100 pl-3 pr-1 py-1 mr-2">
                <DocumentTextIcon className="h-8 w-8 text-black mr-2" />
              </div>
              <h1 className="text-3xl font-bold text-center text-blue-500">
                Bulk Article Generation
              </h1>
            </div>
            <div className="flex flex-row">
              <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-sm mb-6">
                Write up to 1k blog articles just in 1-click also Publish to
                your WordPress & Blogger site automatically.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-700 text-sm font-semibold">
                    GPT Version
                  </label>
                  <div className="group relative">
                    <div className="absolute right-0 w-64 p-2 mt-2 text-sm text-gray-600 bg-white rounded-lg shadow-lg border border-gray-100 invisible group-hover:visible transition-all">
                      Choose between different GPT versions for optimal results
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  {Object.entries(gptVersionMap).map(([display, value]) => (
                    <label
                      key={value}
                      className={`
          flex-1 relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-200
          ${
            gptVersion === value
              ? 'border-blue-400 bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md scale-105'
              : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
          }
        `}
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={gptVersion === value}
                        onChange={(e) => setGptVersion(e.target.value)}
                        className="hidden"
                      />
                      <div className="px-6 py-4 flex items-center justify-center gap-2">
                        <SparklesIcon
                          className={`h-5 w-5 ${gptVersion === value ? 'text-white' : 'text-blue-500'}`}
                        />
                        <span className="font-medium">{display}</span>
                      </div>
                      <div
                        className={`
          absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 
          transition-opacity duration-200
          ${gptVersion === value ? 'opacity-100' : 'group-hover:opacity-50'}
        `}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Keywords
                </label>

                <div className="flex items-start gap-3 p-4 mb-4 bg-blue-50 rounded-xl border border-blue-100">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    GPT-4o can result in much higher quality, faster & latest
                    data than GPT-4o mini. It will use 3x more credits.
                  </p>
                </div>
                <div className="relative">
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    rows={8}
                    placeholder="Example: 
- How to lose weight fast
- How to make money online
- Best accounting software for small business
- GoDaddy vs Namecheap - which is the best webhosting company?
- AppSumo Review: Your All-in-One Business Software Solution"
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none
        placeholder:text-gray-400
        placeholder:text-sm
        resize-none"
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {keywords.split('\n').filter((k) => k.trim()).length}{' '}
                    keywords
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiGeneratedTitle(!aiGeneratedTitle)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none ${aiGeneratedTitle ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${aiGeneratedTitle ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
                <label className="block text-gray-700 text-sm font-bold mr-2">
                  AI Generated Title:
                </label>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-4">
                  Select Publishing Platform
                </label>
                <div className="flex gap-4">
                  {[
                    {
                      name: 'WordPress',
                      icon: <FaWordpress className="h-6 w-6" />,
                      color: 'hover:border-[#21759B]',
                      iconColor: 'text-[#21759B]',
                    },
                    {
                      name: 'Blogger',
                      icon: <FaBlogger className="h-6 w-6" />,
                      color: 'hover:border-[#FF5722]',
                      iconColor: 'text-[#FF5722]',
                    },
                    {
                      name: 'Medium',
                      icon: <FaMedium className="h-6 w-6" />,
                      color: 'hover:border-[#000000]',
                      iconColor: 'text-[#000000]',
                    },
                  ].map((platform) => (
                    <label
                      key={platform.name}
                      className={`
          flex-1 cursor-pointer rounded-xl border-2 transition-all duration-200
          ${
            postTo === platform.name
              ? 'border-blue-400 bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md scale-105'
              : `border-gray-200 ${platform.color} hover:border-blue-200 hover:bg-gray-50`
          }
        `}
                    >
                      <input
                        type="radio"
                        value={platform.name}
                        checked={postTo === platform.name}
                        onChange={(e) => setPostTo(e.target.value)}
                        className="hidden"
                      />
                      <div className="px-6 py-4 flex flex-col items-center gap-3">
                        <div
                          className={`${postTo === platform.name ? 'text-white' : platform.iconColor}`}
                        >
                          {platform.icon}
                        </div>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div>
                  {/* WordPress Site Management - Rendered below platforms */}
                  {postTo === 'WordPress' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <h3 className="text-sm font-medium text-gray-700">
                          No WordPress site found. Please add a site.
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowWordPressSiteModal(true)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors flex items-center gap-2"
                        >
                          {wordPressSite ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5" />
                              <span>Change WordPress Site</span>
                            </>
                          ) : (
                            <>
                              <PlusCircleIcon className="h-5 w-5" />
                              <span>Add WordPress Site</span>
                            </>
                          )}
                        </button>
                      </div>
                      {/* Verified Sites Table */}
                      <div>
                        {wordPressSites.length > 0 && (
                          <div className="mt-4">
                            <table className="min-w-full divide-y divide-gray-200">
                              <WordPressSitesTable sites={wordPressSites} />
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Select Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none cursor-pointer
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Bangla">Bangla</option>
                  </select>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Number of FAQs
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={numFAQs}
                    onChange={(e) => setNumFAQs(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Choose Type of Info Article
                </label>
                <div className="relative">
                  <select
                    value={wordCount}
                    onChange={(e) => setWordCount(parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl 
        appearance-none cursor-pointer
        transition-all duration-200
        hover:border-blue-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        focus:outline-none"
                  >
                    {/* <option value="1500">Long Post Form</option>
                        <option value="750">Short Post Form</option> */}
                    <option value="1500">Long Post Form</option>
                    <option value="750">Short Post Form</option>
                  </select>
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`
    w-full flex items-center justify-center gap-3 px-8 py-4 
    bg-gradient-to-r from-blue-600 to-blue-500 
    hover:from-blue-700 hover:to-blue-600
    text-white font-semibold text-lg
    rounded-xl shadow-lg 
    transform transition-all duration-200 
    hover:shadow-blue-500/25 hover:-translate-y-0.5
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none
  `}
              >
                {isLoading ? (
                  <>
                    {/* <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg> */}
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Generate Article</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* Add FloatingButtonForScrollTop */}
      <FloatingButtonForScrollTop />
      {/* WordPress Site Modal */}
      <WordPressSiteModal
        isOpen={showWordPressSiteModal}
        onClose={() => setShowWordPressSiteModal(false)}
      />
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
}

export default BulkArticleGeneration;
