<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView v-slot="{ Component, route }">
      <KeepAlive :include="['TorrentListView']">
        <component :is="Component" :key="route.fullPath" />
      </KeepAlive>
    </RouterView>
  </div>
</template>

<script>
import { KeepAlive } from 'vue'
import { RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    RouterView,
    KeepAlive
  }
}
</script>