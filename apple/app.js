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
app.use(route.post('/project/administer/check',checkData));
app.use(route.post('/admin',adminData));
app.use(route.post('/search/information',searchInformation));
app.use(route.post('/insert/information',insertInformation));
app.use(route.post('/update/information',updateInformation));
app.use(route.post('/delete/information',deleteInformation));
app.use(route.post('/search/pay',searchPay));
app.use(route.post('/search/list',searchList));
app.use(route.post('/insert/list',insertList));
app.use(route.post('/update/list',updateList));
app.use(route.post('/delete/list',deleteList));

function * checkData(){
  var dataSearch = yield parse(this);
  console.log(dataSearch);
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select phone from customer where name='"+dataSearch.ID+"'");
    var data = result.recordset;
    sql.close();
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = data[i].phone;
    }
    console.log(dataArray);
    this.body = dataArray;
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

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
      dataArray[i] = {"name" : data[i].name, "phone" : data[i].phone, "age" : data[i].age, "sex" : data[i].sex==true?"男":"女", "address" : data[i].address, "introducer" : data[i].introducer, "company" : data[i].company};
    }
    sql.close();
    this.body = yield render('customer',{subject:"customer",
                                        title:{"t1":"name","t2":"phone","t3":"age","t4":"sex","t5":"address","t6":"introducer","t7":"company"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
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
      dataArray[i] = {"td" : i+1, "name" : data[i].name, "phone" : data[i].phone, "age" : data[i].age, "sex" : data[i].sex==true?"男":"女", "address" : data[i].address, "introducer" : data[i].introducer, "company" : data[i].company};
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
      dataArray[i] = {"name" : data[i].name, "phone" : data[i].phone, "age" : data[i].age, "sex" : data[i].sex==true?"男":"女", "address" : data[i].address, "introducer" : data[i].introducer, "company" : data[i].company};
    }
    sql.close();
    this.body = yield render('customer',{subject:"customer",
                                        title:{"t1":"name","t2":"phone","t3":"age","t4":"sex","t5":"address","t6":"introducer","t7":"company"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * insertCustomer(){
  try {
    var data = yield parse(this);
    var sex;
    if(data.sex =="男"){
        sex = 1;
    }
    else if (data.sex =="女") {
        sex = 0;
    }
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("insert into customer values ('"+data.name+"','"+data.phone+"',"+data.age+","+ sex +",'"+data.address+"','"+data.introducer+"','"+data.company+"')");
    console.dir(result);
    sql.close();
    this.redirect('/customer/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
}

function * updateCustomer(){
  try {
    var data = yield parse(this);
    var sex;
    if(data.sex =="男"){
        sex = 1;
    }
    else if (data.sex =="女") {
        sex = 0;
    }
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("update customer set age="+data.age+",sex="+sex+",address='"+data.address+"',introducer='"+data.introducer+"',company='"+data.company+"' where name='"+data.name+"' and phone='"+data.phone+"'");
    console.dir(result);
    sql.close();
    this.redirect('/customer/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
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
      dataArray[i] = {"projectId" : data[i].projectId, "startTime" : data[i].startTime.toLocaleDateString(), "address" : data[i].address, "item" : data[i].item, "receipt" : data[i].receipt.toLocaleDateString(), "money" : data[i].money,
                      "endTime" : data[i].endTime.toLocaleDateString(), "material" : data[i].material, "name" : data[i].name, "phone" : data[i].phone};
    }
    sql.close();
    this.body = yield render('project',{subject:"information",
                                        title:{"t1":"projectId","t2":"startTime","t3":"address","t4":"item","t5":"receipt","t6":"money","t7":"endTime","t8":"material","t9":"name","t10":"phone"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
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
                      .query('select * from project order by projectId');
    var name = yield pool.request()
                        .query('select DISTINCT name from customer');
    console.log(name.recordset);
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    count = 1;
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"td" : i+1, "projectId" : data[i].projectId, "startTime" : data[i].startTime.toLocaleDateString(), "address" : data[i].address, "item" : data[i].item, "receipt" : data[i].receipt.toLocaleDateString(), "money" : data[i].money,
                      "endTime" : data[i].endTime.toLocaleDateString(), "material" : data[i].material, "name" : data[i].name, "phone" : data[i].phone};
      count = data[i].projectId+1;
    }
    sql.close();
    this.body = yield render('projectAdminister',{subject:"project",
                                                  title:{"t1":"數量","t2":"projectId","t3":"startTime","t4":"address","t5":"item","t6":"receipt","t7":"money","t8":"endTime","t9":"material","t10":"name","t11":"phone","t12":"動作"},
                                                  apple:dataArray,
                                                  countId:count,
                                                  name : name.recordset,
                                                  router:"/insert/project",
                                                  value:"新增"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
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
      dataArray[i] = {"projectId" : data[i].projectId, "startTime" : data[i].startTime.toLocaleDateString(), "address" : data[i].address, "item" : data[i].item, "receipt" : data[i].receipt.toLocaleDateString(), "money" : data[i].money,
                      "endTime" : data[i].endTime.toLocaleDateString(), "material" : data[i].material, "name" : data[i].name, "phone" : data[i].phone};
    }
    sql.close();
    this.body = yield render('project',{subject:"information",
                                        title:{"t1":"projectId","t2":"startTime","t3":"address","t4":"item","t5":"receipt","t6":"money","t7":"endTime","t8":"material","t9":"name","t10":"phone"},
                                        apple:dataArray});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * insertProject(){
  try {
    var data = yield parse(this);
    console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("insert into project values ("+data.projectId+",'"+data.startTime+"','"+data.address+"','"+data.item+"','"+data.receipt+"',"+data.money+",'"+data.endTime+"',"+data.material+",'"+data.name+"','"+data.phone+"')");
    console.dir(result);
    sql.close();
    this.redirect('/project/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
}

function * updateProject(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("update project set startTime='"+data.startTime+"',address='"+data.address+"',item='"+data.item+"',receipt='"+data.receipt+"',money="+parseInt(data.money)+",endTime='"+data.endTime+"',material="+parseInt(data.material)+",name='"+data.name+"',phone='"+data.phone+"' where projectId="+parseInt(data.projectId));
    console.dir(result);
    sql.close();
    this.redirect('/project/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'update fail';
  }
}

function * deleteProject(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("delete from project where projectId = " + data.projectId);
    console.dir(result);
    sql.close();
    this.redirect('/project/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'delete fail';
  }
}

function * staff(){
  this.body = yield render('staff');
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
}

function * pay(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name ,e.idCard ,MONTH(pr.date) as '月份',SUM(pr.hours) as '時數',SUM(pr.hours)*3000 as '薪水' from project as p,process as pr,employee as e where p.projectId = pr.projectId and pr.idCard = e.idCard group by e.name,e.idCard,MONTH(pr.date)");
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
}

function * list(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name,e.idCard,p.projectId,pr.date,pr.hours from project as p ,employee as e ,process as pr where p.projectId = pr.projectId and e.idCard = pr.idCard");
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
}

function * adminPay(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name ,e.idCard ,MONTH(pr.date) as '月份',SUM(pr.hours) as '時數',SUM(pr.hours)*600 as '薪水' from project as p,process as pr,employee as e where p.projectId = pr.projectId and pr.idCard = e.idCard group by e.name,e.idCard,MONTH(pr.date)");
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
                                        countId:count});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * adminList(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name,e.idCard,p.projectId,pr.date,pr.hours from project as p ,employee as e ,process as pr where p.projectId = pr.projectId and e.idCard = pr.idCard");
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
}

function * updateInformation(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("update employee set name='"+data.name+"',sex="+data.sex+",age="+data.age+",experience="+data.experience+",birthday='"+data.birthday+"',address='"+data.address+"',phone='"+data.phone+"',specialty='"+data.specialty+"',company='"+data.company+"' where idCard='"+data.idCard+"'");
    console.dir(result);
    sql.close();
    this.redirect('/administer/information');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'update fail';
  }
}

function * deleteInformation(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("delete from employee where idCard = '" + data.idCard + "'");
    console.dir(result);
    sql.close();
    this.redirect('/administer/information');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'delete fail';
  }
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
  try {
    var data = yield parse(this);
    console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("insert into process values ('"+data.idCard+"',"+data.projectId+",'"+data.date+"',"+data.hours+")");
    console.dir(result);
    sql.close();
    this.redirect('/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'insert fail';
  }
}

function * updateList(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("update process set projectId="+data.projectId+",date='"+data.date+"',hours="+data.hours+" where idCard='"+data.idCard+"'");
    console.dir(result);
    sql.close();
    this.redirect('/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'update fail';
  }
}

function * deleteList(){
  try {
    var data = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("delete from process where idCard='" + data.idCard + "' and projectId="+data.projectId+" and date='"+data.date+"' and hours="+data.hours);
    console.dir(result);
    sql.close();
    this.redirect('/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'delete fail';
  }
}

app.listen(3000);
console.log('listening on port 3000');
