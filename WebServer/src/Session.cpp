#include "Session.h"
#include <time.h>
#include "AES.h"
#include "Hex.h"

unsigned char secretKey[] = { 0x00, 0xb4, 0xff, 0x03, 0x53, 0x05, 0x66, 0x07, 0x88, 0x42, 0x0a, 0xcb, 0xdc, 0xfd, 0x0e, 0xff }; //key example
AES aes(AESKeyLength::AES_128);
#define PLAIN_LEN 128

//TODO : ADD Secure Encryption
std::string sessionCreate(std::string email)
{
  //generate random number
  srand(time(NULL));
  int random = rand();

  std::string session = email + ":" +   std::to_string(random);
  unsigned char* plainTextBytes = (unsigned char*)session.c_str();
  unsigned char* res = aes.EncryptECB(plainTextBytes,PLAIN_LEN,secretKey);

  
  std::string hexSession = string_to_hex(std::string((char*)res));
  delete[] res;
  return hexSession;
}

std::string sessionDecrypt(char* hexSession)
{
  try{
    std::string encryptedSession = hex_to_string(hexSession);
    unsigned char* res = aes.DecryptECB((unsigned char*)encryptedSession.c_str(),PLAIN_LEN,secretKey);
    std::string session =  std::string((char*)res);

    delete[] res;
    return session;
  }
  catch(std::exception& e){
    return "";
  }
}