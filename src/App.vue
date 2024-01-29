<template>
  <div class="container mx-auto p-4">
    
    <div class="mb-4">
      <input v-model="state.newStageName" type="text" placeholder="Введите название стадии" class="p-2 border">
      <button @click="createStage" class="p-2 bg-blue-500 text-white">Добавить стадию</button>
    </div>

    <div class="flex flex-wrap space-x-4 min-h-94">
      <div v-for="stage in state.stages" :key="stage.id" class="border p-4 flex flex-col gap-3" @drop="handleTaskDrop(stage)">
        <h2 class="text-4xl text-black font-bold">{{ stage.name }}</h2>
        
        <draggable v-model="stage.tasks" @end="event => handleTaskDrag(event, stage)">
          <template v-slot:item="{element}">
            <div class="bg-gray-100 p-2 mt-2" @dragstart="draggedTask = element; draggedStage = stage">
              <div class="pb-2">{{ element.name }}</div>
              <button @click="showTask(element)" class="p-2 bg-yellow-500 text-white">Показать</button>
              <button @click="deleteTask(stage, element)" class="p-2 bg-red-500 text-white">Удалить</button>
            </div>
          </template>
        </draggable>
        
        <div class="mt-4">
          <button @click="openAddTaskPopup(stage)" class="p-2 bg-green-500 text-white">Добавить задачу</button>
        </div>
        
        <button @click="deleteStage(stage)" class="p-2 bg-red-500 text-white">Удалить стадию</button>
      </div>
    </div>

    <div v-if="state.showAddTaskPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="p-4 bg-white flex flex-col">
        <h3 class="text-2xl">Добавление задачи</h3>
        <input v-model="state.newTaskName" type="text" placeholder="Название задачи" class="p-2 border my-2">
        <textarea v-model="state.newTaskDescription" placeholder="Описание задачи" class="p-2 border my-2"></textarea>
        <div class="flex justify-end">
          <button @click="addTask" class="p-2 bg-green-500 text-white">Добавить</button>
          <button @click="closeAddTaskPopup" class="p-2 bg-red-500 text-white">Закрыть</button>
        </div>
      </div>
    </div>

    <div v-if="state.showTaskPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="p-4 bg-white flex flex-col gap-2">
        <h3 class="text-2xl">{{ state.selectedTask.name }}</h3>
        <p>{{ state.selectedTask.description }}</p>
        <div class="flex justify-end">
          <button @click="editTaskDescription(state.selectedTask)" class="p-2 bg-yellow-500 text-white">Редактировать описание</button>
          <button @click="closeTaskPopup" class="p-2 bg-blue-500 text-white">Закрыть</button>
        </div>
      </div>
    </div>

    <div v-if="state.showEditTaskDescriptionPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="p-4 bg-white flex flex-col">
        <h3 class="text-2xl">Редактирование описания задачи</h3>
        <textarea v-model="state.editTaskDescription" class="p-2 border my-2"></textarea>
        <div class="flex justify-end">
          <button @click="updateTaskDescription" class="p-2 bg-green-500 text-white">Сохранить</button>
          <button @click="closeEditTaskDescriptionPopup" class="p-2 bg-red-500 text-white">Закрыть</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { reactive } from 'vue';
import draggable from 'vuedraggable';

export default {
  name: 'app',
  components: {
    draggable,
  },
  setup() {
    const state = reactive({
      stages: [],
      newStageName: '',
      newTaskName: '',
      newTaskDescription: '',
      showAddTaskPopup: false,
      showTaskPopup: false,
      selectedTask: null,
      selectedStage: null,
      draggedTask: null,
      draggedStage: null,
      showEditTaskDescriptionPopup: false,
      editTaskDescription: '',
      selectedTaskForEdit: null,
    });

    const createStage = () => {
      const newStage = {
        id: Date.now(),
        name: state.newStageName,
        tasks: [],
      };
      state.stages.push(newStage);
      state.newStageName = '';
    };

    const openAddTaskPopup = (stage) => {
      state.showAddTaskPopup = true;
      state.selectedStage = stage;
    };

    const addTask = () => {
      const newTask = {
        id: Date.now(),
        name: state.newTaskName,
        description: state.newTaskDescription,
      };
      state.selectedStage.tasks.push(newTask);
      state.newTaskName = '';
      state.newTaskDescription = '';
      state.showAddTaskPopup = false;
    };

    const closeAddTaskPopup = () => {
      state.showAddTaskPopup = false;
    };

    const showTask = (task) => {
      state.selectedTask = task;
      state.showTaskPopup = true;
    };

    const closeTaskPopup = () => {
      state.showTaskPopup = false;
    };

    const deleteTask = (stage, task) => {
      const index = stage.tasks.indexOf(task);
      if (index > -1) {
        stage.tasks.splice(index, 1);
      }
    };

    const deleteStage = (stage) => {
      const index = state.stages.indexOf(stage);
      if (index > -1) {
        state.stages.splice(index, 1);
      }
    };

    const handleTaskDrag = (event, currentStage) => {
      const draggedTask = event.item;
      const oldStage = state.stages.find(stage => stage.tasks.includes(draggedTask));
      const newStage = currentStage;

      if (oldStage && newStage && oldStage !== newStage) {
        const index = oldStage.tasks.findIndex(task => task === draggedTask);
        if (index !== -1) {
          oldStage.tasks.splice(index, 1);
          newStage.tasks.push(draggedTask);
        }
      }
    };

    const handleTaskDrop = (newStage) => {
      if (state.draggedTask && state.draggedStage !== newStage) {
        const index = state.draggedStage.tasks.indexOf(state.draggedTask);
        if (index !== -1) {
          const task = state.draggedStage.tasks.splice(index, 1)[0];
          newStage.tasks.push(task);
        }
      }
      state.draggedTask = null;
      state.draggedStage = null;
    };
    const editTaskDescription = (task) => {
      state.selectedTaskForEdit = task;
      state.editTaskDescription = task.description;
      state.showEditTaskDescriptionPopup = true;
    };

    const updateTaskDescription = () => {
      state.selectedTaskForEdit.description = state.editTaskDescription;
      state.showEditTaskDescriptionPopup = false;
    };

    const closeEditTaskDescriptionPopup = () => {
      state.showEditTaskDescriptionPopup = false;
    };

    return {
      state,
      createStage,
      openAddTaskPopup,
      addTask,
      closeAddTaskPopup,
      showTask,
      closeTaskPopup,
      deleteTask,
      deleteStage,
      handleTaskDrag,
      handleTaskDrop,
      editTaskDescription,
      updateTaskDescription,
      closeEditTaskDescriptionPopup
    };
  },
};
</script>

<style>
</style>