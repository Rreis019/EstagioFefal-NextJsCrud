import React,{ useState , useEffect} from "react";
import Header from '../components/Header.js'
import Axios from 'axios';
import Swal from 'sweetalert2';


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

export default function addNewPost()
{
    const navbarItems = [{ name: 'Users',href:"CrudUsers"}, { name: 'Posts',href:"Dashboard"}];

    //create state for title,author,msg
    const [title,setTitle] = useState('');

    const [author,setAuthor] = useState('');

    const [msg,setMsg] = useState('');
    


    useEffect( () => 
    {      
      var sessionUser = localStorage.getItem("sessionUser");
      if(sessionUser === null){
          window.location = "/";
      }

      Axios.post("http://127.0.0.1:8000/users-get",
      {
        session:sessionUser

      }).then((response) => {
          if(response.status == 2){
             window.location = "/";
             return;
          }

          setAuthor(response.data.name);
      });
    }, []);


    const addPost = () => 
    {
        var sessionUser = localStorage.getItem("sessionUser");
        if(sessionUser === null){
            window.location = "/";
        }

        Swal.fire({
            title: "Post Added",
            customClass: {
                fontSize: '20px'
              },
              icon: 'success',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              heightAuto: false
        }).then(function() {

            Axios.post("http://127.0.0.1:8000/post-create",
            {
              title: title,
              author: author,
              msg: msg,
              session:sessionUser,
            }).then((response) => {
              console.log(response);  
                if(response.status == 2){
                   window.location = "/";
                }
            });

            window.location.href = "/Dashboard";
        }); 
        
    }




    return (
        <div className="h-full">
            <Header title="Dashboard" items={navbarItems} />
            <div className='content-center-ver  '>
                <div className="allPosts">
                    <div className='post-container'>
                        <div className='left-col'>
                            <div className='user-image'>
                                <img src="./images/Wahaha_Emote.png"></img>
                            </div>
                        </div>

                    <div className='mid-col'>
                            <div className='header-post'>
                                <input placeholder='Title' className='input-h1' maxLength="25"  onChange={(e) => setTitle(e.target.value)} ></input>
                                <input placeholder='Author' className='input-h2'maxLength="25"  value={author} disabled></input>
                            </div>
                            <div className='post-content'>
                                <textarea placeholder='Msg' className='input-p' name="Text1" cols="60"  maxLength="100" rows="5" onChange={(e) => setMsg(e.target.value)}></textarea>
            
                            </div>
                            <div className='flex'>
                                <button style={{"padding":"5px"}} onClick={addPost} className='btn_blue justify-self-end '>Create</button>

                            </div>
                    </div>

                    <div className='right-col flex justify-center'>
                            
                    </div>
                </div>
                </div>
            </div>

    </div>
    );
}