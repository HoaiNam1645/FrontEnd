"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FaList, FaCog } from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryDropdown() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories/getAll");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-dropdown">
      <button 
        className="nav-link"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <FaList />
        <span>Danh Mục</span>
      </button>
      
      {isOpen && (
        <div 
          className="dropdown-content"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link href="/category" className="dropdown-item">
            <FaCog />
            <span>Quản Lý Danh Mục</span>
          </Link>
          <div className="dropdown-divider"></div>
          <div className="dropdown-section">
            <div className="dropdown-section-title">Danh Sách Danh Mục</div>
            {categories.map((category) => (
              <Link 
                key={category._id}
                href={`/product?categoryId=${category._id}`}
                className="dropdown-item"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 