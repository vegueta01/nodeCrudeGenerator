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
exports.crudeGenerate = (req,res,next)=>{

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
    console.log({length:Object.keys(req.body).length});
    if(Object.keys(req.body).length <= 2){
        res.status(500).send(
            
             `body is empty
            example: 
            {
            "_tableName":"COUNTRIES",
            "_id": {"name":"ID","type":"int"},
            "COUNTRY":{
                "type":"integer",
                "allowNull":false,
                "findAttribute":true
                }
            }`
  
        );
        return;
    }
    table = req.body;

    let document = 
    `${getHeadGenerator()}
    ${getListGenerator()}
    ${getAddGenerator()}
    `
    if(table._id){
        document+=
        `
        ${getUpdateGenerator()}
        ${getRemoveGenerator()}
        ${getByIdGenerator()}
        `
    }else{
        // la llave del id es nula osea que tiene varias llaves 
        //etonces para actualizar y eliminar y buscar por id se debe buscar por todas esas llaves
        //agregar el atributo primary = true a todas las llaves
        if(table._ids){
            for (let u = 0; u < table._ids.length; u++) {
                // table._ids[u];
                
            }
        }
    }
    res.send(document)
}
let getHeadGenerator = ()=>{
    let stringHead = 
`const createError = require('http-errors');
const Sequelize = require('sequelize');    
const models = require('../../sequelize/models/index')
`
    if(table._id.type ==='string'){
        stringHead+=
 `const uuid4 = require('uuid4');`
    }

    stringHead+=`
    
    `
    return stringHead;
}

let getByIdGenerator = ()=>{
  
   let stringGetById = 
   `/**
   * get element by id
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
    exports.getById = async (req, res, next) => {
        try {
            if(req.params.${table._id.name.toLowerCase()}) {
                `
            if(table._id.type === 'int' || table._id.type === 'integer' || table._id.type === 'number'){
                stringGetById+=
                `let number_data = Number.parseFloat(req.params.${table._id.name.toLowerCase()});
                if (Number.isNaN(number_data)) {
                    next(createError(400, {
                        message: '${table._id.name.toLowerCase()} is not Number, value = ' + "'" + req.params.${table._id.name.toLowerCase()} + "'"
                    })); return;
                }else {req.params.${table._id.name.toLowerCase()} = number_data;}
            }`
            }else if(table._id.type === 'string'){
                stringGetById+=
                `if (typeof req.params.${table._id.name.toLowerCase()} !== 'string') {
                    next(createError(400, {
                        message: '${table._id.name.toLowerCase()} is not string, value = ' + "'" + req.params.${table._id.name.toLowerCase()} + "'"
                    })); return;
                }else if(! uuid4.valid(req.params.${table._id.name.toLowerCase()})){
                    next(createError(400, {
                        message: '${table._id.name.toLowerCase()} is not valid, value = ' + "'" + req.params.${table._id.name.toLowerCase()} + "'"
                    })); return;
                }
            }`
            }
            
            stringGetById+=
            `else{
                next(createError(400, {
                    message: '${table._id.name.toLowerCase()} is not found'
                })); return;
            }
            let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});

            if (result == null) {
                res.status(404);
                return next();
            }
    
            res.status(200).json(result)
        } catch (error) {
            console.log({error});
            next(createError(500, {
                message: error.message
            })); return;
        }
    }`;

    return stringGetById;

}

