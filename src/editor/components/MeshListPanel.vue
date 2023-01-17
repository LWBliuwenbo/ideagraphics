<template>
    <div class="mesh-list-panel">
        <ul class="mesh-list">
            <li v-for="child in meshs" :key="child.name" @click="select(child)"
                >
                <div class="mesh-card" :class="current.id === child.id ? 'active' : ''">
                    <div class="mesh-image">
                        <img :src="child.image" alt="">
                    </div>
                    <div class="mesh-name">
                        {{ child.name }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import CubeImage from '@/assets/cube.jpg';
import SphereImage from '@/assets/sphere.jpg';


import { ref, defineEmits, toRef } from 'vue';

interface mesh {
    image: string,
    id: string,
    name: string
}
interface Props {
    modelValue: mesh
}
const props = defineProps<Props>();

const modelValue = toRef(props, 'modelValue')

const current = ref(modelValue.value)

const emit = defineEmits([
    'change',
    'update:modelValue'
])
const meshs = ref([
    {
        image: CubeImage,
        id: 'Cube',
        name: '立方体'
    },
    {
        image: SphereImage,
        id: 'Sphere',
        name: '球体'
    }
])

const select = (mesh: mesh) => {
    current.value = mesh;
    emit('update:modelValue', mesh)
    emit('change', mesh)
}
</script>

<style lang="scss">
.mesh-list-panel {
    width: 200px;
    text-align: center;
}

.mesh-card {
    box-shadow: 0 0 11px 3px #00000021;
    width: 180px;
    margin: 10px;
    box-sizing: border-box;
    border-radius: 5px;

    .mesh-name {
        height: 30px;
    }

    .mesh-image {
        img {

            width: 180px;
            height: 180px;
        }
    }

    &.active {
        color: #fff;
        background: #387bc1;
    }
}


ul.mesh-list {
    padding: 0;
    list-style: none;
}
</style>