<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const quizOptions = ref({
  subject: '',
  difficulty: 'medium',
  duration: 30,
  numberOfQuestions: 10,
});

const isLoading = ref(false);
const router = useRouter();

const handleCreate = async () => {
  isLoading.value = true;

  try {
    // Generate quiz questions using the API
    const response = await fetch('/api/quiz-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizOptions.value),
    });
    const generatedQuiz = await response.json();

    if (!response.ok) {
      throw new Error(generatedQuiz.error || 'Failed to generate quiz.');
    }

    // Append the new quiz to the JSON file (mocking this behavior)
    const newQuiz = {
      id: Date.now().toString(), // Mock ID generation
      title: `${quizOptions.value.subject} Quiz`,
      subject: quizOptions.value.subject,
      difficulty: quizOptions.value.difficulty,
      duration: quizOptions.value.duration,
      questions: generatedQuiz,
    };

    console.log('New quiz generated:', newQuiz);

    // Navigate back to the quiz list
    router.push('/quiz');
  } catch (error) {
    console.error('Error creating quiz:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