let getListGenerator =()=>{

    let findsAttributes = ()=>{
        let stringFindsAtributes = "";
        for (const key in table) {           
            if(key !== '_tableName'){
                if(key !== '_id'){
                if(table[key].findAttribute === true){
                    if(table[key].type === 'string'){
                        stringFindsAtributes +=
            `if (req.query.${key.toLocaleLowerCase()} !== undefined) {
                if (typeof req.query.${key.toLocaleLowerCase()} === 'string') {
                    where.${key.toLocaleLowerCase()} = {
                        [Sequelize.Op.like]: '%' + req.query.${key.toLocaleLowerCase()} + '%'
                    }
                } else {
                    next(createError(400, {
                        message: '${key.toLocaleLowerCase()} is not string, value = ' + "'" + req.query.${key.toLocaleLowerCase()} + "'"
                    })); return;
                }
            }
            `
                    }else if(table[key].type === 'number'){
                        stringFindsAtributes +=
            `if (req.query.${key.toLocaleLowerCase()} !== undefined) {
                let number_data = Number.parseFloat(req.query.${key.toLocaleLowerCase()});
                if (Number.isNaN(number_data)) {
                    next(createError(400, {
                        message: '${key.toLocaleLowerCase()} is not Number, value = ' + "'" + req.query.${key.toLocaleLowerCase()} + "'"
                    })); return;
                } else { where.${key.toLocaleLowerCase()} = number_data }
            }
            `
                    }else if(table[key].type === 'int' || table[key].type === 'integer'){
                        stringFindsAtributes +=
            `if (req.query.${key.toLocaleLowerCase()} !== undefined) {
                let number_data = Number.parseInt(req.query.${key.toLocaleLowerCase()});
                if (Number.isNaN(number_data)) {
                    next(createError(400, {
                        message: '${key.toLocaleLowerCase()} is not Number, value = ' + "'" + req.query.${key.toLocaleLowerCase()} + "'"
                    })); return;
                } else { where.${key.toLocaleLowerCase()} = number_data }
            }
            `                        
                    }else if(table[key].type === 'float'){
                        stringFindsAtributes +=
            `if (req.query.${key.toLocaleLowerCase()} !== undefined) {
                let number_data = Number.parseFloat(req.query.${key.toLocaleLowerCase()});
                if (Number.isNaN(number_data)) {
                    next(createError(400, {
                        message: '${key.toLocaleLowerCase()} is not Number, value = ' + "'" + req.query.${key.toLocaleLowerCase()} + "'"
                    })); return;
                } else { where.${key.toLocaleLowerCase()} = number_data }
            }
            `
                    }else if(table[key].type === 'boolean'){
                        stringFindsAtributes +=
            `if (req.query.${key.toLocaleLowerCase()}) {
                if (typeof (req.query.${key.toLocaleLowerCase()}) === "boolean") {
                    where.${key.toLocaleLowerCase()} = req.query.${key.toLocaleLowerCase()};
                } else {
                    switch (req.query.${key.toLocaleLowerCase()}) {
                        case 'true':
                            where.${key.toLocaleLowerCase()} = true;
                            break;
                        case 'false':
                            where.${key.toLocaleLowerCase()} = false;
                            break;
                        default:
                            return res.status(400).send({
                                message: '${key.toLocaleLowerCase()} is not boolean, value = ' + "'" + req.query.${key.toLocaleLowerCase()} + "'"
                            });
                            break;
                    }
                }
            }
            `
                    }
                }
                }
            }
        }
        return stringFindsAtributes;
    }
    let stringList =  
    `/**
    * list and count elements 
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
   exports.getList = async (req, res, next) => {
       try {
           let count = 0
           let skip = 0
           let where = {};
   
           if (req.query.count) {
               let number_data = Number.parseFloat(req.query.count);
               if (Number.isNaN(number_data)) {
                   next(createError(400, {
                       message: 'count is not Number, value = ' + "'" + req.query.count + "'"
                   })); return;
               } else { count = number_data; }
           } else {
               count = 50;
           };
   
           if (req.query.skip) {
               let number_data = Number.parseFloat(req.query.skip);
               if (Number.isNaN(number_data)) {
                   next(createError(400, {
                       message: 'skip is not Number, value = ' + "'" + req.query.skip + "'"
                   })); return;
               } else { skip = number_data; }
           } else {
               skip = 0;
           };
   
           ${findsAttributes()}
   
           let result = await models.${table._tableName.toLocaleLowerCase()}.findAndCountAll({
               where,
               offset: skip,
               limit: count
           });
   
           if (result == null) {
               res.status(404);
               return next();
           }
   
           res.status(200).json({
               rows: result.rows,
               count: result.count
           });
       } catch (error) {
           console.log({ error });
           next(createError(500, {
               message: error.message
           })); return;
       }
   }`
   return stringList;
}

