<template>
    <div class="vec3-input">
        <span>X</span>
        <el-input v-model="vec3value.x" @change="vec3Change"></el-input>
        <span>Y</span>
        <el-input v-model="vec3value.y" @change="vec3Change"></el-input>        
        <span>Z</span>
        <el-input v-model="vec3value.z" @change="vec3Change"></el-input>
    </div>
</template>

<script setup lang="ts">
import { Vec3 } from '@/engine/math/Vector';
import {ref, toRef} from 'vue'
    interface Props {
        modelValue: Vec3
    }
    
    const props = defineProps<Props>()
    
    const modelValue = toRef(props, 'modelValue')

    const emit = defineEmits(["update:modelValue", "change"])

    const vec3value = ref(modelValue.value)

    const vec3Change = () => {
        emit('update:modelValue', vec3value.value)
        emit('change', vec3value.value)
    }

</script>