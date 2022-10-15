var nodemailer = require('nodemailer');
const {m_username} = require("/root/putribot/config.json");
const {m_password} = require("/root/putribot/config.json");
const {m_receiver} = require("/root/putribot/config.json");
const {c_id} = require("/root/putribot/config.json");
const {c_sec} = require("/root/putribot/config.json");
const {r_token} = require("/root/putribot/config.json");
const {a_token} = require("/root/putribot/config.json");

function sendMail(err){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          clientId: c_id,
          clientSecret: c_sec,
          refreshToken: r_token,
          accessToken: a_token,
          user: m_username,
          pass: m_password
        }
      });

      if (err){
      
      var mailOptions = {
        from: 'professorPutri',
        to: m_receiver,
        subject: `Your bot has disconnected ${Date.now()} `,
        text: `There seems to be an error with your bot, it disconnected with this message:\n ${err}`,
      };
    } else {
      connectdate = new Date()
        var mailOptions = {
            from: 'professorPutri',
            to: m_receiver,
            subject: `Your bot has Connected ${connectdate.toLocaleString()} `,
            text: `The professor got connected by someone`,
          };

    }
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Connection Email sent: ' + info.response);
        }
      })
    }
    
module.exports = {sendMail}