AI Car Simulation
A self-driving car simulation built with Python, Pygame, and NEAT (NeuroEvolution of Augmenting Topologies). The AI learns to navigate a 2D track using evolved neural networks, with cars that sense their environment via radar-like beams and improve their driving over successive generations.

 Demo

Cars navigate a 2D top-down map. Each generation, the weakest drivers are eliminated and the best are used to breed and mutate a smarter next generation.


How It Works
Each car is controlled by a neural network. The network takes in sensor readings (distances to track borders) and outputs steering and speed decisions.

Sensors: Each car casts multiple rays outward. When a ray hits a wall, the distance is fed into the neural network as input.
Fitness: Cars are rewarded for traveling farther and staying on track longer.
NEAT: The NEAT algorithm evolves the neural network's topology and weights over generations — no manual architecture needed.

Evolution Loop
Start Generation
    ↓
Spawn N cars with different neural networks
    ↓
Cars drive, collect fitness scores
    ↓
Eliminate poor performers
    ↓
Crossover + mutate top performers → new generation
    ↓
Repeat until a car completes the track

Project Structure
car-simulation/
├── newcar.py          # Main simulation file (car logic, Pygame loop, NEAT integration)
├── config.txt         # NEAT algorithm hyperparameter configuration
├── map.png            # Track map 1
├── map2.png           # Track map 2
├── map3.png           # Track map 3
├── map4.png           # Track map 4
├── map5.png           # Track map 5
└── car.png            # Car sprite image

Requirements

Python 3.7+
Pygame
neat-python

Install dependencies:
bashpip install pygame neat-python

Getting Started
1. Clone the repository
bashgit clone https://github.com/ashwin1603/AI_APP.git
cd AI_APP/car-simulation
2. Run the simulation
bashpython newcar.py
The simulation window will open. You will see multiple cars spawned on the map, each controlled by a different neural network. Over generations, they will progressively learn to navigate the track better.

Switching Maps
The project includes 5 track maps (map.png through map5.png). To switch the active map, update the map filename in newcar.py:
python# Example: change "map.png" to "map3.png"
game_map = pygame.image.load('map3.png')

Configuration (config.txt)
The config.txt file controls all NEAT hyperparameters. Key settings:
ParameterDescriptionpop_sizeNumber of cars per generationfitness_thresholdTarget fitness score to stop evolutionnum_inputsNumber of sensor rays per carnum_outputsNumber of output actions (e.g., speed, angle)mutation_rateProbability of weight mutationactivation_defaultDefault neuron activation function
Tweak these values to experiment with learning speed and behaviour.

Controls
KeyActionQ / Close windowQuit the simulation

The simulation runs autonomously — no manual driving needed.


What to Observe

Generation counter: Shown on screen, increments as populations evolve.
Car count: Number of alive cars drops as poor performers crash.
Fitness: Cars that go farther around the track score higher fitness.
Convergence: After several generations, the best cars will reliably complete laps.


Customisation Ideas

Add more/fewer sensor rays to change car perception
Design your own map images (black track on white background)
Increase pop_size for faster convergence at the cost of more compute
Visualise the neural network structure using neat-python's built-in visualisation tools


References

NEAT-Python Documentation
NEAT Original Paper — Stanley & Miikkulainen (2002)
Pygame Documentation
Original simulation concept inspired by NeuralNine


📄 License
This project is part of the AI_APP repository. See the root repository for license details.
