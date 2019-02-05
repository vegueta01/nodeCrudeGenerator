let table = {
    _tableName:'COUNTRIES',
    _id: {name:'ID',type:'string'},
    _ids:[{
            name:"HOTEL_ID",
            type:"string",
            findAttribute:true
        },{
            name:"TOWER_ID",
            type:"string",
            findAttribute:true
        },{
            name:"FLOOR_ID",
            type:"string",
            findAttribute:true
        },{
            name:"ROOM_ID",
            type:"string",
            findAttribute:true
        }],
    COUNTRY:{
        type:'string',
        allowNull:false,
        findAttribute:true
    },
    PIPE:{
        type:'int',
        allowNull:false,
        findAttribute:true
    }
    }

let documentationGenerator =()=>{

    let doc = 
    `# base url

            [scheme]//[host]/[apiversion]/[controller]/[params]

- scheme: htttp or https
- host: host or ip service
- apiversion: v1
- controller: controler name
- params: url params


- # Controller **${table._tableName.toLowerCase()}**

      name url: ${table._tableName.toLowerCase()}
      
    - ## ***endpoints***
    - ## **Get by id**
        `
        if(table._id){
            doc+=
        `**url:** /${table._tableName.toLowerCase()}/:${table._id.name.toLowerCase()}`
        }else{
            if(table._ids.length > 0){
                doc+=
        `**url:** /${table._tableName.toLowerCase()}${getIds()}`
            }
        }
        `
        
        **type:** GET

        **required params:**  
        `
        if(table._id){
            doc+=
            `
    - **${table._id.name.toLowerCase()}**:
    - type: ${table._id.type.toLowerCase()}
            `
        }else{
            for (let i = 0; i < table._ids.length; i++) {
                doc+=
                `
    - **${table._ids[i].name.toLocaleLowerCase()}**:
    - type: ${table._ids[i].type.toLowerCase()}

                `     
            }
            
        }
        doc+=
        `

    - ### **return**: object model:

                {
                `
                if(table._ids){
                    if(table._ids.length > 0){
                        for (let i = 0; i < table._ids.length; i++) {
                            doc+=
                            getParam(table._ids[i],table._ids[i].name)
                        }
                    } 
                   }
                   for (const key in table) {           
                    if(key !== '_tableName'){
                        if(key !== '_id'){
                            if(key !== '_ids'){
                                doc+=
                                getParam(table[key],key)                        
                            }
                        }
                    }
                }
                doc+=
                `
                }
           


    #

    - ## ***endpoints*** 
    - ## **Get list ${table._tableName.toLowerCase()}**

        **url:** /${table._tableName.toLowerCase()}

        **type:** GET

        **optional params:**

        - **count**: 
            - type: 'Number'
            - default: 50
        - **skip**: 
            - type: 'Number'
            - default: 0
        
        - **urls**: 
            - type: 'JSON'
                     
        - **kind**: 
            - type: 'string'
            
    - ### **return**: object model:
    
                [
                   {
                        "id": "5c366de0169f3b8ca74443aa",
                        "kind": "envelope",
                        "urls": {
                            "thumbnail": string, url,
                            "main": string, url
                        },
                        "status": boolean, true,
                        "createdDate": Number, 1547070944621,
                        "updatedDate": Number, 1547070944621
                    },
                ]
    

    #

    - ## ***endpoints*** 
    - ## **POST add envelopeTemplateDesigns**

        **url:** /envelopeTemplateDesigns/:id

        **type:** POST

        **required params:**  

        - id: string ***id of envelopeTemplateDesigns***
  
        - type: application/json

        - **body:**
    
                 {
                    "kind": "liner",
                    "urls": {
                        "thumbnail": string //Url thumbnail  // url sobre pequeñito cerrado
                        "main": string //Url main // url sobre grande abierto
                    },
                    "status": boolean 
                }

    - ### **return**: object model:
  
          
                {
                "id": string 
                }
           

    #

    - ## ***endpoints*** 
        - ## **Delete delete envelopeTemplateDesigns**

        **url:** /envelopeTemplateDesigns/:id

        **type:** DELETE

        **required params:**

         - **id:** 
         - type: string


    - ### **return**: object model:
  
               {
                    "id": "5c366de0169f3b8ca74443aa",
                    "kind": "envelope",
                    "urls": {
                        "thumbnail": string, url,
                        "main": string, url
                    },
                    "status": boolean, true,
                    "createdDate": Number, 1547070944621,
                    "updatedDate": Number, 1547070944621
                }
        

    #

    - ## ***endpoints*** 
    - ## **Put update envelopeTemplateDesigns**
        
        ***warning:*** this function replaces all envelopeTemplateDesigns 
        data

        **url:** /envelopeTemplateDesigns/:id

        **type:** PUT

        **required params:**
        
         - **id:** 
         - type:string

         - **body:**
    
                {
                    "kind": "liner",
                    "urls": {
                        "thumbnail": string //Url thumbnail  // url sobre pequeñito cerrado
                        "main": string //Url main // url sobre grande abierto
                    },
                    "status": boolean,
                    "createdDate": Number, 1547070944621,
                }
    


    - ### **return**: object model:
   
                {
                    id:string
                }
   `
   return doc;
}

let getIds=()=>{
    let ids = "";
    for (let i = 0; i < table._ids.length; i++) {
        ids+=
        `/:${table._ids[i].name.toLocaleLowerCase()}`
                
    }
    
    return ids;
}


let getParam =(attribute,key)=>{
    let stringParam =
    `${key.toLocaleLowerCase()}:${attribute.type.toLocaleLowerCase()},
    `
    return stringParam;
}