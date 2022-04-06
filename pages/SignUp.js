import React,{ useState , useEffect} from "react";
import Axios from "axios";
import Swal from 'sweetalert2'
import { createUser, StatusCreateUser } from "./api";
import Sidebar from "../components/Sidebar";


function SucessAlert(title)
{
  if(title != "")
  {
      Swal.fire({
        title: title,
    customClass: {
      fontSize: '20px'
    },
    icon: 'success',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    heightAuto: false});
  }
}
//'Email Address already exists'
function ErrorAlert(title)
{
  if(title === ""){return;}
  Swal.fire({
    title: title,
    icon: 'error',
    showClass: {
    popup: 'animate__animated animate__fadeInDown'
    },
    heightAuto: false,
    });
  
}

export default function Home() 
{
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleUsername = (e) => { setUsername(e.target.value) };
  const handleEmail = (e) => { setEmail(e.target.value) };
  const handlePassword = (e) => { setPassword(e.target.value) };



  
  const RegisterAccount = () =>
  {
    if(username === '' || email === '' || password === '')
    {
      ErrorAlert('Fields cannot be empty');
      return;
    }

    var response = createUser(username,email,password);

    if(response.status){SucessAlert(response.message);}
    else{ErrorAlert(response.message);}

  }


  return (
    <div  className="content">
        <div className="content-main" style={{display:"flex",gap:"20px"}} >
          <h2 className="content-title">Create your account now</h2>

          <input className="input_huge" type="text" name="Username" placeholder="Username" onChange={handleUsername} required />
          <input className="input_huge" type="email"  name="Email" placeholder="Email" onChange={handleEmail} required />
          <input  className="input_huge" type="password" name="Password" placeholder="Password" onChange={handlePassword} required />
          <button className="btn_white" onClick={RegisterAccount}>Register</button>
          <a id="label_white" href="/">You already have account?</a>
        </div>
 
        <Sidebar title="Welcome" href="/" btn_name="Login" p1="You have not" p2="logged in yet"/>      
    </div>
  );
}
