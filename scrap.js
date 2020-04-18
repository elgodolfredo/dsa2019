const cheerio  = require('cheerio');
const request  = require("request");
const mod_getpass = require('getpass');
const Repositories = require('./db');

const URLS = {
  login: 'https://github.com/login',
  session: 'https://github.com/session',
}
var jar = request.jar();
const manager = new Repositories.Repositories();

request.get({ url : URLS.login, jar: jar}, (error, response, data) => {
  const $ = cheerio.load(data);
  var input = $('input[name=timestamp]');
  var timestamp = input.val();
  var input = $('input[name=timestamp_secret]');
  var timestamp_secret = input.val();
  var input = $('input[name=authenticity_token]');
  var authenticity_token = input.val();

  mod_getpass.getPass({prompt : 'Contraseña'}, (error, password) => {

    request.post({ url: URLS.session, jar: jar, form: {
      login: 'elgodolfredo@gmail.com', 
      password: password, 
      // password: '', 
      commit : 'Sign in', 
      timestamp: timestamp, 
      timestamp_secret: timestamp_secret, 
      authenticity_token: authenticity_token
    }}, (error, response, data) => {
      console.log(data);
      var code = "extract(%24_GET)%3B";
      var url = `https://github.com/search?l=PHP&o=desc&q=${code}&s=indexed&type=Code`;

      request.get({url : url, jar: jar}, async (error, response, data) => {
        const $ = cheerio.load(data);
        var divs = $("div.width-full");
        for (const div of divs) {
          var url  = $(div).find('div.flex-shrink-0 > .link-gray').text().trim();
          var file = $(div).find('.f4.text-normal').text().trim();
          var code = ''; //TODO
          var vulnerability_id = 1;
          var values = {
            vulnerability_id, url, file, code
          };
          await manager.insert(values);
        }
      });

    });

  });

});



