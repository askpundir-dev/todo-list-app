let taskContainer = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(taskContainer);
const addBtn = document.querySelector("#add-task1-1");
const deleteAllTaskBtn = document.querySelector("#all-task-del");
// console.log(deleteAllTaskBtn);
addBtn.addEventListener("click", addTask);
const taskInputBox = document.querySelector("#task1-1");
// console.log(taskInputBox);
taskInputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

const container = document.querySelector(".all-task-container");
// console.log(container);

function renderUI() {
  if (taskContainer.length === 0) {
    container.classList.add("fade-out");
    setTimeout(() => {
      container.innerHTML = `
<p>No Tasks Yet!</p>
<button id="click-here">Click to add Tasks...</button>
`;
      container.classList.add("place-center");

      container.querySelector("#click-here").onclick = () => {
        taskInputBox.focus();
      };

      container.classList.remove("fade-out");
      container.classList.add("fade-in");

      // Remove fade-in after animation ends
      setTimeout(() => container.classList.remove("fade-in"), 300);
    }, 200);

    saveTasks();
    return;
  }

  //container.classList.remove("place-center");

  let containerHtml = "";
  taskContainer.sort((a, b) => b.timeStamp - a.timeStamp);
  taskContainer.forEach((task, i) => {
    console.log(typeof task.timeStamp);
    const inptId = `id${i}`;
    const html = `<div class="task-container" data-task-container-id='${
      task.timeStamp
    }'>
<input id="${inptId}" class="check-box" type="checkbox" ${
      task.checked ? "checked" : ""
    }>
<p class="text-contant">${task.text}</p>
<button class="delete-btn" data-delete-id='${
      task.timeStamp
    }'><img class="del-img" src="../assets/delete.png"></button>
</div>`;
    containerHtml += html;
    // console.log(containerHtml);
  });
  container.innerHTML = containerHtml;
  saveTasks();
}
renderUI();

// container.addEventListener("click", (event) => {
//   const taskContainerElement = event.target.closest(".task-container");
//   console.log(taskContainerElement);
//   const taskContainerId = Number(taskContainerElement.dataset.taskContainerId);
//   console.log(taskContainerId);

//   const deleteBtn = event.target.closest(".delete-btn");
//   const checkbox = event.target.closest(".check-box");
//   console.log(checkbox);
//   if (deleteBtn) {
//     deleteOnetask(taskContainerId);
//   }

//   if (event.target.classList.contains("check-box")) {
//     taskContainer.forEach((task) => {
//       if (task.timeStamp === taskContainerId) {
//         task.checked = checkbox.checked;
//         saveTasks();
//         console.log(task);
//       }
//     });
//   } else if (taskContainerElement) {
//     taskContainer.forEach((task) => {
//       if (task.timeStamp === taskContainerId) {
//         task.checked = !task.checked; // important eazy code line
//       }
//     });
//   }
//   renderUI();
// });

//OPTIMIZED THE ABOVE CODE

container.addEventListener("click", (event) => {
  const taskContainerElement = event.target.closest(".task-container");
  if (!taskContainerElement) return;

  const taskContainerId = Number(taskContainerElement.dataset.taskContainerId);
  const deleteBtn = event.target.closest(".delete-btn");
  const checkbox = event.target.closest(".check-box");

  // 🗑️ Delete case
  if (deleteBtn) {
    deleteOneTask(taskContainerId);
    return;
  }

  // Find the task once
  const task = taskContainer.find((t) => t.timeStamp === taskContainerId);
  if (!task) return;

  // ✅ Checkbox clicked
  if (checkbox) {
    task.checked = checkbox.checked;
  }
  // 📦 Task container clicked (not delete/checkbox)
  else {
    task.checked = !task.checked;
  }

  saveTasks();
  renderUI();
});

function deleteOneTask(deleteId) {
  console.log("i m deleted");
  let newTaskContainer = [];
  taskContainer.forEach((task) => {
    if (task.timeStamp !== deleteId) {
      newTaskContainer.push(task);
    }
  });
  taskContainer = newTaskContainer;
  console.log(taskContainer);
  renderUI();
}

// Helper to save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskContainer));
}

function addTask() {
  const taskInBoxValue = taskInputBox.value.trim();
  const timeStamp = Date.now();
  // console.log(timeStamp);
  if (taskInBoxValue === "") {
    taskInputBox.focus();
    return;
  } else if (taskInBoxValue !== "") {
    taskContainer.push({ text: taskInBoxValue, checked: false, timeStamp });
    taskInputBox.value = "";
    document.getElementById("to-do-tasks-1-1").classList.remove("place-center");
    // console.log(taskContainer[0].text);
    saveTasks();
    console.log(taskContainer);

    renderUI();

    // Scroll to the latest task
    // const lastTask =
    //   document.querySelector("#to-do-tasks-1-1").lastElementChild;
    // if (lastTask) lastTask.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  //or
  // const container = document.querySelector(".main-container-div");
  // container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
}

function deleteAllTask() {
  taskContainer.splice(0, taskContainer.length);
  console.log(taskContainer);
  renderUI();
}
// delete all task button
deleteAllTaskBtn.addEventListener("click", () => {
  if (taskContainer.length === 0) {
    confirmationPopUp("No tasks to delete!", false);
  } else {
    confirmationPopUp(
      "Are you sure you want to delete all tasks?",
      deleteAllTask
    );
  }
});

function confirmationPopUp(message, confirmAction) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const popup = document.createElement("div");
  popup.className = "popup";

  // Message text
  const msg = document.createElement("p");
  msg.textContent = message;
  msg.className = "para-style";
  popup.appendChild(msg);
  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Confirm";
  confirmBtn.id = "confirm-del";
  if (taskContainer.length) {
    confirmBtn.addEventListener("click", () => {
      confirmAction();
      popup.remove();
      overlay.remove();
    });
  } else {
    confirmBtn.addEventListener("click", () => {
      popup.remove();
      overlay.remove();
    });
  }

  popup.appendChild(confirmBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.id = "cancel-btn";
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => {
    popup.remove();
    overlay.remove();
  });
  popup.appendChild(cancelBtn);

  // Append popup to page
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}
