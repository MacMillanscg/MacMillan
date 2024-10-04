import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./DetailsTab.module.css";
import { useAppContext } from "../../Context/AppContext";
import { DetailsTabTop } from "./DetailsTabTop";
import { url } from "../../../api";
import { ConfirmCancelPopUp } from "../../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const DetailsTab = ({ clientId }) => {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [originalData, setOriginalData] = useState({
    clientName: "",
    phone: "",
    email: "",
    isActive: "",
  });
  const [showdeleteModal, setShowDeleteModal] = useState(false);

  console.log("clientIDDD", clientId);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch client details on component mount
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`${url}/clients/${clientId}`);
        const client = response.data;
        console.log("updated", response.data);
        setClientName(client.clientName);
        setPhone(client.phone);
        setEmail(client.email);
        setIsActive(client.isActive);
        setOriginalData({
          clientName: client.clientName,
          phone: client.phone,
          email: client.email,
          isActive: client.isActive,
        });
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Failed to fetch client details");
      }
    };

    fetchClientDetails();
  }, [fetchTrigger]);

  const handleSave = async () => {
    if (!clientName || !email || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const updatedClient = {
        clientName,
        phone,
        email,
        isActive,
      };
      await axios.put(`${url}/clients/addclients/${clientId}`, updatedClient);
      toast.success("Client details updated successfully");
      // Update the state directly
      setClientName(updatedClient.clientName);
      setPhone(updatedClient.phone);
      setEmail(updatedClient.email);
      setIsActive(updatedClient.isActive);
      setFetchTrigger((prev) => !prev);
      navigate("/addclients");
    } catch (error) {
      console.error("Error updating client details:", error);
      toast.error("Failed to update client details");
    }
  };

  const handleToggle = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const handleDeletModal = () => {
    setShowDeleteModal(true);
  };
  const cancelDeletModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${url}/clients/addclients/${clientId}`);
      toast.success("Client deleted successfully");
      navigate("/addclients");
      // Redirect to clients list
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  const handleNameKeyPress = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[a-zA-Z ]/.test(char)) {
      e.preventDefault();
    }
  };

  const onhandleCancel = () => {
    if (isDirty()) {
      setShowDialog(true);
    }
  };

  const isDirty = () => {
    return (
      clientName !== originalData.clientName ||
      email !== originalData.email ||
      phone !== originalData.phone ||
      isActive !== originalData.isActive
    );
  };

  const handleOk = () => {
    setShowDialog(false);
    setClientName(originalData.clientName);
    setEmail(originalData.email);
    setPhone(originalData.phone);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <div>
      <div className={styles.profileDetails} style={{ maxWidth: "1025px" }}>
        {showDialog && (
          <ConfirmCancelPopUp
            headerText="Warning"
            bodyText="You have unsaved data. Do you want to continue?"
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonText="Ok"
            cancelButtonText="Cancel"
          />
        )}
        {showdeleteModal && (
          <ConfirmCancelPopUp
            headerText="Warning"
            bodyText="Are you sure you want to delete this record?"
            onOk={handleDelete}
            onCancel={cancelDeletModal}
            okButtonText="Ok"
            cancelButtonText="No"
          />
        )}
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
                onKeyPress={handleNameKeyPress}
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
              <button className={styles.deleteIcon} onClick={handleDeletModal}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
          <DetailsTabTop
            handleSave={handleSave}
            handleCancel={handleCancel}
            onhandleCancel={onhandleCancel}
          />
        </div>
      </div>
    </div>
  );
};
