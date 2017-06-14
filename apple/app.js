var koa = require('koa');
var route = require('koa-route');
var logger = require('koa-logger');
var serve = require('koa-static');
var parse = require('co-body');
var MongoClient = require('mongodb').MongoClient;
var sql = require('mssql');
var render = require('./lib/render');

var app = koa();

var db;
var count;

var config = {
  user:'1410332011',
  password:'Apple0706',
  server:'163.17.136.91',
  port:1433,
  database: '1410332011'
}

MongoClient.connect("mongodb://localhost:27017/apple",function(err,pDb){
  if(err){
    return console.dir(err);
  }
  db = pDb;
});

app.use(logger());
app.use(serve('./views'));

app.use(route.get('/',index));
app.use(route.get('/customer',customer));
app.use(route.get('/customer/information',customerInformation));
app.use(route.get('/customer/admin',customerAdmin));
app.use(route.get('/customer/administer',customerAdminister));
app.use(route.get('/customer/administer/list',customerAdministerList));
app.use(route.get('/project',project));
app.use(route.get('/project/information',projectInformation));
app.use(route.get('/project/admin',projectAdmin));
app.use(route.get('/project/administer',projectAdminister));
app.use(route.get('/project/administer/list',projectAdministerList));
app.use(route.get('/staff',staff));
app.use(route.get('/staff/admin',staffAdmin));
app.use(route.get('/staff/information',information));
app.use(route.get('/staff/pay',pay));
app.use(route.get('/staff/list',list));
app.use(route.get('/administer',staffAdminister));
app.use(route.get('/administer/information',adminInformation));
app.use(route.get('/administer/pay',adminPay));
app.use(route.get('/administer/list',adminList));
app.use(route.post('/customer',customerSearch));
app.use(route.post('/customer/admin',customerAdminData));
app.use(route.post('/insert/customer',insertCustomer));
app.use(route.post('/update/customer',updateCustomer));
app.use(route.post('/project',projectSearch));
app.use(route.post('/project/admin',projectAdminData));
app.use(route.post('/insert/project',insertProject));
app.use(route.post('/update/project',updateProject));
app.use(route.post('/delete/project',deleteProject));
app.use(route.post('/admin',adminData));
app.use(route.post('/search/information',searchInformation));
app.use(route.post('/insert/information',insertInformation));
app.use(route.post('/update/information',updateInformation));
app.use(route.post('/delete/information',deleteInformation));
app.use(route.post('/search/pay',searchPay));
app.use(route.post('/insert/pay',insertPay));
app.use(route.post('/update/pay',updatePay));
app.use(route.post('/delete/pay',deletePay));
app.use(route.post('/search/list',searchList));
app.use(route.post('/insert/list',insertList));
app.use(route.post('/update/list',updateList));
app.use(route.post('/delete/list',deleteList));

function * index(){
  this.body = yield render('index');
}

function * customer(){
  this.body = yield render('customer');
}

