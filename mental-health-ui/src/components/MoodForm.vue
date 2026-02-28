<template>
  <div class="mood-form">
    <h2>Mood Check-in</h2>
    
    <label for="user-name">Full Name:</label>
    <input id="user-name" v-model="name" placeholder="Enter your full name" />
    
    <label for="mood-text">How are you feeling today?</label>
    <textarea id="mood-text" v-model="mood" :disabled="isLoading" placeholder="Describe your mood..."></textarea>
    
    <button @click="submitMood" :disabled="isLoading || !mood || !name">
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
      history: [],      
      isLoading: false, 
      errorMessage: ''  
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
        // UPDATED: Sending 'full_name' using the 'this.name' data property
        const res = await api.post('/api/moods', {
          full_name: this.name, 
          mood_text: this.mood
        });

        this.aiMessage = res.data.aiMessage;
        
        // Clear the mood text area but keep the name for the next entry
        this.mood = ''; 
        
        // Refresh the history list to show the new entry with the correct name
        this.fetchHistory(); 
      } catch (error) {
        this.errorMessage = "Connection Error: Is the Lab 4 server running?";
        console.error("Submit Error:", error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchHistory();
  }
};
</script>

<style scoped>
.mood-form { display: flex; flex-direction: column; max-width: 450px; margin: auto; gap: 10px; text-align: left; }
input, textarea { padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
textarea { height: 100px; }
button { padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:disabled { background: #ccc; cursor: not-allowed; }

.ai-response { margin-top: 20px; padding: 15px; background: #f0f4f8; border-radius: 8px; border-left: 5px solid #007bff; }
.error-msg { color: #721c24; background-color: #f8d7da; padding: 10px; border-radius: 4px; border: 1px solid #f5c6cb; }

.history-section { margin-top: 30px; }
.history-card { padding: 10px; border-bottom: 1px solid #eee; background: #fafafa; margin-bottom: 5px; border-radius: 4px; }
.ai-small { font-size: 0.85rem; color: #555; margin-top: 5px; }
</style>