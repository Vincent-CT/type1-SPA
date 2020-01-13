import "./App.css";
import React, { useState, useEffect } from "react";
import facade from "./apiFacade";

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
function LoggedIn() {
  const [dataFromServer, setDataFromServer] = useState("Loading...");

  useEffect(() => {
    facade.fetchData().then(data => setDataFromServer(data.msg));
  }, []);

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div>
  );
}

const Header = () => {
  if (facade.getRole === "admin") {
    return (
      <Router>
        <ul className="header">
          <li>
            <NavLink exact activeClassName="active" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to="/peope">
              People
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
      </Router>
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
          People
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

const Content = ({ logout }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
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

const Home = () => {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");
  const [listPeople, setListPeople] = useState("");

  useEffect(() => {
    facade.fetchData().then(res => setDataFromServer(res.msg));
  }, []);
  useEffect(() => {
    facade.fetchPeople().then(res => setListPeople(res));
    console.log(facade.getRole());
  }, []);
  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
      <p>{JSON.stringify(listPeople)}</p>
    </div>
  );
};

function App() {
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
          <LoggedIn />
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
export default App;
