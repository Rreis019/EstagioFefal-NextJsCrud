import React,{ useState , useEffect} from "react";
import Header from '../components/Header.js'
import Axios from 'axios';
import Swal from 'sweetalert2';
import { deleteUser } from "./api/index.js";

export default function Dashboard() {
    const edit = (name,email,password) => 
    {
        
        window.location.href = "/Dashboard";
    }
 
    function isLoggedIn()
    {
      var user = localStorage.getItem('sessionUser');
      if(user == null){return 0;}
      //return loginUser(user.email,user.password).status;
      return 1;
    }


    useEffect( () => {
        
        if(isLoggedIn() === 0)
        {
            window.location.href = "/";
            return;
        }
    }, []);


    return (
        <div>
            <Header title="Edit User" />

            <div className="content-center-ver">
                <div style={{"background-color":"#5337EE"}} className="flex flex-col gap-4 p-12 shadow-md bg-gray-100 border-gray-200 border-solid rounded-2xl border-2 ">
                    <div className="flex justify-center content-center">
                        <h1 className="text-5xl text-white">Edit user</h1>
                    </div>
                    <input type="text" className="input_huge border-gray border-solid border-2" placeholder="Name" />
                    <input type="text"  className="input_huge border-gray border-solid border-2" placeholder="Email" />
                    <input type="text"  className="input_huge border-gray border-solid border-2" placeholder="Password" /> 
                    <button className="btn_white" onClick={edit}>Edit</button>
                </div>
            </div>

        </div>
    );
}