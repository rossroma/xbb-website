<template>
  <div v-if="adsList.length > 0" class="ads-banner">
    <el-carousel :interval="5000" arrow="always" height="400px">
      <el-carousel-item v-for="item in adsList" :key="item.id">
        <a
          :href="item.url || '#'"
          :target="item.target || '_blank'"
          class="banner-link"
        >
          <img
            :src="item.simg"
            :alt="item.title"
            class="banner-image"
          />
          <div v-if="item.title || item.descs" class="banner-content">
            <h2 v-if="item.title" class="banner-title">{{ item.title }}</h2>
            <p v-if="item.descs" class="banner-desc">{{ item.descs }}</p>
          </div>
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getClientAds, type Ads } from '@/shared/api/ads'

interface Props {
  position: number
}

const props = defineProps<Props>()
const adsList = ref<Ads[]>([])

const fetchAds = async () => {
  try {
    adsList.value = await getClientAds(props.position)
  } catch (error) {
    console.error('获取广告失败:', error)
  }
}

onMounted(() => {
  fetchAds()
})
</script>

<script lang="ts">
export default {
  name: 'AdsBanner'
}
</script>

<style scoped>
.ads-banner {
  width: 100%;
  margin-bottom: 2rem;
}

.banner-link {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  text-decoration: none;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  padding: 2rem;
}

.banner-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.banner-desc {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.5);
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
