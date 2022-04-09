#include "sqlite3.h"
#include <stdio.h>

sqlite3 *db;

#define DATABASE_NAME "web.db"

bool initDatabase()
{
  sqlite3 *db;
  char *err_msg = 0;
  int rc = sqlite3_open(DATABASE_NAME, &db);
  if (rc != SQLITE_OK) {
    fprintf(stderr, "Cannot open database: %s\n", sqlite3_errmsg(db));
    sqlite3_close(db);
    return 1;
  }

  //migrate database
  char *users  = "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT NOT NULL UNIQUE, pass TEXT);";
  char *posts = "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, content TEXT);";
  sqlite3_exec(db, users, 0, 0, &err_msg);
  sqlite3_exec(db, posts, 0, 0, &err_msg);
  sqlite3_close(db);
}

void connectDatabase(){
    sqlite3_open(DATABASE_NAME, &db);
}
void disconnectDatabase(){
    sqlite3_close(db);
}