export class Designer {
    constructor(components) {
        this.components = components;
        this.leftOverComponents = [];
        this.fitnessHistory = [];

        this.environment = {
            maxPageSize: 1016,
            maxPopulation: 1000,
            marginOfComfort: 10,
            allowedGenerations: 1000
        };

    }


    /**
     *  Gets a perfectly evolved document
     */

    createDocument() {
        let allPages = [this.getBestPage(this.components)[0]];

        while (this.components.length > 0) {
            let nextPage = this.getBestPage(this.components);

            /* If no perfect solution is found */
            if (!nextPage){
                this.environment.marginOfComfort = Math.max(...this.components) - Math.min(...this.components);
                allPages.push(this.getBestPage(this.components)[0]);
            }else{
                allPages.push(nextPage[0]);
            }
        }

        return allPages;
    }


    /**
     *  Gets a perfectly evolved page
     * 
     *  @param {Object[]} components - Components to use for the page
     */

    getBestPage(components) {
        let generation = this.createGeneration(this.environment.maxPopulation, components),
            componentCopy = components.slice(0);

        for (let i = 0; i < this.environment.allowedGenerations; i++) {
            let perfect = true;

            generation = this.evolve(generation, componentCopy);
            this.fitnessHistory.push(this.generationFitness(generation));

            if (generation[0].size > this.environment.maxPageSize) perfect = false;

            if (perfect) {
                console.log('Perfect solution found', generation[0]);

                /*- Repopulate components from the leftovers of the fittest individual -*/
                this.components = this.getLeftOvers(generation[0].parts);
                return generation;
            }
        }

        return false;
    }


    /**
     *  Gets components left over from a page
     * 
     *  @param {number[]} parts - The page's components
     */

    getLeftOvers(parts) {
        let componentCopy = this.components.slice(0);

        for (let part of parts) {
            componentCopy.splice(componentCopy.indexOf(part), 1);
        }

        return componentCopy;
    }


    /**
     *  Creates a generation of possible page options
     *  
     *  @param {number} individuals - Number of individuals in generation
     *  @param {Object[]} components - Components to use for page creation
     */

    createGeneration(individuals, components) {
        let generation = [];

        for (let i = 0; i < individuals; i++) {
            generation.push(this.getPage(components.slice(0)));
        }

        return generation;
    }


    /**
     *  Get the fitness of an entire generation
     * 
     *  @param {Object[]} generation - Generation to get the fitness for
     */

    generationFitness(generation) {
        let summed = 0;

        for (let individual of generation) {
            summed += this.pageFitness(individual.size);
        }

        return summed / generation.length;
    }


    /**
     *  Creates a page full of components
     *  
     *  @param {number[]} components - Components to create a page from
     */

    getPage(components) {
        let page = { size: 0, parts: [] },
            componentCopy = components.slice(0),
            comfortablePageSize = this.environment.maxPageSize - this.environment.marginOfComfort;

        while (page.size < comfortablePageSize && componentCopy.length > 0) {
            let randomComponent = this.getRandomComponent(componentCopy);
            page.parts.push(randomComponent.part);
            page.size += randomComponent.part;

            componentCopy.splice(randomComponent.index, 1);
        }

        return page;
    }


    /**
     *  Get the fitness of a page
     * 
     *  @param {number} size - Page size to get fitness for
     */

    pageFitness(size) {
        return Math.abs(this.environment.maxPageSize - size);
    }


    /**
     *  Get a random component from list
     * 
     *  @param {number[]} components - Components to choose from
     */

    getRandomComponent(components) {
        let max = components.length,
            randomIndex = Math.floor(Math.random() * (max - 1));

        return { index: randomIndex, part: components[randomIndex] };
    }


    /**
     *  Generates a population from the genetically inferior members
     *  of the generation based on a small chance
     * 
     *  @param {Object[]} inferiorIndividuals - The "losing" end of the current generation
     *  @param {number} inferiorityRetention - Number of probability to decide inclusion
     */

    inferiorPopulation(inferiorIndividuals, inferiorityRetention) {
        let inferiors = [];

        for (let individual of inferiorIndividuals) {
            if (inferiorityRetention > Math.random()) {
                inferiors.push(individual);
            }
        }

        return inferiors;
    }


    /**
     *  Create crossovered children for the next generation
     * 
     *  @param {number} generationLength - The desired number of individuals for the next generation
     *  @param {Object[]} nextGeneration - The current next generation
     */

    children(generationLength, nextGeneration) {
        let neededLength = generationLength - nextGeneration.length,
            children = [];

        while (children.length < neededLength) {
            let fatherHalf = Math.floor(Math.random() * (nextGeneration.length - 1)),
                motherHalf = Math.floor(Math.random() * (nextGeneration.length - 1));

            if (fatherHalf != motherHalf) {
                let father = nextGeneration[fatherHalf],
                    mother = nextGeneration[motherHalf],
                    halfwayPoint = Math.floor(father.parts.length / 2),
                    child = { size: 0, parts: [] };

                if (mother.parts.length > halfwayPoint) {
                    child.parts = father.parts.slice(0, halfwayPoint).concat(mother.parts.slice(halfwayPoint)),
                        child.size = child.parts.reduce((prev, current) => { return prev + current }, 0);

                    children.push(child);
                }
            }
        }

        return children;
    }


    /**
     *  Performs an evolutionary cycle for a generation
     * 
     *  @param {Object[]} generation - Generation to evolve
     *  @param {number[]} components - Components to evolve from
     *  @param {number} superiorityRetention - Value to determine retention of genetic winners
     *  @param {number} inferiorityRetention - Value to determine retention of genetic losers
     *  @param {number} mutationProbability - Probabilty of a mutation happening
     */

    evolve(generation, components, superiorityRetention = 0.2, inferiorityRetention = 0.2, mutationProbability = 0.01) {
        let sortedByFitness = generation.sort((a, b) => {
            return this.pageFitness(a.size) > this.pageFitness(b.size) ? 1 : -1;
        });

        let retentionLength = parseInt(sortedByFitness.length * superiorityRetention),
            nextGeneration = sortedByFitness.slice(0, retentionLength),
            generationRemainder = sortedByFitness.slice(retentionLength);

        /*- Add genetic inferiors -*/
        nextGeneration.push(...this.inferiorPopulation(generationRemainder, inferiorityRetention));

        /*- Add crossover children -*/
        nextGeneration.push(...this.children(generation.length, nextGeneration.slice(0)));

        /*- Mutate -*/
        if (mutationProbability > Math.random()) {
            let randomIndex = Math.floor(Math.random() * (nextGeneration.length + 1));
            nextGeneration[randomIndex] = this.getPage(components);
        }

        return nextGeneration;
    }
}