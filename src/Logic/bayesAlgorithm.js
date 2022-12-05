export function normpdf(x, mean, std) {
    var exp = Math.pow(((x - mean) / std), 2) * -1 * 0.5
    return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.pow(Math.E, exp);
}

export function calculateMeanVariance(data) {
    let mean = 0;
    for (let i = 0; i < data.length; i++) {
        mean += data[i];
    }
    mean /= data.length;

    let variance = 0;
    for (let i = 0; i < data.length; i++) {
        variance += Math.pow((data[i] - mean), 2);
    }

    variance /= data.length - 1;

    console.log(mean);
    console.log(Math.sqrt(variance));

    return [ mean, variance ];
}

function getProbability(inputs, mean, std) {
    let prob = 0;
    for (let i = 0; i < inputs.length; i++) {
        prob += Math.log(normpdf(inputs[i], mean, std));
    }
    return prob;
}

export function determineUserBayes(distributions, inputs) {
    let isValidated = 0;

    let probUser = getProbability(inputs, distributions[0][0], Math.sqrt(distributions[0][1]));
    console.log("User = " + probUser);
    for (let i = 1; i < distributions.length; i++) {
        let probBot = getProbability(inputs, distributions[i][0], Math.sqrt(distributions[i][1]));
        let ratio = probUser - probBot;
        console.log(ratio);
        console.log(probBot);
        if (ratio > 0) {
            isValidated += 1;
            console.log("Validated against " + i);
        }
    }

    return isValidated > (distributions.length / 2) ? 0 : 1;
}