import React from "react";
import styles from "./CustomPagination.module.css"; // Assuming you'll add custom styles

export const CustomPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.itemsPerPage}>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
        >
          {[5, 10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.currentPage}>{currentPage}</div>

      <div className={styles.pageControls}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr; Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};