function * customerInformation(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query('select * from customer');
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "phone" : data[i].phone, "age" : data[i].age, "sex" : data[i].sex, "address" : data[i].address, "introducer" : data[i].introducer, "company" : data[i].company};
    }
    // console.log(dataArray);
    sql.close();
    this.body = yield render('customer',{subject:"customer",
                                        title:{"t1":"name","t2":"phone","t3":"age","t4":"sex","t5":"address","t6":"introducer","t7":"company"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find().toArray();
  // var dataArray = [];
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  // }
  // this.body = yield render('customer',{subject:"customer",
  //                                     title:{"t1":"id","t2":"name","t3":"sex","t4":"old","t5":"birthday"},
  //                                     apple:dataArray});
}

function * customerAdmin(){
  this.body = yield render('customerAdmin');
}

function * customerAdminData(){
  var data = yield parse(this);
  if(data.account == 'root' && data.password == 'apple'){
    message='';
    this.redirect('/customer/administer');
  }else{
    this.redirect('/customer/admin');
  }
}

function * customerAdminister(){
  this.body = yield render('customerAdminister');
}

function * customerAdministerList(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query('select * from customer');
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    count = 1;
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"td" : i+1, "name" : data[i].name, "phone" : data[i].phone, "age" : data[i].age, "sex" : data[i].sex, "address" : data[i].address, "introducer" : data[i].introducer, "company" : data[i].company};
      count = data[i].id+1;
    }
    sql.close();
    this.body = yield render('customerAdminister',{subject:"customer",
                                                  title:{"t1":"數量","t2":"name","t3":"phone","t4":"age","t5":"sex","t6":"address","t7":"introducer","t8":"company","t9":"動作"},
                                                  apple:dataArray,
                                                  countId:count,
                                                  router:"/insert/customer",
                                                  value:"新增"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find().sort({id: 1}).toArray();
  // var dataArray = [];
  // count = 1;
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"td" : i+1,"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  //   count = data[i].id+1;
  // }
  // this.body = yield render('customerAdminister',{subject:"information",
  //                                       title:{"t1":"數量","t2":"id","t3":"name","t4":"sex","t5":"old","t6":"birthday","t7":"動作"},
  //                                       apple:dataArray,
  //                                       countId:count,
  //                                       router:"/insert/customer",
  //                                       value:"新增"});
}

function * customerSearch(date){
  try {
    var dataSearch = yield parse(this);
    console.log(dataSearch);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select * from customer where name = '"+dataSearch.search+"'");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "phone" : data[i].phone, "age" : data[i].age, "sex" : data[i].sex, "address" : data[i].address, "introducer" : data[i].introducer, "company" : data[i].company};
    }
    // console.log(dataArray);
    sql.close();
    this.body = yield render('customer',{subject:"customer",
                                        title:{"t1":"name","t2":"phone","t3":"age","t4":"sex","t5":"address","t6":"introducer","t7":"company"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var data1 = yield parse(this);
  // console.log(data1);
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find({"name":data1.search}).toArray();
  // var dataArray = [];
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  // }
  // this.body = yield render('customer',{subject:"information",
  //                                   title:{"t1":"id","t2":"name","t3":"sex","t4":"old","t5":"birthday"},
  //                                   apple:dataArray});
}

function * insertCustomer(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("insert into customer values ('"+data.name+"','"+data.phone+"',"+data.age+","+data.sex+",'"+data.address+"','"+data.introducer+"','"+data.company+"')");
    console.dir(result);
    sql.close();
    this.redirect('/customer/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
  // var data = yield parse(this);
  // var insertData = {"id" : count, "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday};
  // var collection = db.collection('information');
  // var data = yield collection.insert(insertData);
  // this.redirect('/customer/administer/list');
}

function * updateCustomer(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("update customer set age="+data.age+",sex="+data.sex+",address='"+data.address+"',introducer='"+data.introducer+"',company='"+data.company+"' where name='"+data.name+"' and phone='"+data.phone+"'");
    console.dir(result);
    sql.close();
    this.redirect('/customer/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
  // var data = yield parse(this);
  // console.log(data);
  // var findData = {"id" : parseInt(data.id)};
  // var collection = db.collection('information');
  // var data = yield collection.update(findData,{
  //                                     '$set':{"id" : parseInt(data.id), "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday}
  //                                   });
  // this.redirect('/customer/administer/list');
}

function * project(){
  this.body = yield render('project');
}

function * projectInformation(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query('select * from project');
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"id" : data[i].id, "startTime" : data[i].startTime.toLocaleDateString(), "address" : data[i].address, "item" : data[i].item, "receipt" : data[i].receipt.toLocaleDateString(), "money" : data[i].money,
                      "endTime" : data[i].endTime.toLocaleDateString(), "material" : data[i].material, "name" : data[i].name, "phone" : data[i].phone};
    }
    sql.close();
    this.body = yield render('project',{subject:"information",
                                        title:{"t1":"id","t2":"startTime","t3":"address","t4":"item","t5":"receipt","t6":"money","t7":"endTime","t8":"material","t9":"name","t10":"phone"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find().toArray();
  // var dataArray = [];
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  // }
  // this.body = yield render('project',{subject:"information",
  //                                   title:{"t1":"id","t2":"name","t3":"sex","t4":"old","t5":"birthday"},
  //                                   apple:dataArray});
}

function * projectAdmin(){
  this.body = yield render('projectAdmin');
}

function * projectAdminData(){
  var data = yield parse(this);
  if(data.account == 'root' && data.password == 'apple'){
    message='';
    this.redirect('/project/administer');
  }else{
    this.redirect('/project/admin');
  }
}

function * projectAdminister(){
  this.body = yield render('projectAdminister');
}

function * projectAdministerList(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query('select * from project order by id');
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    count = 1;
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"td" : i+1, "id" : data[i].id, "startTime" : data[i].startTime.toLocaleDateString(), "address" : data[i].address, "item" : data[i].item, "receipt" : data[i].receipt.toLocaleDateString(), "money" : data[i].money,
                      "endTime" : data[i].endTime.toLocaleDateString(), "material" : data[i].material, "name" : data[i].name, "phone" : data[i].phone};
      count = data[i].id+1;
    }
    sql.close();
    this.body = yield render('projectAdminister',{subject:"project",
                                                  title:{"t1":"數量","t2":"id","t3":"startTime","t4":"address","t5":"item","t6":"receipt","t7":"money","t8":"endTime","t9":"material","t10":"name","t11":"phone","t12":"動作"},
                                                  apple:dataArray,
                                                  countId:count,
                                                  router:"/insert/project",
                                                  value:"新增"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find().sort({id: 1}).toArray();
  // var dataArray = [];
  // count = 1;
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"td" : i+1,"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  //   count = data[i].id+1;
  // }
  // this.body = yield render('projectAdminister',{subject:"information",
  //                                       title:{"t1":"數量","t2":"id","t3":"name","t4":"sex","t5":"old","t6":"birthday","t7":"動作"},
  //                                       apple:dataArray,
  //                                       countId:count,
  //                                       router:"/insert/project",
  //                                       value:"新增"});
}

function * projectSearch(date){
  try {
    var dataSearch = yield parse(this);
    console.log(dataSearch);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select * from project where name = '"+dataSearch.search+"'");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"id" : data[i].id, "startTime" : data[i].startTime.toLocaleDateString(), "address" : data[i].address, "item" : data[i].item, "receipt" : data[i].receipt.toLocaleDateString(), "money" : data[i].money,
                      "endTime" : data[i].endTime.toLocaleDateString(), "material" : data[i].material, "name" : data[i].name, "phone" : data[i].phone};
    }
    sql.close();
    this.body = yield render('project',{subject:"information",
                                        title:{"t1":"id","t2":"startTime","t3":"address","t4":"item","t5":"receipt","t6":"money","t7":"endTime","t8":"material","t9":"name","t10":"phone"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var data1 = yield parse(this);
  // console.log(data1);
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find({"name":data1.search}).toArray();
  // var dataArray = [];
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  // }
  // this.body = yield render('project',{subject:"information",
  //                                   title:{"t1":"id","t2":"name","t3":"sex","t4":"old","t5":"birthday"},
  //                                   apple:dataArray});
}

function * insertProject(){
  try {
    var data = yield parse(this);
    console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("insert into project values ("+data.id+",'"+data.startTime+"','"+data.address+"','"+data.item+"','"+data.receipt+"',"+data.money+",'"+data.endTime+"',"+data.material+",'"+data.name+"','"+data.phone+"')");
    console.dir(result);
    sql.close();
    this.redirect('/project/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
  // var data = yield parse(this);
  // var insertData = {"id" : count, "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday};
  // var collection = db.collection('information');
  // var data = yield collection.insert(insertData);
  // this.redirect('/project/administer/list');
}

function * updateProject(){
  try {
    var data = yield parse(this);
    // console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("update project set startTime='"+data.startTime+"',address='"+data.address+"',item='"+data.item+"',receipt='"+data.receipt+"',money="+parseInt(data.money)+",endTime='"+data.endTime+"',material="+parseInt(data.material)+",name='"+data.name+"',phone='"+data.phone+"' where id="+parseInt(data.id));
    console.dir(result);
    sql.close();
    this.redirect('/project/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'update fail';
  }
  // var data = yield parse(this);
  // console.log(data);
  // var findData = {"id" : parseInt(data.id)};
  // var collection = db.collection('information');
  // var data = yield collection.update(findData,{
  //                                     '$set':{"id" : parseInt(data.id), "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday}
  //                                   });
  // this.redirect('/project/administer/list');
}

function * deleteProject(){
  try {
    var data = yield parse(this);
    // console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("delete from project where id = " + data.id);
    console.dir(result);
    sql.close();
    this.redirect('/project/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'delete fail';
  }
  // var data = yield parse(this);
  // console.log(data);
  // var collection = db.collection('information');
  // var data = yield collection.remove({"id" : parseInt(data.id), "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday});
  // this.redirect('/project/administer/list');
}

function * staff(){
  var collection = db.collection('staff');                           //選擇collection為staff
  var data = yield collection.find().toArray();
  this.body = yield render('staff',data[6]);
}

function * staffAdmin(){
  this.body = yield render('staffAdmin');
}

function * adminData(){
  var data = yield parse(this);
  if(data.account == 'root' && data.password == 'apple'){
    message='';
    this.redirect('/administer');
  }else{
    this.redirect('/staff/admin');
  }
}

function * information(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query('select * from employee');
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "idCard" : data[i].idCard, "sex" : data[i].sex, "age" : data[i].age, "experience" : data[i].experience, "birthday" : data[i].birthday.toLocaleDateString(),
                      "address" : data[i].address, "phone" : data[i].phone, "specialty" : data[i].specialty, "company" : data[i].company};
    }
    sql.close();
    this.body = yield render('staff',{subject:"information",
                                        title:{"t1":"name","t2":"idCard","t3":"sex","t4":"age","t5":"experience","t6":"birthday","t7":"address","t8":"phone","t9":"specialty","t10":"company"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find().toArray();
  // var dataArray = [];
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  // }
  // this.body = yield render('staff',{subject:"information",
  //                                   title:{"t1":"id","t2":"name","t3":"sex","t4":"old","t5":"birthday"},
  //                                   apple:dataArray});
}

function * pay(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name ,e.idCard ,MONTH(pr.date) as '月份',SUM(pr.hours) as '時數',SUM(pr.hours)*3000 as '薪水' from project as p,process as pr,employee as e where p.id = pr.id and pr.idCard = e.idCard group by e.name,e.idCard,MONTH(pr.date)");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "idCard" : data[i].idCard, "月份" : data[i].月份, "時數" : data[i].時數, "薪水" : data[i].薪水};
    }
    sql.close();
    this.body = yield render('staff',{subject:"information",
                                        title:{"t1":"name","t2":"idCard","t3":"月份","t4":"時數","t5":"薪水"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('pay');                           //選擇collection為pay
  // var data = yield collection.find().toArray();
  // var dataArray = [];
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "month" : data[i].month, "money" : data[i].money};
  // }
  // this.body = yield render('staff',{subject:"pay",
  //                                   title:{"t1":"id","t2":"name","t3":"month","t4":"money"},
  //                                   apple:dataArray});
}

function * list(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name,e.idCard,p.id as projectId,pr.date,pr.hours from project as p ,employee as e ,process as pr where p.id = pr.id and e.idCard = pr.idCard");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "idCard" : data[i].idCard, "projectId" : data[i].projectId, "date" : data[i].date.toLocaleDateString(), "hours" : data[i].hours};
    }
    sql.close();
    this.body = yield render('staff',{subject:"information",
                                        title:{"t1":"name","t2":"idCard","t3":"projectId","t4":"date","t5":"hours"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('list');                           //選擇collection為list
  // var data = yield collection.find().toArray();
  // var dataArray = [];
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "project" : data[i].project, "date" : data[i].date, "hours" : data[i].hours};
  // }
  // this.body = yield render('staff',{subject:"list",
  //                                   title:{"t1":"id","t2":"name","t3":"project","t4":"date","t5":"hours"},
  //                                   apple:dataArray});
}


function * staffAdminister(){
  this.body = yield render('staffAdminister');
}

function * adminInformation(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query('select * from employee');
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    count = 1;
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"td":i+1,"name" : data[i].name, "idCard" : data[i].idCard, "sex" : data[i].sex, "age" : data[i].age, "experience" : data[i].experience, "birthday" : data[i].birthday.toLocaleDateString(),
                      "address" : data[i].address, "phone" : data[i].phone, "specialty" : data[i].specialty, "company" : data[i].company};
    }
    count = dataArray.length+1;
    sql.close();
    this.body = yield render('staffAdminister',{subject:"information",
                                        title:{"t1":"數量","t2":"name","t3":"idCard","t4":"sex","t5":"age","t6":"experience","t7":"birthday","t8":"address","t9":"phone","t10":"specialty","t11":"company","t12":"動作"},
                                        apple:dataArray,
                                        countId:count,
                                        router:"/insert/information",
                                        value:"新增"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('information');                           //選擇collection為information
  // var data = yield collection.find().sort({id: 1}).toArray();
  // var dataArray = [];
  // count = 1;
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"td" : i+1,"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  //   count = data[i].id+1;
  // }
  // this.body = yield render('staffAdminister',{subject:"information",
  //                                       title:{"t1":"數量","t2":"id","t3":"name","t4":"sex","t5":"old","t6":"birthday","t7":"動作"},
  //                                       apple:dataArray,
  //                                       countId:count,
  //                                       router:"/insert/information",
  //                                       value:"新增"});
}

function * adminPay(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name ,e.idCard ,MONTH(pr.date) as '月份',SUM(pr.hours) as '時數',SUM(pr.hours)*3000 as '薪水' from project as p,process as pr,employee as e where p.id = pr.id and pr.idCard = e.idCard group by e.name,e.idCard,MONTH(pr.date)");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    count = 1;
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"td" : i+1,"name" : data[i].name, "idCard" : data[i].idCard, "月份" : data[i].月份, "時數" : data[i].時數, "薪水" : data[i].薪水};
    }
    count = dataArray.length+1;
    sql.close();
    this.body = yield render('staffAdminister',{subject:"pay",
                                        title:{"t1":"數量","t2":"name","t3":"idCard","t4":"月份","t5":"時數","t6":"薪水"},
                                        apple:dataArray,
                                        countId:count,
                                        router:"/insert/pay",
                                        value:"新增"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('pay');                           //選擇collection為pay
  // var data = yield collection.find().sort({id: 1}).toArray();
  // var dataArray = [];
  // count = 1;
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"td" : i+1,"id" : data[i].id, "name" : data[i].name, "month" : data[i].month, "money" : data[i].money};
  //   count = data[i].id+1;
  // }
  // this.body = yield render('staffAdminister',{subject:"pay",
  //                                        title:{"t1":"數量","t2":"id","t3":"name","t4":"month","t5":"money","t6":"動作"},
  //                                        apple:dataArray,
  //                                        countId:count,
  //                                        router:"/insert/pay",
  //                                        value:"新增"});
}

function * adminList(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name,e.idCard,p.id as projectId,pr.date,pr.hours from project as p ,employee as e ,process as pr where p.id = pr.id and e.idCard = pr.idCard");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    count = 1;
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"td" : i+1,"name" : data[i].name, "idCard" : data[i].idCard, "projectId" : data[i].projectId, "date" : data[i].date.toLocaleDateString(), "hours" : data[i].hours};
    }
    count = dataArray.length+1;
    sql.close();
    this.body = yield render('staffAdminister',{subject:"list",
                                        title:{"t1":"數量","t2":"name","t3":"idCard","t4":"projectId","t5":"date","t6":"hours","t7":"動作"},
                                        apple:dataArray,
                                        countId:count,
                                        router:"/insert/list",
                                        value:"新增"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
  // var collection = db.collection('list');                           //選擇collection為list
  // var data = yield collection.find().toArray();
  // var dataArray = [];
  // count = 1;
  // for(let i=0;i<data.length;i++){
  //   dataArray[i] = {"td" : i+1,"id" : data[i].id, "name" : data[i].name, "project" : data[i].project, "date" : data[i].date, "hours" : data[i].hours};
  //   count = data[i].id+1;
  // }
  // this.body = yield render('staffAdminister',{subject:"list",
  //                                        title:{"t1":"數量","t2":"id","t3":"name","t4":"project","t5":"date","t6":"hours","t7":"動作"},
  //                                        apple:dataArray,
  //                                        countId:count,
  //                                        router:"/insert/list",
  //                                        value:"新增"});
}

function * searchInformation(date){
  var data1 = yield parse(this);
  console.log(data1);
  var collection = db.collection('information');                           //選擇collection為information
  var data = yield collection.find({"name":data1.search}).toArray();
  var dataArray = [];
  for(let i=0;i<data.length;i++){
    dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "sex" : data[i].sex, "old" : data[i].old, "birthday" : data[i].birthday};
  }
  this.body = yield render('staff',{subject:"information",
                                    title:{"t1":"id","t2":"name","t3":"sex","t4":"old","t5":"birthday"},
                                    apple:dataArray});
}

function * insertInformation(){
  try {
    var data = yield parse(this);
    console.log(data);
    var pool = yield sql.connect(config);
    console.log("insert into employee values ('"+data.name+"','"+data.idCard+"',"+data.sex+","+data.age+","+data.experience+",'"+data.birthday+"','"+data.address+"','"+data.phone+"','"+data.specialty+"','"+data.company+"')");
    var result = yield pool.request()
                      .query("insert into employee values ('"+data.name+"','"+data.idCard+"',"+data.sex+","+data.age+","+data.experience+",'"+data.birthday+"','"+data.address+"','"+data.phone+"','"+data.specialty+"','"+data.company+"')");
    console.dir(result);
    sql.close();
    this.redirect('/administer/information');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
  // var data = yield parse(this);
  // var insertData = {"id" : count, "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday};
  // var collection = db.collection('information');
  // var data = yield collection.insert(insertData);
  // this.redirect('/administer/information');
}

function * updateInformation(){
  var data = yield parse(this);
  console.log(data);
  var findData = {"id" : parseInt(data.id)};
  var collection = db.collection('information');
  var data = yield collection.update(findData,{
                                      '$set':{"id" : parseInt(data.id), "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday}
                                    });
  this.redirect('/administer/information');
}

function * deleteInformation(){
  var data = yield parse(this);
  console.log(data);
  var collection = db.collection('information');
  var data = yield collection.remove({"id" : parseInt(data.id), "name" : data.name, "sex" : data.sex, "old" : data.old, "birthday" : data.birthday});
  this.redirect('/administer/information');
}

function * searchPay(date){
  var data1 = yield parse(this);
  console.log(data1);
  var collection = db.collection('pay');                           //選擇collection為information
  var data = yield collection.find({"name":data1.search}).toArray();
  var dataArray = [];
  for(let i=0;i<data.length;i++){
    dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "month" : data[i].month, "money" : data[i].money};
  }
  this.body = yield render('staff',{subject:"pay",
                                    title:{"t1":"id","t2":"name","t3":"month","t4":"money"},
                                    apple:dataArray});
}

function * insertPay(){
  var data = yield parse(this);
  var insertData = {"id" : parseInt(data.id), "name" : data.name, "month" : data.month, "money" : data.money};
  var collection = db.collection('pay');
  var data = yield collection.insert(insertData);
  this.redirect('/administer/pay');
}

function * updatePay(){
  var data = yield parse(this);
  console.log(data);
  var findData = {"id" : parseInt(data.id)};
  var collection = db.collection('pay');
  var data = yield collection.update(findData,{
                                      '$set':{"id" : parseInt(data.id), "name" : data.name, "month" : data.month, "money" : data.money}
                                    });
  this.redirect('/administer/pay');
}

function * deletePay(){
  var data = yield parse(this);
  console.log(data);
  var collection = db.collection('pay');
  var data = yield collection.remove({"id" : parseInt(data.id), "name" : data.name, "month" : data.month, "money" : data.money});
  this.redirect('/administer/pay');
}

function * searchList(date){
  var data1 = yield parse(this);
  console.log(data1);
  var collection = db.collection('list');                           //選擇collection為information
  var data = yield collection.find({"name":data1.search}).toArray();
  var dataArray = [];
  for(let i=0;i<data.length;i++){
    dataArray[i] = {"id" : data[i].id, "name" : data[i].name, "project" : data[i].project, "date" : data[i].date, "hours" : data[i].hours};
  }
  this.body = yield render('staff',{subject:"list",
                                    title:{"t1":"id","t2":"name","t3":"project","t4":"date","t5":"hours"},
                                    apple:dataArray});
}

function * insertList(){
  var data = yield parse(this);
  var insertData = {"id" : parseInt(data.id), "name" : data.name, "project" : data.project, "date" : data.date, "hours" : data.hours};
  var collection = db.collection('list');
  var data = yield collection.insert(insertData);
  this.redirect('/administer/list');
}

function * updateList(){
  var data = yield parse(this);
  console.log(data);
  var findData = {"id" : parseInt(data.id)};
  var collection = db.collection('list');
  var data = yield collection.update(findData,{
                                      '$set':{"id" : parseInt(data.id), "name" : data.name, "project" : data.project, "date" : data.date, "hours" : data.hours}
                                    });
  this.redirect('/administer/list');
}

function * deleteList(){
  var data = yield parse(this);
  console.log(data);
  var collection = db.collection('list');
  var data = yield collection.remove({"id" : parseInt(data.id), "name" : data.name, "project" : data.project, "date" : data.date, "hours" : data.hours});
  this.redirect('/administer/list');
}

app.listen(3000);
console.log('listening on port 3000');
