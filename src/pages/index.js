import React, { useEffect, useRef, useState } from "react";
import * as styles from "./Index.module.scss";

import Matter from "matter-js";

const STATIC_DENSITY = 15;

const IndexPage = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  const [constraints, setContraints] = useState();
  const [scene, setScene] = useState();

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;

    let engine = Engine.create({});

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        background: "rgba(255, 0, 0, 0.5)",
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(150, 300, 300, 20, {
      isStatic: true,
      render: {
        fillStyle: "blue",
      },
    });

    const ball = Bodies.circle(150, 0, 10, {
      restitution: 0.9,
      render: {
        fillStyle: "yellow",
      },
    });

    World.add(engine.world, [floor, ball]);

    Engine.run(engine);
    Render.run(render);

    setContraints(boxRef.current.getBoundingClientRect());
    setScene(render);

    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints;

      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;

      // Dynamically update floor
      const floor = scene.engine.world.bodies[0];
      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2,
      });
      Matter.Body.setVertices(floor, [
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: height + STATIC_DENSITY },
        { x: 0, y: height + STATIC_DENSITY },
      ]);
    }
  }, [scene, constraints]);

  return (
    <main className={styles.indexStyles}>
      <title>MatterJS / Gatsby</title>
      <h1>MatterJS / Gatsby</h1>
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </main>
  );
};

export default IndexPage;
