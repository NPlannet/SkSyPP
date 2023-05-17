const express = require('express');
let fs = require("fs");
let jsonServer= require("json-server");
let bodyparser=require('body-parser');

const app = express();
const port = 3000;

const jsonServerMiddleware=jsonServer.router("api.json");

app.use('/api',jsonServerMiddleware);
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());



app.get("/",(req,res)=>{
const todos = JSON.parse(fs.readFileSync("api.json")).todos;
res.render("ListTodos",{data:todos});

})
app.post("/",(req,res)=>{
  const todos = JSON.parse(fs.readFileSync("api.json")).todos;
  let todo = {
    id: Date.now(),
    name: req.body.name,
    date:req.body.date,
    progress:req.body.progress,
  }
  todos.push(todo);
  fs.writeFileSync("api.json",JSON.stringify({todos}));
  res.redirect("/");
})


app.get("/deleteUser/:id",(req,res)=>{
  const list = JSON.parse(fs.readFileSync("api.json")).todos
  const todos = list.filter((todo)=>(todo.id!=parseInt(req.params.id)))
  if(todos.length == list.length){
    res.send(404);
  }
  fs.writeFileSync("api.JSON",JSON.stringify({todos}))
  res.redirect("/")
})



app.get("/new",(req,res)=>{
  res.render("newTodo");
})




app.get("/edit/:id",(req,res)=>{
  const list = JSON.parse(fs.readFileSync("api.json")).todos
  const todo = list.find((u) => u.id == parseInt(req.params.id))

  res.render("editTodo",{toDoData: todo})
})

app.post("/edit/:id",(req,res)=> {

  const todos = JSON.parse(fs.readFileSync("api.json")).todos
  const todo = todos.find((u) => u.id == parseInt(req.params.id))

  todo.name=req.body.name
  todo.date=req.body.date
  todo.progress=req.body.progress
  fs.writeFileSync("api.JSON",JSON.stringify({todos}))
  res.redirect("/")
})




app.listen(port, () => {
  console.log(` app listening at http://localhost:${port}`);
});