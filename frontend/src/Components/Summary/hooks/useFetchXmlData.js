import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchXmlData = () => {
  const [xmlData, setXmlData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipmentsId, setShipmentsId] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/summary/getShipmentsId"
        );
        console.log("response", response);
        setShipmentsId(response.data.shipmentsId); // Save the shipment data to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shipments:", error);
        setError("Failed to fetch shipment data");
        setLoading(false);
      }
    };

    fetchShipments(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    const fetchXmlData = async () => {
      try {
        const response = await axios(
          "http://localhost:5000/summary/convert-xml"
        );
        const files = response.data.files; // assuming `files` is an array

        console.log("Converted XML to JSON:", files);

        // Process and format data for each file dynamically
        const formattedFiles = files.map((file) => {
          const data = file.data.ORDER; // Assuming ORDER is the relevant data in each file
          console.log("inside", data);
          console.log("inside file", file.data.ORDER.Header[0]);

          // Format the data as required
          return {
            scheduledShipDate: data?.Header[0]?.scheduledShipDate[0],
            // scheduledShipDate: "2024-10-31 19:35",
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
              type: data?.Header[0]?.static_Type[0] || "",
              packages: [
                {
                  height: data?.Header[0]?.dimension_height[0],
                  length: data?.Header[0]?.dimension_length[0],
                  width: data?.Header[0]?.dimension_width[0],
                  dimensionUnit: data?.Header[0]?.dimensionUnit[0],
                  weight: data?.Header[0]?.dimension_weight[0],
                  weightUnit: data?.Header[0]?.weightUnit[0],
                  insuranceAmount: data?.Header[0]?.insuranceAmount[0],
                  description: data?.Header[0]?.description[0],
                },
              ],
            },
            reference1: data?.Header[0]?.ReferenceCode1[0] || "",
            reference2: data?.Header[0]?.ReferenceCode2[0] || "",
            reference3: data?.Header[0]?.ReferenceCode3[0] || "",
            // signatureRequired: "No",
            signatureRequired: data?.Header[0]?.SignatureRequired[0] || "",
            insuranceType: data?.Header[0]?.InsuranceType[0] || "",
            pickup: {
              contactName: data?.Header[0]?.contactName[0],
              phoneNumber: data?.Header[0]?.phoneNumber[0],
              // pickupDate: data?.Header[0]?.pickupDate[0],
              pickupDate: "2024-10-31",
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
