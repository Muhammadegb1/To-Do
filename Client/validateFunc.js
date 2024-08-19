class ValidateFunc{
    Validate_password(res,password,repeatPassword){
        if (password.length < 8) {
             res.status(400).send("Password must be at least 8 characters long");
             res.redirect('/login');
        }
        if (password !== repeatPassword) {
             res.status(400).send("Password must match the repeat password.");
             res.redirect('/login');
        }
    }

    Validate_email(res,users,email){
    if (users.find(user => user.email === email)) {
        res.status(400).send("Email is already registered");
        res.redirect('/login');
    }
  }

  Validate_email_In_DATA(res,user,password){
    if (!user) {
        res.status(400).send("Email not registered");
        res.redirect('/login');
    }

    // Check if password matches
    if (user.password !== password) {
        res.status(400).send("Invalid password");
        res.redirect('/login');
    }
  }

}
module.exports = ValidateFunc;