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
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Generates a unique task ID with a unique task ID

function generateTaskId() {
  const taskID = Math.floor(Math.random() * 1000);
  return taskId;
}

// Creates a task card element with the provided task data. Upon creation these task cards should be draggable, droppable and sortable. 
//They should include the "task-title", the "task-description" and "task-date" ids.

function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card")
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
    .addClass('btn btn-danger')
    .text('Delete')
    deleteBtn.on('click', handleDeleteTask);
  

  // Append elements to task card
  taskCard.append(dateEl, titleEl, descriptionEl, deleteBtn);
}


/**
 * Renders the task list and makes cards draggable.
 */
function renderTaskList() {
  const taskList = JSON.parse(localStorage.getItem("tasks"));
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

/**
 * Handles adding a new task.
 * @param {Event} event - The event object triggered by the submission of the task form.
 */
function handleAddTask(event) {
  event.preventDefault();
  const taskId = generateTaskId();
  const taskTitle = $("#task-title").val();
  const taskDescription = $("#task-description").val();
  const taskDate = $("#task-date").val();
  const task = {
    id: taskId,
    title: taskTitle,
    description: taskDescription,
    date: taskDate,
    status: "todo"
  };
  
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
  taskForm.trigger("reset");
}

/**
 * Handles deleting a task.
 * @param {Event} event - The event object triggered by clicking the delete button.
 */
function handleDeleteTask(event) {
  const taskId = $(this).parent().data("task-id");
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

/**
 * Handles dropping a task into a new status lane.
 * @param {Event} event - The event object triggered by dropping a task card.
 * @param {jQueryUI} ui - The jQuery UI object containing information about the dropped element.
 */
function handleDrop(event, ui) {
  const taskId = ui.draggable.data("task-id");
  const newStatus = $(this).data("status");
  const task = taskList.find(task => task.id === taskId);
  task.status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
taskForm.on('click', '.btn-delete-task', handleDeleteTask);
submitBtn.on('click', handleAddTask);

$(document).ready(function () {
    renderTaskList();

    // Adds date picker to task date input box.
    $('#task-date').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    // Makes lanes droppable.
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    // Closes modal when clicking on "x" in top right corner of modal.
    $('#close-btn').on('click', function() {
        const modalId = $(this).closest('.modal').attr('id');
        $('#' + modalId).modal('hide');
    });
});