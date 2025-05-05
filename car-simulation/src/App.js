import { useState, useEffect, useRef, useCallback } from 'react';
import Road from './components/Road';
import Car from './components/Car';
import NeuralNetwork from './components/NeuralNetwork';
import Visualizer from './components/Visualizer';
import './App.css';
import { getRandomColor } from './components/utils';

function App() {
  const [cars, setCars] = useState([]);
  const [bestCar, setBestCar] = useState(null);
  const [traffic, setTraffic] = useState([]);
  const [road, setRoad] = useState(null);
  
  const carCanvasRef = useRef(null);
  const networkCanvasRef = useRef(null);
  const animationRef = useRef(null);

  // Generate cars with optional saved brain data
  const generateCars = useCallback((N, road) => {
    const cars = Array.from({ length: N }, () => (
      new Car(road.getLaneCenter(1), 100, 30, 50, "AI")
    ));

    const bestBrain = localStorage.getItem("bestBrain");
    if (bestBrain) {
      try {
        const parsedBrain = JSON.parse(bestBrain);
        cars.forEach((car, i) => {
          car.brain = structuredClone(parsedBrain);
          if (i !== 0) NeuralNetwork.mutate(car.brain, 0.1);
        });
      } catch (e) {
        console.error("Failed to parse saved brain", e);
        localStorage.removeItem("bestBrain");
      }
    }
    
    return cars;
  }, []);

  // Update simulation state
  const updateSimulation = useCallback((time) => {
    const carCanvas = carCanvasRef.current;
    const networkCanvas = networkCanvasRef.current;
    if (!carCanvas || !networkCanvas) return;

    const carCtx = carCanvas.getContext('2d');
    const networkCtx = networkCanvas.getContext('2d');

    // Clear canvases
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

    // Update traffic
    setTraffic(prevTraffic => 
      prevTraffic.map(car => {
        car.update(road?.borders || [], []);
        return car;
      })
    );

    // Update cars and find best performer
    setCars(prevCars => {
      const updatedCars = prevCars.map(car => {
        car.update(road?.borders || [], traffic);
        return car;
      });
      
      const newBestCar = updatedCars.reduce((best, current) => 
        current.y < best.y ? current : best, updatedCars[0]);
      setBestCar(newBestCar);
      
      return updatedCars;
    });

    // Draw road and vehicles if they exist
    if (road && bestCar) {
      carCtx.save();
      carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
      
      road.draw(carCtx);
      traffic.forEach(car => car.draw(carCtx));
      
      carCtx.globalAlpha = 0.2;
      cars.forEach(car => car.draw(carCtx));
      carCtx.globalAlpha = 1;
      
      bestCar.draw(carCtx, true);
      carCtx.restore();

      // Draw neural network visualization
      networkCtx.lineDashOffset = -time / 50;
      Visualizer.drawNetwork(networkCtx, bestCar.brain);
    }
  }, [road, traffic, cars]);

  // Initialize simulation
  useEffect(() => {
    const carCanvas = carCanvasRef.current;
    const networkCanvas = networkCanvasRef.current;
    if (!carCanvas || !networkCanvas) return;
    
    // Set canvas dimensions
    carCanvas.width = 200;
    networkCanvas.width = 300;
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    
    // Create road and vehicles
    const newRoad = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
    setRoad(newRoad);
    
    // Generate cars and traffic
    const newCars = generateCars(100, newRoad);
    setCars(newCars);
    setBestCar(newCars[0]);
    
    const newTraffic = [
      [1, -100], [0, -300], [2, -300],
      [0, -500], [1, -500], [1, -700], [2, -700]
    ].map(([lane, y]) => (
      new Car(newRoad.getLaneCenter(lane), y, 30, 50, "DUMMY", 2, getRandomColor())
    ));
    setTraffic(newTraffic);

    // Animation loop
    const animate = (time) => {
      updateSimulation(time);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [generateCars, updateSimulation]); // Added updateSimulation to dependencies

  // Save best car's brain to localStorage
  const save = useCallback(() => {
    if (bestCar?.brain) {
      try {
        localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
      } catch (e) {
        console.error("Failed to save brain", e);
      }
    }
  }, [bestCar]);

  // Discard saved brain
  const discard = useCallback(() => {
    localStorage.removeItem("bestBrain");
  }, []);

  return (
    <div className="app">
      <canvas 
        id="carCanvas" 
        ref={carCanvasRef} 
        aria-label="Car simulation canvas"
      />
      <div id="verticalButtons">
        <button onClick={save} aria-label="Save neural network">💾</button>
        <button onClick={discard} aria-label="Discard saved network">🗑️</button>
      </div>
      <canvas 
        id="networkCanvas" 
        ref={networkCanvasRef} 
        aria-label="Neural network visualization"
      />
    </div>
  );
}

export default App;