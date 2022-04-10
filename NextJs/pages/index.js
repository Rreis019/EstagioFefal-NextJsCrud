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


export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const authLogin = () => 
  {
    if(email === '' || password === ''){
      ErrorAlert('Fields cannot be empty');
      return;
    }


    Axios.post("http://127.0.0.1:8000/users-login", 
    {
      email: email,
      pass: password,
    }).then((response) => {
        if(response.data.status == 0){
          ErrorAlert(response.data.message);
        }
        else{
          SucessAlert(response.data.message);
          //console.log(response);
          localStorage.setItem("sessionUser",response.data.session);
          window.location = "/Dashboard";
        }
    });

  };

  useEffect(() => 
  {
    var sessionUser = localStorage.getItem("sessionUser");
    if(sessionUser === null){return;}

    Axios.post("http://127.0.0.1:8000/users-get",
    {
      session:sessionUser

    }).then((response) => {
        //is response.status is undefined
        if(response.status != 2){
            window.location = "/Dashboard";
            return;
          }

    });
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

        <div className="sidebar">
          <div className="sidebar-content">
            <h1 id="sideBarCaption">Hi Friend</h1>
            <h3 id="sideBarDesc">You have not<br/> created an<br/> Account yet</h3>    

            <a href="SignUp" className="btn_lightblue"  >Sign up</a>       
          </div>
        </div>
      
    </div>
  );
}
