#pragma once
#include <string>


#define SESSION_KEY "odkwaodkawfopnawmfpwadsdsadsads"

std::string sessionCreate(std::string email);
std::string sessionDecrypt(char* encryptedSession);