let getAddGenerator =()=>{

    let whereAnd =()=>{
        let stringWhereAnd = "";
        for (let key in table) {           
            if(key !== "_tableName"){
                if(key !== "_id"){
                stringWhereAnd+=
                `{${key.toLocaleLowerCase()}: req.body.${key.toLocaleLowerCase()}},
                    `
                }
            }
        }
        return stringWhereAnd;
    }

    let defaults =()=>{
        let stringWhereAnd = "";
        for (let key in table) {           
            if(key !== "_tableName"){
                if(key !== "_id"){
                stringWhereAnd+=
                `${key.toLocaleLowerCase()}: req.body.${key.toLocaleLowerCase()},
                    `
                }
            }
        }
        return stringWhereAnd;
    }


    let stringAdd =
    `/**
    * add element
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
   exports.add = async (req, res, next) => {
       try {
           if (!req.body) {
               next(createError(400, {
                   message: 'body null or undefined'
               }));
               return;
           }
   
           ${findsAttributesInsert()}
   
           let result = await models.${table._tableName.toLowerCase()}.findOrCreate({
               where: {
                   [Sequelize.Op.and]: [
                    ${whereAnd()}
                   ]
               },
               defaults: {
                   `
                   if(table._id.type === 'string'){
                    stringAdd+=
                    `${table._id.name.toLocaleLowerCase()}: uuid4(),
                    `
                   }
                   stringAdd+=
                   `
                    ${defaults()}
               }
           });
   
           if (result == null) {
               throw new Error('work-time start creation internal error');
           }
   
           if (result[1] == false) {
               next(createError(400, {
                   message: 'start work-time already in database for this employee at this hotel'
               }));
   
               return;
           } else {
               res.status(201).json(result[0]);
           }
   
       } catch (error) {
           console.log({ error });
           next(createError(500, {
               message: error.message
           })); return;
       }
   }
   `
   return stringAdd;
}

