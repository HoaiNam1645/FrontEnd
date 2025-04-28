'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/breadcrumbs/Breadcrumb';
import NewsDetailPage from '@/components/news-details/NewsDetailPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Detail | E-commerce',
  description: 'News detail page of the e-commerce website',
};

const BlogDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <>
      <Breadcrumb pageName="News Detail" />
      <NewsDetailPage id={id} />
    </>
  );
};

export default BlogDetailPage; 