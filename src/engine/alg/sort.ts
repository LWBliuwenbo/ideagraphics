

function swap <T>(data: T[], m: number, n: number) {
    const tmp = data[m];
    data[m] = data[n];
    data[n] = tmp
}

function moveDown <T> (data:T[], first: number, last: number)  {
    let largest = 2 * first + 1;
    while (largest <= last) {
        if(largest < last && data[largest] < data[largest + 1]){
            largest ++
        }

        if(data[first] < data[largest] ){
            swap(data, first, largest)
            first = largest;
            largest = 2* first + 1;
        }else {
            largest = last + 1
        }
    }
}

export function heapSort<T>(data: T[]) {
    const length = data.length;
    for(let i = length/2 - 1; i>=0; --i){
        moveDown(data, i, length-1)
    }

    for (let i = length -1;  i >= 1; --i) {
        swap(data,0,i)
        moveDown(data, 0, i-1)
    }
}

export function quicksort_method <T> (data: T[], first: number, last: number ){
    let lower = first + 1;
    let upper = last;
    swap(data,first, (first + last)/2)
    let   bound = data[first];

    while(lower < upper){
        while (data[lower] < bound) {
            lower++ 
        }
        while (bound < data[upper]) {
            upper--
        }

        if(lower < upper){
            swap(data,lower++, upper--)
        }else {
            lower++
        }
    }

    swap(data, upper, first)

    if(first < upper - 1){
        quicksort_method(data, first, upper-1)
    }
    if(upper+1 < last){
        quicksort_method(data, upper+1, last)
    }
}

export function quicksort<T>(data: T[]){
    const length = data.length;

    if(length < 2){ return }
    let i, max;
    for ( i = 0, max = 0;  i < length; i++) {
        if(data[max] < data[i]){
            max = i;
        }
    }
    swap(data, length-1, max)
    quicksort_method(data, 0, length-2);
}