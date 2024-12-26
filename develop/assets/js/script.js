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
  });

  // Make lanes droppable
  $(".lane").droppable({
    accept: ".task-card",
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

  console.log(JSON.parse(localStorage.getItem("tasks")));

  // render task list
  renderTaskList();

  // clear form fields
  $("#task-name").val("");
  $("#task-description").val("");
  $("#task-due-date").val("");

  //close the modal
  $("#formModal").modal("hide");
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
  const droppedTaskCard = ui.draggable;
  const taskId = parseInt(droppedTaskCard.data("id"));
  const newLane = $(event.target).attr("id");

  // Find the new status lane from the droppable element
  //const newLane = $(event.target).data('lane');

  let newStatus = "";
  if (newLane === "to-do") {
    newStatus = "To Do";
  } else if (newLane === "in-progress") {
    newStatus = "In Progress";
  } else if (newLane === "done") {
    newStatus = "Done";
  }

  // find task in task list and update its status
  const task = taskList.find((task) => task.id === taskId);
  if (task) {
    task.status = newLane;
    localStorage.setItem("tasks", JSON.stringify(taskList)); // Correctly update task list

    //task.status = newLane;

    // save updated task list to localStorage
    //localStorage.setItem("tasks", JSON.stringify(taskList));

    // optionally, re-render the task list to reflect the status change
    renderTaskList();
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // initialize the nextId from localStorage if available
  nextId = JSON.parse(localStorage.getItem("nextId") || 1); // default to 1 if not found
  //localStorage.getItem("nextId") ? JSON.parse(localStorage.getItem("nextId")) : 1;

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
