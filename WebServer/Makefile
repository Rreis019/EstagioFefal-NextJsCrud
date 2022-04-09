CC = g++
CFLAGS 	= -IC:/mingw64/include -Wall  -Iinclude#include flags 
LDFLAGS = -LC:/mingw64/lib   -lmingw32 -lws2_32 #linker flags
SRC = $(wildcard src/*.cpp src/Models/*.cpp) 
OBJ  =  $(SRC:.cpp=.o) 
OBJ += sqlite3.o

BIN = bin/Release/WebServer.exe
all: sql
#all: CFLAGS += -O3
all : LDFLAGS += -static-libstdc++ -static-libgcc #include libstd++ and libgcc on executable to be able run another machine 
all: LDFLAGS += -s #remove debug symbols
all: link 
all: execute

debug: CFLAGS += -DDEBUG -g
debug: BIN = bin/Debug/WebServer.exe
debug: link
debug: execute
dirs:
	mkdir src
	@echo > src/main.cpp
	mkdir include
	mkdir bin
	cd bin && mkdir Debug && mkdir Release
execute: 
	$(BIN)

link: $(OBJ)
	$(CC)   $^ $(LDFLAGS) -o  $(BIN)

%.o: %.cpp
	$(CC) -o $@ -c $< $(CFLAGS)

sql:#gcc src/sqlite3.c -c 


clean:
	del src\*.o src\Models\*.o


