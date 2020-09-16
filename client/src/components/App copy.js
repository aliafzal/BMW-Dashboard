import React, { useState,useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {useFetchGet, useFetchPost} from "./useFetch";
import {SignIn} from "./SignIn";

function App() {

  

  function loginInfo(login){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
  };
  fetch('/', requestOptions)
      .then(response => response.json())
      .then(result => console.log(result));
  }

  //useFetchGet();

  return (
    <div>
      <Header />
      <SignIn getLoginInfo={loginInfo}/>
      <Footer />
    </div>
  );
}

export default App;