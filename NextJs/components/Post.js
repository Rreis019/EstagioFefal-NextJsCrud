import React, { Component } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';


//Titulo 25 max
//Mensagem 100 max

export default function Post(props)
{

    const deletePost = (id) =>
    {
        var sessionUser = localStorage.getItem("sessionUser");
        if(sessionUser === null){ window.location = "/"; return; }
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
                        
                        Axios.post("http://127.0.0.1:8000/post-delete",
                        {
                            id: id,
                            session:sessionUser
                        }).then((response) => {
                            console.log(response);
                            window.location.reload();
                        });
    
                    })
            }
          })
    }

    const editPost = (id) =>
    {window.location.href = "/post/" + id;}


    return (
        <div className='post-container'>
            <div className='left-col'>
                <div className='user-image'>
                    <img src="./images/Wahaha_Emote.png"></img>
                </div>
            </div>

            <div className='mid-col'>
                <div className='header-post'>
                    <h1>{props.title}</h1>
                    <h2>{props.author}</h2>
                </div>
                <div className='post-content'>
                    <p>{props.msg}</p>
                </div>
            </div>

            <div className='right-col flex flex-col justify-center gap-2'>
                 <img className='icon32 cursor-pointer ' src={'/images/lapisAzul.png'} onClick={() => editPost(props.id)}></img> 
                <button className='icon32 cursor-pointer btn_delete' onClick={() => deletePost(props.id)}>X</button> 
            </div>
        </div>
    );
}