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


exports.routeGenerator = (req,res,next)=>{
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
    `
    const ${table._tableName.toLocaleLowerCase()}_ctrl =  require('../controllers/${table._tableName.toLocaleLowerCase()}'); 

    `
    if(table._id){
        document+=
        `router.get('/${table._tableName.toLocaleLowerCase()}/:${table._id.name.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.getById);`
    }else{
        document+=
        `router.get('/${table._tableName.toLocaleLowerCase()}${getIds()}', ${table._tableName.toLocaleLowerCase()}_ctrl.getById);`
    }
    document+=
    `    
    router.get('/${table._tableName.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.getList);
    router.post('/${table._tableName.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.add);
    `
    if(table._id){
    `
    router.delete('/${table._tableName.toLocaleLowerCase()}/:${table._id.name.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.remove);
    `
    }else{
    `
    router.delete('/${table._tableName.toLocaleLowerCase()}${getIds()}', ${table._tableName.toLocaleLowerCase()}_ctrl.remove);
    `
    }
   
    if(table._id){
        document+=
    `router.put('/${table._tableName.toLocaleLowerCase()}/:${table._id.name.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.updated);
    `
    }else{
        document+=
    `router.put('/${table._tableName.toLocaleLowerCase()}${getIds()}', ${table._tableName.toLocaleLowerCase()}_ctrl.updated);
    `
    }

    if(table._id){
        document+=
    `router.get('/${table._tableName.toLocaleLowerCase()}/restore/:${table._id.name.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.restore);
    `
    }else{
        document+=
    `router.get('/${table._tableName.toLocaleLowerCase()}/restore${getIds()}', ${table._tableName.toLocaleLowerCase()}_ctrl.restore);
    `
    }

    
    res.send(document)

}

let getIds=()=>{
    let ids = "";
    for (let i = 0; i < table._ids.length; i++) {
        ids+=
        `/:${table._ids[i].name.toLocaleLowerCase()}`
                
    }
    
    return ids;
}