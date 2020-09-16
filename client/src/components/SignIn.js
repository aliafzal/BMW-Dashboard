import React, { useState } from "react";

export function SignIn(props){

  const [loginInfo, setLoginInfo] = useState({
    username : "",
    password : ""
  });

  function handleChange(event){
    const { name, value } = event.target; 

    setLoginInfo( prevInfo => {
      return {
        ...prevInfo,
        [name]: value
      };  
    });
  }

  function submitLoginInfo(event){
    props.getLoginInfo(loginInfo);
    setLoginInfo( prevInfo => {
      return {
        username : "",
        password : ""
      };  
    });
    event.preventDefault();
  }
  return(
    <div class="signIn-body">
      <div class="text-center">
        <form onSubmit={submitLoginInfo}>
          <img class="mb-4" src="http://pngimg.com/uploads/bmw_logo/bmw_logo_PNG19714.png" alt="" width="82" height="82"/>
          <input onChange={handleChange} type="text" name="username" class="form-control top login" placeholder="Username" required autofocus value={loginInfo.username}/>
          <input onChange={handleChange} type="password"  name="password" class="form-control bottom login" placeholder="Password" required autofocus value={loginInfo.password}/>
          <button class="btn btn-lg btn-primary btn-block login" type="submit">Login</button>
        </form>
      </div>  
    </div>
  );
}
