import React from "react";
import styles from "./CustomPagination.module.css"; // Assuming you'll add custom styles

export const CustomPagination = ({
  currentPage,
  itemsPerPage,
  handlePageChange,
  handleItemsPerPageChange,
  totalPages,
}) => {
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pageControls}>
        <div className={styles.itemsPerPage}>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              disabled={currentPage === i + 1}
              className={`${styles.paginationButton} ${
                currentPage === i + 1 ? styles.activeButton : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
