'use strict'

/**
 * Created by: Daniel Proença
 * License: MIT
 * Email(personal): devillabdeveloper@gmail.com || danielproenca89@gmail.com
 * Email(professional): daniel.proenca@lbrtelecom.com.br
 * 
 */

const config = require('../config/config.json')
const mysql = require('mysql2')

module.exports = class EasyCrud{

    constructor(server){
    this.server = server
    this.name = this.server.name
    this.errors = []
    this.config = {
        host: this.server.host,
        user: this.server.user,
        database: this.server.db,
        password: this.server.password,
        port:this.server.port,
        connectionLimit: 1
        }
    }

    connect(){
    
    try{
        this.pool = mysql.createConnection(this.config).promise();
        return true
    }catch(err){
        console.log(err)
        this.errors.push(err)
        return false
    }
    }


    async execute(query, params=null){
        
    try{
        
        const run = await this.pool.query(query, params != null?Object.values(params):'');
       
        return run[0];

    }catch(err){
        
        this.errors.push(err);
        return err;
    }

    }


    async get_result(query, params=null){


    try{
        
        const rows = await this.pool.query(query, params != null?Object.values(params):'');

        
       
        return rows[0];

    }catch(err){
        
        this.errors.push(err);
        console.log(err)
        return err;
    }

    }

    async insert(table,obj){


        if(typeof(obj) == 'object'){0

          
            if(!Array.isArray(obj)){
                try{
            const colums = Object.keys(obj)
            const values = Object.values(obj)
            const req = await this.pool.query(`INSERT IGNORE ${table} (${colums.map(e=>'`'+`${e}`+'`').join(',')}) values (${values.map(e=>`'${e}'`).join(',')})`)
            return req

            }catch(err){
                console.log(err)
                this.errors.push(err)
                return err
            }
            
            }else{

            obj.forEach(async o=>{

            try{
                const colums = Object.keys(o)
                const values = Object.values(o)
                console.log(`INSERT IGNORE ${table} (${colums.join(',')}) values (${values.map(e=>`'${e}'`).join(',')})`)
                const req = await this.pool.query(`INSERT IGNORE ${table} (${colums.join(',')}) values (${values.map(e=>`'${e}'`).join(',')})`)        
                return req
                }
            catch(err){
                console.log(err)
                this.errors.push(err)
                return err
            }
            })
            }
        }

    }


    async update(table, obj, where=''){
        try{

            const colums = Object.keys(obj)
            const values = Object.values(obj)

            const params = colums.map((e,i)=>`${'`'+e+'`'}='${values[i]}'`).join(',')

            const req = await this.pool.query(`UPDATE ${table} SET ${params} ${where != ''?'WHERE '+ where:''}`)

            return req
            
        }catch(err){
                console.log(err)
                this.errors.push(err)
                return err
    }

}

    async delete(table, where){

        try{

       
            
            const req = await this.pool.query(`DELETE FROM ${table} WHERE ${where}`)
            
            
        }catch(err){
                console.log(err)
                this.errors.push(err)
                return err

    }


    }

}


/*Example*/

/**
 * Create a JSON file like "config.json" in this folder:
 * 
 * {

"servers":[{
    "name": "example",
    "host": "localhost",
    "user": "root",
    "password": "pass",
    "db": "mydb" 
}]    
}
 */



/*async function test(){
    const conn = new Connection(config.servers[0])

    conn.connect()

    #INSERT
    const res = await conn.insert("test",[{column:'value', column2:'other'}, {column:'value2', column2:'other'}])

    #UPDATE
    const res = await conn.insert("test",{column:value3},"`column` = 'value2'")

    #DELETE
    const res = await conn.delete("test", "`column` = 'test3'")

    console.log(res)

}

# RUN!!!!

test()
*/