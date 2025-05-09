// connectionData.js
import {
  faSync,
  faThLarge,
  faClock,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

const clientsData = [
  {
    title: "Test",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "Never published",
    instances: 0,
    enabledInstances: 0,
    triggerInstances: 0,
    content: "Its all about testing",
  },
  {
    title: "Test Client",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "Never published",
    instances: 0,
    enabledInstances: 0,
    triggerInstances: 0,
    content: "Its all about testing",
  },
  {
    title: "Testing Client",
    versionIcon: faSync,
    categoryIcon: faThLarge,
    lastRunIcon: faClock,
    instanceIcon: faPlayCircle,
    status: "Never published",
    instances: 0,
    enabledInstances: 0,
    triggerInstances: 0,
    content: "Its all about testing",
  },
  // Add more connection objects as needed
];

export default clientsData;
