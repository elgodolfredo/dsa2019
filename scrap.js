const cheerio  = require('cheerio');
const request  = require("request");
const mod_getpass = require('getpass');
const Repositories = require('./db');

class Github {
  
  constructor(){
    this.jar = request.jar();
    this.URLS = {
      login: 'https://github.com/login',
      session: 'https://github.com/session',
    }
  }

  login(username, password, callback){
    request.get({ url : this.URLS.login, jar: this.jar}, (error, response, data) => {
      const $ = cheerio.load(data);
      var input = $('input[name=timestamp]');
      var timestamp = input.val();
      var input = $('input[name=timestamp_secret]');
      var timestamp_secret = input.val();
      var input = $('input[name=authenticity_token]');
      var authenticity_token = input.val();

      request.post({ url: this.URLS.session, jar: this.jar, form: {
        login: username, 
        password: password, 
        commit : 'Sign in', 
        timestamp: timestamp, 
        timestamp_secret: timestamp_secret,
        authenticity_token: authenticity_token
      }}, callback);
    });
  }

  searchExtract(){
    var code = "extract(%24_GET)%3B";
    var vulnerability_id = 1;
    this.search(code, vulnerability_id);
  }

  searchSQLInjection(){
    var code = "mysql_query+%24_POST%5B%22username%22%5D";
    var vulnerability_id = 2;
    this.search(code, vulnerability_id);
  }

  search(code, vulnerability_id){
    var url = `https://github.com/search?l=PHP&o=desc&q=${code}&s=indexed&type=Code`;
    request.get({url : url, jar: this.jar}, async (error, response, data) => {
      console.log('logged in')
      const $ = cheerio.load(data);
      var divs = $("div.code-list div.width-full");
      for (const div of divs) {
        var url  = $(div).find('div.flex-shrink-0 > .link-gray').text().trim();
        var file = $(div).find('.f4.text-normal').text().trim();
        var updated_at = $(div).find('.updated-at').find('relative-time').attr('datetime');
        var code = ''; //TODO
        if ( url ){
          var values = {
            vulnerability_id, url, file, updated_at, code
          };
          console.log(values);
          await manager.insert(values);
        }
      }
    });      
  }

}

const manager = new Repositories.Repositories();
const github = new Github();


mod_getpass.getPass({prompt : 'Contraseña'}, (error, password) => {
  github.login('elgodolfredo@gmail.com', password, () => {
    github.searchExtract();
    github.searchSQLInjection();
  });
});




