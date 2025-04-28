'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

interface NewsDetailProps {
  id: string;
}

interface NewsDetail {
  _id: string;
  title: string;
  content: string;
  author: string;
  image_url: string;
  createdAt: string;
}

const NewsDetailPage: React.FC<NewsDetailProps> = ({ id }) => {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/news/get/${id}`);
        setNews(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching news detail:', error);
        setError('Failed to load news details. Please try again later.');
        toast.error('Failed to load news details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-red-500">{error}</p>
          <Link href="/blog" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-lg font-semibold text-yellow-600 mb-2">News Not Found</h3>
          <p className="text-gray-600">The news article you're looking for does not exist or has been removed.</p>
          <Link href="/blog" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {news.image_url && (
          <div className="relative w-full h-[400px]">
            <Image 
              src={news.image_url} 
              alt={news.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{news.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
            <div className="flex items-center mr-6 mb-2">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(news.createdAt)}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaUser className="mr-2" />
              <span>{news.author}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            {/* Render content with proper formatting */}
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/blog" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage; 