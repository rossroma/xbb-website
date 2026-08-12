<template>
  <div
    :class="[
      'flex cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-6 transition-all duration-normal motion-reduce:transition-none motion-reduce:transform-none',
      align === 'center' ? 'flex-col items-center text-center' : 'items-end justify-between gap-6',
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
    @click="$emit('click')"
  >
    <div>
      <span
        v-if="kicker"
        class="inline-flex items-center px-3 py-1 rounded bg-brand-primary-soft text-brand-primary text-caption font-bold tracking-widest uppercase"
        >{{ kicker }}</span
      >
      <h2
        :class="[
          kicker ? 'mt-4' : '',
          '  text-h1 leading-heading max-lg:text-h2 max-md:text-h3 text-[36px] max-lg:text-h2 max-md:text-h3',
          headingClass,
        ]"
      >
        {{ title }}
      </h2>
      <p
        v-if="subtitle"
        class="mt-4 max-w-150 text-body text-text-tertiary leading-body max-lg:text-body"
      >
        {{ subtitle }}
      </p>
    </div>
    <span
      v-if="clickable && align === 'left'"
      class="text-small text-brand-primary font-semibold whitespace-nowrap"
      >查看全部 →</span
    >
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    kicker?: string
    clickable?: boolean
    align?: 'center' | 'left'
    headingClass?: string
  }>(),
  {
    align: 'center',
    clickable: false,
  },
)

defineEmits<{
  click: []
}>()
</script>
