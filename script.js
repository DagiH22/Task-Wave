const tasks = document.querySelector('.listOfTasks');
const addNewTask = document.querySelector('.add');
const mode = document.querySelector('.modeToggle');
const newTask = document.querySelector('.newTask');
const del = document.querySelectorAll('.delete');
const container = document.querySelector('.container')
const body = document.body

let tobBeSaved = loadTasks();
renderTask();

//adding new tasks 
const addTask = e =>{
    let value = newTask.value;
    //checks for white spaces and if the entered value is only white spaces it prevents the user from adding it to the tasks
    if ((value.trim() != "") ){
        let li = document.createElement('li');    
        li.innerHTML = `<section class="inLi"> <input type="checkbox" > 
                            <p> ${value} </p> 
                        </section> 
                        <button class="delete">
                            <img class = "delete deleteImg" src="./images/delete-svgrepo-com.svg" alt="delete a task"> 
                        </button>`
        tasks.appendChild(li);
        tobBeSaved.push({ text: value, completed: false });

        saveTask();
        newTask.value = "";
    } 
}
tasks.addEventListener('change',(e)=>{
    if(e.target.type === 'checkbox'){
        let p = e.target.nextElementSibling;
        p.classList.toggle('done', e.target.checked)
    }
})

//allows for the addition of new task by pressing "Enter"
newTask.addEventListener('keydown', e => {
    if(e.key === "Enter")
        addTask(e);
})

//allows for the addition of new task by cliking "ADD" button
addNewTask.addEventListener("click",addTask);

// adds event listener to the ul elements and listens to click events on elements with delete class on them then deletes that element
tasks.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
        let taskText = e.target.parentElement.previousElementSibling.querySelector('p').textContent;
        tasks.removeChild(e.target.parentElement.parentElement);
        tobBeSaved = tobBeSaved.filter(task => task.text.trim() !== taskText.trim());
        saveTask();
    }
});

const setTheme = theme => {
    if(theme === 'dark'){
        container.classList.add('dark');
        tasks.classList.add('dark');
        body.classList.add('dark');
    }
    else {
        container.classList.remove('dark');
        tasks.classList.remove('dark');
        body.classList.remove('dark');
    }
    localStorage.setItem('theme',theme)
}

let savedTheme = localStorage.getItem('theme');
if(savedTheme)
    setTheme(savedTheme);
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark )').matches)
    setTheme('dark');
else setTheme('light')

//dynamically update changes of theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    setTheme(newTheme);
});

// to manualy change the theme
mode.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

function renderTask(){
   let load =  loadTasks()
   tasks.innerHTML = ""
 
    load.forEach(task =>{
        let li = document.createElement('li')
        li.innerHTML = `<section class="inLi">
                            <input type="checkbox"> 
                            <p class = ${task.completed ? "done" : ""}> ${task.text} </p> 
                        </section> 
                        <button class="delete">
                            <img class = "delete deleteImg" src="./images/delete-svgrepo-com.svg" alt="delete a task"> 
                        </button>`
        tasks.appendChild(li)

        let checkbox = li.querySelector("input");
            checkbox.addEventListener("change", () => {
                let taskIndex = tobBeSaved.findIndex(t => t.text === task.text);
                tobBeSaved[taskIndex].completed = checkbox.checked;
                saveTask();
            });
    
})
}

function loadTasks(){
    return JSON.parse(localStorage.getItem('tasks')) || [];
};
function saveTask(){
    localStorage.setItem("tasks",JSON.stringify(tobBeSaved))
};
