<script setup lang="ts">
import {
  getGallery2List,
  createGallery2,
  updateGallery2,
  deleteGallery2,
} from '@/shared/api/gallery'
import GenericGalleryManagement from './GenericGalleryManagement.vue'

const api = {
  getList: getGallery2List,
  create: createGallery2,
  update: updateGallery2,
  delete: deleteGallery2,
}
</script>

<template>
  <GenericGalleryManagement label="图片组2" :api="api" />
</template>
