const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const multer = require("multer");

const port = process.env.PORT || 3000; // option either the connected port or 3000
require("./db/conn");
const Register = require("./models/registers")// name of register 


// to connect to index.html
const static_path = path.join (__dirname,"../public");
const templates_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");


// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json()); // enough if it was just postman 
app.use(express.urlencoded({extended:false}));//we want to get data in the form

app.use(express.static(static_path));

// to connect to index.hbs
app.set("view engine", "hbs");
app.set("views",templates_path);
hbs.registerPartials(partials_path);

// for hbs , we will change res.send to res.render
app.get("/", (req, res)=>{
    res.render("start");    // to show index.hbs
});

// for register page
// ...
app.get("/index", (req, res) => {
    res.render("index"); // Assuming "index" is the correct template name
});
// for login 
app.get("/login", (req, res) => {
    res.render("login");
});

// check login 
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ email: email });

        if (user && user.password === password) {
            res.status(201).redirect("/index"); // Redirect to the index page after successful login
        } else {
            res.send("Invalid email or password");
        }
    } catch (error) {
        res.status(400).send("Invalid email or password");
    }
});

// for register page
app.get("/register", (req, res) => {
    res.render("register");
});

// create new user in our database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;

        if (password === cpassword) {
            const registerEmp = new Register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                profilePicture: req.file.buffer
            });

            const registered = await registerEmp.save();
            res.status(201).redirect("/login"); // Redirect to the login page after successful registration
        } else {
            res.send("Passwords are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// This should be the last route to handle other cases
app.get("/:destination", (req, res) => {
    const destination = req.params.destination;
    if (destination === "login" || destination === "register") {
        res.render(destination);
    } else {
        res.status(404).send("Page not found");
    }
});



app.listen(port,()=>{
    console.log(`server is running at port number ${port} `);
})