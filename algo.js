let genes = document.querySelector("#alphabet").value;
let target = document.querySelector("#word").value;
let population_size = document.querySelector("#population").value;
let mutation_probability = document.querySelector("#p_m").value;
let crossOver_probability = document.querySelector("#p_c").value;
let contador = 0;

function start() {
    genes = document.querySelector("#alphabet").value;
    target = document.querySelector("#word").value;
    population_size = document.querySelector("#population").value;
    mutation_probability = document.querySelector("#p_m").value;
    crossOver_probability = document.querySelector("#p_c").value;
    let iterations = 0;
    let population = [];
    let bestFitness = 0;
    let bestChromosome = "";
    let goodChromose = "";
    // let sumOffitness = 0;
    contador = 0;
    for (let i = 0; i < population_size; i++) {
        population.push(new initialPopulation(genes, target));
        if (population[i].fitness >= bestFitness) {
            goodChromose = bestChromosome;
            bestFitness = population[i].fitness;
            bestChromosome = population[i].chromosome;
        }
    }
    if (bestChromosome == "") {
        bestChromosome = population[Math.random() * population.length];
    }
    if (goodChromose == "") {
        goodChromose = population[Math.random() * population.length];
    }
    //console.log(population[indexBest],population[indexGood]);
    while (target != bestChromosome) {
        bestFitness = 0;
        // sumOffitness = 0;
        population = [];
        for (let i = 0; i < Math.ceil((population_size)); i++) {
            let newChromosome = crossOver(bestChromosome, goodChromose, mutation_probability, crossOver_probability, genes);
            population.push(new individual(newChromosome, target));
            // sumOffitness += population[i].fitness;
        }
        // sumOffitness = sumOffitness / population.length;       // select new parents
        // let randomFitness = Math.random() * sumOffitness;
        for (let i = 0; i < population.length; i++) {
            if (population[i].fitness >= bestFitness) {
                goodChromose = bestChromosome;
                bestFitness = population[i].fitness;
                bestChromosome = population[i].chromosome;
            }
            // if(population[i].fitness >= sumOffitness && Math.random()<=population[i].fitness){
            //     goodChromose = bestChromosome;
            //     bestChromosome = population[i].chromosome;
            // }
        }
        iterations++;
        addResults(bestChromosome, iterations, bestFitness);
    }
}

class initialPopulation {
    constructor(genes, target) {
        let gene = "";
        for (let i = 0; i < target.length; i++) {
            gene += genes[Math.floor(Math.random() * genes.length)];
        }
        this.chromosome = gene;
        this.fitness = fitness(target, this.chromosome);
        return this.chromosome;
    }
}

class individual {
    constructor(chromosome, target) {
        this.chromosome = chromosome;
        this.fitness = fitness(target, this.chromosome);
    }
}


function addResults(result, generation, fitness) {
    const screen = document.querySelector(".screen");
    let r = document.createElement("p");
    let texto = `Generation: ${generation}   \t   Result: ${result}   \t   Fitness: ${fitness}`;
    r.innerText = texto;
    setTimeout(() => {
        screen.appendChild(r);
        screen.scrollTop = screen.scrollHeight;
    }, contador);
    contador += 50;
}

function clearResults() {
    const screen = document.querySelector(".screen");
    screen.innerText = 0;
}

function fitness(target, chromosome) {
    let fitness_score = 0;
    for (let i = 0; i < target.length; i++) {
        if (target[i] == chromosome[i]) {
            fitness_score += Number(1 / (target.length));
        }
    }
    return fitness_score
}

function crossOver(chromosome1, chromosome2, p_m, p_c, genes) {
    p_m = p_m / 100;
    p_c = p_c / 100;
    let offspring = "";
    if (p_c >= Math.random()) {
        for (let i = 0; i < chromosome1.length; i++) {
            let random = Math.random();
            if (random >= 0.5) {
                offspring += chromosome1[i];
            } else if (random < 0.5 && random > p_m) {
                offspring += chromosome2[i];
            } else {
                offspring += genes[Math.floor(Math.random() * genes.length)];
            }
        }
    } else {
        if (Math.random() >= 0.5) {
            if (Math.random() < p_m) {
                chromosome1 = chromosome1.split("");
                chromosome1[Math.random() * chromosome1.length] = genes[Math.floor(Math.random() * genes.length)];
                chromosome1 = chromosome1.join("");
            }
            // chromosome1 = mutation(chromosome1,p_m,genes);
            return chromosome1
        } else {
            if (Math.random() < p_m) {
                chromosome2 = chromosome2.split("");
                chromosome2[Math.random() * chromosome2.length] = genes[Math.floor(Math.random() * genes.length)];
                chromosome2 = chromosome2.join("");
            }
            // chromosome2 = mutation(chromosome2,p_m,genes);
            return chromosome2
        }
    }
    return offspring
}

function mutation(chromosome, p_m, genes) {
    let newChromosome = ""
    for (let i = 0; i < chromosome.length; i++) {
        if (Math.random <= p_m) {
            newChromosome += genes[Math.floor(Math.random() * genes.length)]
        } else {
            newChromosome += chromosome[i];
        }
    }
    return newChromosome
}