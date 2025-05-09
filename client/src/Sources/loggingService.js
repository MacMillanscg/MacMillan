// src/services/loggingService.js
export const loggingService = {
  addLog(type, message) {
    const logEntry = { type, message, timestamp: new Date().toISOString() };
    const logs = JSON.parse(localStorage.getItem("appLogs")) || [];
    logs.push(logEntry);
    localStorage.setItem("appLogs", JSON.stringify(logs));
  },

  getLogs() {
    return JSON.parse(localStorage.getItem("appLogs")) || [];
  },

  clearLogs() {
    localStorage.removeItem("appLogs");
  },
};
