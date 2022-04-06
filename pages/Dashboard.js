import React,{ useState , useEffect} from "react";
import Header from '../components/Header.js'
import Axios from 'axios';
import Swal from 'sweetalert2';
import { deleteUser } from "./api/index.js";
import Post from "../components/Post.js";

export default function Dashboard()
{
    const navbarItems = [{ name: 'Users',href:"CrudUsers" }];
    const [posts, setPosts] = useState([]);

    
    useEffect( () => {
        
        if(isLoggedIn() === 0)
        {
            window.location.href = "/";
            return;
        }

        //set user using local storage "users"
        var temp = JSON.parse(localStorage.getItem("posts"));
        if(temp != null){
            setPosts( temp );
        }

    }, []);

    const delPost = (id) => 
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

    useEffect( () => {      
        if(isLoggedIn() === 0)
        {
            window.location.href = "/";
            return;
        }
    }, []);


    return (
        <div className="h-full">
            <Header title="Dashboard" items={navbarItems} />
            <div className='content-center-ver  '>
                <div className="allPosts">

                    {posts && posts.map((post) => 
                    {
                       return <Post id={post.id} title={post.title} author ={post.author} msg ={post.msg}></Post>
                    })}
                </div>
            </div>

            <a href="addNewPost" style={{"bottom":"10px" ,"left":"10px","padding":"8px"}} className="btn_blue hoverDarkBlue fixed cursor-pointer">Add new Post</a>
        </div>
    );
}