let getUpdateGenerator =()=>{
    
    // let findsAttributesInsert = ()=>{
    //     let stringFindsAtributes = "";
    //     for (const key in table) {           
    //         if(key !== '_tableName'){
    //             if(key !== '_id'){
    //             // if(table[key].findAttribute === true){
    //             if(table[key].type === 'string'){
    //                 stringFindsAtributes +=
    //         `if (!req.body.${key.toLocaleLowerCase()}) {
    //             next(createError(400, {
    //                 message: '${key.toLocaleLowerCase()} null or undefined'
    //             }));
    //             return;
    //         } else {
    //             if (typeof req.body.${key.toLocaleLowerCase()} !== 'string') {
    //                 next(createError(400, {
    //                     message: '${key.toLocaleLowerCase()} is not string'
    //                 }));
    //                 return;
    //             }
    //         }
    //         `
    //             }else if(table[key].type === 'number'){
    //                 stringFindsAtributes +=
    //         `if (!req.body.${key.toLocaleLowerCase()}) {
    //             next(createError(400, {
    //                 message: '${key.toLocaleLowerCase()} null or undefined'
    //             }));
    //             return;
    //         } else {
    //             let number_data = Number.parseFloat(req.body.${key.toLocaleLowerCase()});
    //             if (Number.isNaN(number_data)) {
    //                 next(createError(400, {
    //                     message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
    //                 }));
    //                 return;
    //             } else { req.body.${key.toLocaleLowerCase()} = number_data }
    //         }
    //         `
    //             }else if(table[key].type === 'float'){
    //                 stringFindsAtributes +=
    //         `if (!req.body.${key.toLocaleLowerCase()}) {
    //             next(createError(400, {
    //                 message: '${key.toLocaleLowerCase()} null or undefined'
    //             }));
    //             return;
    //         } else {
    //             let number_data = Number.parseFloat(req.body.${key.toLocaleLowerCase()});
    //             if (Number.isNaN(number_data)) {
    //                 next(createError(400, {
    //                     message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
    //                 }));
    //                 return;
    //             } else { req.body.${key.toLocaleLowerCase()} = number_data }
    //         }
    //         `
    //             }else if(table[key].type === 'int' || table[key].type === 'integer'){
    //                 stringFindsAtributes +=
    //         `if (!req.body.${key.toLocaleLowerCase()}) {
    //             next(createError(400, {
    //                 message: '${key.toLocaleLowerCase()} null or undefined'
    //             }));
    //             return;
    //         } else {
    //             let number_data = Number.parseInt(req.body.${key.toLocaleLowerCase()});
    //             if (Number.isNaN(number_data)) {
    //                 next(createError(400, {
    //                     message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
    //                 }));
    //                 return;
    //             } else { req.body.${key.toLocaleLowerCase()} = number_data }
    //         }
    //         `
    //             }else if(table[key].type === 'boolean'){
    //                 stringFindsAtributes +=
    //     `if (req.body.${key.toLocaleLowerCase()} === undefined) {
    //         next(createError(400, {
    //             message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
    //         }));
    //     }else{
    //         if (typeof (req.body.${key.toLocaleLowerCase()}) !== "boolean") {               
    //             switch (req.body.${key.toLocaleLowerCase()}) {
    //                 case 'true':
    //                     req.body.${key.toLocaleLowerCase()} = true;
    //                     break;
    //                 case 'false':
    //                     req.body.${key.toLocaleLowerCase()} = false;
    //                     break;
    //                 default:
    //                      next(createError(400, {
    //                         message: '${key.toLocaleLowerCase()} is not boolean, value = ' + "'" + req.body.${key.toLocaleLowerCase()} + "'"
    //                     }));
    //                     break;
    //             }
    //         }
    //     }
    //     `
    //             }
    //            }
                
    //         }
    //     }
    //     return stringFindsAtributes;
    // }

    let whereAnd =()=>{
        let stringWhereAnd = "";
        for (let key in table) {           
            if(key !== "_tableName"){
                if(key !== "_id"){
                stringWhereAnd+=
                `${key.toLocaleLowerCase()}: req.body.${key.toLocaleLowerCase()},
                `
                }
            }
        }
        return stringWhereAnd;
    }


    let stringUpdate =
    `/**
    * update element
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
   exports.updated = async (req, res, next) => {
       try {
            if (!req.params.${table._id.name.toLowerCase()}) {
                next(createError(400, {
                    message: 'params ${table._id.name.toLowerCase()} null or undefined'
                }));
                return;
            } else {
                `
        if(table._id.type === 'int' || table._id.type === 'integer' || table._id.type === 'number'){
            stringUpdate+=
            `                let number_data = Number.parseInt(req.params.${table._id.name.toLowerCase()});
            if (Number.isNaN(number_data)) {
                next(createError(400, {
                    message: '${table._id.name.toLowerCase()} params is not number, value: ' + req.params.${table._id.name.toLowerCase()}
                }));
                return;
            } else { req.params.${table._id.name.toLowerCase()} = number_data }
        `
        }else if(table._id.type === 'string'){
            stringUpdate+=
            `if (typeof req.params.${table._id.name.toLowerCase()} !== 'string') {
                next(createError(400, {
                    message: '${table._id.name.toLowerCase()} params is not string, value: ' + req.params.${table._id.name.toLowerCase()}
                }));
                return;
            }else if(! uuid4.valid(req.params.${table._id.name.toLowerCase()})){
                next(createError(400, {
                    message: '${table._id.name.toLowerCase()} is not valid, value = ' + "'" + req.params.${table._id.name.toLowerCase()} + "'"
                })); return;
            }
        `
        }
        
        stringUpdate+=
        `

            }

           if (!req.body) {
               next(createError(400, {
                   message: 'body null or undefined'
               }));
               return;
           }
   
           ${findsAttributesInsert()}


           if (!req.body.${table._id.name.toLowerCase()}) {
                next(createError(400, {
                    message: 'body ${table._id.name.toLowerCase()} null or undefined'
                }));
                return;
            } else {
           `
           if(table._id.type === 'int' || table._id.type === 'integer' || table._id.type === 'number'){
               stringUpdate+=
            `let number_data = Number.parseInt(req.body.${table._id.name.toLowerCase()});
               if (Number.isNaN(number_data)) {
                   next(createError(400, {
                       message: '${table._id.name.toLowerCase()} body is not number, value: ' + req.body.${table._id.name.toLowerCase()}
                   }));
                   return;
               } else { req.body.${table._id.name.toLowerCase()} = number_data }
           `
           }else if(table._id.type === 'string'){
               stringUpdate+=
               `if (typeof req.body.${table._id.name.toLowerCase()} !== 'string') {
                   next(createError(400, {
                       message: '${table._id.name.toLowerCase()} body is not string, value: ' + req.body.${table._id.name.toLowerCase()}
                   }));
                   return;
               }else if(! uuid4.valid(req.body.${table._id.name.toLowerCase()})){
                    next(createError(400, {
                        message: '${table._id.name.toLowerCase()} is not valid, value = ' + "'" + req.body.${table._id.name.toLowerCase()} + "'"
                    })); return;
                }
           `
           }
           
           stringUpdate+=
           `
        }
           if (req.body.${table._id.name.toLowerCase()} + '' !== req.params.${table._id.name.toLowerCase()} + '') {
            next(createError(400, {
                message: '${table._id.name.toLowerCase()} param and ${table._id.name.toLowerCase()} body is not equals values: ' + req.body.${table._id.name.toLowerCase()} + ' ' + req.params.${table._id.name.toLowerCase()}
            }));
            return;
            }

            let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});

            if (result == null) {
                res.status(404);
                return next();
            }
            await result.update({ 
                ${whereAnd()}
            });


            res.status(200).json(result);
   
       } catch (error) {
           console.log({ error });
           next(createError(500, {
               message: error.message
           })); return;
       }
   }
   `
   return stringUpdate;
}

