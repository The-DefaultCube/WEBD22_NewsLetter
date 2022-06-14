const API_KEY = "API_KEY"
const LIST_ID = "LIST_ID"

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser")

const app = express();

app.use(express.static("public"));//all relative url will assume it starts from public folder

app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(3000, function() {
    console.log("Server running at port 3000");
})

//handles GET req
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html" || __dirname + "\\index.html");
})

app.post("/", function (req, res) {
    // console.log(req.body);
    let first_name = req.body.fName;
    first_name = first_name.slice(0,1).toUpperCase()+first_name.slice(1).toLowerCase();
    let last_name = req.body.lName;
    last_name = last_name.slice(0,1).toUpperCase()+last_name.slice(1).toLowerCase();
    let e_mail = req.body.e_id;
    let full_name = first_name + " " +last_name;
    // console.log(first_name +" "+last_name+ " "+ e_mail + " " +full_name);

    let data = {
        members: [
        {
            email_address: e_mail,
            status: "subscribed",
            merge_fields: {
                FNAME: first_name,
                LNAME: last_name
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "manish:"+API_KEY//authentication for post request
    }
    const url_to_mc = "https://us14.api.mailchimp.com/3.0/lists/"+LIST_ID;

    const request = https.request(url_to_mc, options, function(response_mc) {
        console.log("response from mc: "+response_mc.statusCode);
        if (response_mc.statusCode === 200) {
            res.sendFile(__dirname + "/success.html" || __dirname + "\\success.html")
        } else {
            res.sendFile(__dirname + "/failure.html" || __dirname + "\\failure.html")
        }
        // response_mc.on("data", function(data) {
        //     console.log(JSON.parse(data));
        // })
    })
    request.write(jsonData);
    request.end();

})

app.post("/fail", function(req, res){
    res.redirect("/");
})