#include "routes.h"
#include "json.h"
#include <algorithm>

#include "UserModel.h"
#include "PostModel.h"
#include "sha256.h"

#include "session.h"

bool isMethodPost(mg_http_message* hm) {
    if(hm->body.len == 0) {
        return false;
    }

  return strncmp(hm->method.ptr, "POST", 4) == 0;
}


void sendRes(mg_connection *c,const char* format,...)
{
    char buffer[1024];
    va_list args;
    va_start(args, format);
    vsnprintf(buffer, sizeof(buffer), format, args);
    va_end(args);
  
    mg_printf(c, "HTTP/1.1 200 OK\r\n"
            "Access-Control-Allow-Origin: *\r\n" //4 header que preciso para poder mandar request
            "Access-Control-Allow-Credentials: true\r\n"
            "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
            "Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With\r\n"
            "Content-Type: text/html\r\n"
            "Content-Length:%d\r\n\r\n"
            "%s",
            strlen(buffer),buffer);

}
void sendRes(mg_connection *c,int lenght,const char* format,...)
{
    char buffer[lenght];
    va_list args;
    va_start(args, format);
    vsnprintf(buffer, sizeof(buffer), format, args);
    va_end(args);
  
    mg_printf(c, "HTTP/1.1 200 OK\r\n"
            "Access-Control-Allow-Origin: *\r\n" //4 header que preciso para poder mandar request
            "Access-Control-Allow-Credentials: true\r\n"
            "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
            "Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With\r\n"
            "Content-Type: text/html\r\n"
            "Content-Length:%d\r\n\r\n"
            "%s",
            strlen(buffer),buffer);
}


//if is invalid user.id is -1
UserModel isValidSession(char* encryptedSession)
{
    if(encryptedSession == NULL){return UserModel();}

    std::string s = sessionDecrypt((char*)encryptedSession);
    if(s.length() == 0){return UserModel();}

    char* email = strtok((char*)s.c_str(), ":");
    UserModel user = UserModel::getUser(email);
    if(user.id == -1){return UserModel();}

    return user;
}


//{"name":"Rodrigo","email":"rr199820031@gmail.com","pass":"123456"}
void users_create(mg_connection *c,mg_http_message *hm)
{
    if(isMethodPost(hm) == false){
        sendRes(c, "Nope\n");
        return;
    }

    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;
    if(paramaters != 3){
        sendRes(c, "{ \"status\": 0, \"message\": \"It has to be at least 3 parameters\" } \n");
        return;
    }

    char* name = json->operator[]("name").u.string.ptr;
    char* email = json->operator[]("email").u.string.ptr;
    char* pass = json->operator[]("pass").u.string.ptr;

    //verify if paramaters are valid
    if(name == NULL || email == NULL || pass == NULL){
        sendRes(c, "{ \"status\": 0, \"message\": \"Invalid paramaters\" } \n");
        return;
    }



    //check if paramaters are empty
    if(strlen(name) == 0 || strlen(email) == 0 || strlen(pass) == 0){
        sendRes(c, "{ \"status\": 0, \"message\": \"The fields cannot be empty\" } \n");
        return;
    }



    UserModel user = UserModel(name, email, pass);
    std::string temp = sha256(pass, strlen(pass)); //hash the password
    strcpy(user.pass, temp.c_str());
    if(user.add() == 1){
        sendRes(c,"{ \"status\": 1, \"message\": \"User created successfully\" } \n");
    }
    else{
        sendRes(c,"{ \"status\": 0, \"message\": \"Email already  exists\" } \n");
    }

    json_value_free(json);
}

void users_login(mg_connection *c,mg_http_message *hm){
    //check if is method post
    if(isMethodPost(hm) == false){
        sendRes(c, "Nope\n");
        return;
    }



    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;

    //if number paramaters is not 2 return
    if(paramaters != 2){
        sendRes(c,"{ \"status\": 0, \"message\": \"It has to be at least 2 parameters\" } \n");
        json_value_free(json);
        return;
    }

    char* email = json->operator[]("email").u.string.ptr;
    char* pass = json->operator[]("pass").u.string.ptr;


    //verify if paramaters are valid
    if(email == NULL || pass == NULL){
        sendRes(c,"{ \"status\": 0, \"message\": \"Invalid paramaters\" }");
         json_value_free(json);
        return;
    }

    //check if paramaters are empty
    if(strlen(email) == 0 || strlen(pass) == 0){
        sendRes(c,"{ \"status\": 0, \"message\": \"The fields cannot be empty\"}");
         json_value_free(json);
        return;
    }
    
    std::string hash = sha256(pass, strlen(pass)); //hash the password
    char* res = UserModel::checkLogin(email, hash);
    //printf("%s\n",res);
    sendRes(c,res);
    delete res;
    json_value_free(json);
}

