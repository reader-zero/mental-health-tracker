<template>
  <div id="app">
    <h1>Wellness AI Tracker</h1>
    <MoodForm />
  </div>
</template>

<script>
import MoodForm from './components/MoodForm.vue';

export default {
  components: {
    MoodForm
  }
};
</script>

<style>
#app { font-family: Avenir, Helvetica, Arial, sans-serif; text-align: center; color: #2c3e50; margin-top: 60px; }
</style>