import React from "react";
import ReactDOM from "react-dom";

import { HashRouter, Route, Switch } from "react-router-dom";
import Login from "views/Login";
import indexRoutes from "routes/index.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard.css?v=1.2.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

ReactDOM.render(
  <HashRouter>
    <Switch>
      {indexRoutes.map((prop, key) => {
        if (!localStorage.getItem('jwtToken')) {
          return <Route to={'login'} component={Login} key={1.1} />;
        }
        return <Route to={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
