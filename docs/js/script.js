// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  // increment the nextId value for each new task
  const taskId = nextId;
  nextId += 1;
  // update nextId in localStorage
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return taskId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  return `
        <div class="task-card card mb-3" data-id="${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.name}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                <button class="btn btn-danger delete-btn">Delete</button>
            </div>
        </div>
    `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoLane = $("#todo-cards");
  const inProgressLane = $("#in-progress-cards");
  const doneLane = $("#done-cards");

  // Clear lanes before rendering
  todoLane.empty();
  inProgressLane.empty();
  doneLane.empty();

  // Render tasks into the correct lane based on status
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);
    if (task.status === "To Do") {
      todoLane.append(taskCard);
    } else if (task.status === "In Progress") {
      inProgressLane.append(taskCard);
    } else if (task.status === "Done") {
      doneLane.append(taskCard);
    }
  });

  // Initialize drag-and-drop for cards
  $(".task-card").draggable({
    helper: "clone",
    revert: "invalid",
    zIndex: 1000,
    start: function (event, ui) {
        $(this).css("visibility", "hidden");
    },
    stop: function (event, ui) {
        $(this).css("visibility", "visible");
    }
  });

  // Make lanes droppable
  $(".lane").droppable({
    accept: ".task-card",
    hoverClass: "ui-droppable-hover",
    drop: handleDrop,
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  // get task input values
  const taskName = $("#task-name").val();
  const taskDescription = $("#task-description").val();
  const taskDueDate = $("#task-due-date").val();

  // Check if any input field is empty
  if (!taskName || !taskDescription || !taskDueDate) {
    alert("Please fill in all fields.");
    return; // Stop the function execution if validation fails
  }

  // create new task object
  const newTask = {
    id: generateTaskId(),
    name: taskName,
    description: taskDescription,
    dueDate: taskDueDate,
    status: "To Do",
  };

  // add task to task list
  taskList.push(newTask);

  // save updated task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  $("#todo-cards").append(createTaskCard(newTask));

  // clear form fields
  $("#task-name").val("");
  $("#task-description").val("");
  $("#task-due-date").val("");

  //close the modal
  $("#formModal").modal("hide");

  $(".task-card").draggable({
    helper: "clone",
    revert: "invalid",
    zIndex: 1000,
    start: function (event, ui) {
      $(this).css("visibility", "hidden");
    },
    stop: function (event, ui) {
      $(this).css("visibility", "visible");
    },
  });
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskCard = $(event.target).closest(".task-card");
  const taskId = taskCard.data("id");

  // remove task from task list
  taskList = taskList.filter((task) => task.id !== taskId);

  // save updated task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // remove task card from UI
  taskCard.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const draggedElement = ui.draggable;
  const taskId = parseInt(draggedElement.data("id"));
  
  $(this).append(draggedElement);

  // Find the new status lane from the droppable element
  const newLane = $(this).data("lane");

  // Update the task's status
  const task = taskList.find((task) => task.id === taskId);
  if (task) {
    if (newLane === "to-do") {
      task.status = "To Do";
    } else if (newLane === "in-progress") {
      task.status = "In Progress";
    } else if (newLane === "done") {
      task.status = "Done";
    }

    // Save the updated task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // initialize the nextId from localStorage if available
  nextId = JSON.parse(localStorage.getItem("nextId") || 1); // default to 1 if not found


  // initialize the taskList from localStorage if available
  taskList = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];

  // render task list
  renderTaskList();

  // set up add task form submission
  $("#add-task-form").on("submit", handleAddTask);

  // set up delete button event listener
  $(document).on("click", ".delete-btn", handleDeleteTask);

  // initialize date picker for the due date field
  $("#task-due-date").datepicker({
    dateFormat: "mm-dd-yyyy",
  });
});
