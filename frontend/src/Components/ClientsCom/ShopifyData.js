import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../api";

export const ShopifyData = () => {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get(`${url}/shopify`);
        setShopData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading shop data: {error.message}</p>;

  return (
    <div>
      <h1>Shop Data</h1>
      <pre>{JSON.stringify(shopData, null, 2)}</pre>
    </div>
  );
};
