#pragma once
#include "mongoose.h"

typedef void (*tp_fnRoute)(mg_connection *c,mg_http_message *hm);

struct Route
{
  char path[64];
  tp_fnRoute function;
};

#define ROUTE_COUNT 12
extern Route routes[ROUTE_COUNT];