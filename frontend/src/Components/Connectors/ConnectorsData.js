// connectionData.js
import {
  faSync,
  faThLarge,
  faClock,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

const connectorData = [
  {
    title: "Shopify",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    category: "Application Con..",
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "2 months ago",
    instances: 0,
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ",
  },
  {
    title: "Megento",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    category: "Data plateform",
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "7 days ago",
    instances: 0,
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ",
  },
  {
    title: "Amazon",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    category: "Data plateform",
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "1 month ago",
    instances: 0,
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ",
  },
  // Add more connection objects as needed
];

export default connectorData;
