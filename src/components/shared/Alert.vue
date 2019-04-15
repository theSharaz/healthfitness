<template>
    <v-alert
    @input="onClose"
      dismissible
      :value="true"
      color="error" type="error" error
    >
      {{text}}
      
    </v-alert>
</template>

<script>
export default {
    props: ['text'],
    methods: {
        onClose() {
            this.$emit('dismissed')
        }
    }
}
</script> 