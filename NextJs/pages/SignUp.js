import React,{ useState , useEffect} from "react";
import Axios from "axios";
import Swal from 'sweetalert2'



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
    //check if email is actually an email
    var res = email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    if(res === null){
      ErrorAlert('Please enter a valid email address');
      return;
    }

    Axios.post("http://127.0.0.1:8000/users-create",
    {
      name: username,
      email: email,
      pass: password,
    }).then((response) => {
        if(response.data.status == 0){
          ErrorAlert(response.data.message);
        }
        else{
          SucessAlert(response.data.message);
        }
    });
    return;
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

        <div className="sidebar">
          <div className="sidebar-content">

          <h1 id="sideBarCaption">Welcome</h1>
          <h3 id="sideBarDesc">You have not<br/> logged in yet</h3>    

          <a href="/"  className="btn_lightblue" >Login</a>       
          </div>
        </div>
      
    </div>
  );
}
