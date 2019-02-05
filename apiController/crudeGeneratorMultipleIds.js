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

    let bodyExample =()=>{
        let body=
        `body is empty
        example: 
        ${JSON.stringify(table, null, "\t") }
      
        `
        return body;
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
    console.log({table});
    let document = 
    
    `${getHeadGenerator()}
    ${getByIdGenerator()} 
    ${getListGenerator()}
    ${getAddGenerator()}
    ${getUpdateGenerator()}
    ${getRemoveGenerator()}
    ${getRestoreGenerator()}
    `
  
    // if(table._id){
    //     document+=
    //     `
    //     ${getUpdateGenerator()}
    //     ${getRemoveGenerator()}
    //     ${getByIdGenerator()}
    //     `
    // }else{
    //     // la llave del id es nula osea que tiene varias llaves 
    //     //etonces para actualizar y eliminar y buscar por id se debe buscar por todas esas llaves
    //     //agregar el atributo primary = true a todas las llaves
    //     if(table._ids){
    //         if(table._ids.length>0){
    //             document+=
    //             `
    //             ${getUpdateGenerator()}
    //             ${getByIdGenerator()}               
    //             ${getRemoveGenerator()}`
               
    //         }
            
    //     }
    // }
    res.send(document)
}
let getHeadGenerator = ()=>{
    let stringHead = 
`const createError = require('http-errors');
const Sequelize = require('sequelize');    
const models = require('../../sequelize/models/index');
const moment = require('moment');
`
    if(table._id){
        if(table._id.type ==='string'){
            stringHead+=
`const uuid4 = require('uuid4');`
        }
    }else{
        for (let i = 0; i < table._ids.length; i++) {
             if(table._ids[i].type === 'string'){
                stringHead+=
`const uuid4 = require('uuid4');`
                break;
             }
            
        }
    }

    stringHead+=`
    
    `
    return stringHead;
}

let selectParamsIds =(_id) =>{

    let stringGetById=
                `
                if(req.params.${_id.name.toLowerCase()}) {
                    `
                if(_id.type === 'int' || _id.type === 'integer' || _id.type === 'number'){
                    stringGetById+=
                    `let number_data = Number.parseInt(req.params.${_id.name.toLowerCase()});
                    if (Number.isNaN(number_data)) {
                        next(createError(400, {
                            message: '${_id.name.toLowerCase()} is not Number, value = ' + "'" + req.params.${_id.name.toLowerCase()} + "'"
                        })); return;
                    }else {req.params.${_id.name.toLowerCase()} = number_data;}
                }`
                }else if(_id.type === 'string'){
                    stringGetById+=
                    `if (typeof req.params.${_id.name.toLowerCase()} !== 'string') {
                        next(createError(400, {
                            message: '${_id.name.toLowerCase()} is not string, value = ' + "'" + req.params.${_id.name.toLowerCase()} + "'"
                        })); return;
                    }else if(! uuid4.valid(req.params.${_id.name.toLowerCase()})){
                        next(createError(400, {
                            message: '${_id.name.toLowerCase()} is not valid, value = ' + "'" + req.params.${_id.name.toLowerCase()} + "'"
                        })); return;
                    }
                }`
                }
                stringGetById+=
                `else{
                    next(createError(400, {
                        message: '${_id.name.toLowerCase()} is not found'
                    })); return;
                }
                `
        return stringGetById;
}

