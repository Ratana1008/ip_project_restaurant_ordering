<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validateLogin } from '@/utils/validation'
import { errorMessage } from '@/utils/errorMessage'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

// State owned here: the form fields, which fields were touched, and the form-level error.
const email = ref('')
const password = ref('')
const touched = reactive({ email: false, password: false })
const submitted = ref(false)
const formError = ref('')
const busy = ref(false)

const errors = computed(() => validateLogin(email.value, password.value))
// A message shows after the field was left once, or after a submit attempt.
const emailError = computed(() => (touched.email || submitted.value ? errors.value.email : ''))
const passwordError = computed(() =>
  touched.password || submitted.value ? errors.value.password : '',
)

async function onSubmit() {
  submitted.value = true
  formError.value = ''
  if (errors.value.email || errors.value.password) return
  busy.value = true
  try {
    await auth.login(email.value)
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/menu')
  } catch (e) {
    formError.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <h1>Log in</h1>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>

    <div class="field">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        :aria-invalid="!!emailError"
        aria-describedby="email-error"
        @blur="touched.email = true"
      />
      <p v-if="emailError" id="email-error" class="field-error">{{ emailError }}</p>
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        :aria-invalid="!!passwordError"
        aria-describedby="password-error"
        @blur="touched.password = true"
      />
      <p v-if="passwordError" id="password-error" class="field-error">{{ passwordError }}</p>
    </div>

    <button type="submit" :disabled="busy">{{ busy ? 'Logging in…' : 'Log in' }}</button>
  </form>
  <p class="muted">
    Demo accounts (any password of 8+ characters): sokha@example.com (customer),
    vanna@example.com (chef), ratana@example.com (admin).
  </p>
</template>
