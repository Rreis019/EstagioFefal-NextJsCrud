import React, { Component } from 'react';
import Axios from 'axios';


//Titulo 25 max
//Mensagem 100 max


function handleSubmit() 
{
    alert("Submitted");
}



export default class EditPost extends Component 
{


    render() 
    {
        return (
            <div className='post-container'>
                <div className='left-col'>
                    <div className='user-image'>
                        <img src="./images/Wahaha_Emote.png"></img>
                    </div>
                </div>

               <div className='mid-col'>
                    <div className='header-post'>
                        <input placeholder='Title'  className='input-h1'></input>
                        <input placeholder='Author' className='input-h2'></input>
                    </div>
                    <div className='post-content'>
                        <textarea placeholder='Msg' className='input-p' name="Text1" cols="60"  maxlength="100" rows="5"></textarea>
     
                    </div>
                    <div className='flex'>
                        <button style={{"padding":"5px"}} onClick={handleSubmit} className='btn_blue justify-self-end '>Create</button>

                    </div>
               </div>

               <div className='right-col flex justify-center'>
                    
               </div>
            </div>
        )
    }
}