import React,{ useState , useEffect} from "react";
import Axios from "axios";
import Swal from 'sweetalert2'
import { loginUser } from "./api";
import Sidebar from "../components/Sidebar";


function SucessAlert(title)
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
//'Email Address already exists'
function ErrorAlert(title)
{
  Swal.fire({
    title: title,
    icon: 'error',
    showClass: {
    popup: 'animate__animated animate__fadeInDown'
    },
    heightAuto: false,
    });
  
}


export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authLogin = () => 
  {

    var response = loginUser(email,password);

    if(!response.status){ErrorAlert(response.message);}
    else{
      window.location.href = "/Dashboard";
    }


  };

  function isLoggedIn()
  {
    return localStorage.getItem('sessionUser') != null;
  }
  //create use effect and check if session = "sessionUser" exist and if exist redirect to dashboard
  useEffect(() => {
    if(isLoggedIn() == true){window.location.href = "/Dashboard";}
  }, []);

  return (
    <div  className="content">
        <div className="content-main">
          <h2 className="content-title">Login in your account</h2>

          <input className="input_huge" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input  className="input_huge" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={authLogin} className="btn_white" >Login</button>
          <a href="SignUp" id="label_white">You dont have account?</a>
        </div>

        <Sidebar title="Hi Friend" btn_name="SignUp" href="SignUp" p1="You have not" p2="created an" p3 = " Account yet" />
    </div>
  );
}
