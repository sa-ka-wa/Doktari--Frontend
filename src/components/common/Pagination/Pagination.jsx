// src/components/common/Pagination/Pagination.jsx
import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  siblingCount = 1,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageItem = (page, index) => {
    if (page === "...") {
      return (
        <span key={`dots-${index}`} className="pagination-dots">
          ...
        </span>
      );
    }

    return (
      <button
        key={page}
        className={`pagination-item ${currentPage === page ? "active" : ""}`}
        onClick={() => handlePageClick(page)}
        aria-label={`Go to page ${page}`}
        aria-current={currentPage === page ? "page" : undefined}
      >
        {page}
      </button>
    );
  };

  return (
    <nav className={`pagination ${className}`} aria-label="Pagination">
      <ul className="pagination-list">
        {showFirstLast && currentPage > 1 && (
          <li>
            <button
              className="pagination-item pagination-first"
              onClick={() => handlePageClick(1)}
              aria-label="Go to first page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
          </li>
        )}

        {showPrevNext && currentPage > 1 && (
          <li>
            <button
              className="pagination-item pagination-prev"
              onClick={() => handlePageClick(currentPage - 1)}
              aria-label="Go to previous page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </li>
        )}

        {pageNumbers.map((page, index) => (
          <li key={typeof page === "number" ? page : `dots-${index}`}>
            {renderPageItem(page, index)}
          </li>
        ))}

        {showPrevNext && currentPage < totalPages && (
          <li>
            <button
              className="pagination-item pagination-next"
              onClick={() => handlePageClick(currentPage + 1)}
              aria-label="Go to next page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </li>
        )}

        {showFirstLast && currentPage < totalPages && (
          <li>
            <button
              className="pagination-item pagination-last"
              onClick={() => handlePageClick(totalPages)}
              aria-label="Go to last page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </button>
          </li>
        )}
      </ul>

      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
};

export default Pagination;
