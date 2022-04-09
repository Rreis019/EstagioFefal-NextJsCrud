#include "UserModel.h"
#include "database.h"
#include <cstring>
#include "Session.h"

UserModel::UserModel(std::string name, std::string email, std::string pass)
{
    strcpy(this->name, name.c_str());
    strcpy(this->email, email.c_str());
    strcpy(this->pass, pass.c_str());
}


//{"name":"Jesus","email":"dawfwa","pass":"123456"}
int UserModel::add()
{
    connectDatabase();

    char sqlCommand[200];
    char *err_msg = 0;

    sprintf(sqlCommand, "INSERT INTO users (name, email, pass) VALUES (\"%s\" , \"%s\" , \"%s\");", this->name, this->email, this->pass);

    printf("%s\n", sqlCommand);

    sqlite3_exec(db, sqlCommand, 0, 0, &err_msg);
    printf("%s\n", err_msg);
   
    disconnectDatabase();

    if(err_msg != NULL){return 0;}//fail
    return 1; //sucess
} 



void UserModel::getUser(int id)
{

}


bool isValidAcc = false;
static int callback(void *data, int argc, char **argv, char **azColName)
{
    if(argc > 0){isValidAcc = true;}
    return 0;
}




std::vector<UserModel> UserModel::getUsers()
{
    connectDatabase();
    char sqlCommand[] = "SELECT * FROM users;";
    sqlite3_stmt* stmt;

    //create vector to store all the users
    std::vector<UserModel> users;
    
    //execute the query without callback
    sqlite3_prepare(db, sqlCommand, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, 1); //protect against sql injection

    bool done = false;
    while (!done)
    {
        switch (sqlite3_step(stmt))
        {
            case SQLITE_ROW:
            {
                UserModel user;
                user.id = sqlite3_column_int(stmt, 0);
                strcpy(user.name, (char*)sqlite3_column_text(stmt, 1));
                strcpy(user.email, (char*)sqlite3_column_text(stmt, 2));
                strcpy(user.pass, (char*)sqlite3_column_text(stmt, 3));
                users.push_back(user);
                //user.printUser();
                break;
            }
            case SQLITE_DONE:
            {
                done = true;
                break;
            }
            default:
            {
                printf("Error: %s\n", sqlite3_errmsg(db));
                done = true;
                break;
            }
        }
    }

    sqlite3_finalize(stmt);
    disconnectDatabase();
    return users;
}

char* UserModel::checkLogin(std::string email,std::string pass)
{
    connectDatabase();
    char sqlCommand[200];
    isValidAcc = false;
    sprintf(sqlCommand, "SELECT * FROM users WHERE email = \"%s\" AND pass = \"%s\";", email.c_str(), pass.c_str());
    sqlite3_exec(db, sqlCommand, callback,0, 0);

    disconnectDatabase();

    char* buffer = new char[500];
    if(isValidAcc)
    {
        std::string session = sessionCreate(email);
        sprintf(buffer, "{ \"status\": 1, \"message\": \"Login successfully\", \"session\": \"%s\"}", session.c_str());
        return buffer;
    }
    
    sprintf(buffer, "{ \"status\": 0, \"message\": \"Invalid email or password\"}");
    return buffer;
}

void UserModel::print(){
    printf("user -> id:%d  name: %s email: %s pass:%s\n", this->id, this->name, this->email, this->pass);
}

//FREE AFTER USE
char* UserModel::toJson(){
    char* result = new char[256];
    sprintf(result, "{\"id\": %d, \"name\": \"%s\", \"email\": \"%s\", \"password\": \"%s\"}", this->id, this->name, this->email, this->pass);
  return result;


}

void UserModel::deleteUser(int id){
    connectDatabase();
    char sqlCommand[200];
    sprintf(sqlCommand, "DELETE FROM users WHERE id = %d;", id);
    sqlite3_exec(db, sqlCommand, 0, 0, 0);
    disconnectDatabase();
}

UserModel UserModel::getUser(std::string email)
{
    connectDatabase();
    char sqlCommand[200];
    sprintf(sqlCommand, "SELECT * FROM users WHERE email = \"%s\";", email.c_str());
    sqlite3_stmt* stmt;
    sqlite3_prepare(db, sqlCommand, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, 1); //protect against sql injection

    UserModel user;
    if(sqlite3_step(stmt) == SQLITE_ROW)
    {
        user.id = sqlite3_column_int(stmt, 0);
        strcpy(user.name, (char*)sqlite3_column_text(stmt, 1));
        strcpy(user.email, (char*)sqlite3_column_text(stmt, 2));
        strcpy(user.pass, (char*)sqlite3_column_text(stmt, 3));
    }

    sqlite3_finalize(stmt);
    disconnectDatabase();
    return user;
}