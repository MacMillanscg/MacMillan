export const webhookTriggers = [
  {
    name: "Universal Webhook",
    description: "Executes an integration via an HTTP Post request to a URL",
  },

  // {
  //   name: "Adobe Acrobat Sign",
  //   description:
  //     "Receive and validate webhook requests from Adobe Sign for webhooks you configure.",
  // },
  // {
  //   name: "Adobe Commerce Magento",
  //   description:
  //     "Receive and validate webhook requests from Adobe Commerce for webhooks you configure.",
  // },
];

export const managementTriggers = [
  {
    name: "Instance Deploy",
    description: "Executes a Flow when an Instance is deployed",
  },
  {
    name: "User Level Config Deploy",
    description: "Executes a Flow when an User Level Config is deployed",
  },
  {
    name: "Instance Remove",
    description: "Executes a Flow when an Instance is removed",
  },
  {
    name: "User Level Config Remove",
    description: "Executes a Flow when an User Level Config is removed",
  },
];

export const scheduleOptions = [
  { value: "", label: "No Schedule" },
  { value: "* * * * *", label: "1 min" },
  { value: "* * * * *", label: "2 mins" },
  { value: "* * * * *", label: "5 mins" },
  { value: "* * * * *", label: "10 mins" },
  { value: "* * * * *", label: "15 mins" },
  { value: "* * * * *", label: "20 mins" },
  { value: "* * * * *", label: "30 mins" },
  { value: "* * * * *", label: "1 hr" },
  // { value: "0 * * * WED", label: "Custom" },
];
