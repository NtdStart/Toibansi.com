'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wsConnection = require('../wsConnections/wsConnection');

var _wsConnection2 = _interopRequireDefault(_wsConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Routers = function () {
    function Routers(app) {
        _classCallCheck(this, Routers);

        this.app = app;
        this.wsConnection = new _wsConnection2.default(app);
        this.setupRouter = this.setupRouter.bind(this);
        this.setupRouter();
    }

    _createClass(Routers, [{
        key: 'setupRouter',
        value: function setupRouter() {
            var app = this.app;
            console.log("App Router init!");

            // Những router không cần check token
            var mapRouter = ['/login'];

            // router.use(function (req, res, next) {
            //     // Website you wish to allow to connect
            //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            //     // Request methods you wish to allow
            //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            //     // Request headers you wish to allow
            //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            //     // Set to true if you need the website to include cookies in the requests sent
            //     // to the API (e.g. in case you use sessions)
            //     res.setHeader('Access-Control-Allow-Credentials', true);
            //     console.log(req.originalUrl)
            //     if (mapRouter.includes(req.originalUrl)) {
            //         next()
            //     } else {
            //         let token = req.query.token || req.body.token || req.headers['token'] || undefined
            //         if (token) {
            //             // verifies secret and checks exp
            //             jwt.verify(token, superSecret, function (err, decoded) {
            //                 if (err) {
            //                     return res.json({success: false, message: 'Failed to authenticate token.'});
            //                 } else {
            //                     // if everything is good, save to request for use in other routes
            //                     req.decoded = decoded; //log data decoded
            //                     console.log(decoded)
            //                     next();
            //                 }
            //             });
            //         } else {
            //             // if there is no token
            //             // return an error
            //             return res.status(403).json({
            //                 success: false,
            //                 message: 'No token provided.'
            //             });
            //
            //         }
            //     }
            // })


            // router.use('/user', userController);
            // router.use('/tag', tagController);
            // router.use('/order', orderController);
            // router.use('/search', searchController);


            //Tuan add: Find One user to username and passs
            app.post('/login', function (req, res) {
                var email = req.body.email;
                var pass = req.body.pass;
                if (email === 'a5wap123@gmail.com' && pass === '123456') {
                    var payload = {
                        email: email
                    };
                    var token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + 60 * 60,
                        payload: payload
                    }, superSecret);
                    res.status(200).json({
                        code: 1,
                        mgs: 'Enjoy your token!',
                        data: token
                    });
                } else {
                    res.status(403).json({ code: -1, mgs: 'User not found.', data: null });
                }

                // User.findOne({email:email},(err,user)=>{
                //     if (err) {
                //         res.json({code:0,mgs:'thorw error',data:null})
                //     }
                //     if(!user){
                //         res.json({ code: -1, mgs: 'User not found.' ,data:null});
                //     }else if (user) {
                //         if (user.password != pass) {
                //             res.json({ code: -2, mgs: 'Wrong password' ,data:null});
                //           } else {

                //             // if user is found and password is right
                //             // create a token with only our given payload
                //         // we don't want to pass in the entire user since that has the password
                //         const payload = {
                //           email: user.email
                //         };
                //         var token = jwt.sign(payload, src.get('superSecret'), {
                //             expiresInMinutes: 1440 // expires in 24 hours
                //           });
                //           res.json({
                //             code: 1,
                //             mgs: 'Enjoy your token!',
                //             data:token
                //           });
                //     }
                //     }

                // })
            });
        }
    }]);

    return Routers;
}();

exports.default = Routers;
//# sourceMappingURL=index.js.map