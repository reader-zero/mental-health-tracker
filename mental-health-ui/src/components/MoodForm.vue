<template>
  <div class="mood-form">
    <h2>Mood Check-in</h2>
    <input v-model="name" placeholder="Your name" />
    <textarea v-model="mood" :disabled="isLoading" placeholder="How are you feeling today?"></textarea>
    
    <button @click="submitMood" :disabled="isLoading || !mood">
      {{ isLoading ? '🤖 AI is thinking...' : 'Submit Mood' }}
    </button>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <div v-if="aiMessage" class="ai-response">
      <h3>AI Advisor says:</h3>
      <p>{{ aiMessage }}</p>
    </div>

    <hr />

    <div class="history-section">
      <h3>Recent Mood History</h3>
      <div v-for="entry in history" :key="entry.id" class="history-card">
        <p><strong>{{ entry.full_name }}:</strong> {{ entry.mood_text }}</p>
        <p class="ai-small"><em>AI: {{ entry.ai_message }}</em></p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      name: '',
      mood: '',
      aiMessage: '',
      history: [],      // To store the history list
      isLoading: false, // For the loading spinner
      errorMessage: ''  // For Error UI
    };
  },
  methods: {
    async fetchHistory() {
      try {
        const res = await api.get('/api/moods');
        this.history = res.data;
      } catch (error) {
        console.error("History Error:", error);
      }
    },
    async submitMood() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const res = await api.post('/api/moods', {
          user_id: 1, 
          mood_text: this.mood
        });

        this.aiMessage = res.data.aiMessage;
        this.mood = ''; 
        
        // Refresh the history list after a new post
        this.fetchHistory(); 
      } catch (error) {
        this.errorMessage = "Connection Error: Is the Lab 4 server running?";
      } finally {
        this.isLoading = false;
      }
    }
  },
  // This runs as soon as the page loads
  mounted() {
    this.fetchHistory();
  }
};
</script>

<style scoped>
.mood-form { display: flex; flex-direction: column; max-width: 450px; margin: auto; gap: 10px; text-align: left; }
textarea { height: 100px; padding: 10px; }
button:disabled { background: #ccc; cursor: not-allowed; }

.ai-response { margin-top: 20px; padding: 15px; background: #f0f4f8; border-radius: 8px; border-left: 5px solid #007bff; }
.error-msg { color: #721c24; background-color: #f8d7da; padding: 10px; border-radius: 4px; border: 1px solid #f5c6cb; }

.history-section { margin-top: 30px; }
.history-card { padding: 10px; border-bottom: 1px solid #eee; background: #fafafa; margin-bottom: 5px; }
.ai-small { font-size: 0.85rem; color: #555; margin-top: 5px; }
</style>