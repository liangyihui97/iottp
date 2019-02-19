var express = require('express'); 
var app = express(); 
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000); 
app.disable('x-powered-by');//禁用 Express 的 X-Powered-By 头信息
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){                  
res.type('text/html');
res.render('home',{layout:null}//
); 
}); 
app.get('/about', function(req, res){               
res.render('about'); 
});
app.use(require('body-parser')()); 
app.get('/newsletter',function(req, res) { // 我们会在后面学到 CSRF……目前，只提供一个虚拟值     
res.render('newsletter', { csrf: 'CSRF token goes here' }); 
});
app.post('/process',function(req, res) {
        console.log('Form (from querystring): ' + req.query.form);
        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
        console.log('Name (from visible form field): ' + req.body.name);
        console.log('Email (from visible form field): ' + req.body.email);
        res.redirect(303, '/thankyou');
    });
app.get('/thankyou', function(req, res){
res.render('thankyou');
});

app.get('/headers',function(req, res){
	res.set('Content-Type','text/plain');
	var s = '';
	for(var name in req.headers) s += name + ':' + 	 req.headers[name] + '\n'; 
res.send(s);
}); 
//api
app.get('/api/data',function(req,res){
 res.json({
            columns: [
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '年龄 ',
                    key: 'age',
                    sortable: true
                },
                {
                    title : '出生日期  ',
                    key :'birthday',
                    sortable: true
                },
                {
                    title: '地址',
                    key: 'address'
                }
            ],
            data: [
                {
                    name: '小明',
                    age: '22',
                    birthday: '1997-04-02',
                    address: '江西省抚州市黎川县'
                },
                {
                    name: '宇成',
                    age: '24',
                    birthday: '1994-12-30',
                    address: '广东省云浮市'
                },
            ]
        })
});
// 定制 404 页面 
app.use(function(req, res){                 
res.status(404);         
res.render('404'); }); 
//  
//  // 定制 500 页面
app.use(function(err, req, res, next){     
console.error(err.stack); 
res.status(500);        
res.render('500'); });     
 app.listen(app.get('port'), function(){   console.log( 'Express started on http://localhost:' +     app.get('port') + '; press Ctrl-C to terminate.' ); });
