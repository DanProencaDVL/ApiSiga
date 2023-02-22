# fast-route-js 🚀
 It integrates any MySQL database with an API in a simple and fast way.



1. **Download or clone the project:**  ⬇️ || 🐑

`git clone https://github.com/lbrlab/fast-route-js.git`

`npm install`

2. **Create the files "config.json", "end_point.json" in the folder "config":**

**config.json**
	```
{

    "test":{
    "name": "Test",
    "host": "localhost",
    "user": "root",
    "password": "**********",
    "db": "testdb"    
},
    "auth":{
    "name": "Auth",
    "host": "localhost",
    "user": "root",
    "password": "********",
    "db": "auth"    
}

}
	```
This file contains all your database access configuration. Yea! You can connect many databases!


the structure should follow the pattern:

	```
"NameForConection:"{                          1*
    "name":"OptionalNameForConnection",       
    "host":"DatabaseServerAddress",           
    "user" "DatabaseUserName",                
    "password: "DatabasePassword"             
    "db":"SchemaOfDatabase"                   
}
	```



**end_point.json**

	```
[
{
        "name":"test",
        "path": "local/test",
        "method": "GET",
        "query": "select * from tb_test"
    },
    {
        "name":"auth",
        "path": "login",
        "method": "login",
        "query": "select id from login where username = ? and password = ?"
    }
]
	```

This file contains the endpoints and the instruction that will execute in the database.

Pattern:
```
[
{
        "name":"NameForConnection", 1*
        "path": "Route",
        "method": "Method", GET|POST|PUT|DELETE
        "query": "Query"
    },
    {
        "name":"auth",
        "path": "login",
        "method": "login",
        "query": "select id from login where username = ? and password = ?"
    },

    {...},
    ...
]
```

| Method | Use query |Expected Data |
| ------ | --------- |--------------|
| GET | Yes | {param1:"param1", ...} or null |
| POST | No  | [{column:"value", colum2:"value2",...}, {...}] |
| PUT | No | {data:{column:"NewValue", ...}, where:"column = 'SearchValue'" |
| DELETE | No | "column = 'SearchValue'" |



In GET method: 
```
{
        "name":"test",
        "path": "local/test",
        "method": "GET",
        "query": "select * where column1 = ? and column2 = ?"
}
```

The value of column1 and column2, must be passed in the order they appear in the query ({colum1: 'value1', colum2: 'value2'}).


In other methods, follow the table.


**.env**

AUTH= 1 if use authentication. Default is 0
SECRET=MySecret --Usage for authentication
PORT=3001 -- Application port


Save and RUN:

node index.js

