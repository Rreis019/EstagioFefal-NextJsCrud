import React,{ useState , useEffect} from "react";
import {useRouter} from "next/router";
import Header from '../../components/Header.js';
import { postmodelGetById,postmodelUpdate} from "../api/index.js";
import EditPost from "../../components/EditPost.js";

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
        var p =  postmodelGetById(router.query.id);
        setTitle(p.title);
        setAuthor(p.author);
        setMsg(p.msg);

        //console .log (post);
    }, [router.isReady]);

    function updateP()
    {
        postmodelUpdate(router.query.id,title,author,msg);

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
                        <input placeholder='Author'  value={author}  onChange={(e) => setAuthor(e.target.value)} className='input-h2'></input>
                    </div>
                    <div className='post-content'>
                        <textarea placeholder='Msg'  value={msg} className='input-p' name="Text1" cols="60" onChange={(e) => setMsg(e.target.value)}   maxlength="100" rows="5"></textarea>
     
                    </div>
                    <div className='flex'>
                        <button style={{"padding":"5px"}} onClick={updateP} className='btn_blue justify-self-end '>Update</button>

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


