let table = {
    _tableName:'COUNTRIES',
    _id: {name:'ID',type:'string'},
    _ids:['HOTEL_ID','TOWER_ID','FLOOR_ID','ROOM_ID'],
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
    if(!req.body._tableName){
        res.status(500).send({
            message: '_tableName is not fount'
        });
        return;
    }
    if(!req.body._id){
        res.status(500).send({
            message: '_id is not fount'
        });
        return;
    }
    // console.log({length:Object.keys(req.body).length});
    if(Object.keys(req.body).length <= 2){
        res.status(500).send(
            
             `body is empty
            example: 
            {
                
                    _tableName:'COUNTRIES',
                    _id: {name:'ID',type:'string'},
                    _ids:['HOTEL_ID','TOWER_ID','FLOOR_ID','ROOM_ID'],
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
                    
            }`
  
        );
        return;
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
    }
}
let getGeneratorModel =()=>{

    let modelAttribute =()=>{



        let stringAttribute = "";
        for (const key in table) {
            //  object[key];
            if(key !== '_id'){
                if(key !== '_tableName'){
                    console.log();
                    stringAttribute+=
        ` 
        ${key.toLocaleLowerCase()}: {
            type: ${typeDefine(table[key].type)},
            allowNull: ${table[key].allowNull},
            field: '${key.toUpperCase()}'
            },
            `

                }
            }
            
        }
        return stringAttribute;
    }

    let stringModel = 
    `/**
    * model of ${table._tableName.toLocaleLowerCase()}
    */
   module.exports = function (sequelize, DataTypes) {
       return sequelize.define('${table._tableName.toLocaleLowerCase()}', {
         ${table._id.name.toLocaleLowerCase()}: {
           type: ${typeDefine(table._id.type.toLocaleLowerCase())},
           primaryKey: true,
           `
           if(! table._id.type.toLocaleLowerCase() === 'string'){
            stringModel+=
            `autoIncrement: true,`
           }
           stringModel+=
           `field: '${table._id.name.toLocaleUpperCase()}'
         },
         ${modelAttribute()}
        },{
         tableName: '${table._tableName.toLocaleUpperCase()}',
         timestamps: false,
         paranoid: true,
         underscored: true,
         freezeTableName: true
       });
     };
     `
     return stringModel;
}