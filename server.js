#!/usr/bin/env node
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
const argv = require('yargs').argv

let hasInlineEmail = argv.email
let hasEmailListName = argv.list 

if (!hasInlineEmail && !hasEmailListName) throw new Error('Specify an email list using --list ./path/to/XXX or a single email using --email XXXX@domain.com')

// Create an array to store the list of email to be verified
let emailList = []

if (hasInlineEmail && hasInlineEmail.length) {
  // after a quick check, add the supplied 
  // email address to the list of emails to be 
  // verified. -> emailList
  emailList.push(hasInlineEmail)
}

if (hasEmailListName && hasEmailListName.length) {
  try {
    // usually when u use fs.readFileSync without the encoding option,
    // it returns a buffer, so we use the toString() method so we get 
    // a string in stead of an object of data. 
    // now that its a string, we can easily .split() by new line (\n) 
    // which returns an array with each element or item of the array a
    // single email address.
    fs.readFileSync(hasEmailListName).toString().split('\n').forEach(one_email => emailList.push(one_email))
  } catch (e) {
    // something might go wrong parsing the emails or the file the
    // emails are in. Let the user know.
    console.log(new Error('Invalid or Missing list. note: Email list expects a new line seperator for each email.'))
  }
} 


// this will filter out any invalid emails from our emailList[] 
let cleanedEmails = _.filter(emailList, e => {
  return validator.validate(e)
})

fs.writeFileSync(`${ _.uniqueId(_.uniqueId() + 'cc_') }-cleaned-email-list.ls`, cleanedEmails.join('\n'))

let badRequest = 0, goodRequest = 0

function checkEmails () {
  if (!cleanedEmails.length ) return console.error(`List is now empty`), process.exit();
  let this_email = cleanedEmails.shift()
  // Quick version
  emailCheck(this_email)
  .then(function (res) {
    // console.log(res)
      // Returns "true" if the email address exists, "false" if it doesn't.
    if (check) {
      console.log('Good request count: %d', goodRequest)
      fs.appendFileSync('cleaned-emails.txt', `${this_email} \n `)
      goodRequest++
    } else {
      console.log('Bad request count: %d', badRequest)
      badRequest++
      fs.appendFileSync('bad-emails.txt', `${this_email} \n `)
    }
    checkEmails()
  })
  .catch(function (err) {
    if (err.message === 'refuse') {
      console.log(`cannot check this domain mx`)
      // The MX server is refusing requests from your IP address.
    } else {
      console.log('does not exist')
      // Decide what to do with other errors.
    }
    checkEmails()
  });  
}

checkEmails()