void users_logout(mg_connection *c,mg_http_message *hm)
{

}
void users_list(mg_connection *c,mg_http_message *hm)
{
     if(isMethodPost(hm) == false){
        sendRes(c, "Nope\n");
        return;
    }

    json_value *jsonR = json_parse(hm->body.ptr, hm->body.len);

    int paramaters = jsonR->u.object.length;

    //if number paramaters is not 2 return
    if(paramaters != 1){
        sendRes(c,"{ \"status\": 0, \"message\": \"It has to be at least 1 parameters\" } \n");
        json_value_free(jsonR);
        return;
    }

    char* session = jsonR->operator[]("session").u.string.ptr;

    if(isValidSession(session).id == -1){
        sendRes(c,"{ \"status\": 2, \"message\": \"Invalid session\" } \n");
        json_value_free(jsonR);
        return;
    }



    std::vector<UserModel> users = UserModel::getUsers();
    if(users.size() == 0){sendRes(c,"[]");return;}

    int maxSize=  150 * users.size();
    char *json = new char[maxSize];
    json[0] = '[';
    json[1] = '\0';
    for(int i = 0; i < users.size(); i++){
        const char* temp = users[i].toJson(); 
        strcat(json,temp);
        if(i != users.size() - 1){
            strcat(json,",");
        }
        delete[] temp;
        
    }
    strcat(json,"]");
    sendRes(c,150 * users.size(),json);
    delete [] json;
    json_value_free(jsonR);
}

void users_delete(mg_connection *c,mg_http_message *hm)
{
    if(isMethodPost(hm) == false){sendRes(c, "Nope\n");return;}
    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;
    //if number paramaters is not 2 return
    if(paramaters != 2){
        sendRes(c,"{ \"status\": 0, \"message\": \"It has to be at least 2 parameters\" } \n");
         json_value_free(json);
        return;
    }

    int userId = json->operator[]("id").u.integer;
    //verify if paramaters are valid
    if(userId == NULL){
        sendRes(c,"{ \"status\": 0, \"message\": \"Invalid paramaters\" } \n");
        json_value_free(json);
        return;
    }

    //session
    char* session = json->operator[]("session").u.string.ptr;
    UserModel user = isValidSession(session);
    if(user.id == -1){
        sendRes(c,"{ \"status\": 2, \"message\": \"Invalid session\" } \n");
        json_value_free(json);
        return;
    }

    if(user.id == userId){
        sendRes(c,"{ \"status\": 0, \"message\": \"You can only delete your account\" } \n");
        json_value_free(json);
        return;
    }


    UserModel::deleteUser(userId);
    sendRes(c,"{ \"status\": 1, \"message\": \"User deleted successfully\" } \n");
     json_value_free(json);
}

//post
void post_create(mg_connection *c,mg_http_message *hm)
{
    if(isMethodPost(hm) == false){sendRes(c, "Nope\n");return;}

    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;
    if(paramaters != 4){
        sendRes(c, "{ \"status\": 0, \"message\": \"It has to be at least 4 parameters\" } \n");
        json_value_free(json);
        return;
    }

    char* title = json->operator[]("title").u.string.ptr;
    char* author = json->operator[]("author").u.string.ptr;
    char* msg = json->operator[]("msg").u.string.ptr;

    char* session = json->operator[]("session").u.string.ptr;

    if(isValidSession(session).id == -1){
        sendRes(c,"{ \"status\": 2, \"message\": \"Invalid session\" } \n");
        json_value_free(json);
        return;
    }

    //verify if paramaters are valid
    if(title == NULL || author == NULL || msg == NULL){
        sendRes(c, "{ \"status\": 0, \"message\": \"Invalid paramaters\" } \n");
        json_value_free(json);
        return;
    }

    PostModel post = PostModel(title, author, msg);
    post.add();
    sendRes(c,"{ \"status\": 1, \"message\": \"Post created successfully\" } \n");

    //free json
    json_value_free(json);
}
#include "database.h"
void post_list(mg_connection *c,mg_http_message *hm)
{

    if(isMethodPost(hm) == false){sendRes(c, "Nope\n");return;}
 
 

    json_value *jsonR = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = jsonR->u.object.length;
    if(paramaters != 1){
        sendRes(c, "{ \"status\": 0, \"message\": \"It has to be at least 1 parameters\" } \n");
        json_value_free(jsonR);
        return;
    }
  
   

    char* session = jsonR->operator[]("session").u.string.ptr;
    if(isValidSession(session).id == -1){
        sendRes(c,"{ \"status\": 2, \"message\": \"Invalid session\" } \n");
        json_value_free(jsonR);
        return;
    }


    std::vector<PostModel> posts = PostModel::getPosts();



    char *json = new char[200 * posts.size()];
    json[0] = '[';
    json[1] = '\0';

 
    for(int i = 0; i < posts.size(); i++){
        const char* temp = posts[i].toJson(); 
        strcat(json,temp);
        if(i != posts.size() - 1){
            strcat(json,",");
        }
        delete[] temp;
    }
    strcat(json,"]");
    
    sendRes(c,200 * posts.size(),json);
    delete[] json;
    json_value_free(jsonR);
}

