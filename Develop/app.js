const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "./output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// EMAIL INPUT VALIDATION

const emailValidation = value => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return true;
    } else {
    return "Must be a valid email address";
    }
};

// EMPTY RESPONSE VALIDATION

const emptyResponseValidation = value => {
    if (/\w/.test(value)) {
        return true;
    } else {
    return "Input required";
    }
};

// CHECKING FOR NUMBER VALIDATION

const checkNum = value => {
    if(isNaN(value) || value < 1) {
        return "Answer must be a number greater than zero"
    } else {
        return true;
    }
}

// EMPTY ARRAY FOR TEAM MEMBER INSTANCES

const teamArr = [];


inquirerQuestions();

function inquirerQuestions() { 

inquirer.prompt([
    {
        type: "list",
        name: "role",
        message: "What is the Employees role?",
        choices: ["Manager","Engineer","Intern"]
    },
    {
        type: "input",
        name: "name",
        message: "What is the Employees name?",
        validate: emptyResponseValidation
    },
    {
        type: "input",
        name: "email",
        message: "What is their email address?",
        validate: emailValidation
    },
    {
        type: "input",
        name: "id",
        message: "What is their Employee ID?",
        validate: checkNum
    },
    {
        type: "input",
        name: "officeNumber",
        message: "What is their office number?",
        when: (answers) => answers.role === "Manager",
        validate: checkNum
    },
    {
        type: "input",
        name: "github",
        message: "What is their GitHub username?",
        when: (answers) => answers.role === "Engineer",
        validate: emptyResponseValidation
    },
    {
        type: "input",
        name: "school",
        message: "What school do they attend?",
        when: (answers) => answers.role === "Intern",
        validate: emptyResponseValidation
    },

]).then(function(data) {

    if(data.role === "Engineer") {
    let newEngineer = new Engineer(data.name, data.id, data.email, data.github);
    teamArr.push(newEngineer);
    } 
    if(data.role === "Manager") {
    let newManager = new Manager(data.name, data.id, data.email, data.officeNumber);
    teamArr.push(newManager);
    }
    if(data.role === "Intern") {
    let newIntern = new Intern(data.name, data.id, data.email, data.school);
    teamArr.push(newIntern);
    }

}).then(function(){
    
    inquirer.prompt([
        {
            type: "list",
            name: "additionalEmployees",
            message: "Would you like to add another employee?",
            choices: ["Yes", "No"]
        }
]).then(function(answers){
    if(answers.additionalEmployees === "Yes") {
       inquirerQuestions()
    } else {
        // console.log(teamArr)
        let html = render(teamArr);
        fs.writeFile(outputPath, html, "utf8", function (err){
            if(err) {
                return(err);
            }
        });
    } 
})

}).catch(function(err) {
    console.log(err);
  })

}

