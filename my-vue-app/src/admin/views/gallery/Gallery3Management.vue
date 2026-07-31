<script setup lang="ts">
import {
  getGallery3List,
  createGallery3,
  updateGallery3,
  deleteGallery3,
} from '@/shared/api/gallery'
import GenericGalleryManagement from './GenericGalleryManagement.vue'

const api = {
  getList: getGallery3List,
  create: createGallery3,
  update: updateGallery3,
  delete: deleteGallery3,
}
</script>

<template>
  <GenericGalleryManagement label="图片组3" :api="api" />
</template>
