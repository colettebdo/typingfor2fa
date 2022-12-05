function dotProduct(arr1, arr2) {
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        sum += arr1[i] * arr2[i];
    }
    return sum;
}


export function calculateMinDistance(xi, y) {
    let diff = [...xi]
    for (let i = 0; i < diff.length; i++) {
        diff[i] -= y;
    }
    return dotProduct(diff, diff)
}

export function determineUser(distances, numUsers, k) {
    const sortedData = distances.sort((a, b) => a[0] - b[0]);
    console.log(sortedData);
    let votes = {};
    for (let i = 0; i < numUsers; i++) {
        votes[i] = 0;
    }
    k = k % 2 == 0 ? k + 1 : k;

    for (let i = 0; i < k; i++) {
        votes[sortedData[i][1]] += 1 / sortedData[i][0];
    }

    let best = -1;
    for (let i = 0; i < numUsers; i++) {
        if (best == -1 || votes[i] > votes[best]) {
            best = i;
        }
    }
    console.log(votes);
    return best;
 }