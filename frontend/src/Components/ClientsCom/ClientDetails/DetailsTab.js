import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./DetailsTab.module.css";
import { useAppContext } from "../../Context/AppContext";
import { DetailsTabTop } from "./DetailsTabTop";
import { url } from "../../../api";

export const DetailsTab = ({ clientId }) => {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(null);
  const [isActive, setIsActive] = useState(false);
  console.log("clientIDDD", clientId);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch client details on component mount
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`${url}/clients/${clientId}`);
        const client = response.data;
        setClientName(client.clientName);
        setPhone(client.phone);
        setEmail(client.email);
        // setIsActive(client.isActive);
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Failed to fetch client details");
      }
    };

    fetchClientDetails();
  }, [clientId]);

  const handleSave = async () => {
    try {
      const updatedClient = {
        clientName,
        phone,
        email,
        isActive,
      };
      await axios.put(`${url}/clients/addclients/${clientId}`, updatedClient);
      toast.success("Client details updated successfully");
    } catch (error) {
      console.error("Error updating client details:", error);
      toast.error("Failed to update client details");
    }
  };

  const handleToggle = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const handleCancel = () => {
    // Reload the client details from the server
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`${url}/clients/${clientId}`);
        const client = response.data;
        setClientName(client.clientName);
        setPhone(client.phone);
        setEmail(client.email);
        // setIsActive(client.isActive);
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Failed to fetch client details");
      }
    };

    fetchClientDetails();
    toast("Changes have been reverted");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`${url}/clients/addclients/${clientId}`);
        toast.success("Client deleted successfully");
        navigate("/addclients");
        // Redirect to clients list
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Failed to delete client");
      }
    }
  };

  return (
    <div>
      <div className={styles.profileDetails} style={{ maxWidth: "900px" }}>
        <div className={styles.profilebottom}>
          <div className="inputFields" style={{ minWidth: "355px" }}>
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                // onKeyPress={handleNameKeyPress}
              />
            </div>
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputFUllName"
                value={email}
              />
            </div>

            <div className="form-group mb-2">
              <label>Phone</label>
              <input
                type="number"
                className="form-control"
                id="exampleInputConfirm_Password"
                placeholder="+1"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              {/* <label>Status</label> */}
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  checked={isActive}
                  onChange={handleToggle}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckDefault"
                >
                  {isActive ? "Active" : "Inactive"}
                </label>
              </div>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
          <DetailsTabTop handleSave={handleSave} handleCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};
