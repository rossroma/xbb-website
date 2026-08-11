<template>
  <SectionBlock spacing="default">
    <SectionHeading v-if="title" :title="title" align="center" />

    <div class="feature-overview__grid mt-12">
      <div
        v-for="(card, index) in cards"
        :key="card.title"
        class="feature-overview__card"
        :style="cardStyle(card)"
      >
        <div class="feature-overview__icon">
          <img v-if="card.icon" :src="card.icon" :alt="card.iconAlt ?? card.title" loading="lazy" />
        </div>

        <div class="feature-overview__heading-group">
          <div class="feature-overview__heading">
            <h3 class="feature-overview__title">{{ card.title }}</h3>
            <p v-if="card.description" class="feature-overview__subtitle">
              {{ card.description }}
            </p>
          </div>
        </div>

        <div class="feature-overview__content">
          <img
            v-if="card.sideImage"
            :class="['feature-overview__side-image', sideImageClass(index)]"
            :src="card.sideImage"
            :alt="card.sideImageAlt ?? ''"
            loading="lazy"
          />
          <ul class="feature-overview__list">
            <li v-for="point in card.points ?? []" :key="point">{{ point }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="ctaText && ctaHref" class="feature-overview__cta">
      <UiButton :href="ctaHref" variant="hero" color="brand" size="lg">
        {{ ctaText }}
      </UiButton>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import UiButton from '@/client/components/ui/Button.vue'

export interface AiCrmFeatureCard {
  image?: string
  icon?: string
  iconAlt?: string
  sideImage?: string
  sideImageAlt?: string
  title: string
  description?: string
  points?: string[]
}

defineProps<{
  title?: string
  cards: AiCrmFeatureCard[]
  ctaText?: string
  ctaHref?: string
}>()

function cardStyle(card: AiCrmFeatureCard): CSSProperties {
  if (!card.image) return {}

  return {
    backgroundImage: `url("${card.image}")`,
  }
}

function sideImageClass(index: number): string {
  if (index === 1) return 'feature-overview__side-image--small'
  if (index === 2) return 'feature-overview__side-image--smaller'
  return ''
}
</script>

<style scoped>
.feature-overview__grid {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.feature-overview__cta {
  display: flex;
  justify-content: center;
}

.feature-overview__card {
  width: 306px;
  height: 414px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.feature-overview__icon {
  width: 48px;
  height: 48px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}

.feature-overview__icon img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.feature-overview__title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.3;
}

.feature-overview__heading {
  flex: 0 0 auto;
  min-width: 0;
  transform: translateY(-30px);
}

.feature-overview__content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-bottom: 12px;
  padding-top: 4px;
}

.feature-overview__content .feature-overview__list {
  flex: 1;
  min-width: 0;
}

.feature-overview__side-image {
  width: 26px;
  height: auto;
  display: block;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.feature-overview__side-image--small {
  width: 32px;
}

.feature-overview__side-image--smaller {
  width: 31px;
}

.feature-overview__subtitle {
  font-size: 21px;
  color: #333;
  margin-bottom: 0;
  font-weight: 500;
  line-height: 1.45;
}

.feature-overview__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-overview__list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 15px;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.7;
}

@media (max-width: 1100px) {
  .feature-overview__grid {
    gap: 24px;
  }

  .feature-overview__card {
    width: min(306px, 100%);
  }
}

@media (max-width: 768px) {
  .feature-overview__card {
    width: min(306px, 100%);
    padding: 28px 24px;
  }

  .feature-overview__heading {
    transform: translateY(-18px);
  }

  .feature-overview__title {
    font-size: 20px;
  }

  .feature-overview__subtitle {
    font-size: 15px;
  }

  .feature-overview__list li {
    font-size: 13px;
  }
}

@media (max-width: 450px) {
}
</style>
