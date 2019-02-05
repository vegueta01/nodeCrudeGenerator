
exports.routeGenerator = (req,res,next)=>{
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


    table = req.body;

    let document = 
    `
    const ${table._tableName.toLocaleLowerCase()}_ctrl =  require('../controllers/${table._tableName.toLocaleLowerCase()}'); 


    router.get('/${table._tableName.toLocaleLowerCase()}/:${table._id.name.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.getById);
    router.get('/${table._tableName.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.getList);
    router.post('/${table._tableName.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.add);
    router.delete('/${table._tableName.toLocaleLowerCase()}/:${table._id.name.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.remove);
    router.put('/${table._tableName.toLocaleLowerCase()}/:${table._id.name.toLocaleLowerCase()}', ${table._tableName.toLocaleLowerCase()}_ctrl.updated);
    `
    res.send(document)

}
