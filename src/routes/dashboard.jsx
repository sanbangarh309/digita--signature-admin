import Docs from "views/Docs";
import Signers from "views/Signers";
import Users from "views/Users";
import Contacts from "views/Contacts"; 
import Settings from "views/Settings"; 
import Prices from "views/Prices";

const dashboardRoutes = [
  {
    path: "/docs",
    name: "Docs",
    icon: "pe-7s-file",
    component: Docs
  },
  {
    path: "/signers",
    name: "Signers",
    icon: "pe-7s-users",
    component: Signers
  },
  {
    path: "/users",
    name: "Users",
    icon: "pe-7s-users",
    component: Users
  },
  {
    path: "/prices",
    name: "Plans",
    icon: "pe-7s-cash",
    component: Prices
  },
  {
    path: "/contacts",
    name: "New Contacts",
    icon: "pe-7s-news-paper",
    component: Contacts
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "pe-7s-settings",
    component: Settings
  },

    { redirect: true, path: "/", to: "/docs", name: "Docs" }
];

export default dashboardRoutes;
