import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../../../api";

export const ClientDetailTop = () => {
  const [client, setClient] = useState("");
  const { id } = useParams();
  console.log("id", id);

  useEffect(() => {
    const fetchClientSingleRecord = async () => {
      try {
        const response = await axios.get(`${url}/clients/${id}`);
        console.log("resawse", response.data);
        setClient(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClientSingleRecord();
  }, []);

  return (
    <div>
      <span>Clients</span> / <span>{client.clientName}</span>
    </div>
  );
};
