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
app.use(route.get('/advanced',advanced));
app.use(route.get('/project/join',projectJoin));
app.use(route.get('/factory/income',factoryIncome));
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
app.use(route.post('/administer/employeeCheck',employeeData));
app.use(route.post('/administer/customerCheck',customerData));
app.use(route.post('/administer/getProjectId',getProjectId));
app.use(route.post('/project/join',getProjectJoin));

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

function * employeeData(){
  var dataSearch = yield parse(this);
  console.log(dataSearch);
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select idCard from employee where name='"+dataSearch.ID+"'");
    var data = result.recordset;
    sql.close();
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = data[i].idCard;
    }
    console.log(dataArray);
    this.body = dataArray;
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * customerData(){
  var dataSearch = yield parse(this);
  console.log(dataSearch);
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select item from project where name='"+dataSearch.ID+"'");
    var data = result.recordset;
    sql.close();
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = data[i].item;
    }
    console.log(dataArray);
    this.body = dataArray;
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * getProjectId(){
  var dataSearch = yield parse(this);
  console.log(dataSearch);
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select projectId from project where name='"+dataSearch.customer+"' and item='"+dataSearch.item+"'");
    var data = result.recordset;
    console.log(data);
    sql.close();
    this.body = data[0].projectId;
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
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query('select COUNT(projectId) as count ,AVG(money) as average from project');
    console.dir(result.recordset);
    var data = result.recordset;
    var total = "專案數量："+data[0].count+"======>平均金額："+data[0].average;
    console.log(data);
    sql.close();
    this.body = yield render('project',{subject:total});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
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
      dataArray[i] = {"name" : data[i].name, "idCard" : data[i].idCard, "sex" : data[i].sex==true?"男":"女", "age" : data[i].age, "experience" : data[i].experience, "birthday" : data[i].birthday.toLocaleDateString(),
                      "address" : data[i].address, "phone" : data[i].phone, "specialty" : data[i].specialty, "company" : data[i].company};
    }
    sql.close();
    this.body = yield render('staff',{subject:"information",
                                      title:{"t1":"name","t2":"idCard","t3":"sex","t4":"age","t5":"experience","t6":"birthday","t7":"address","t8":"phone","t9":"specialty","t10":"company"},
                                      apple:dataArray,
                                      search:"/search/information"});
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
    this.body = yield render('staff',{subject:"pay",
                                        title:{"t1":"name","t2":"idCard","t3":"月份","t4":"時數","t5":"薪水"},
                                        apple:dataArray,
                                        search:"/search/pay"});
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
    this.body = yield render('staff',{subject:"list",
                                      title:{"t1":"name","t2":"idCard","t3":"projectId","t4":"date","t5":"hours"},
                                      apple:dataArray,
                                      search:"/search/list"});
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
      dataArray[i] = {"td":i+1,"name" : data[i].name, "idCard" : data[i].idCard, "sex" : data[i].sex==true?"男":"女", "age" : data[i].age, "experience" : data[i].experience, "birthday" : data[i].birthday.toLocaleDateString(),
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
    var name = yield pool.request()
                      .query("select name from employee");
    var customer = yield pool.request()
                      .query("select DISTINCT name from project");
    var result = yield pool.request()
                      .query("select e.name,e.idCard,p.name as customer,p.item,p.projectId,pr.date,pr.hours from project as p ,employee as e ,process as pr where p.projectId = pr.projectId and e.idCard = pr.idCard");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    count = 1;
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"td" : i+1,"name" : data[i].name, "idCard" : data[i].idCard, "customer" : data[i].customer, "item" : data[i].item, "projectId" : data[i].projectId, "date" : data[i].date.toLocaleDateString(), "hours" : data[i].hours};
    }
    count = dataArray.length+1;
    console.log(dataArray);
    sql.close();
    this.body = yield render('staffAdminister',{subject:"list",
                                        title:{"t1":"數量","t2":"name","t3":"idCard","t4":"顧客姓名","t5":"工程名稱","t6":"projectId","t7":"date","t8":"hours","t9":"動作"},
                                        apple:dataArray,
                                        countId:count,
                                        name:name.recordset,
                                        customer:customer.recordset,
                                        router:"/insert/list",
                                        value:"新增"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * searchInformation(date){
  try {
    var data1 = yield parse(this);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select * from employee where name = '" + data1.search + "'");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "idCard" : data[i].idCard, "sex" : data[i].sex==true?"男":"女", "age" : data[i].age, "experience" : data[i].experience, "birthday" : data[i].birthday.toLocaleDateString(),
                      "address" : data[i].address, "phone" : data[i].phone, "specialty" : data[i].specialty, "company" : data[i].company};
    }
    sql.close();
    this.body = yield render('staff',{subject:"information",
                                      title:{"t1":"name","t2":"idCard","t3":"sex","t4":"age","t5":"experience","t6":"birthday","t7":"address","t8":"phone","t9":"specialty","t10":"company"},
                                      apple:dataArray,
                                      search:"/search/information"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * insertInformation(){
  try {
    var data = yield parse(this);
    var sex;
    if(data.sex =="男"){
        sex = 1;
    }
    else if (data.sex =="女") {
        sex = 0;
    }
    console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("insert into employee values ('"+data.name+"','"+data.idCard+"',"+sex+","+data.age+","+data.experience+",'"+data.birthday+"','"+data.address+"','"+data.phone+"','"+data.specialty+"','"+data.company+"')");
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
    console.log(data);
    var sex;
    if(data.sex =="男"){
        sex = 1;
    }
    else if (data.sex =="女") {
        sex = 0;
    }
    var pool = yield sql.connect(config);
    console.log("update employee set name='"+data.name+"',sex="+data.sex+",age="+data.age+",experience="+data.experience+",birthday='"+data.birthday+"',address='"+data.address+"',phone='"+data.phone+"',specialty='"+data.specialty+"',company='"+data.company+"' where idCard='"+data.idCard+"'");
    var result = yield pool.request()
                      .query("update employee set name='"+data.name+"',sex="+data.sex+",age="+data.age+",experience="+data.experience+",birthday='"+data.birthday+"',address='"+data.address+"',phone='"+data.phone+"',specialty='"+data.specialty+"',company='"+data.company+"' where idCard='"+data.idCard+"'");
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
  try {
    var data1 = yield parse(this);
    var pool = yield sql.connect(config);
    console.log(data1.search);
    var result = yield pool.request()
                      .query("select e.name ,e.idCard ,MONTH(pr.date) as '月份',SUM(pr.hours) as '時數',SUM(pr.hours)*3000 as '薪水' from project as p,process as pr,employee as e where p.projectId = pr.projectId and pr.idCard = e.idCard and e.name = '" + data1.search + "' group by e.name,e.idCard,MONTH(pr.date)");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "idCard" : data[i].idCard, "月份" : data[i].月份, "時數" : data[i].時數, "薪水" : data[i].薪水};
    }
    sql.close();
    this.body = yield render('staff',{subject:"information",
                                      title:{"t1":"name","t2":"idCard","t3":"月份","t4":"時數","t5":"薪水"},
                                      apple:dataArray,
                                      search:"/search/pay"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * searchList(date){
  try {
    var data1 = yield parse(this);
    var pool = yield sql.connect(config);
    console.log(data1.search);
    var result = yield pool.request()
                      .query("select e.name,e.idCard,p.name as customer,p.item,p.projectId,pr.date,pr.hours from project as p ,employee as e ,process as pr where p.projectId = pr.projectId and e.idCard = pr.idCard and e.name = '" + data1.search + "'");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    sql.close();
    for(let i=0;i<data.length;i++){
      dataArray[i] = {"name" : data[i].name, "idCard" : data[i].idCard, "projectId" : data[i].projectId, "date" : data[i].date.toLocaleDateString(), "hours" : data[i].hours};
    }
    this.body = yield render('staff',{subject:"list",
                                      title:{"t1":"name","t2":"idCard","t3":"projectId","t4":"date","t5":"hours"},
                                      apple:dataArray,
                                      search:"/search/list"});
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
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
    console.log('apple');
    console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("update process set "+"date='"+data.date+"',hours="+data.hours+" where idCard='"+data.idCardData+"' and projectId="+data.projectIdData);
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
                      .query("delete from process where idCard='" + data.idCardData + "' and projectId="+data.projectIdData+" and date='"+data.date+"' and hours="+data.hours);
    console.dir(result);
    sql.close();
    this.redirect('/administer/list');
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'delete fail';
  }
}

function * advanced(){
  this.body = yield render('advanced');
}

function * projectJoin(){
  try {
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select name,item,projectId from project");
    console.dir(result.recordset);
    var data = result.recordset;
    var dataArray = [];
    sql.close();
    for(let i=0;i<data.length;i++){
        dataArray[i] = data[i].name+":"+data[i].item+":"+data[i].projectId;
    }
    this.body = yield render('advanced',{
                                          subject:"查詢某工程員工參與人數",
                                          select:dataArray
                                        });
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * getProjectJoin(){
  try {
    var data = yield parse(this);
    console.log(data.ID);
    data=data.ID.split(":")[2];
    console.log(data);
    var pool = yield sql.connect(config);
    var result = yield pool.request()
                      .query("select e.name,e.idCard,p.projectId,pr.date,pr.hours from project as p ,employee as e ,process as pr where p.projectId = pr.projectId and e.idCard = pr.idCard and pr.projectId="+data);
    console.dir(result.recordset);
    var data1 = result.recordset;
    var dataArray = [];
    for(let i=0;i<data1.length;i++){
      dataArray[i] = {"name" : data1[i].name, "idCard" : data1[i].idCard, "projectId" : data1[i].projectId, "date" : data1[i].date.toLocaleDateString(), "hours" : data1[i].hours};
    }
    sql.close();
    this.body = dataArray;
  }catch(err){
    console.log(err);
    sql.close();
    this.body = 'select fail';
  }
}

function * factoryIncome(){
  this.body = yield render('advanced',{
                                        subject:"計算工廠某月收入"
                                      });
}

app.listen(3000);
console.log('listening on port 3000');
