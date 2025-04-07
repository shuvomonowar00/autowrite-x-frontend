import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  ChartBarIcon,
  PencilIcon,
  CheckCircleIcon,
  BoltIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  SparklesIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { FaWordpress, FaBlogger, FaMedium } from 'react-icons/fa';
import api from '../lib/api';
import FloatingButtonForScrollTop from '../features/commonFeatures/FloatingButtonForScrollTop';

function ClientDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_articles: 0,
      published_articles: 0,
      total_words: 0,
      publication_rate: 0,
    },
    recent_articles: [],
    platform_stats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Actual API call
        const response = await api.get('/api/client/dashboard/stats');
        setDashboardData(response.data);
        console.log('Dashboard data:', response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Add truncate function
  const truncateArticleTitle = (title, maxLength = 40) => {
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  // Function to format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  // Function to generate a gradient based on value
  const getGradient = (index) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-emerald-500 to-emerald-600',
      'from-amber-500 to-amber-600',
      'from-rose-500 to-rose-600',
      'from-indigo-500 to-indigo-600',
    ];
    return gradients[index % gradients.length];
  };

  // Function to get platform icon
  const getPlatformIcon = (platform) => {
    if (!platform) {
      return <GlobeAltIcon className="h-4 w-4 text-white" />;
    }

    const platformName =
      typeof platform === 'string' ? platform.toLowerCase() : '';

    switch (platformName) {
      case 'wordpress':
        return <FaWordpress className="h-4 w-4 text-white" />;
      case 'blogger':
        return <FaBlogger className="h-4 w-4 text-white" />;
      case 'medium':
        return <FaMedium className="h-4 w-4 text-white" />;
      default:
        return <GlobeAltIcon className="h-4 w-4 text-white" />;
    }
  };

  // Calculate pending articles
  const pendingArticles =
    dashboardData.stats.total_articles - dashboardData.stats.published_articles;

  return (
    <>
      <div className="h-full w-full bg-white pt-3 pb-3 rounded-lg shadow-lg">
        {/* <div className="min-h-full bg-white pb-4 pt-[4rem]"> */}
        <div className="px-6">
          {/* Welcome section Design 01 */}
          {/* <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Get an overview of your content creation and publishing activities
            </p>
          </div> */}

          {/* Welcome section Design 02 */}
          {/* <div className="mb-10">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="hidden sm:block">
                  <div className="p-3 bg-blue-100 rounded-lg shadow-sm">
                    <SparklesIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                    Welcome to your Dashboard
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base max-w-2xl leading-relaxed">
                    Get a complete overview of your content creation journey.
                    Track your publishing activities, monitor content
                    performance, and discover new opportunities to grow your
                    audience.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Link
                      to="/bulk-article-generation"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Create New</span>
                    </Link>
                    <Link
                      to="/dashboard/analytics"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                      <span>View Analytics</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Welcome section Design 03 */}
          <div className="mb-10">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex p-4 bg-white rounded-xl shadow-sm">
                  <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-lg">
                    <SparklesIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="inline-block mb-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Dashboard Overview
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
                    Welcome to your AutoWriteX Dashboard
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base max-w-2xl leading-relaxed">
                    Get a comprehensive view of your content creation journey.
                    Track your publishing activities, monitor content
                    performance, and discover insights to grow your audience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> */}
          {/* Cards design 01 */}
          {/* Card 1: Total Articles */}
          {/* <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="absolute right-0 top-0 mt-4 mr-4 opacity-20">
                <DocumentTextIcon className="h-16 w-16" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Total Articles</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-20 bg-blue-300/40 animate-pulse rounded"></div>
                  ) : (
                    formatNumber(dashboardData.stats.total_articles)
                  )}
                </span>
              </div>
              <div className="mt-4 flex items-center text-blue-100">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {isLoading ? (
                    <div className="h-4 w-24 bg-blue-300/40 animate-pulse rounded"></div>
                  ) : (
                    `${pendingArticles} still pending to publish`
                  )}
                </span>
              </div>
            </div> */}

          {/* Card 2: Published Articles */}
          {/* <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="absolute right-0 top-0 mt-4 mr-4 opacity-20">
                <CheckCircleIcon className="h-16 w-16" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Published Articles</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-20 bg-emerald-300/40 animate-pulse rounded"></div>
                  ) : (
                    formatNumber(dashboardData.stats.published_articles)
                  )}
                </span>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-emerald-300/30">
                    <div
                      style={{
                        width: isLoading
                          ? '60%'
                          : `${dashboardData.stats.publication_rate}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white"
                    ></div>
                  </div>
                  <div className="text-sm text-emerald-100">
                    {isLoading ? (
                      <div className="h-4 w-24 bg-emerald-300/40 animate-pulse rounded"></div>
                    ) : (
                      `${dashboardData.stats.publication_rate}% of all articles`
                    )}
                  </div>
                </div>
              </div>
            </div> */}

          {/* Card 3: Total Word Count */}
          {/* <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="absolute right-0 top-0 mt-4 mr-4 opacity-20">
                <ChartBarIcon className="h-16 w-16" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Total Word Count</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-24 bg-purple-300/40 animate-pulse rounded"></div>
                  ) : (
                    formatNumber(dashboardData.stats.total_words)
                  )}
                </span>
              </div>
              <div className="mt-4 flex items-center text-purple-100">
                <BoltIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {isLoading ? (
                    <div className="h-4 w-32 bg-purple-300/40 animate-pulse rounded"></div>
                  ) : dashboardData.stats.total_articles > 0 ? (
                    `Avg ${Math.round(dashboardData.stats.total_words / dashboardData.stats.total_articles)} words per article`
                  ) : (
                    'No articles yet'
                  )}
                </span>
              </div>
            </div>
          </div> */}

          {/* Cards design 02 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Total Articles - Blue Theme */}
            <div className="bg-white rounded-xl border-2 border-blue-300 shadow-md p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:border-blue-400 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full z-0 opacity-70"></div>
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DocumentTextIcon className="h-24 w-24 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-medium text-gray-700">
                    Total Articles
                  </h3>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {isLoading ? (
                      <div className="h-8 w-20 bg-blue-100 animate-pulse rounded"></div>
                    ) : (
                      formatNumber(dashboardData.stats.total_articles)
                    )}
                  </span>
                </div>
                <div className="mt-6 flex items-center text-gray-600 bg-gradient-to-r from-blue-50 to-white px-3 py-2 rounded-lg border border-blue-100">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-blue-600" />
                  <span className="text-sm">
                    {isLoading ? (
                      <div className="h-4 w-24 bg-blue-100 animate-pulse rounded"></div>
                    ) : (
                      `${pendingArticles} still pending to publish`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Published Articles - Emerald Theme */}
            <div className="bg-white rounded-xl border-2 border-emerald-300 shadow-md p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:border-emerald-400 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100 to-transparent rounded-bl-full z-0 opacity-70"></div>
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircleIcon className="h-24 w-24 text-emerald-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-medium text-gray-700">
                    Published Articles
                  </h3>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-emerald-600">
                    {isLoading ? (
                      <div className="h-8 w-20 bg-emerald-100 animate-pulse rounded"></div>
                    ) : (
                      formatNumber(dashboardData.stats.published_articles)
                    )}
                  </span>
                </div>
                <div className="mt-6">
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-gray-600">
                        {isLoading ? (
                          <div className="h-4 w-24 bg-emerald-100 animate-pulse rounded"></div>
                        ) : (
                          `${dashboardData.stats.publication_rate}% of all articles`
                        )}
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-emerald-100 border border-emerald-200">
                      <div
                        style={{
                          width: isLoading
                            ? '60%'
                            : `${dashboardData.stats.publication_rate}%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Total Word Count - Indigo Theme */}
            <div className="bg-white rounded-xl border-2 border-indigo-300 shadow-md p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:border-indigo-400 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full z-0 opacity-70"></div>
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ChartBarIcon className="h-24 w-24 text-indigo-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ChartBarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-base font-medium text-gray-700">
                    Total Word Count
                  </h3>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-indigo-600">
                    {isLoading ? (
                      <div className="h-8 w-24 bg-indigo-100 animate-pulse rounded"></div>
                    ) : (
                      formatNumber(dashboardData.stats.total_words)
                    )}
                  </span>
                </div>
                <div className="mt-6 flex items-center text-gray-600 bg-gradient-to-r from-indigo-50 to-white px-3 py-2 rounded-lg border border-indigo-100">
                  <BoltIcon className="h-4 w-4 mr-1 text-indigo-600" />
                  <span className="text-sm">
                    {isLoading ? (
                      <div className="h-4 w-32 bg-indigo-100 animate-pulse rounded"></div>
                    ) : dashboardData.stats.total_articles > 0 ? (
                      `Avg ${Math.round(dashboardData.stats.total_words / dashboardData.stats.total_articles)} words per article`
                    ) : (
                      'No articles yet'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-column layout for article list and quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Recent Articles */}
            {/* Recent Column Design 01 */}
            {/* <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Recent Articles
                  </h2>
                  <Link
                    to="/all-post-history"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    View All
                    <svg
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-gray-100 rounded-lg p-4"
                      >
                        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : dashboardData.recent_articles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        No articles yet
                      </p>
                      <p className="text-gray-600 mb-4">
                        Start creating content to see your articles here.
                      </p>
                      <Link
                        to="/bulk-article-generation"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        Create Your First Article
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dashboardData.recent_articles.map((article) => (
                          <tr
                            key={article.id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() =>
                              navigate(`/article-details/${article.id}`)
                            }
                          >
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {truncateArticleTitle(article.article_heading)}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {article.article_type}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  article.article_status === 'Published'
                                    ? 'bg-green-100 text-green-800'
                                    : article.article_status === 'Success'
                                      ? 'bg-blue-100 text-blue-800'
                                      : article.article_status === 'Draft'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {article.article_status}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                article.created_at
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div> */}

            {/* Recent Column Design 02 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-blue-100 shadow-md p-6 h-full overflow-hidden">
                {/* Header with gradient accent */}
                <div className="relative mb-6 pb-4 border-b border-gray-100">
                  <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <div className="p-2 mr-2 bg-blue-50 rounded-lg">
                        <ClockIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      Recent Articles
                    </h2>
                    <Link
                      to="/all-post-history"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View All
                      <svg
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : dashboardData.recent_articles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center shadow-sm border border-blue-100 max-w-md">
                      <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        No articles yet
                      </p>
                      <p className="text-gray-600 mb-6">
                        Start creating content to see your articles here.
                      </p>
                      <Link
                        to="/bulk-article-generation"
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          Create Your First Article
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-100">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dashboardData.recent_articles.map((article) => (
                          <tr
                            key={article.id}
                            className="hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={() =>
                              navigate(`/article-details/${article.id}`)
                            }
                          >
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {truncateArticleTitle(article.article_heading)}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {article.article_type}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  article.article_status === 'Published'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : article.article_status === 'Success'
                                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                      : article.article_status === 'Draft'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}
                              >
                                {article.article_status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(
                                article.created_at
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Quick Actions and Publishing Stats Design 01 */}
            {/* <div className="space-y-6"> */}
            {/* Quick Actions */}
            {/* <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <RocketLaunchIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    to="/bulk-article-generation"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-500 transition-colors">
                      <PencilIcon className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Generate New Articles
                      </h3>
                      <p className="text-sm text-gray-500">
                        Create AI-powered content
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/all-post-history"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-lg hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-purple-100 p-2 rounded-full group-hover:bg-purple-500 transition-colors">
                      <DocumentTextIcon className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Manage Articles
                      </h3>
                      <p className="text-sm text-gray-500">
                        View, edit or publish content
                      </p>
                    </div>
                  </Link>
                </div>
              </div> */}

            {/* Publishing Stats */}
            {/* <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Publishing Stats
                </h2>

                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : dashboardData.platform_stats.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      No publishing data available yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.platform_stats.map((platform, index) => (
                      <div
                        key={platform.platform_name}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full bg-gradient-to-br ${getGradient(index)}`}
                          >
                            {getPlatformIcon(
                              platform?.platform ||
                                platform?.platform_name ||
                                ''
                            )}
                          </div>
                          <span className="font-medium text-gray-700">
                            {platform.platform_name}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900">
                            {platform.article_count}
                          </span>
                          <span className="text-gray-500 ml-1">posts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div> */}

            {/* Right column: Quick Actions and Publishing Stats Design 02 */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-blue-100 shadow-md p-6 relative">
                {/* Header with gradient accent */}
                <div className="relative mb-6 pb-4 border-b border-gray-100">
                  <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="p-2 mr-2 bg-blue-50 rounded-lg">
                      <RocketLaunchIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    Quick Actions
                  </h2>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/bulk-article-generation"
                    className="flex items-center gap-3 p-5 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-500 transition-colors">
                      <PencilIcon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">
                        Generate New Articles
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Create AI-powered content for your platforms
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/all-post-history"
                    className="flex items-center gap-3 p-5 bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-lg hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-500 transition-colors">
                      <DocumentTextIcon className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">
                        Manage Articles
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        View, edit or publish content to your platforms
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Publishing Stats */}
              <div className="bg-white rounded-xl border border-blue-100 shadow-md p-8 relative">
                {/* Header with gradient accent */}
                <div className="relative mb-6 pb-4 border-b border-gray-100">
                  <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="p-2 mr-2 bg-emerald-50 rounded-lg">
                      <GlobeAltIcon className="h-5 w-5 text-emerald-500" />
                    </div>
                    Publishing Stats
                  </h2>
                </div>

                {isLoading ? (
                  <div className="space-y-5">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse"></div>
                          <div className="h-5 w-24 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                        <div className="h-7 w-12 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    ))}
                    <div className="h-10"></div>
                  </div>
                ) : dashboardData.platform_stats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 px-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-5 border border-gray-100">
                      <GlobeAltIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2 text-center">
                      No publishing data available yet
                    </p>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Publish your first article to see stats here
                    </p>
                    <div className="h-10"></div>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-5">
                      {dashboardData.platform_stats.map((platform, index) => (
                        <div
                          key={platform.platform_name}
                          className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-full bg-gradient-to-br ${getGradient(index)}`}
                            >
                              {getPlatformIcon(
                                platform?.platform ||
                                  platform?.platform_name ||
                                  ''
                              )}
                            </div>
                            <span className="font-medium text-gray-700 text-base">
                              {platform.platform_name}
                            </span>
                          </div>
                          <div className="bg-gray-50 px-3.5 py-2 rounded-full border border-gray-100">
                            <span className="font-bold text-gray-900">
                              {platform.article_count}
                            </span>
                            <span className="text-gray-500 ml-1">posts</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Extra space to match height */}
                    <div className="mt-6 bg-gradient-to-r from-emerald-50 to-white p-4 rounded-lg border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            Publication rate
                          </span>
                        </div>
                        <span className="text-sm font-medium text-emerald-600">
                          {dashboardData.stats.publication_rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips and Insights Section */}
          <div className="mt-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-xl shadow-md p-6 border border-blue-100 mb-[2rem]">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Pro Tip
                </h2>
                <p className="text-gray-600">
                  Regular content creation is key to building audience
                  engagement. Try publishing at least 3-5 articles per week for
                  optimal results.
                </p>
                <Link
                  to="/bulk-article-generation"
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start creating now
                  <svg
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /div> */}
      {/* Add FloatingButtonForScrollTop */}
      <FloatingButtonForScrollTop />
    </>
  );
}

export default ClientDashboard;
