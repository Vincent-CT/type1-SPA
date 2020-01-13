import "./App.css";
import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useParams,
  Link,
  Prompt,
  NavLink,
  useHistory
} from "react-router-dom";

function App({ facade }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
  };

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn logout={logout} facade={facade} />
        </div>
      )}
    </div>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}

function LoggedIn({ logout, facade }) {
  return (
    <div>
      <Router>
        <Header facade={facade} />
        <Content logout={logout} facade={facade} />
      </Router>
    </div>
  );
}

const Header = ({ facade }) => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/people">
            People ADDDDMIIN
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/company">
            Company
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/logout">
            Logout
          </NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/people">
          People USEEEEER
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/company">
          Company
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/logout">
          Logout
        </NavLink>
      </li>
    </ul>
  );
};

const Content = ({ logout, facade }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home facade={facade} />
      </Route>
      <Route path="/people">
        <People />
      </Route>
      <Route path="/company">
        <Company />
      </Route>
      <Route path="/logout">
        <Logout logout={logout} />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

const Home = ({ facade }) => {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");
  const [listPeople, setListPeople] = useState("");

  useEffect(({ facade }) => {
    facade.fetchData().then(res => setDataFromServer(res.msg));
  }, []);
  useEffect(({ facade }) => {
    facade.fetchPeople().then(res => setListPeople(res));
    console.log(facade.getRole());
  }, []);
  useEffect(({ facade }) => {
    facade.fetchPeople().then(res => console.log(res));
  }, []);
  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
      <p>{JSON.stringify(listPeople)}</p>
    </div>
  );
};

const People = () => {
  return (
    <div>
      <h3>PEOPLE</h3>
    </div>
  );
};
const Company = () => {
  return (
    <div>
      <h3>COMPANY</h3>
    </div>
  );
};

const NoMatch = () => <div>Urlen matcher ingen kendte routes</div>;

const Logout = ({ logout }) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
