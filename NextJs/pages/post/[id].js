import React,{ useState , useEffect} from "react";
import {useRouter} from "next/router";
import Header from '../../components/Header.js';
import Axios from 'axios';

export default function post() {

    const navbarItems = [{ name: 'Posts',href:"../Dashboard" }, { name: 'Users',href:"../CrudUsers"}];

    const router = useRouter();
  
    //create state post
    const [post, setPost] = useState({});

    //create state for title,author,msg
    const [title, setTitle] = useState('');

    const [author, setAuthor] = useState('');

    const [msg, setMsg] = useState('');


    useEffect(()=>{
        if(!router.isReady) return;

        var sessionUser = localStorage.getItem("sessionUser");
        if(sessionUser === null){ window.location = "/";  return;}


        //var p =  postmodelGetById(router.query.id);
        Axios.post("http://127.0.0.1:8000/post-get",
        {
          id: parseInt(router.query.id),
          session : sessionUser
        }).then((response) => {
            if(response.data.status === 2){ 
                window.location = "/";
                localStorage.removeItem("sessionUser");
                return;
            }
            console.log(response.data);
            setTitle(response.data.title);
            setAuthor(response.data.author);
            setMsg(response.data.msg);
        });
        


        //setTitle(p.title);
        //setAuthor(p.author);
        //setMsg(p.msg);

        //console .log (post);
    }, [router.isReady]);

    function updatePost()
    {
        Axios.post("http://127.0.0.1:8000/post-update",
        {
          id: parseInt(router.query.id),
          title: title,
          author: author,
          msg: msg
        }).then((response) => {
           console.log(response.data);
        });
        

        //redirect  to dashboard
        window.location.href = "/Dashboard";
    }



    return (
        <div className="h-full">
            <Header title="Dashboard" items={navbarItems} />
            <div className='content-center-ver  '>
                <div className="allPosts">
                <div className='post-container'>
                <div className='left-col'>
                    <div className='user-image'>
                        <img src="../../images/Wahaha_Emote.png"></img>
                    </div>
                </div>

               <div className='mid-col'>
                    <div className='header-post'>
                        <input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} className='input-h1'></input>
                        <input placeholder='Author'  value={author}  onChange={(e) => setAuthor(e.target.value)} className='input-h2' disabled></input>
                    </div>
                    <div className='post-content'>
                        <textarea placeholder='Msg'  value={msg} className='input-p' name="Text1" cols="60" onChange={(e) => setMsg(e.target.value)}   maxlength="100" rows="5"></textarea>
     
                    </div>
                    <div className='flex'>
                        <button style={{"padding":"5px"}} onClick={updatePost} className='btn_blue justify-self-end '>Update</button>

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


