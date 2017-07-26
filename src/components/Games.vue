<template>
	<div id="game"></div>
</template>
<script type="text/ecmascript-6">
	import {mapActions} from 'vuex';
	export default {
		data(){
			return {

			}
		},
		mounted(){
			this.start(this.$route.params.gameName);
		},
		created(){

		},
		methods: {
			...mapActions([
				'start'
			])
		}
	}
</script>
<style lang="scss">

</style>
