const emailCheck = require('email-check')
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
const validator = require("email-validator");
const _ = require("lodash")

// const adapter = new FileSync('db.json')
// const db = low(adapter)


const fs = require('fs')


// bad email list
// let badEmailList = fs.readFileSync('bad.ls')

// good email list


// list of emails
let scrapedEmails = fs.readFileSync('emails.ls').toString().split('\n')

// const domains = db.get('url').map().value
let cleanedEmails = _.filter(scrapedEmails, e => {
  return validator.validate(e)
})

fs.writeFile(`${ _.uniqueId() }-cleaned-email-list.ls`, cleanedEmails.join('\n'))

let badRequest = 0, goodRequest = 0

function checkEmails () {
  let this_email = cleanedEmails.shift()
//   let this_email = 'michaelsrhema@gmail.com'
  // Quick version
  emailCheck(this_email)
  .then(function (res) {
    // Returns "true" if the email address exists, "false" if it doesn't.
    fs.appendFileSync('cleaned-emails.txt', `${this_email} \n `)
    checkEmails()
    console.log('Good request count: %d', goodRequest++)
  })
  .catch(function (err) {
    console.log('Bad request count: %d', badRequest++)
    if (err.message === 'refuse') {
      console.log(`cannot check this domain mx`)
      // The MX server is refusing requests from your IP address.
    } else {
      console.log('does not exist')
      // Decide what to do with other errors.
    }
    fs.appendFileSync('bad-emails.txt', `${this_email} \n `)
    checkEmails()
  });  
}

checkEmails()