let getRemoveGenerator =()=>{


    let stringRemove = 
    `/**
    * remove element
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
   exports.remove = async (req, res, next) => {
        try {
            if (!req.params.${table._id.name.toLowerCase()}) {
                next(createError(400, {
                    message: 'params ${table._id.name.toLowerCase()} null or undefined'
                }));
                return;
            } else {
                `
        if(table._id.type === 'int' || table._id.type === 'integer' || table._id.type === 'number'){
            stringRemove+=
            `                let number_data = Number.parseInt(req.params.${table._id.name.toLowerCase()});
            if (Number.isNaN(number_data)) {
                next(createError(400, {
                    message: '${table._id.name.toLowerCase()} params is not number, value: ' + req.params.${table._id.name.toLowerCase()}
                }));
                return;
            } else { req.params.${table._id.name.toLowerCase()} = number_data }
        `
        }else if(table._id.type === 'string'){
            stringRemove+=
            `if (typeof req.params.${table._id.name.toLowerCase()} !== 'string') {
                next(createError(400, {
                    message: '${table._id.name.toLowerCase()} params is not string, value: ' + req.params.${table._id.name.toLowerCase()}
                }));
                return;
            }else if(! uuid4.valid(req.params.${table._id.name.toLowerCase()})){
                next(createError(400, {
                    message: '${table._id.name.toLowerCase()} is not valid, value = ' + "'" + req.params.${table._id.name.toLowerCase()} + "'"
                })); return;
            }
        `
        }
        
        stringRemove+=
        `}
           let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});
   
           if (result == null) {
               res.status(404);
               return next();
           }
           await result.destroy();
           res.status(200).json(result)
   
       } catch (error) {
           console.log({ error });
           next(createError(500, {
               message: error.message
           })); return;
       }
   }
   `
   return stringRemove;
}

let getByIdsGenerator =()=>{
    let stringGetById = 
    `/**
    * get elements by ids
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
     exports.getById = async (req, res, next) => {
         try {
             if (req.params.${table._id.name.toLowerCase()}) { 
                 let number_data = Number.parseFloat(req.params.${table._id.name.toLowerCase()});
                 if (Number.isNaN(number_data)) {
                     next(createError(400, {
                         message: '${table._id.name.toLowerCase()} is not Number, value = ' + "'" + req.params.${table._id.name.toLowerCase()} + "'"
                     })); return;
                 }else {req.params.${table._id.name.toLowerCase()} = number_data;}
             }
             
             let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});
 
             if (result == null) {
                 res.status(404);
                 return next();
             }
     
             res.status(200).json(result)
         } catch (error) {
             console.log({error});
             next(createError(500, {
                 message: error.message
             })); return;
         }
     }`;
 
     return stringGetById;
}


