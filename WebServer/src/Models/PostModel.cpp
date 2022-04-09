#include "PostModel.h"
#include "database.h"
#include "sqlite3.h"
#include <stdio.h>
#include <stdlib.h>
#include <cstring>


PostModel::PostModel(char* title, char* author, char* msg)
{
    strcpy(this->title, title);
    strcpy(this->author, author);
    strcpy(this->content, msg);
}

PostModel::PostModel(int id,char* title, char* author, char* msg)
{
    this->id = id;
    strcpy(this->title, title);
    strcpy(this->author, author);
    strcpy(this->content, msg);
}

std::vector<PostModel> PostModel::getPosts()
{
    bool done = false;
    std::vector<PostModel> posts;
    connectDatabase();
    char sqlCommand[] = "SELECT * FROM posts";
    sqlite3_stmt *stmt;
    sqlite3_prepare_v2(db, sqlCommand, -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, 1); //protect against sql injection

    while (!done)
    {   
        switch (sqlite3_step(stmt))
        {
            case SQLITE_ROW:
            {

                PostModel post;
                post.id = sqlite3_column_int(stmt, 0);
                strcpy(post.title, (char*)sqlite3_column_text(stmt, 1));
                strcpy(post.author, (char*)sqlite3_column_text(stmt, 2));
                strcpy(post.content, (char*)sqlite3_column_text(stmt, 3));
                posts.push_back(post);
                break;
            }
            case SQLITE_DONE:{
                done = true;
                break;
            }
        }

    }
    sqlite3_finalize(stmt);
    disconnectDatabase();
    return posts;
}

char* PostModel::toJson()
{
    char* json = new char[256];
    sprintf(json, "{\"id\":%d,\"title\":\"%s\",\"author\":\"%s\",\"msg\":\"%s\"}", id, title, author, content);
    return json;
}

void PostModel::print()
{
    printf("post -> id: %d, title: %s, author: %s, msg: %s\n", id, title, author, content);
}

void PostModel::deletePost(int id){
    connectDatabase();
    char sqlCommand[200];
    sprintf(sqlCommand, "DELETE FROM posts WHERE id = %d;", id);
    sqlite3_exec(db, sqlCommand, 0, 0, 0);
    disconnectDatabase();
}


void PostModel::add()
{
    char sqlCommand[200];
    sprintf(sqlCommand, "INSERT INTO posts (title,author,content) VALUES ('%s', '%s', '%s');", title, author, content);
    connectDatabase();
    sqlite3_exec(db, sqlCommand, 0, 0, 0);
    disconnectDatabase();
}

void PostModel::update()
{
    if(id == -1)
    {
        printf("id is not set\n");
        return;
    }

    char sqlCommand[200];
    sprintf(sqlCommand, "UPDATE posts SET title = '%s', content = '%s' WHERE id = %d;", title, content, id);
    connectDatabase();
    sqlite3_exec(db, sqlCommand, 0, 0, 0);
    disconnectDatabase();
}

PostModel PostModel::get(int id)
{
   char sqlCommand[200];
   sprintf(sqlCommand, "SELECT * FROM posts WHERE id = %d LIMIT 1;", id);
    connectDatabase();

    sqlite3_stmt *stmt;
    sqlite3_prepare_v2(db, sqlCommand, -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, 1); //protect against sql injection


    PostModel post;
    if(sqlite3_step(stmt) == SQLITE_ROW)
    {
        post.id = sqlite3_column_int(stmt, 0);
        strcpy(post.title, (char*)sqlite3_column_text(stmt, 1));
        strcpy(post.author, (char*)sqlite3_column_text(stmt, 2));
        strcpy(post.content, (char*)sqlite3_column_text(stmt, 3));
    }

    sqlite3_finalize(stmt);
    disconnectDatabase();

    return post;
}