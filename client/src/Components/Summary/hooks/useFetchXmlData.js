import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../../api";

export const useFetchXmlData = () => {
  const [xmlData, setXmlData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipmentsId, setShipmentsId] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axios.get(`${url}/summary/getShipmentsId`);
        console.log("response", response);
        setShipmentsId(response.data.shipmentsId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shipments:", error);
        setError("Failed to fetch shipment data");
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  useEffect(() => {
    const fetchXmlData = async () => {
      try {
        const response = await axios(`${url}/summary/convert-xml`);
        const files = response.data.files; 

        console.log("Converted XML to JSON:", files);

        // Process and format data for each file dynamically
        const formattedFiles = files.map((file) => {
          const data = file?.data?.ORDER;
          if (!data) {
            console.warn("Missing ORDER data in file:", file);
            return {};
          }
        
          const header = data?.Header?.[0];
          if (!header) {
            console.warn("Missing or empty Header data in ORDER:", data);
            return {};
          }
        
          return {
            scheduledShipDate: data?.Header[0]?.scheduledShipDate[0],
            from: {
              attention: data?.Header[0]?.attention[0] || "",
              company: data?.Header[0]?.company[0] || "",
              address1: data?.Header[0]?.address1[0] || "",
              address2: data?.Header[0]?.address2[0] || "",
              city: data?.Header[0]?.city[0] || "",
              province: data?.Header[0]?.province[0] || "",
              country: data?.Header[0]?.country[0] || "",
              zip: data?.Header[0]?.Zip[0] || "",
              email: data?.Header[0]?.email[0] || "",
              phone: data?.Header[0]?.phone[0] || "",
              instructions: data?.Header[0]?.instructions[0] || "",
              residential: false,
              tailgateRequired: false,
              confirmDelivery: true,
              notifyRecipient: true,
            },
            to: {
              attention: data?.Header[0]?.dynamic_attention[0] || "",
              company: data?.Header[0]?.dynamic_company[0] || "",
              address1: data?.Header[0]?.dynamic_address1[0] || "",
              address2: data?.Header[0]?.dynamic_address2[0] || "",
              city: data?.Header[0]?.dynamic_city[0] || "",
              province: data?.Header[0]?.dynamic_province[0] || "",
              country: data?.Header[0]?.dynamic_country[0] || "",
              zip: data?.Header[0]?.dynamic_Zip[0] || "",
              email: data?.Header[0]?.dynamic_email[0] || "",
              phone: data?.Header[0]?.dynamic_phone[0] || "",
              instructions: data?.Header[0]?.static_instructions[0] || "",
              residential: false,
              tailgateRequired: false,
              confirmDelivery: true,
              notifyRecipient: true,
            },
            packagingUnit: data?.Header[0]?.static_packagingUnit[0],
            packages: {
              type: "Package",
              packages: Array.from({ length: parseInt(data?.Header[0]?.Boxes[0] || 1) }, (_, index) => {
                const height = data?.Header[0]?.dimension_height[0] || ""; 
                const length = data?.Header[0]?.dimension_length[0] || "";
                const width = data?.Header[0]?.dimension_width[0] || ""; 
            
                return {
                  height: height,
                  length: length,
                  width: width,
                  dimensionUnit: data?.Header[0]?.dimensionUnit[0] || "in",
                  weight: data?.Header[0]?.dimension_weight[0] || "",  
                  weightUnit: data?.Header[0]?.weightUnit[0] || "lb",
                  insuranceAmount: data?.Header[0]?.insuranceAmount[0] || "", 
                  description: data?.Header[0]?.description[0] || "",
                  uniquePackageId: `Package-${(index + 1).toString()}`
                };
              })
            },
            
            reference1: data?.Header[0]?.ReferenceCode1[0] || "",
            reference2: data?.Header[0]?.ReferenceCode2[0] || "",
            reference3: data?.Header[0]?.ReferenceCode3[0] || "",
            signatureRequired: data?.Header[0]?.SignatureRequired[0] || "",
            insuranceType: data?.Header[0]?.InsuranceType[0] || "",
            pickup: {
              contactName: data?.Header[0]?.contactName[0],
              phoneNumber: data?.Header[0]?.phoneNumber[0],
              pickupDate: data?.Header[0]?.pickupDate[0],
              pickupTime: data?.Header[0]?.pickupTime[0] || "",
              closingTime: data?.Header[0]?.closingTime[0] || "",
              location: data?.Header[0]?.location[0] || "",
              instructions: data?.Header[0]?.pickup_instructions[0] || "",
            },
          };
        });
        

        setXmlData(files); // Store the entire files array
        setFormattedData(formattedFiles); // Store the formatted data for all files
      } catch (error) {
        console.error("Error fetching XML data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchXmlData();
  }, []); // Run only on component mount

  return {
    xmlData,
    formattedData,
    loading,
    error,
    shipmentsId,
    setShipmentsId,
  };
};

