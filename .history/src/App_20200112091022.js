import "./App.css";
import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  Link,
  Prompt,
  NavLink,
  useHistory
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    history.push("/");
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
    history.push("/");
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <HeaderStart />
          <ContentStart login={login} />
        </div>
      ) : (
        <div>
          <LoggedIn logout={logout} />
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
const Logout = ({ logout }) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function LoggedIn({ logout }) {
  return (
    <div>
      <Header />
      <Content logout={logout} />
    </div>
  );
}
const HeaderStart = () => {
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/readme">
          README
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/login">
          Login
        </NavLink>
      </li>
    </ul>
  );
};
const ContentStart = ({ login }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <LogIn login={login} />
      </Route>
      <Route path="/readme">
        <Readme />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};
const Header = () => {
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
            People
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/readme">
            README
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/edit">
            Edit
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/logout">
            Logout
          </NavLink>
        </li>
        <li style={{ float: "right" }}>
          <NavLink activeClassName="active" to="/user-info">
            Hi! {facade.getUser().username} Role: {facade.getUser().roles}
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
          People
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/readme">
          README
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
      <Route path="/readme">
        <Readme />
      </Route>
      <Route path="/edit">
        <Edit />
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

const Home = () => {
  return (
    <div>
      <h3>Welcome to home</h3>
    </div>
  );
};

const People = () => {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");
  const [listPeople, setListPeople] = useState([]);
  const [listHobbies, setListHobbies] = useState([]);

  useEffect(() => {
    facade.fetchData().then(res => setDataFromServer(res.msg));
  }, []);
  useEffect(() => {
    let didCancel = false;
    facade.fetchPeople().then(res => {
      if (didCancel === false) {
        setListPeople(res);
        console.log("Fetching persons complete");
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    let didCancel = false;
    facade.fetchAllHobbies().then(res => {
      if (didCancel === false) {
        setListHobbies(res);
        console.log("Fetching hobbies complete");
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
      <p>{JSON.stringify(listPeople)}</p>
      <h3>List Hobbies</h3>
      <p>{JSON.stringify(listHobbies)}</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {listHobbies.map((hobby, index) => {
            return (
              <tr key={index}>
                <td>{hobby.name}</td>
                <td>{hobby.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Edit = () => {
  const emptyAddress = { street: "", city: "", zip: "" };
  const emptyHobby = { name: "", description: "" };
  const emptyPerson = {
    id: "",
    fName: "",
    lName: "",
    phone: "",
    email: ""
  };

  const [id, setId] = useState(1);
  const [address, setAddress] = useState(emptyAddress);
  const [hobby, setHobby] = useState(emptyHobby);
  const [person, setPerson] = useState(emptyPerson);
  const [findPerson, setFindPerson] = useState("");

  useEffect(() => {
    let didCancel = false;
    facade.fetchGetPersonById(id).then(res => {
      if (didCancel === false) {
        setFindPerson(res);
        console.log("Fetching persons complete");
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);

  const handleChangeFind = event => {
    const target = event.target;
    const value = target.value;
    setId(Number(value));
  };

  const handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    setPerson({ ...person, [name]: value });
  };
  const handleChangeAddress = event => {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    setAddress({ ...address, [name]: value });
  };
  const handleChangeHobby = event => {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    setHobby({ ...hobby, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setPerson({ ...emptyPerson });
    setAddress({ ...emptyAddress });
    setHobby({ ...emptyHobby });

    const finalPerson = {
      fName: person.fName,
      lName: person.lName,
      phone: person.phone,
      email: person.email,
      address: { street: address.street, city: address.city, zip: address.zip },
      hobbies: [{ name: hobby.name, description: hobby.description }]
    };

    facade.fetchCreatePerson(finalPerson);

    console.log(finalPerson);
  };

  const handleSubmitFind = event => {
    event.preventDefault();
    setPerson({
      id: findPerson.id,
      fName: findPerson.fName,
      lName: findPerson.lName,
      phone: findPerson.phone,
      email: findPerson.email
    });
    setAddress({
      street: findPerson.address.street,
      city: findPerson.address.city,
      zip: findPerson.address.zip
    });
    setHobby({
      name: findPerson.hobbies[0].name,
      description: findPerson.hobbies[0].description
    });
    console.log(findPerson);
  };

  const submitTitle = person.id === "" ? "Submit" : "Save";

  return (
    <div>
      <h3>Find and Edit</h3>
      <input
        onChange={handleChangeFind}
        placeholder="Find Person by Id"
      ></input>
      <button onClick={handleSubmitFind}>Find Person</button>
      <p>{JSON.stringify(person)}</p>
      <p>{JSON.stringify(address)}</p>
      <p>{JSON.stringify(hobby)}</p>

      <input value={person.id} readOnly id="id" placeholder="ID"></input>
      <br />
      <input
        id="fName"
        value={person.fName}
        onChange={handleChange}
        placeholder="Add first name"
      ></input>
      <br />
      <input
        id="lName"
        value={person.lName}
        onChange={handleChange}
        placeholder="Add last name"
      ></input>
      <br />
      <input
        id="phone"
        value={person.phone}
        onChange={handleChange}
        placeholder="Add phone"
      ></input>
      <br />
      <input
        id="email"
        value={person.email}
        onChange={handleChange}
        placeholder="Add email"
      ></input>
      <br />
      <input
        id="street"
        value={address.street}
        onChange={handleChangeAddress}
        placeholder="Add street"
      ></input>
      <br />
      <input
        id="city"
        value={address.city}
        onChange={handleChangeAddress}
        placeholder="Add city"
      ></input>
      <br />
      <input
        id="zip"
        value={address.zip}
        onChange={handleChangeAddress}
        placeholder="Add zip"
      ></input>
      <br />
      <input
        id="name"
        value={hobby.name}
        onChange={handleChangeHobby}
        placeholder="Add name"
      ></input>
      <br />
      <input
        id="description"
        value={hobby.description}
        onChange={handleChangeHobby}
        placeholder="Add description"
      ></input>
      <br />
      <button onClick={handleSubmit}>{submitTitle}</button>
    </div>
  );
};

const Readme = () => {
  return (
    <div className="col-md-8">
      <h3>TO use this SPA change the following</h3>

      <p>1. In the apiFacade change the URL to match your droplet URL.</p>
      <p>
        2. To fetch data from the backend Rest-endpoint add new fetches to
        apiFacade.
      </p>
      <p> 3. To use these new fetch methods just call them from App.js. </p>
      <p>
        4. To deploy the SPA use - npm run build. n a terminal, in the root of
        your Client project, type npm run build. This will "build" your project
        into a folder build
      </p>
      <p>
        5. Still in the root of your project, type: surge --project ./build
        --domain A_DOMAIN_NAME.surge.s
      </p>
      <p>
        6. That’s it. Your SPA Client is now hosted like A_DOMAIN_NAME.surge.sh
      </p>
    </div>
  );
};

const NoMatch = () => <div>Urlen matcher ingen kendte routes</div>;
export default App;
