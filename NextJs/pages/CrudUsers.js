import React,{ useState , useEffect} from "react";
import Axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../components/Header.js'



function deleteAlert(){
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
          )
          return true;
        }
      })
    return false;
}

export default function Dashboard() {

    const navbarItems = [{ name: 'Posts',href:"Dashboard" }];
    const [users, setUsers] = useState([]);
    const [me, setme] = useState();


    useEffect(() => 
    {
        
        var sessionUser = localStorage.getItem("sessionUser");
        if(sessionUser === null){
            window.location = "/";
        }

        Axios.post("http://127.0.0.1:8000/users-get",
        {
          session:sessionUser
  
        }).then((response) => {
            console.log(response.data);
            setme(response.data);
        });

        
        Axios.post("http://127.0.0.1:8000/users-list", 
        {
            session:sessionUser,
        }).then((response) => {
            setUsers(response.data);
            if(response.data.status === 2){ //if session is not valid
                localStorage.removeItem("sessionUser");
                window.location = "/";
                setUsers([]);
            }

        });
    
    }, []);


        //setName(e.target.value);
    const delUser = (id) => 
    {
        var sessionUser = localStorage.getItem("sessionUser");
        if(sessionUser === null){  return; }
        //send AxiosPost request to server 
        //and pass userId
        //http://127.0.0.1:8000/users-delete
        Axios.post("http:///127.0.0.1:8000/users-delete",
        {
            id: id,
            session : sessionUser
        }).then((response) => {
            console.log(response);
            window.location.reload();
        });

    }
 




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
                                            {me.id != user.id ?
                                                <button className='btn_blue' onClick={() => delUser(user.id)}>Delete</button> :
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