import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
firebase.initializeApp(firebaseConfig);



function App() {

  const [user,setUser] = useState({
     inSignedIn: false,
     name:'',
     email:'',
     photo:''
  })

 const provider = new firebase.auth.GoogleAuthProvider();
 const handleSignIn = () =>{
  firebase.auth().signInWithPopup(provider)
  .then(res => {
    const {displayName,photoURL,email} = res.user;
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
      photo:''
    }
    setUser(signedOutUser);

  })
  .catch(err => {
    
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
      
    </div>
  );
}

export default App;
