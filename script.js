const tasks = document.querySelector('.listOfTasks');
const addNewTask = document.querySelector('.add');
const mode = document.querySelector('.modeToggle');
const newTask = document.querySelector('.newTask');
const del = document.querySelectorAll('.delete');
const container = document.querySelector('.container')
const body = document.querySelector('body')
const modeImage = document.querySelector('.modeImg')
const cont = document.querySelector('.newTaskContainer')
// const list =document.querySelectorA('li')
// const done= document.querySelector('.done')
const header = document.querySelector('header')
const tabButtons = document.querySelectorAll('.tab');

let currentFilter = "all";

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
        tasks.scrollTop = tasks.scrollHeight;
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
    const darks = [container,header,newTask,addNewTask];
    if(theme === 'dark'){
        body.classList.add('dark');
        darks.forEach(dark =>{
            dark.classList.add('dark');
            modeImage.src = "./images/sun-svgrepo-com.svg";})
        console.log(body.classList)
    }
   
    else {
        body.classList.remove('dark');
        modeImage.src = "./images/night-mode-svgrepo-com.svg"
        darks.forEach(dark =>{
        dark.classList.remove('dark');})
        console.log(body.classList)
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

//manualy change the theme
mode.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

function renderTask() {
    let load = loadTasks();
    tasks.innerHTML = "";

    let filteredTasks = load.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true; 
    });

    filteredTasks.forEach(task => {
        let li = document.createElement('li');
        li.innerHTML = `<section class="inLi">
                            <input type="checkbox" ${task.completed ? 'checked' : ''}> 
                            <p class="${task.completed ? "done" : ""}"> ${task.text} </p> 
                        </section> 
                        <button class="delete">
                            <img class="delete deleteImg" src="./images/delete-svgrepo-com.svg" alt="delete a task"> 
                        </button>`;
        tasks.appendChild(li);

        let checkbox = li.querySelector("input");
        checkbox.addEventListener("change", () => {
            let taskIndex = tobBeSaved.findIndex(t => t.text === task.text);
            tobBeSaved[taskIndex].completed = checkbox.checked;
            saveTask();
            renderTask(); 
        });
    });
}

function loadTasks(){
    return JSON.parse(localStorage.getItem('tasks')) || [];
};
function saveTask(){
    localStorage.setItem("tasks",JSON.stringify(tobBeSaved))
};

function renderTask() {
    let load = loadTasks();
    tasks.innerHTML = "";

    let filteredTasks = load.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true; // for "all"
    });

    filteredTasks.forEach(task => {
        let li = document.createElement('li');
        li.innerHTML = `<section class="inLi">
                            <input type="checkbox" ${task.completed ? 'checked' : ''}> 
                            <p class="${task.completed ? "done" : ""}"> ${task.text} </p> 
                        </section> 
                        <button class="delete">
                            <img class="delete deleteImg" src="./images/delete-svgrepo-com.svg" alt="delete a task"> 
                        </button>`;
        tasks.appendChild(li);

        let checkbox = li.querySelector("input");
        checkbox.addEventListener("change", () => {
            let taskIndex = tobBeSaved.findIndex(t => t.text === task.text);
            tobBeSaved[taskIndex].completed = checkbox.checked;
            saveTask();
            renderTask(); // re-render after checkbox change
        });
    });
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTask();
    });
});


