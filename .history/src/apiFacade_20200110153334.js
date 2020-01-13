const URL = "http://localhost:8080/type1";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const getRole = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData.roles;
  };

  const getUser = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData;
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };

  const fetchData = () => {
    const options = makeOptions("GET", true); //True add's the token
    if (getRole() === "admin") {
      return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
    }
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  const fetchPeople = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/person/allpersons", options).then(
      handleHttpErrors
    );
  };
  const fetchAllHobbies = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/person/allhobbies", options).then(
      handleHttpErrors
    );
  };

  const fetchCreatePerson = personDTO => {
    const options = makeOptions("POST", true, personDTO); //True add's the token
    return fetch(URL + "/api/person/allhobbies", options).then(
      handleHttpErrors
    );
  };

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    getRole,
    fetchPeople,
    getUser,
    fetchAllHobbies,
    fetchCreatePerson
  };
}
const facade = apiFacade();
export default facade;
