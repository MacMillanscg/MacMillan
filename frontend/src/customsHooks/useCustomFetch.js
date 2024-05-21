import React, { useState, useEffect } from "react";
import axios from "axios";

export const useCustomFetch = (url, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  console.log("hook dtat", data);
  console.log("props", id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [url, id]); // add url as a dependency

  return { data, loading, error };
};
