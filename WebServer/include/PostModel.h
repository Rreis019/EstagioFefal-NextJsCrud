#pragma once
#include <vector>

class PostModel
{
    public:
        PostModel() : id(-1), title(""), author(""), content("") {}
        PostModel(char* title, char* author, char* msg);
        PostModel(int id,char* title, char* author, char* msg);
        void print();
        char* toJson();

        void add(); // add to database
        void update(); // update database

        int id = -1;
        char title[25];
        char author[25];
        char content[100];
    public:
        static std::vector<PostModel> getPosts();
        static void deletePost(int id);
        static PostModel get(int id); // get from database
        
};