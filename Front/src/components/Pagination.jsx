
 import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="mt-4 d-flex justify-content-center">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            السابق
          </button>
        </li>
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page && "active"}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            التالي
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
