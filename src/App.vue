<template>
  <div class="container mx-auto p-4">
    
    <!-- создание стадии -->
    <div class="mb-4">
      <input v-model="state.newstagename" type="text" placeholder="введите название стадии" class="p-2 border">
      <button @click="createstage" class="p-2 bg-blue-500 text-white">добавить стадию</button>
    </div>

    <!-- стадии -->
    <div class="flex space-x-4">
      <div v-for="stage in state.stages" :key="stage.id" class="border p-4">
        <h2 class="text-4xl text-black font-bold">{{ stage.name }}</h2>
        <!-- задачи -->
        <div v-for="task in stage.tasks" :key="task.id" class="bg-gray-100 p-2 mt-2">
          <div>{{ task.name }}</div>
          <button @click="showTask(task)" class="p-2 bg-yellow-500 text-white">показать</button>
          <button @click="deletetask(stage, task)" class="p-2 bg-red-500 text-white">удалить</button>
        </div>
        <!-- добавление задачи -->
        <div class="mt-4">
          <button @click="openAddTaskPopup(stage)" class="p-2 bg-green-500 text-white">добавить задачу</button>
        </div>
        <!-- удаление стадии -->
        <button @click="deletestage(stage)" class="p-2 bg-red-500 text-white">удалить стадию</button>
      </div>
    </div>

    <!-- попап окно для добавления задачи -->
    <div v-if="state.showAddTaskPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="p-4 bg-white">
        <h3 class="text-2xl">Добавление задачи</h3>
        <input v-model="state.newtaskname" type="text" placeholder="Название задачи" class="p-2 border my-2">
        <textarea v-model="state.newtaskdescription" placeholder="Описание задачи" class="p-2 border my-2"></textarea>
        <div class="flex justify-end">
          <button @click="addTask" class="p-2 bg-green-500 text-white">Добавить</button>
          <button @click="closeAddTaskPopup" class="p-2 bg-red-500 text-white">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- попап окно для просмотра задачи -->
    <div v-if="state.showTaskPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="p-4 bg-white">
        <h3 class="text-2xl">{{ state.selectedTask.name }}</h3>
        <p>{{ state.selectedTask.description }}</p>
        <div class="flex justify-end">
          <button @click="closeTaskPopup" class="p-2 bg-blue-500 text-white">Закрыть</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'app',
  setup() {
    const state = reactive({
      stages: [],
      newstagename: '',
      newtaskname: '',
      newtaskdescription: '',
      showAddTaskPopup: false,
      showTaskPopup: false,
      selectedTask: null,
    });

    // создание стадии
    const createstage = () => {
      const newstage = {
        id: Date.now(), // генерируем уникальный id
        name: state.newstagename,
        tasks: [],
      };
      state.stages.push(newstage);
      state.newstagename = '';
    };

    // добавление задачи
    const openAddTaskPopup = (stage) => {
      state.showAddTaskPopup = true;
      state.newtaskname = '';
      state.newtaskdescription = '';
      state.selectedStage = stage;
    };

    const addTask = () => {
      const newtask = {
        id: Date.now(), // генерируем уникальный id
        name: state.newtaskname,
        description: state.newtaskdescription,
      };
      state.selectedStage.tasks.push(newtask);
      state.newtaskname = '';
      state.newtaskdescription = '';
      state.showAddTaskPopup = false;
    };

    const closeAddTaskPopup = () => {
      state.showAddTaskPopup = false;
    };

    // показать задачу
    const showTask = (task) => {
      state.selectedTask = task;
      state.showTaskPopup = true;
    };

    const closeTaskPopup = () => {
      state.showTaskPopup = false;
    };

    // удаление задачи
    const deletetask = (stage, task) => {
      const index = stage.tasks.indexOf(task);
      if (index > -1) {
        stage.tasks.splice(index, 1);
      }
    };

    // удаление стадии
    const deletestage = (stage) => {
      const index = state.stages.indexOf(stage);
      if (index > -1) {
        state.stages.splice(index, 1);
      }
    };

    return {
      state,
      createstage,
      openAddTaskPopup,
      addTask,
      closeAddTaskPopup,
      showTask,
      closeTaskPopup,
      deletetask,
      deletestage,
    };
  },
};
</script>

<style>
</style>