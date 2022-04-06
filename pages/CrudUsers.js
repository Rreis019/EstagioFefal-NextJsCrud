import React,{ useState , useEffect} from "react";
import Header from '../components/Header.js'
import Axios from 'axios';
import Swal from 'sweetalert2';
import { deleteUser } from "./api/index.js";

export default function Dashboard() {

    const navbarItems = [{ name: 'Posts',href:"Dashboard" }];
    //define array json called users
    const [users, setUsers] = useState([]);

    //define array as state
    //state for saving name,password,email


    const  [myName, setMyName] = useState('');


    const delUser = (id) => 
    {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                    ).then(() => {
                        deleteUser(id);
                        window.location.reload();
                    })
            }
          })
    };

 
    function isLoggedIn()
    {
      var user = localStorage.getItem('sessionUser');
      if(user == null){return 0;}
      //return loginUser(user.email,user.password).status;
      return 1;
    }

    const goToEdit = () =>
    {
        window.location.href = "/EditUser";
    }


    useEffect( () => {
        
        if(isLoggedIn() === 0)
        {
            window.location.href = "/";
            return;
        }

        //set user using local storage "users"
        var temp = JSON.parse(localStorage.getItem("users"));
        if(temp != null){
            setUsers( temp );
        }
        
        console.log(users);
    }, []);


    return (
        <div>
            <Header title="Users" items={navbarItems}/>
            <div className='content-center-ver'>
                <div style={{ "width":"100%" ,"max-width": '1000px', display: 'table', flexDirection: 'column' }}>

                    <table className='table_gray'>
                        <thead>
                            <tr>
                                <th id='col_id'>Id</th>
                                <th id='col_name'>Name</th>
                                <th >Email</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {users && users.map( (user, index) => 
                            {
                                return (
                                    <tr key={index}>
                                        <td id="col_id">{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="actions">
                                            
                                            {JSON.parse(localStorage.getItem('sessionUser')).id != user.id ?
                                                <button className='btn_blue' onClick={() => delUser(user.id)}>Delete</button> :
                                                
                                                //create function in onClick to window.location.href = EditUser.js
                                                <button className="text-transparent cursor-default">Delete</button>
                                            }
            
                                        </td>
                                    </tr>
                                )
                            })}

        
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}