#include "routes.h"
#include "database.h"
#include "UserModel.h"

static const char *s_listen_on = "ws://127.0.0.1:8000";
static const char *s_web_root = ".";

static void fn(struct mg_connection *c, int ev, void *ev_data, void *fn_data) {

  if (ev == MG_EV_OPEN) {
    // c->is_hexdumping = 1;
  } else if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data;
    //if User try to download db say return 
    if (strstr(hm->uri.ptr, ".db")) {mg_http_reply(c,401,"","Not yeet amigo");}

    bool match = false;
    for(int i = 0 ; i < ROUTE_COUNT;i++)
    {
        if (mg_http_match_uri(hm, routes[i].path)) {
          match = true;
          routes[i].function(c,hm);
          break;
        }
    }
    
    if(match == false) {
      // Serve static files
      struct mg_http_serve_opts opts = {.root_dir = s_web_root};
      mg_http_serve_dir(c, (struct mg_http_message*)ev_data, (struct mg_http_serve_opts*) &opts);
    }
  } else if (ev == MG_EV_WS_MSG) {


    // Got websocket frame. Received data is wm->data. Echo it back!
    struct mg_ws_message *wm = (struct mg_ws_message *) ev_data;
    mg_ws_send(c, wm->data.ptr, wm->data.len, WEBSOCKET_OP_TEXT);
  }
  (void) fn_data;
}


int main(void) 
{  


  
  initDatabase();
  struct mg_mgr mgr;  // Event manager
  mg_mgr_init(&mgr);  // Initialise event manager
  printf("Starting WS listener on %s/websocket\n", s_listen_on);
  mg_http_listen(&mgr, s_listen_on, fn, NULL);  // Create HTTP listener
  for (;;) mg_mgr_poll(&mgr, 1000);             // Infinite event loop
  mg_mgr_free(&mgr);
  return 0;
}
