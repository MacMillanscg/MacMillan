import React, { useState } from "react";
import styles from "./ClientsCom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import clientsData from "./ClientsData";
import { AddClients } from "./AddClients";

export const ClientsCom = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("ismodal", isModalOpen);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.clientHeader}>
        <h2 className={styles.heading2}>Clients</h2>
        <div className={styles.clientsRight}>
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="exampleInputEmail"
              placeholder="Search clients"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
            />
            {/* <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> */}
          </div>
          <div className={styles.selectFilterOption}>
            <select name="" id="" className={styles.selectFilter}>
              <option value="">Filter</option>
              <option value="">client1</option>
              <option value="">client2</option>
              <option value="">client3</option>
            </select>
            {/* <FontAwesomeIcon
              icon={faChevronDown}
              className={styles.filterIcon}
            /> */}
          </div>
          <Link
            to="/clients/addClient"
            className={`btn btn-success ${styles.addBtn} ms-4`}
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
            Add Client
          </Link>
        </div>
      </div>
      <div className={styles.cardSection}>
        {clientsData.map((client, index) => (
          <Link
            to={`/clients/clientList`}
            className={styles.cardWrap}
            key={index}
          >
            <div className={`card ${styles.clientCard}`}>
              <div className="card-body pt-4 px-4">
                {/* <img src={amazonImg} className={styles.clientImg} alt="" /> */}
                <div className="cardTitle">
                  <h2 className={styles.title}>T</h2>
                </div>
                <h3 className={styles.cardTitle}>{client.title}</h3>
                <p className={styles.content}> {client.content}</p>
                <p className={styles.externalId}>External ID: 1234</p>
                <div className="category">
                  <div className={styles.list}>
                    <div className={styles.listItem}>
                      <div className="listItemLeft">
                        <div className={styles.listItems}>
                          <Link to="#" className={styles.listText}>
                            <span className={styles.enabledClient}>
                              {client.enabledInstances}{" "}
                            </span>
                            <span className={styles.enabled}>
                              Enabled Instances
                            </span>
                          </Link>{" "}
                        </div>
                      </div>
                      <div className="listItemRight">
                        <div className={styles.listItems}>
                          <Link to="#" className={styles.listText}>
                            <span className={styles.enabledClient}>
                              {client.enabledInstances}{" "}
                            </span>
                            <span className={styles.enabled}>
                              Triggered Monitors
                            </span>
                          </Link>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* {<AddClients closeModal={closeModal} />} */}
    </div>
  );
};
