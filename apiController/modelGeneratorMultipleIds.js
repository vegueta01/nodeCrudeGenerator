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

exports.modelGenerate =(req,res,next)=>{
    if(!req.body._tableName === undefined){
        res.status(500).send({
            message: '_tableName is not fount'
        });
        return;
    }
    if(!req.body._id === undefined){
        res.status(500).send({
            message: '_id is not fount'
        });
        return;
    }
    
    if(Object.keys(req.body).length <= 2){
        if(req.body._ids){
            console.log(req.body._ids);            
            if(!(req.body._ids.length > 0)){
               
                res.status(400).send(
                bodyExample()
                );
                return;
            }
        }else{           
            res.status(400).send(                
                bodyExample()    
            );
            return;
        }
       
    }
    table = req.body;

    let document = 
    `${getGeneratorModel()}
   
    `
    res.send(document)

}
let typeDefine = (type)=>{
    if(type.toLocaleLowerCase() === 'string'){
        return 'DataTypes.STRING'
    }else if(type.toLocaleLowerCase() === 'integer' || type === 'int' ){
        return 'DataTypes.BIGINT'
    }else if(type.toLocaleLowerCase() === 'float'){
        return 'DataTypes.FLOAT'
    }else if(type.toLocaleLowerCase() === 'boolean'){
        return 'DataTypes.BOOLEAN'
    }else if(type.toLocaleLowerCase() === 'date' || type.toLocaleLowerCase() === 'timestamp' || type.toLocaleLowerCase() === 'timestamp with time zone'){
        return 'DataTypes.DATE'
    }
}
let getGeneratorModel =()=>{

    let modelAttribute =(attibute,key)=>{
        let stringAttribute = "";
        // for (const key in table) {
        //     //  object[key];
        //     if(key !== '_id'){
        //         if(key !== '_tableName'){
                  
         stringAttribute+=
        ` 
        ${key.toLocaleLowerCase()}: {
            type: ${typeDefine(attibute.type)},
            allowNull: ${attibute.allowNull},
            field: '${key.toUpperCase()}'
            },
            `

        //         }
        //     }
            
        // }
        return stringAttribute;
    }

    let modelAttributesKeys =(attibute,key)=>{
    
         let stringAttribute =
        ` 
        ${key.toLocaleLowerCase()}: {
            type: ${typeDefine(attibute.type)},
            primaryKey: true,
            field: '${key.toUpperCase()}'`
            if(attibute.type !== 'string'){
                stringAttribute+=
                `,
                autoIncrement: true,`
            }
            stringAttribute+=
            `
            },
            `
        return stringAttribute;
    }

    let stringModel = 
`   /**
    * model of ${table._tableName.toLocaleLowerCase()}
    */
   module.exports = function (sequelize, DataTypes) {
    return sequelize.define('${table._tableName.toLocaleLowerCase()}', {
       `
       if(table._id){
        stringModel+=
        `
        ${table._id.name.toLocaleLowerCase()}: {
            type: ${typeDefine(table._id.type.toLocaleLowerCase())},
            primaryKey: true,
            `
            if(table._id.type.toLocaleLowerCase() !== 'string'){
             stringModel+=
             `autoIncrement: true,`
            }
            stringModel+=
            `
            field: '${table._id.name.toLocaleUpperCase()}'
          },
        `
       }
       if(table._ids){
        if(table._ids.length > 0){
            for (let i = 0; i < table._ids.length; i++) {
                stringModel+=
                modelAttributesKeys(table._ids[i],table._ids[i].name)
            }
            
        } 
       }
        for (const key in table) {           
            if(key !== '_tableName'){
                if(key !== '_id'){
                    if(key !== '_ids'){
                        stringModel+=
                        modelAttribute(table[key],key)
                    }
                }
            }
        }
        // ${modelAttribute()}
       stringModel+=
       `   
        deleted:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'DELETED'
            },
            deleted_at:{
                type: 'TIMESTAMP',
                allowNull: true,
                field: 'DELETED_AT'               
            },
            deleted_by:{
                type: DataTypes.STRING,
                allowNull: true,
                field: 'DELETED_BY'
            }
        },{
         tableName: '${table._tableName.toLocaleUpperCase()}',
         timestamps: false,
         paranoid: true,
         underscored: true,
         freezeTableName: true
       });
     };`
     return stringModel;
}