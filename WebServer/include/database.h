#include "sqlite3.h"

extern sqlite3 *db;

bool initDatabase();
void connectDatabase();
void disconnectDatabase();