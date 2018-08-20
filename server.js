var emailCheck = require('email-check');
 
// Quick version
emailCheck('michael.rhema@gmail.com')
  .then(function (res) {
    // Returns "true" if the email address exists, "false" if it doesn't.
    console.log(res)
  })
  .catch(function (err) {
    if (err.message === 'refuse') {
      console.log(`cannot check this domain mx`)
      // The MX server is refusing requests from your IP address.
    } else {
      console.log('does not exist')
      // Decide what to do with other errors.
    }
  });