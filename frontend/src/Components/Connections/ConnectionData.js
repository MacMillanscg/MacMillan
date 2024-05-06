// connectionData.js
import {
  faSync,
  faThLarge,
  faClock,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

const connectionData = [
  {
    title: "My Shopify Connection",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "Never published",
    instances: 0,
  },
  {
    title: "New Connection",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "Never published",
    instances: 0,
  },
  {
    title: "Testing Connection",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "Never published",
    instances: 0,
  },
  // Add more connection objects as needed
];

export default connectionData;
