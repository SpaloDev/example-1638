/**
 * SFDC Webhook Refer Sample
 */

require('dotenv').config()
const bcrypt = require('bcryptjs')
const jsforce = require('jsforce')

exports.exampleSfdcWebhookRefer = async (req, res) => {

  // check by webhookKey
  if (req.body.webhookKey) {

    if(req.body.webhookKey !== process.env.SPALO_WEBHOOK_KEY){
      console.log('webhookKey Error');
      return res.status(401).send('Unauthorized')
    }

  } else {

    // for velification
    return res.send('OK')
  
  }

  // SFDC connect
  const login_url = 'https://login.salesforce.com'

  const conn = new jsforce.Connection({
    oauth2: {
      loginUrl: login_url,
      clientId: process.env.CONSUMER_KEY,
      clientSecret: process.env.CONSUMER_SECRET,
    }
  })

  conn.login(process.env.CLIENT_USERNAME, process.env.PASSWORD + process.env.SECURITY_TOKEN, (error, response) => {

    if (error) { return res.status(401).send('SFDC Unauthorized') }

    const query = "SELECT Name, Id FROM Account"
    
    // SFDC request
    conn.query(query, (err, result) => {

      if (err) { return console.log(err) }

      // return response for SPALO
      const ret = {
        type: "carousel",
        data: []
      }

      for (let i = 0; i < result.records.length; i++) {
        ret.data.push({
          type: "message",
          label: result.records[i].Name,
          text: result.records[i].Id
        })
      }

      res.send(ret)

    })
  })
  
}
