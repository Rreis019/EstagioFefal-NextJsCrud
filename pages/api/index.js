// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//import postmodel.js


export function createUser(name,email,password)
{    
    var users = JSON.parse(localStorage.getItem('users'));
    if(users == null){users = [];}
    else{
      for(var i = 0; i < users.length; i++) //check if email already exists
      {
        if(users[i].email === email){
          return  {status: 0, message: 'Email already exists'};
        }
      }
    }

    //verify if email is valid
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email)){
      return {status: 0, message: 'Invalid email'};
    }
    

    if(users.length != 0){
      var lastId = users[users.length -1].id + 1;
    }else{
      var lastId = 0;
    }

    //add user to array
    users.push({id:lastId, name: name, email: email, password: password});

    //save array to local storage
    localStorage.setItem('users', JSON.stringify(users));

    //return integer and string as object
    return {status: 1, message: 'Account created successfully'};
}

export function loginUser(email,password)
{
  if(email === '' || password === ''){return StatusLoginUser.EmptyFields;}

  var users = JSON.parse(localStorage.getItem('users'));
  
  if(users == null){ return  {status: 0, message: 'There are no accounts'};}

  for(var i = 0; i < users.length; i++) //check if email already exists
  {
    if(users[i].email === email && users[i].password === password)
    {
      var user = getUserByEmail(email);
      localStorage.setItem('sessionUser', JSON.stringify(user));
      return {status: 1, message: 'Login Sucess'};
    }
  }

  return  {status: 0, message: 'Email or password is incorrect'};
}

export function isLoggedIn()
{
  var user = localStorage.getItem('sessionUser');
  if(user == null){return 0;}
  //return loginUser(user.email,user.password).status;
  return 1;
}


export function deleteUser(id)
{
  //if id == sessionUser
  var session = JSON.parse(localStorage.getItem('sessionUser'));
  if(session != null && session.id == id){return;}
  var users = JSON.parse(localStorage.getItem('users'));

  for(var i = 0; i < users.length; i++)
  {
    if(users[i].id === id){
      users.splice(i,1);
    }
  }

  localStorage.setItem('users', JSON.stringify(users));

}

function getUserByEmail(email)
{
  var users = JSON.parse(localStorage.getItem('users'));
  if(users == null){return null;}
  if(users.length == 0){return null;}
  for(var i = 0; i < users.length; i++)
  {
    if(users[i].email === email){
      return users[i];
    }
  }
}


export function postmodelGetById(id){
  var posts = JSON.parse(localStorage.getItem('posts'));
  if(posts == null){return null;}
  if(posts.length == 0){return null;}




  for(var i = 0; i < posts.length; i++)
  {
    if(posts[i].id == id){
      return posts[i];
    }
  }
}

export function postmodelAdd(title,author,msg)
{
    if(title === '' || author === '' || msg === ''){
      return  {status: 0, message: "Fields cannot be empty"};
    }


    //get post from local storage
    var posts =  JSON.parse(localStorage.getItem('posts'));
    if(posts == null){posts = [];}

    //create new post
    var lastId = 0;
    if(posts.length > 0){lastId = posts[posts.length - 1].id + 1;}

    posts.push({id:lastId, title: title, author: author, msg: msg});

    //save array to local storage
    localStorage.setItem('posts', JSON.stringify(posts));

    return  {status: 1, message: "Created successfully"};
}


export function postmodelDelete(id){
  var posts =  JSON.parse(localStorage.getItem('posts'));
  if(posts == null){return;}
  for(var i = 0; i < posts.length; i++)
  {
    if(posts[i].id === id){
      posts.splice(i,1);
    }
  }
  
  localStorage.setItem('posts', JSON.stringify(posts));
}

export function postmodelUpdate(id,title,author,msg)
{
  var posts =  JSON.parse(localStorage.getItem('posts'));
  if(posts == null){return;}
  for(var i = 0; i < posts.length; i++)
  {
    if(posts[i].id == id)
    {
        posts[i].title = title;
        posts[i].author = author;
        posts[i].msg = msg;
    }
  }
  
  localStorage.setItem('posts', JSON.stringify(posts));
}