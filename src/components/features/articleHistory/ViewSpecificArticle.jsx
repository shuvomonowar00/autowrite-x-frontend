import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  PencilSquareIcon,
  CommandLineIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  DocumentTextIcon,
  LinkIcon,
  ArrowPathIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { FaWordpress, FaBlogger, FaMedium } from 'react-icons/fa';
import FloatingButtonForScrollTop from '../commonFeatures/FloatingButtonForScrollTop';
import api from '../../lib/api';
import { useSidebar } from '../../compulsory/client/contexts/ClientSidebarContext';

const ViewSpecificArticle = () => {
  const { id } = useParams();
  const [record, setRecord] = useState({});
  const [isSticky, setIsSticky] = useState(false);
  const [isWordPressModalOpen, setIsWordPressModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const navigate = useNavigate();
  const [editArticle, setEditArticle] = useState(false);
  const [deleteArticle, setDeleteArticle] = useState(false);
  const [publishArticleToWordPress, setPublishArticleToWordPress] =
    useState(false);

  // Render the specific article
  useEffect(() => {
    api
      .get(`/api/contents/articles/show/${id}`)
      .then((response) => {
        setRecord(response.data);
        setEditArticle(true);
        setDeleteArticle(true);
        setPublishArticleToWordPress(true);
      })
      .catch((error) => {
        // console.error('Error:', error);
        toast.error(error.message);
      });
  }, []);

  // Sticky the title of the article when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const titleElement = document.querySelector('.title-header');
      if (titleElement) {
        const position = titleElement.getBoundingClientRect();
        setIsSticky(position.top <= 32); // 2rem = 32px
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render content using ReactMarkdown
  const renderContent = (content) => {
    return (
      <div className="prose prose-lg max-w-none p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          className="markdown-content"
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl font-bold mb-6 text-gray-900"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl font-bold mb-4 text-gray-800"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-bold mb-3 text-gray-800" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-lg font-bold mb-2 text-gray-800" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 mb-4 text-gray-700" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 mb-4 text-gray-700" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="mb-2 text-gray-700" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600"
                {...props}
              />
            ),
            a: ({ node, href, children }) => (
              <a
                href={href}
                className="text-blue-600 font-normal hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            code: ({ node, inline, className, children, ...props }) => {
              return inline ? (
                <code
                  className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono text-gray-800"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <pre className="bg-gray-100 rounded p-4 mb-4 overflow-x-auto">
                  <code className="text-sm font-mono text-gray-800" {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto mb-4">
                <table
                  className="min-w-full divide-y divide-gray-200"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-50" {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="divide-y divide-gray-200" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-gray-50" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                {...props}
              />
            ),
            img: ({ node, ...props }) => (
              <img
                className="max-w-full h-auto rounded-lg shadow-lg my-4"
                {...props}
              />
            ),
            hr: () => <hr className="my-8 border-t border-gray-200" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  // Handle edit button click
  const handleEditClick = (record) => {
    try {
      navigate(`/edit-article/${record.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Update handleDeleteClick
  const handleDeleteClick = (recordId) => {
    setRecordToDelete(recordId);
    setDeleteModalOpen(true);
  };

  // Add confirmation handler
  const handleConfirmDelete = () => {
    if (recordToDelete) {
      api
        .delete(`/api/contents/articles/delete/${recordToDelete}`)
        .then(() => {
          toast.success('Article deleted successfully', {
            onClose: () => navigate('/all-post-history'),
          });
          setDeleteModalOpen(false);
          setRecordToDelete(null);
        })
        .catch((error) => {
          console.error('Error deleting record:', error);
          toast.error('Failed to delete article');
        });
    }
  };

  // Add DeleteConfirmationModal component
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const { sidebarCollapsed } = useSidebar();

    return (
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 mt-[4rem] transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[6rem]' : 'ml-[21rem]'
        }`}
      >
        <div className="bg-white rounded-lg p-6 w-[30rem]">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <XMarkIcon className="h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-4">Delete Confirmation</h3>
          <p className="mb-6 text-gray-600">
            Are you sure you want to delete this article record?
          </p>
          <div className="flex justify-end gap-4 pb-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add WordPress Modal Component
  const WordPressPublishModal = ({ isOpen, onClose, articleID }) => {
    const { sidebarCollapsed } = useSidebar();
    const [wordPressSites, setWordPressSites] = useState([]);
    const [currentWordPressSite, setCurrentWordPressSite] = useState({
      wpUrl: '',
      wpUsername: '',
      wpPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [WordPressPublishFormErrors, setWordPressPublishFormErrors] =
      useState({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
      });
    const [isVerifying, setIsVerifying] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    if (!isOpen) return null;

    const handleFormInputDataChange = (e) => {
      setCurrentWordPressSite((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleVerify = async (e) => {
      e.preventDefault();

      setIsVerifying(true);
      setWordPressPublishFormErrors({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
      });

      try {
        const response = await api.post(
          '/api/contents/articles/verify-wordpress-site',
          currentWordPressSite
        );
        if (response.data.success) {
          setWordPressSites((prev) => [...prev, currentWordPressSite]);
          setCurrentWordPressSite({
            wpUrl: '',
            wpUsername: '',
            wpPassword: '',
          });
          toast.success('WordPress site verified successfully!');
          setIsVerifying(false);
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

    const handleAddSite = (e) => {
      e.preventDefault();
      handleVerify(e);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsPublishing(true);

      try {
        const response = await api.post('/api/contents/articles/publish', {
          articleID,
          wordPressSites,
        });

        toast.success(
          `Article published successfully ${response.data.success_count} of ${response.data.total_sites}!`
        );
        setIsPublishing(false);
        setWordPressSites([]);
        onClose();
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to publish article'
        );
        setIsPublishing(false);
      }
    };

    return (
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 mt-[4rem] transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[6rem]' : 'ml-[21rem]'
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl w-[45rem] p-6 max-h-[40rem] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-row gap-2">
              <FaWordpress className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-semibold text-blue-500">
                Publish to WordPress Sites
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 rounded-xl"
            >
              <XMarkIcon className="h-8 w-8 text-gray-400 hover:text-red-500" />
            </button>
          </div>

          {/* Add New Site Form */}
          <div>
            <form onSubmit={handleAddSite} className="space-y-4">
              <div className="border px-4 py-6 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WordPress Site URL
                  </label>
                  <input
                    type="url"
                    name="wpUrl"
                    value={currentWordPressSite.wpUrl}
                    onChange={handleFormInputDataChange}
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
                    value={currentWordPressSite.wpUsername}
                    onChange={handleFormInputDataChange}
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
                    Application Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="wpPassword"
                      value={currentWordPressSite.wpPassword}
                      onChange={handleFormInputDataChange}
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
              <div className="flex justify-end gap-4">
                {/* <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Site
                </button> */}
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
                {/* {wordPressSites.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Publish to All Sites
                  </button>
                )} */}
              </div>
            </form>
          </div>

          {/* Added Sites Table */}
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
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex flex-row gap-2 px-4 py-2 text-red-400 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                Cancel
              </button>
              {/* {wordPressSites.length > 0 ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Publish to All Sites
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg opacity-50 cursor-not-allowed"
                  title="Add at least one WordPress site to publish"
                >
                  Publish to All Sites
                </button>
              )} */}
              <div>
                {wordPressSites.length > 0 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isPublishing}
                    className={`flex items-center justify-center gap-2 px-4 py-2 ${
                      isPublishing
                        ? 'bg-green-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white rounded-lg transition-all duration-200`}
                  >
                    {isPublishing ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Publish Article'
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg opacity-50 cursor-not-allowed"
                    title="Add at least one WordPress site to publish"
                  >
                    Publish Article
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* Component's main return statement */
  return (
    <>
      <div className="h-full w-full bg-white pt-3 pb-3 rounded-lg shadow-lg">
        {/* <div className="min-h-full bg-white shadow-2xl"> */}
        <div className="relative z-10">
          {/* <div className="bg-[rgba(245, 244, 243, 1)] pb-4 pt-[3rem] mt-[1rem] -z-10"> */}
          {/* Action Buttons */}
          <div className="mx-4 flex justify-start gap-2 border-2 border-blue-100 rounded-md bg-blue-50 px-4 py-4">
            <div className="flex flex-row gap-2">
              <CommandLineIcon
                className="h-8 w-8 text-gray-600 text-center my-auto"
                title="Actions"
              />
              <div className="h-10 border-l-2 border-gray-300 mx-2 my-auto"></div>
            </div>
            <div className="flex flex-row gap-2">
              <button
                onClick={() => handleEditClick(record)}
                disabled={!editArticle}
                className={`flex flex-row gap-2 px-4 py-2 ${
                  !editArticle
                    ? 'bg-gray-300 rounded-lg cursor-not-allowed'
                    : 'bg-blue-500 rounded-lg hover:bg-blue-600'
                } text-white`}
              >
                <PencilSquareIcon className="h-5 w-5" />
                Edit Article
              </button>
              <button
                onClick={() => handleDeleteClick(record.id)}
                disabled={!deleteArticle}
                className={`flex flex-row gap-2 px-4 py-2 ${
                  !deleteArticle
                    ? 'bg-gray-300 rounded-lg cursor-not-allowed'
                    : 'bg-blue-500 rounded-lg hover:bg-blue-600'
                } text-white`}
              >
                <TrashIcon className="h-5 w-5" />
                Delete Article
              </button>
              <button
                onClick={() => setIsWordPressModalOpen(true)}
                disabled={!publishArticleToWordPress}
                className={`flex flex-row gap-2 px-4 py-2 ${
                  !publishArticleToWordPress
                    ? 'bg-gray-300 rounded-lg cursor-not-allowed'
                    : 'bg-blue-500 rounded-lg hover:bg-blue-600'
                } text-white`}
              >
                <FaWordpress className="h-5 w-5" />
                Publish to WordPress
              </button>
            </div>
          </div>
          {/* Article Content */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-4 mx-4 border border-gray-100 overflow-hidden">
            {record?.article_content ? (
              <div>
                {/* Article Header - Sticky Title */}
                <div
                  className={`sticky inset-x-0 top-[2rem] title-header z-10 transition-all duration-300 ${
                    isSticky
                      ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md py-3'
                      : 'bg-white border-b border-gray-200 py-4'
                  }`}
                >
                  <div className="flex items-center gap-4 px-6 max-w-5xl mx-auto">
                    <div className="hidden sm:flex items-center justify-center bg-blue-50 p-2 rounded-full">
                      <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex-1 truncate">
                      {record.article_heading}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="hidden md:inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {record.article_type || 'Short Article'}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600 border border-green-100">
                        {record.article_status || 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article Content Container */}
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-70 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-50 to-transparent rounded-tr-full opacity-70 pointer-events-none"></div>

                  {/* Content area with metadata */}
                  <div className="px-4 sm:px-8 py-8 relative">
                    {/* Article metadata */}
                    <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-500 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        {/* Article's Created Date */}
                        <span>
                          {new Date(
                            record.created_at || Date.now()
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                        {/* Article's Words Count */}
                        <span>
                          {record.article_content
                            .split(/\s+/)
                            .filter(Boolean)
                            .length.toLocaleString()}{' '}
                          words
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span>{record.author || 'AI Generated'}</span>
                      </div>
                      <div className="ml-auto flex items-center">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium border border-blue-100">
                          Reading time:{' '}
                          {Math.ceil(
                            record.article_content.split(/\s+/).filter(Boolean)
                              .length / 200
                          )}{' '}
                          min
                        </span>
                      </div>
                    </div>

                    {/* Article content with enhanced styling */}
                    <div
                      className="prose prose-lg max-w-none 
              prose-headings:font-semibold 
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:font-bold prose-h1:text-gray-900
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:font-bold prose-h2:text-gray-800
              prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-6 prose-h3:font-semibold prose-h3:text-gray-800
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-blockquote:italic prose-blockquote:text-gray-700
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
              prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
              prose-li:marker:text-blue-500 prose-li:my-1
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-gray-50 prose-th:p-2 prose-th:border prose-th:border-gray-200
              prose-td:p-2 prose-td:border prose-td:border-gray-200
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto"
                    >
                      {renderContent(record.article_content)}
                    </div>

                    {/* Word count summary at the bottom */}
                    <div className="mt-12 flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Article length
                          </p>
                          <p className="font-medium text-gray-900">
                            {record.article_content
                              .split(/\s+/)
                              .filter(Boolean)
                              .length.toLocaleString()}{' '}
                            words
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">
                          Last updated
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(
                            record.updated_at || record.created_at || Date.now()
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Bottom decoration */}
                    <div className="mt-8 flex justify-center">
                      <div className="h-1 w-16 bg-gradient-to-r from-blue-300 to-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 rounded-xl">
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 blur-xl scale-150 animate-pulse"></div>
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center px-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Loading Your Article
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div
                      className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0s' }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                  <p className="text-gray-500 max-w-sm">
                    We're preparing your content for viewing. This will only
                    take a moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* Add FloatingButtonForScrollTop */}
      <FloatingButtonForScrollTop />
      {/* WordPress Publish Modal */}
      <WordPressPublishModal
        isOpen={isWordPressModalOpen}
        onClose={() => setIsWordPressModalOpen(false)}
        articleID={record.id}
      />
      {/** Delete Confirmation Modal */}
      <div>
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setRecordToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
      {/* Toast container */}
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default ViewSpecificArticle;