let selectBodyIds =(_id) =>{

    let stringGetById=
                `
                if(req.body.${_id.name.toLowerCase()}) {
                    `
                if(_id.type === 'int' || _id.type === 'integer' || _id.type === 'number'){
                    stringGetById+=
                    `let number_data = Number.parseInt(req.body.${_id.name.toLowerCase()});
                    if (Number.isNaN(number_data)) {
                        next(createError(400, {
                            message: '${_id.name.toLowerCase()} is not Number, value = ' + "'" + req.body.${_id.name.toLowerCase()} + "'"
                        })); return;
                    }else {req.body.${_id.name.toLowerCase()} = number_data;}
                }`
                }else if(_id.type === 'string'){
                    stringGetById+=
                    `if (typeof req.body.${_id.name.toLowerCase()} !== 'string') {
                        next(createError(400, {
                            message: '${_id.name.toLowerCase()} is not string, value = ' + "'" + req.body.${_id.name.toLowerCase()} + "'"
                        })); return;
                    }else if(! uuid4.valid(req.body.${_id.name.toLowerCase()})){
                        next(createError(400, {
                            message: '${_id.name.toLowerCase()} is not valid, value = ' + "'" + req.body.${_id.name.toLowerCase()} + "'"
                        })); return;
                    }
                }`
                }
                stringGetById+=
                `else{
                    next(createError(400, {
                        message: '${_id.name.toLowerCase()} is not found'
                    })); return;
                }
                `
        return stringGetById;
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
        try {`
            if(table._ids){
                if(table._ids.length > 0){
                    for (let i = 0; i < table._ids.length; i++) {
                        stringGetById+=
                        selectParamsIds(table._ids[i])
                    }
                }else{
                    stringGetById+=
                selectParamsIds(table._id)
                }
            }else{
                stringGetById+=
                selectParamsIds(table._id)
                
            }            
            
            
            if(table._ids){
                if(table._ids.length > 0){
                    let where = {}
                    for (let i = 0; i < table._ids.length; i++) {
                        where[table._ids[i].name.toLowerCase()] = `req.params.${table._ids[i].name.toLowerCase()}`
                    }
                    stringGetById+=                    `
                   
            let result = await models.${table._tableName.toLowerCase()}.findOne({ where: ${JSON.stringify(where)} })
                    `

                }else{
                    stringGetById+=
            ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
                }
            }else{
                stringGetById+=
            ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
            }
            stringGetById+=
            `
           
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
    let attributes =(attribute,key)=>{
        return "'"+key.toLocaleLowerCase()+"',";
    }
    let findsAttributes = (attribute,key)=>{
        let stringFindsAtributes = "";
        // for (const key in table) {           
        //     if(key !== '_tableName'){
        //         if(key !== '_id'){
        //             if(key !== '_ids'){
                if(attribute.findAttribute === true){
                    if(attribute.type === 'string'){
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
                    }else if(attribute.type === 'number'){
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
                    }else if(attribute.type === 'int' || attribute.type === 'integer'){
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
                    }else if(attribute.type === 'float'){
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
                    }else if(attribute.type === 'boolean'){
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
        //             }
        //         }
        //     }
           
        // }
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
           `
        //    if(table._id){

           
         if(table._ids){
            if(table._ids.length > 0){
                for (let i = 0; i < table._ids.length; i++) {
                    stringList+=
                findsAttributes(table._ids[i],table._ids[i].name)
                }
                
            } 
           }
           for (const key in table) {           
            if(key !== '_tableName'){
                if(key !== '_id'){
                    if(key !== '_ids'){
                         stringList+=
                            findsAttributes(table[key],key)
                        
                    }
                }
            }
        }
     
           stringList+=
           `
           let result = {rows:[],count:0};

            if (req.query.deleted) {
                if (typeof (req.query.deleted) === "boolean") {
                    where.deleted = req.query.status;
                } else {
                    switch (req.query.deleted) {
                        case 'true':
                            where.deleted = true;
                            break;
                        case 'false':
                            where.deleted = false;
                            break;
                        default:
                            return res.status(400).send({
                                message: 'deleted is not boolean, value = ' + "'" + req.query.deleted + "'"
                            });
                    }
                }

                result = await models.countries.findAndCountAll({
                    where,
                    offset: skip,
                    limit: count
                });

            }else{               
                where.deleted = false;

                result = await models.${table._tableName.toLocaleLowerCase()}.findAndCountAll({
                    where,
                    attributes:[`

                    if(table._ids){
                     if(table._ids.length > 0){
                         for (let i = 0; i < table._ids.length; i++) {
                             stringList+=
                         attributes(table._ids[i],table._ids[i].name)
                         }
                         
                     } 
                    }
                    if(table._id){
                        stringList+=
                        "'"+table._id.name.toLocaleLowerCase()+"',";
                    }
                    for (const key in table) {           
                     if(key !== '_tableName'){
                         if(key !== '_id'){
                             if(key !== '_ids'){
                                  stringList+=
                                     attributes(table[key],key)
                                 
                             }
                         }
                     }
                 }
                    stringList+=
                    `],
                    offset: skip,
                    limit: count
                });
            }
           
      
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

    let whereAnd =(key)=>{
        // let stringWhereAnd = "";
        // for (let key in table) {           
        //     if(key !== "_tableName"){
        //         if(key !== "_id"){
                let stringWhereAnd=
                `{${key.toLocaleLowerCase()}: req.body.${key.toLocaleLowerCase()}},
                    `
        //         }
        //     }
        // }
        return stringWhereAnd;
    }

    let defaults =(key)=>{
        // let stringWhereAnd = "";
        // for (let key in table) {           
        //     if(key !== "_tableName"){
        //         if(key !== "_id"){
                let stringWhereAnd=
                `${key.toLocaleLowerCase()}: req.body.${key.toLocaleLowerCase()},
                    `
        //         }
        //     }
        // }
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
           `
           if(table._ids){
            if(table._ids.length > 0){
                for (let i = 0; i < table._ids.length; i++) {
                    stringAdd+=
                    findsAttributesInsert(table._ids[i],table._ids[i].name)
                }
            } 
           }
           for (const key in table) {           
            if(key !== '_tableName'){
                if(key !== '_id'){
                    if(key !== '_ids'){
                        stringAdd+=
                         findsAttributesInsert(table[key],key)                        
                    }
                }
            }
        }
        // ${findsAttributesInsert()}
        stringAdd+=
           `
          
   
           let result = await models.${table._tableName.toLowerCase()}.findOrCreate({
               where: {
                   [Sequelize.Op.and]: [
                       `
                       if(table._ids){
                        if(table._ids.length > 0){
                            for (let i = 0; i < table._ids.length; i++) {
                                stringAdd+=
                                whereAnd(table._ids[i].name)
                            }
                        } 
                       }
                       for (const key in table) {           
                        if(key !== '_tableName'){
                            if(key !== '_id'){
                                if(key !== '_ids'){
                                    stringAdd+=
                                    whereAnd(key)                        
                                }
                            }
                        }
                    }
                    //    ${whereAnd()}
                    stringAdd+=
                       `
                   ]
               },
               defaults: {
                   `
                //    if(table._id){
                //     if(table._id.type === 'string'){
                //         stringAdd+=
                //         `${table._id.name.toLocaleLowerCase()}: uuid4(),
                //         `
                //     }
                //     }else{
                //         // poner los ids acá
                //     }
                    if(table._ids){
                        if(table._ids.length > 0){
                            for (let i = 0; i < table._ids.length; i++) {
                                stringAdd+=
                                defaults(table._ids[i].name)
                            }
                        } 
                    }
                        if(table._id){
                        if(table._id.type === 'string'){
                            stringAdd+=
                            `${table._id.name.toLocaleLowerCase()}: uuid4(),
                            `
                            }
                        }
                       for (const key in table) {           
                        if(key !== '_tableName'){
                            if(key !== '_id'){
                                if(key !== '_ids'){
                                    stringAdd+=
                                    defaults(key)                        
                                }
                            }
                        }
                    }
                    // ${defaults()}
                   stringAdd+=
                   `
                    
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
    

    let whereAnd =(key)=>{
        // let stringWhereAnd = "";
        // for (let key in table) {           
        //     if(key !== "_tableName"){
        //         if(key !== "_id"){
            let stringWhereAnd =
                `${key.toLocaleLowerCase()}: req.body.${key.toLocaleLowerCase()},
                `
        //         }
        //     }
        // }
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
    try {`
    if(table._ids){
        if(table._ids.length > 0){
            for (let i = 0; i < table._ids.length; i++) {
                stringUpdate+=
                selectParamsIds(table._ids[i])
            }
        }else{
            stringUpdate+=
        selectParamsIds(table._id)
        }
        }else{
            stringUpdate+=
            selectParamsIds(table._id)
            
        }            
 
        
        stringUpdate+=
        `
            

           if (!req.body) {
               next(createError(400, {
                   message: 'body null or undefined'
               }));
               return;
           }
   
         
           `
        //    ${findsAttributesInsert()}
            if(table._ids){
                if(table._ids.length > 0){
                    for (let i = 0; i < table._ids.length; i++) {
                        stringUpdate+=
                        findsAttributesInsert(table._ids[i],table._ids[i].name)
                    }
                } 
            }
            for (const key in table) {           
                if(key !== '_tableName'){
                    if(key !== '_id'){
                        if(key !== '_ids'){
                            stringUpdate+=
                            findsAttributesInsert(table[key],key)                        
                        }
                    }
                }
            }
        //    if(table._ids){
        //     if(table._ids.length > 0){
        //         for (let i = 0; i < table._ids.length; i++) {
        //             stringUpdate+=
        //             selectBodyIds(table._ids[i])
        //         }
        //     }else{
        //         stringUpdate+=
        //         selectBodyIds(table._id)
        //     }
        //     }else
            // {
                // if(table._id)
                // stringUpdate+=
                
                
            // }


            if(table._id){               
            stringUpdate+=
           `
           ${selectBodyIds(table._id)}
                
           if (req.body.${table._id.name.toLowerCase()} + '' !== req.params.${table._id.name.toLowerCase()} + '') {
            next(createError(400, {
                message: '${table._id.name.toLowerCase()} param and ${table._id.name.toLowerCase()} body is not equals values: ' + req.body.${table._id.name.toLowerCase()} + ' ' + req.params.${table._id.name.toLowerCase()}
            }));
            return;
            }
            `                   
            }       
            if(table._ids){
                if(table._ids.length > 0){
                    let where = {}
                    for (let i = 0; i < table._ids.length; i++) {
                        where[table._ids[i].name.toLowerCase()] = `req.params.${table._ids[i].name.toLowerCase()}`
                    }
                    stringUpdate+=                    `
                
                let result = await models.${table._tableName.toLowerCase()}.findOne({ where: ${JSON.stringify(where)} })
                        `

                    }else{
                        stringUpdate+=
                ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
                    }
                }else{
                    stringUpdate+=
                ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
                }
            ;
            // let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});
            stringUpdate+=
            `
            if (result == null) {
                res.status(404);
                return next();
            }
            await result.update({ 
                `
                if(table._ids){
                    if(table._ids.length > 0){
                        for (let i = 0; i < table._ids.length; i++) {
                            stringUpdate+=
                            whereAnd(table._ids[i].name)
                        }
                    } 
                   }
                   for (const key in table) {           
                    if(key !== '_tableName'){
                        if(key !== '_id'){
                            if(key !== '_ids'){
                                stringUpdate+=
                                whereAnd(key)                        
                            }
                        }
                    }
                }
                // ${whereAnd()}
                stringUpdate+=
                `
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
    try {`
    if(table._ids){
        if(table._ids.length > 0){
            for (let i = 0; i < table._ids.length; i++) {
                stringRemove+=
                selectParamsIds(table._ids[i])
            }
        }else{
            stringRemove+=
        selectParamsIds(table._id)
        }
    }else{
        stringRemove+=
        selectParamsIds(table._id)
        
    }            
    
    
    if(table._ids){
        if(table._ids.length > 0){
            let where = {}
            for (let i = 0; i < table._ids.length; i++) {
                where[table._ids[i].name.toLowerCase()] = `req.params.${table._ids[i].name.toLowerCase()}`
            }
            stringRemove+=                    `
           
    let result = await models.${table._tableName.toLowerCase()}.findOne({ where: ${JSON.stringify(where)} })
            `

        }else{
            stringRemove+=
    ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
        }
    }else{
        stringRemove+=
    ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
    }
    stringRemove+=
    `
        if (result == null) {
            res.status(404);
            return next();
        }
      
        let userIdBytoken = await getUserIdByToken('tokenPruebaFelipeBorrado');
        await result.update({
            deleted: true,
            deleted_at: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
            deleted_by: userIdBytoken,
        });
        res.status(200).json(result)
    } catch (error) {
        console.log({error});
        next(createError(500, {
            message: error.message
        })); return;
    }
    }
    
    
    let getUserIdByToken = async (token)=>{
        return token
    }`;
        
    
   return stringRemove;
}

let getRestoreGenerator =()=>{


    let stringRestore = 
    `/**
    * restore element
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
   exports.restore = async (req, res, next) => {
    try {`
    if(table._ids){
        if(table._ids.length > 0){
            for (let i = 0; i < table._ids.length; i++) {
                stringRestore+=
                selectParamsIds(table._ids[i])
            }
        }else{
            stringRestore+=
        selectParamsIds(table._id)
        }
    }else{
        stringRestore+=
        selectParamsIds(table._id)
        
    }            
    
    
    if(table._ids){
        if(table._ids.length > 0){
            let where = {}
            for (let i = 0; i < table._ids.length; i++) {
                where[table._ids[i].name.toLowerCase()] = `req.params.${table._ids[i].name.toLowerCase()}`
            }
            stringRestore+=                    `
           
    let result = await models.${table._tableName.toLowerCase()}.findOne({ where: ${JSON.stringify(where)} })
            `

        }else{
            stringRestore+=
    ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
        }
    }else{
        stringRestore+=
    ` let result = await models.${table._tableName.toLowerCase()}.findById(req.params.${table._id.name.toLowerCase()});`
    }
    stringRestore+=
    `
        if (result == null) {
            res.status(404);
            return next();
        }

        await result.update({
            deleted: false,
            deleted_at: null,
            deleted_by: null,
        });
        res.status(200).json(result)
    } catch (error) {
        console.log({error});
        next(createError(500, {
            message: error.message
        })); return;
    }
    }
    
  `;
        
    
   return stringRestore;
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


let findsAttributesInsert = (attribute,key)=>{
    let stringFindsAtributes = "";
    // for (const key in table) {           
    //     if(key !== '_tableName'){
    //         if(key !== '_id'){
            // if(table[key].findAttribute === true){
            if(attribute.type === 'string'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {`
                if(attribute.allowNull === true){
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
            }else if(attribute.type === 'number'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {
            `
                if(attribute.allowNull === true){
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
            }else if(attribute.type === 'float'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {
            `
                if(attribute.allowNull === true){
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
            }else if(attribute.type === 'int' || attribute.type === 'integer'){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {
            `
            if(attribute.allowNull === true){
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
            }else if(attribute.type === 'boolean'){
                stringFindsAtributes +=
    `if (req.body.${key.toLocaleLowerCase()} === undefined) {
        `
            if(attribute.allowNull === true){
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
            }else if(attribute.type.toLocaleLowerCase() === 'date' ){
                stringFindsAtributes +=
        `if (req.body.${key.toLocaleLowerCase()} === undefined) {
            `
                if(attribute.allowNull === true){
                    stringFindsAtributes +=
        `
        // req.body.${key.toLocaleLowerCase()} can be null
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
        if(req.body.birth_day !== null){
            let date_${key.toLocaleLowerCase()} = new Date(req.body.${key.toLocaleLowerCase()});
            req.body.${key.toLocaleLowerCase()} = "'"+date_${key.toLocaleLowerCase()}.getFullYear()+'-'+date_${key.toLocaleLowerCase()}.getMonth() + 1+'-'+date_${key.toLocaleLowerCase()}.getDate()+' '+date_${key.toLocaleLowerCase()}.getHours()+':'+date_${key.toLocaleLowerCase()}.getMinutes()+':'+date_${key.toLocaleLowerCase()}.getSeconds()+"'";
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

        let date_${key.toLocaleLowerCase()} = new Date(req.body.${key.toLocaleLowerCase()});
        req.body.${key.toLocaleLowerCase()} = "'"+date_${key.toLocaleLowerCase()}.getFullYear()+'-'+date_${key.toLocaleLowerCase()}.getMonth() + 1+'-'+date_${key.toLocaleLowerCase()}.getDate()+' '+date_${key.toLocaleLowerCase()}.getHours()+':'+date_${key.toLocaleLowerCase()}.getMinutes()+':'+date_${key.toLocaleLowerCase()}.getSeconds()+"'";

        `}
            }
    //        }
            
    //     }
    // }
    return stringFindsAtributes;
}