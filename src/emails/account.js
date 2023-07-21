const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeMessage = (email, name) => {
    sgMail.send({
        to: email, // Change to your recipient
        from: 'a.o.ehiagwina@gmail.com', // Change to your verified sender
        subject: 'Thanks for Joining',
        text: `Hello ${name}
        Welcome to this task manager app.
        Do share concerns at anytime.`
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })
}

const cancellationMessage = async (email, name) => {
    const msg = {
        to: email,
        from: 'a.o.ehiagwina@gmail.com',
        subject: 'Sorry to hear you cancelled',
        text: `Hello ${name},
        It has beem brought to our notice that you are cancelling your account with us.
        
        We are sorry to see you go.
        
        Do let us know if there is anyting we can do to keep you.
        
        Regards
        CEO`
    }
    
    await sgMail.send(msg)
    //console.log('Cancellation Message sent')
    
}


module.exports = {
    welcomeMessage,
    cancellationMessage
}

