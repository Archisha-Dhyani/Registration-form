const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

const port = process.env.PORT || 3000; // option either the connected port or 3000
require("./db/conn");
const Register = require("./models/registers")// name of register 


// to connect to index.html
const static_path = path.join (__dirname,"../public");
const templates_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

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
app.get("/register",(req,res)=>{
    res.render("register"); 
})
// first page , to ask if user wants to register or login and then render accordingly , destination recieved from start.hbs
app.get("/:destination", (req, res) => {
    const destination = req.params.destination;
    if (destination === "login" || destination === "register") {
        res.render(destination); 
    } else {
        res.status(404).send("Page not found");
    }
});
// create new user in our database
app.post("/register",async (req,res)=>{
    try{

        const password = req.body.password;
        const cpassword = req.body.confirmPassword;
        console.log(password);
        console.log(cpassword);

        if(password === cpassword){

            const registerEmp = new Register({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                confirmPassword : req.body.confirmPassword

            })

            const registered = await registerEmp.save();
            res.status(201).render(index);
            // saving data 
        }else{
            res.send("passwords are not matching ");

        }
        // console.log(req.body.name);
        // res.send(req.body.name);
    } catch(error){
        res.status(400).send(error);
    }
})



// for login 
app.get("/login",(req,res)=>{
    res.render("login"); 
 })

// check login 
// with async function go with try and catch 
app.post("/login",async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        // check if the id is registered or not 
        const useremail = await Register.findOne({email:email});// comparing two emails 
        if (useremail.password === password){
            // if yes , render on next page 
            res.status(201).render("index");

        }else{
            res.send("Password not matching ");
        }


    } catch(error){
        res.status(400).set("invalid email")
    }
})


app.listen(port,()=>{
    console.log(`server is running at port number ${port} `);
})