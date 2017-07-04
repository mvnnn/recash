import PostSchema from './models/post';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

let today = new Date();
let hours = today.getHours();
let minutes = today.getMinutes();
let dd = today.getDate();
let mm = today.getMonth()+1; //January is 0!
let yyyy = today.getFullYear();
let time = hours+"."+minutes;
let dayFormat = 'AM';

if(time > 12.00) {
  hours = hours - 12;
  dayFormat = 'PM';
}
if(dd<10) {
    dd='0'+dd;
}
if(mm<10) {
    mm='0'+mm;
}

let todays = mm+"/"+dd+"/"+yyyy;
let totalTime = hours+':'+minutes;
let timeString = totalTime+" "+dayFormat+" "+todays;
let moment = require('moment');
require('moment-weekday-calc');

let image_urls = [];
module.exports = function(app, passport) {


app.get('/addpost', function(req, res) {
    res.render('addPost.ejs');
});


var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './uploads');
  },
  filename: function (request, file, callback) {
    console.log(file);
    callback(null, file.originalname)
  }
});

app.post('/addpost', function (request, response, next) {
var upload = multer({storage: storage}).single('userFile');

upload(request, response, function(err) {
  if(err) {
    console.log('Error Occured');
    return;
  }

  console.log(request.file);
  PostSchema.update({image_path:request.file.originalname},
    {info:request.body.information,
    image_path:request.file.originalname,
    time:timeString},
    { upsert: true },
    function(err, respons){
      if(respons.length != 0){
        PostSchema.find({ }, function (err, respon) {
          if(respon.length != 0){
            response.render('homepage.ejs', { posts : respon});
            response.end();
          }
          else{response.send("Error");}
        })
    }
  })
  console.log('Photo Uploaded');
});

});

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/profile', isLoggedIn, function(req, res) {

        PostSchema.find({ }, function (err, response) {
          if(response.length != 0){
            // console.log(response);
            res.render('homepage.ejs', { posts : response});
            res.end();
          }
          else{res.send("Error");}
        }
      );

        //  res.render('homepage.ejs', { message: req.flash('loginMessage') });
     }
      // res.render('homepage.ejs', {
      //   user : req.user
      // });
    );


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

    app.get('/*',  isLoggedIn, function(req, res) {
      res.redirect('/');
    });
};



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