let findsAttributesInsert = ()=>{
    let stringFindsAtributes = "";
    for (const key in table) {           
        if(key !== '_tableName'){
            if(key !== '_id'){
            // if(table[key].findAttribute === true){
            if(table[key].type === 'string'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {`
                if(table[key].allowNull === true){
                    stringFindsAtributes +=
        `
        // req.body.${key.toLocaleLowerCase()} can be null
        req.body.${key.toLocaleLowerCase()} = null
        } else {
            if (typeof req.body.${key.toLocaleLowerCase()} !== 'string') {
                if (req.body.${key.toLocaleLowerCase()} !== null) {
                    next(createError(400, {
                        message: '${key.toLocaleLowerCase()} is not string'
                    }));
                    return;
                }                    
            }
        }
        `
                }else{
                stringFindsAtributes +=
        `                
            next(createError(400, {
                message: '${key.toLocaleLowerCase()} null or undefined'
            }));
            return;
        } else {
            if (typeof req.body.${key.toLocaleLowerCase()} !== 'string') {
                next(createError(400, {
                    message: '${key.toLocaleLowerCase()} is not string'
                }));
                return;
            }
        }
        `}
            }else if(table[key].type === 'number'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {
            `
                if(table[key].allowNull === true){
                    stringFindsAtributes +=
        `
        // req.body.${key.toLocaleLowerCase()} can be null
        req.body.${key.toLocaleLowerCase()} = null
        } else {
            let number_data = Number.parseFloat(req.body.${key.toLocaleLowerCase()});
            if (Number.isNaN(number_data)) {
                next(createError(400, {
                    message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
                }));
                return;
            } else { req.body.${key.toLocaleLowerCase()} = number_data }
        }
        `
                }else{
                stringFindsAtributes +=
        `    
            next(createError(400, {
                message: '${key.toLocaleLowerCase()} null or undefined'
            }));
            return;
        } else {
            let number_data = Number.parseFloat(req.body.${key.toLocaleLowerCase()});
            if (Number.isNaN(number_data)) {
                next(createError(400, {
                    message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
                }));
                return;
            } else { req.body.${key.toLocaleLowerCase()} = number_data }
        }
        `}
            }else if(table[key].type === 'float'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {
            `
                if(table[key].allowNull === true){
                    stringFindsAtributes +=
        `
        // req.body.${key.toLocaleLowerCase()}  can be null
        req.body.${key.toLocaleLowerCase()} = null
        } else {
            let number_data = Number.parseFloat(req.body.${key.toLocaleLowerCase()});
            if (Number.isNaN(number_data)) {
                next(createError(400, {
                    message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
                }));
                return;
            } else { req.body.${key.toLocaleLowerCase()} = number_data }
        }
        `
                }else{
                stringFindsAtributes +=
        `    
            next(createError(400, {
                message: '${key.toLocaleLowerCase()} null or undefined'
            }));
            return;
        } else {
            let number_data = Number.parseFloat(req.body.${key.toLocaleLowerCase()});
            if (Number.isNaN(number_data)) {
                next(createError(400, {
                    message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
                }));
                return;
            } else { req.body.${key.toLocaleLowerCase()} = number_data }
        }
        `}
            }else if(table[key].type === 'int' || table[key].type === 'integer'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {
            `
            if(table[key].allowNull === true){
                stringFindsAtributes +=
    `
    // req.body.${key.toLocaleLowerCase()}  can be null
    req.body.${key.toLocaleLowerCase()} = null
    } else {
        let number_data = Number.parseInt(req.body.${key.toLocaleLowerCase()});
        if (Number.isNaN(number_data)) {
            next(createError(400, {
                message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
            }));
            return;
        } else { req.body.${key.toLocaleLowerCase()} = number_data }
    }
    `
            }else{
            stringFindsAtributes +=
    `
            next(createError(400, {
                message: '${key.toLocaleLowerCase()} null or undefined'
            }));
            return;
        } else {
            let number_data = Number.parseInt(req.body.${key.toLocaleLowerCase()});
            if (Number.isNaN(number_data)) {
                next(createError(400, {
                    message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
                }));
                return;
            } else { req.body.${key.toLocaleLowerCase()} = number_data }
        }
        `}
            }else if(table[key].type === 'boolean'){
                stringFindsAtributes +=
    `if (req.body.${key.toLocaleLowerCase()} === undefined) {
        `
            if(table[key].allowNull === true){
                stringFindsAtributes +=
    `
    // req.body.${key.toLocaleLowerCase()}  can be null
    req.body.${key.toLocaleLowerCase()} = null
    }else{
        if (typeof (req.body.${key.toLocaleLowerCase()}) !== "boolean") {               
            switch (req.body.${key.toLocaleLowerCase()}) {
                case 'true':
                    req.body.${key.toLocaleLowerCase()} = true;
                    break;
                case 'false':
                    req.body.${key.toLocaleLowerCase()} = false;
                    break;
                default:
                    next(createError(400, {
                        message: '${key.toLocaleLowerCase()} is not boolean, value = ' + "'" + req.body.${key.toLocaleLowerCase()} + "'"
                    })); return;
                    break;
            }
        }
    }
    `
            }else{
            stringFindsAtributes +=
    `
        next(createError(400, {
            message: '${key.toLocaleLowerCase()} is not number, value: ' + req.body.${key.toLocaleLowerCase()}
        })); return;
    }else{
        if (typeof (req.body.${key.toLocaleLowerCase()}) !== "boolean") {               
            switch (req.body.${key.toLocaleLowerCase()}) {
                case 'true':
                    req.body.${key.toLocaleLowerCase()} = true;
                    break;
                case 'false':
                    req.body.${key.toLocaleLowerCase()} = false;
                    break;
                default:
                     next(createError(400, {
                        message: '${key.toLocaleLowerCase()} is not boolean, value = ' + "'" + req.body.${key.toLocaleLowerCase()} + "'"
                    })); return;
                    break;
            }
        }
    }
    `}
            }
           }
            
        }
    }
    return stringFindsAtributes;
}