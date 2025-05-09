import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { url } from "../../../api";
import styles from "./ClientDetailTop.module.css";

export const ClientDetailTop = () => {
  const [client, setClient] = useState("");
  const { id } = useParams();
  console.log("id", id);

  useEffect(() => {
    const fetchClientSingleRecord = async () => {
      try {
        const response = await axios.get(`${url}/clients/${id}`);
        const clientData = response.data;
        setClient(clientData.clientName);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClientSingleRecord();
  }, []);

  return (
    <div>
      <Link to="/addclients">
        <span className={styles.clients}>Clients</span>
      </Link>{" "}
      / <span className={styles.clientName}>{client}</span>
    </div>
  );
};
