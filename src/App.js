import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
firebase.initializeApp(firebaseConfig);



function App() {
  const [newUser,setNewUser] = useState(false);
  const [user,setUser] = useState({
     inSignedIn: false,
     
     name:'',
     email:'',
     password:'',
     photo:''
    
  })

 const provider = new firebase.auth.GoogleAuthProvider();
 const handleSignIn = () =>{
  firebase.auth().signInWithPopup(provider)
  .then(res => {
    const {displayName,photoURL,email,} = res.user;
    const signedInUser={
      isSignedIn:true,
      name:displayName,
      email:email,
      photo:photoURL
    }
    setUser(signedInUser);
    console.log(displayName,photoURL,email);
  }) 
  .catch (err =>{
    console.log(err);
    console.log(err.message);
  })


 }

 const handleSignOut = () =>{
  firebase.auth().signOut()
  .then(res => {
    const signedOutUser ={
      isSignedIn:false,
      name:'',
      email:'',
      photo:'',
      error:'',
      success: false
      
    }
    setUser(signedOutUser); 

  })
  .catch(err => {
    
  });

 }

 
  const handleBlur = (e) => {
     
    let isFormValid =true;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }

    if(e.target.name === 'password'){ 
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){ 
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  
  }

  const handleSubmit =(e) => {
     if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })

      .catch(error => {
        
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
     }

     if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('sign in user info', res.user);
      })

      .catch(function(error) {
        
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
     }
     e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
      
    }).then(function() {
      console.log('user name updated successfully')
    }).catch(function(error) {
      console.log(error)
    });
  }


  return (
    <div className="App">
       {
         user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
         <button onClick={handleSignIn}>Sign in</button>
       }

      {
        user.isSignedIn &&
         <div>
          <p> Welcome,{user.name}</p>
          <p>your mail:{user.email}</p>
          <img src={user.photo} alt=""></img>
         </div>
      }
 

      <h1>Our own Authentication</h1> 
      <input type="checkbox" onChange={() => setNewUser(!newUser) } name="newUser" id=""/>
      <label htmlFor="newUser">New user Sign up</label>
       
      <form onSubmit={handleSubmit}>
        { user.newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name"/> }
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="enter your email"/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="your password"/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      { user.success &&  <p style={{color:'green'}}>User Created succesfully</p>}
      
    </div>
  );
}

export default App;