void post_delete(mg_connection *c,mg_http_message *hm)
{
    if(isMethodPost(hm) == false){sendRes(c,"Nope");return;}

    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;

    if(paramaters != 2) {sendRes(c,"{ \"status\": 0, \"message\": \"It has to be at least 1 parameters\" } \n");return;}

    int postId = json->operator[]("id").u.integer;
    if(postId == NULL){sendRes(c,"{ \"status\": 0, \"message\": \"Invalid paramaters\" }");return;}
    
    char* session = json->operator[]("session").u.string.ptr;


    if(isValidSession(session).id == -1){
        sendRes(c,"{ \"status\": 2, \"message\": \"Invalid session\" } \n");
        json_value_free(json);
        return;
    }

    PostModel::deletePost(postId);
    sendRes(c,"{ \"status\": 1, \"message\": \"Post deleted successfully\" } \n");
}
void post_update(mg_connection *c,mg_http_message *hm)
{
     if(isMethodPost(hm) == false){sendRes(c,"Nope");return;}

    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;

    if(paramaters != 4) {sendRes(c,"{ \"status\": 0, \"message\": \"It has to be at least 4 parameters\" } \n");return;}
    
    int id = json->operator[]("id").u.integer;
    char* title = json->operator[]("title").u.string.ptr;
    char* author = json->operator[]("author").u.string.ptr;
    char* msg = json->operator[]("msg").u.string.ptr;

    //check if paramaters are valid
    if(title == NULL || author == NULL || msg == NULL){
        sendRes(c,"{ \"status\": 0, \"message\": \"Invalid paramaters\" } \n");
        return;
    }

    PostModel post = PostModel(id,title,author,msg);
    post.update();
    sendRes(c,"{ \"status\": 1, \"message\": \"Post updated successfully\" } \n");
    json_value_free(json);
}

void post_get(mg_connection *c,mg_http_message *hm)
{   
    if(isMethodPost(hm) == false){sendRes(c,"Nope");return;}

    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;

    if(paramaters != 2){sendRes(c,"{ \"status\": 0, \"message\": \"It has to be at least 1 parameters\" } \n");return;}

    char* session = json->operator[]("session").u.string.ptr;
    if(isValidSession(session).id == -1){
        sendRes(c,"{ \"status\": 2, \"message\": \"Invalid session\" } \n");
        json_value_free(json);
        return;
    }
    
    int postId = json->operator[]("id").u.integer;


    PostModel post = PostModel::get(postId);
    if(post.id == -1){
        sendRes(c,"{ \"status\": 0, \"message\": \"Post not found\" } \n");
        return;
    }

    char* jsonPost = post.toJson();
    sendRes(c,jsonPost);
    delete[] jsonPost;
}

void users_get(mg_connection *c,mg_http_message *hm)
{
    if(isMethodPost(hm) == false){sendRes(c,"Nope");return;}

    json_value *json = json_parse(hm->body.ptr, hm->body.len);
    int paramaters = json->u.object.length;
    //session paramaters
    if(paramaters != 1){sendRes(c,"{ \"status\": 0, \"message\": \"It has to be at least 1 parameters\" } \n");return;}

    char* session = json->operator[]("session").u.string.ptr;

    if(session == NULL){sendRes(c,"{ \"status\": 0, \"message\": \"Invalid paramaters\" } \n");return;}

    if(isValidSession(session).id == -1){
        sendRes(c,"{ \"status\": 0, \"message\": \"Invalid session\" } \n");
        return;
    }

    //decrypt
    std::string decrypted = sessionDecrypt(session);

    char* email = strtok((char*)decrypted.c_str(),":");

    UserModel user = UserModel::getUser(email);

    sendRes(c,user.toJson());
}

void index(mg_connection *c,mg_http_message *hm)
{   
    sendRes(c, "Hello World %d",10);
}


Route routes[ROUTE_COUNT] = {
  {"/users-create", users_create},
  {"/users-login", users_login},
  {"/users-logout", users_logout},
  {"/users-list", users_list},
  {"/users-delete", users_delete},
  {"/users-get", users_get},
  {"/post-create", post_create},
  {"/post-list", post_list},
  {"/post-delete", post_delete},
  {"/post-update", post_update},
  {"/post-get", post_get},
  {"/", index}
};

