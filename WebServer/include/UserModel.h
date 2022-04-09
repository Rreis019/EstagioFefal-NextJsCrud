#include <string>
#include <vector>

class UserModel
{
    public:
        UserModel(){};
        UserModel(std::string name, std::string email, std::string pass);
        int add(); //add user to database
        void print(); //print user info
        char* toJson();
    public:
        int id = -1;
        char name[100];
        char email[100];
        char pass[100];
    public:
        static std::vector<UserModel> getUsers();
        static void getUser(int id);
        static UserModel getUser(std::string email);
        static void deleteUser(int id); //delete user from database
        static char* checkLogin(std::string email,std::string pass); //login user
};