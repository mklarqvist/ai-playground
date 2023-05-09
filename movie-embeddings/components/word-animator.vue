<template>
   <div class="word-animator">
    <span class="text-progress" :class="{'animate-[cursorBlink_600ms_ease-in-out_infinite_alternate]': isRunning, 'text-finished': isFinished}">{{ animatedWord }}</span>
  </div>
</template>

<script setup>
import { watchEffect } from "vue";

const props = defineProps({
  inputText: String,
});

const animatedWord = ref("");
const isRunning = ref(false)
const isFinished = ref(false)

const animateText = (text) => {
    isRunning.value = true
    isFinished.value = false
  animatedWord.value = "";
  const animationSpeed = 2; // 2 milliseconds per character
  let charIndex = 0;

  const intervalId = setInterval(() => {
    animatedWord.value += text[charIndex];
    charIndex++;

    if (charIndex >= text.length) {
      clearInterval(intervalId);
      isRunning.value = false
      isFinished.value = true
    }
  }, animationSpeed);
};

watchEffect(() => {
  if (props.inputText) {
    animateText(props.inputText);
  }
});
</script>

<style lang="scss" scoped>
.text-progress {
  white-space: pre-wrap;
  font-size: 1rem;
  line-height: 130%;
  letter-spacing: 0;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  border-right: 12px solid #000;
background-color: rgba(0, 0, 0, 0.2);
transition: background-color .2s ease-in-out;
}
.animate-\[cursorBlink_600ms_ease-in-out_infinite_alternate\] {
  -webkit-animation: cursorBlink .6s ease-in-out infinite alternate;
  animation: cursorBlink .6s ease-in-out infinite alternate;
}

.text-finished {
    border: none;
    background-color: transparent;
}

@-webkit-keyframes cursorBlink {
 0% {
  border-right-color:initial
 }
 to {
  border-right-color:transparent
 }
}
@keyframes cursorBlink {
 0% {
  border-right-color:initial
 }
 to {
  border-right-color:transparent
 }
}

</style>