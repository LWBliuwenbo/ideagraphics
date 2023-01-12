<template>
    <el-color-picker v-model="colorvalue" color-format="rgb" @change="colorChange"></el-color-picker>
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

    const colorvalue = ref(modelValue.value.toRgb())

    const colorChange = (value:string|null) => {
        if(value != null){
            const vec3value = Vec3.rgbToVec3(value)
            emit('update:modelValue', vec3value)
            emit('change', vec3value)
        }
    }

</script>