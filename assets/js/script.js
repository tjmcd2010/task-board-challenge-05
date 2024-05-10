// Create variables from index.html to call on
const closeBtn = $("#close-btn");
const taskForm = $("#task-form");
const taskTitle = $("#task-title");
const taskDate = $("#task-date");
const taskDescription = $("#task-description");
const submitBtn = $("#submit");
const todoCards = $("#todo-cards");
const inProgressCards = $("#in-progress-cards");
const doneCards = $("#done-cards");

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; 
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Generates a unique task ID with a unique task ID

function generateTaskId() {
  const taskId = Math.floor(Math.random() * 1000);
  return taskId;
}

// Creates a task card element with the provided task data. Upon creation these task cards should be draggable, droppable and sortable. 
//They should include the "task-title", the "task-description" and "task-date" ids.

function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass('card draggable')
    .attr("data-task-id", task.id);

  const dateEl = $("<p>")
    .addClass("card-title")
    .text(task.date);

  const cardBody = $('<div>')
    .addClass('card-body text');

  const titleEl = $("<h5>")
    .addClass("card-title")
    .text(task.title);

  const descriptionEl = $("<p>")
    .addClass("card-text")
    .text(task.description);
    
  const deleteBtn = $('<button>')
    .addClass('btn btn-dark')
    .attr('data-task-id', task.id)
    .text('Delete')
    deleteBtn.on('click', handleDeleteTask);
  
   // Utilize jquery ui to color the tasks based on due date. 
   const today = dayjs();
   const dueDate = dayjs(task.date, 'DD/MM/YYYY');
   const diff = dueDate.diff(today, 'days');
   if (diff < 0) {
     taskCard.addClass('bg-danger');
   } else if (diff === 0) {
     taskCard.addClass('bg-warning');
   } else {
     taskCard.addClass('bg-white');
   }
//enable task card as draggable
taskCard.draggable({
    revert: "invalid", // If dropped outside a lane, revert back
    cursor: "move",
    containment: "document",
});

  // Append elements to task card
  cardBody.append(dateEl, titleEl, descriptionEl, deleteBtn);
  taskCard.append(cardBody, deleteBtn);
  return taskCard;
  
}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasksList = JSON.parse(localStorage.getItem("tasks")) || {};
    
    todoCards.empty();
    inProgressCards.empty();
    doneCards.empty();
    
    for (const task of taskList) {
      const taskCard = createTaskCard(task);
      if (task.status === "todo") {
        todoCards.append(taskCard);
      } else if (task.status === "in-progress") {
        inProgressCards.append(taskCard);
      } else if (task.status === "done") {
        doneCards.append(taskCard);
      }
    }

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
   // if (!taskTitle.val() || !taskDescription.val() || !taskDate.val()) {
   //     alert("Please fill in all fields");
   //     return;
   // }
   
    event.preventDefault();
    const taskId = generateTaskId();
    const title = $("#task-title").val();
    const description = $("#task-description").val();
    const date = $("#task-date").val();
    const task = {
        id: taskId,
        title: title,
        description: description,
        date: date,
        status: "todo"
    }
    taskList.push(task);
    renderTaskList();
    const newTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    newTasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    renderTaskList;

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).parent().data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();


}
// ? Use JQuery UI to make task cards draggable
$('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('.draggable')
                ? $(e.target)
                : $(e.target).closest('.draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });

    

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data("task-id");
    const newStatus = $(this).data("status");
    const task = taskList.find(task => task.id === taskId);

    if (task) {
        task.status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}

// Renders the task list, adds event listeners, makes lanes droppable, and turns due date field into a date picker.

taskForm.on('click', '.btn-delete-task', handleDeleteTask);
submitBtn.on('click', handleAddTask);


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    
    // Make lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

    //make the task-date field a date picker in the format of "yyyy-MM-dd"
    $('#task-date').datepicker({
        changeMonth: true,
        changeYear: true,
    });


    
    // Closes modal when clicking on "x" in top right corner of modal.
    $('#close-btn').on('click', function() {
        const modalId = $(this).closest('.modal').attr('id');
        $('#' + modalId).modal('hide');
    });
});
   
