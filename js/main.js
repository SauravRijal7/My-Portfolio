import {
    animate,
    createTimeline,
    stagger
} from "https://cdn.jsdelivr.net/npm/animejs@4.2.2/+esm";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

import { setupInteractions } from "./interactions.js";
import { createScene } from "./scene.js";


console.log("[PORTFOLIO] main.js loaded");


/* ============================================================
   SETTINGS
============================================================ */

const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isTouch =
    window.matchMedia("(pointer: coarse)").matches;


/* ============================================================
   DOM
============================================================ */

const cursor =
    document.querySelector(".cursor");

const loader =
    document.querySelector("#loader");

const loaderFill =
    document.querySelector("#loaderFill");

const loadPercent =
    document.querySelector("#loadPercent");


/* ============================================================
   POINTER
============================================================ */

const pointer = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0
};

window.addEventListener(
    "pointermove",
    (event) => {

        pointer.tx =
            (event.clientX / window.innerWidth) * 2 - 1;

        pointer.ty =
            -(
                (event.clientY / window.innerHeight) * 2 - 1
            );

    },
    { passive: true }
);


/* ============================================================
   GLOBAL 3D ARCHITECTURAL BACKGROUND
============================================================ */

function createGlobal3DBackground() {

    if (prefersReduced) return;


    /* --------------------------------------------------------
       CANVAS
    -------------------------------------------------------- */

    const canvas =
        document.createElement("canvas");

    canvas.id =
        "global-3d-bg";

    Object.assign(canvas.style, {

        position: "fixed",

        inset: "0",

        width: "100%",

        height: "100%",

        zIndex: "0",

        pointerEvents: "none",

        opacity: "0.82",

        mixBlendMode: "multiply"

    });

    document.body.prepend(canvas);


    /* --------------------------------------------------------
       RENDERER
    -------------------------------------------------------- */

    const renderer =
        new THREE.WebGLRenderer({

            canvas,

            antialias: true,

            alpha: true,

            powerPreference: "high-performance"

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.7
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setClearColor(
        0x000000,
        0
    );


    /* --------------------------------------------------------
       SCENE
    -------------------------------------------------------- */

    const scene =
        new THREE.Scene();


    /* --------------------------------------------------------
       CAMERA
    -------------------------------------------------------- */

    const camera =
        new THREE.PerspectiveCamera(

            38,

            window.innerWidth /
            window.innerHeight,

            0.1,

            100

        );


    camera.position.set(
        0,
        0,
        12
    );


    /* --------------------------------------------------------
       WORLD
    -------------------------------------------------------- */

    const world =
        new THREE.Group();

    scene.add(world);


    /* --------------------------------------------------------
       MATERIALS
    -------------------------------------------------------- */

    const lineMaterial =
        new THREE.LineBasicMaterial({

            color: 0x171716,

            transparent: true,

            opacity: 0.18

        });


    const faintMaterial =
        new THREE.LineBasicMaterial({

            color: 0x171716,

            transparent: true,

            opacity: 0.075

        });


    /* --------------------------------------------------------
       ARCHITECTURAL GRID
    -------------------------------------------------------- */

    const grid =
        new THREE.GridHelper(

            30,

            30,

            0x171716,

            0x171716

        );


    grid.material.transparent =
        true;

    grid.material.opacity =
        0.085;


    grid.rotation.x =
        Math.PI / 2;


    grid.position.set(
        0,
        -1.8,
        -2
    );


    world.add(grid);


    /* --------------------------------------------------------
       VERTICAL STRUCTURAL LINES
    -------------------------------------------------------- */

    const verticalGroup =
        new THREE.Group();


    for (
        let i = -10;
        i <= 10;
        i++
    ) {

        const points = [

            new THREE.Vector3(
                i * 0.75,
                -6,
                -3
            ),

            new THREE.Vector3(
                i * 0.75,
                6,
                -3
            )

        ];


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(points);


        const line =
            new THREE.Line(

                geometry,

                i % 3 === 0
                    ? lineMaterial
                    : faintMaterial

            );


        verticalGroup.add(line);

    }


    world.add(
        verticalGroup
    );


    /* --------------------------------------------------------
       HORIZONTAL STRUCTURAL LINES
    -------------------------------------------------------- */

    const horizontalGroup =
        new THREE.Group();


    for (
        let i = -5;
        i <= 5;
        i++
    ) {

        const points = [

            new THREE.Vector3(
                -9,
                i * 0.9,
                -3.2
            ),

            new THREE.Vector3(
                9,
                i * 0.9,
                -3.2
            )

        ];


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(points);


        const line =
            new THREE.Line(
                geometry,
                faintMaterial
            );


        horizontalGroup.add(line);

    }


    world.add(
        horizontalGroup
    );


    /* --------------------------------------------------------
       FLOATING ARCHITECTURAL FRAMES
    -------------------------------------------------------- */

    const structures =
        new THREE.Group();


    const frameMaterial =
        new THREE.LineBasicMaterial({

            color: 0x171716,

            transparent: true,

            opacity: 0.16

        });


    function createFrame(
        x,
        y,
        z,
        width,
        height,
        depth,
        rotation
    ) {

        const geometry =
            new THREE.BoxGeometry(

                width,
                height,
                depth

            );


        const edges =
            new THREE.EdgesGeometry(
                geometry
            );


        const frame =
            new THREE.LineSegments(

                edges,

                frameMaterial

            );


        frame.position.set(
            x,
            y,
            z
        );


        frame.rotation.set(

            rotation.x,

            rotation.y,

            rotation.z

        );


        frame.userData = {

            baseX: x,

            baseY: y,

            baseZ: z,

            speed:
                0.2 +
                Math.random() * 0.35,

            offset:
                Math.random() *
                Math.PI *
                2,

            depth:
                0.5 +
                Math.random() * 1.4

        };


        structures.add(frame);

    }


    /* FRAME 01 */

    createFrame(

        -5,

        2.2,

        -2,

        2.2,

        2.2,

        2.2,

        {

            x: 0.2,

            y: -0.3,

            z: 0.1

        }

    );


    /* FRAME 02 */

    createFrame(

        5,

        -1,

        -1.5,

        1.6,

        3.5,

        1.6,

        {

            x: -0.2,

            y: 0.4,

            z: -0.15

        }

    );


    /* FRAME 03 */

    createFrame(

        -4,

        -2.8,

        -3,

        1.2,

        1.2,

        1.2,

        {

            x: 0.5,

            y: 0.2,

            z: 0

        }

    );


    /* FRAME 04 */

    createFrame(

        4,

        2.8,

        -3,

        2.8,

        1.2,

        1.2,

        {

            x: -0.3,

            y: -0.5,

            z: 0.2

        }

    );


    world.add(
        structures
    );


    /* --------------------------------------------------------
       DIAGONAL WIRES
    -------------------------------------------------------- */

    const wireGroup =
        new THREE.Group();


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const points = [

            new THREE.Vector3(

                -8,

                -4 + i * 1.3,

                -2

            ),

            new THREE.Vector3(

                8,

                4 - i * 1.3,

                -2

            )

        ];


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(points);


        const wire =
            new THREE.Line(

                geometry,

                faintMaterial

            );


        wireGroup.add(wire);

    }


    world.add(
        wireGroup
    );


    /* --------------------------------------------------------
       FLOATING POINTS
    -------------------------------------------------------- */

    const pointsGroup =
        new THREE.Group();


    const pointGeometry =
        new THREE.SphereGeometry(
            0.025,
            8,
            8
        );


    const pointMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x171716,

            transparent: true,

            opacity: 0.28

        });


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const point =
            new THREE.Mesh(

                pointGeometry,

                pointMaterial

            );


        point.position.set(

            THREE.MathUtils.randFloat(
                -8,
                8
            ),

            THREE.MathUtils.randFloat(
                -5,
                5
            ),

            THREE.MathUtils.randFloat(
                -4,
                1
            )

        );


        point.userData = {

            baseX:
                point.position.x,

            baseY:
                point.position.y,

            baseZ:
                point.position.z,

            offset:
                Math.random() *
                Math.PI *
                2,

            speed:
                0.2 +
                Math.random() *
                0.3

        };


        pointsGroup.add(
            point
        );

    }


    world.add(
        pointsGroup
    );


    /* --------------------------------------------------------
       MOUSE PARALLAX
    -------------------------------------------------------- */

    let mouseX = 0;

    let mouseY = 0;

    let targetX = 0;

    let targetY = 0;


    window.addEventListener(

        "pointermove",

        (event) => {

            targetX =
                event.clientX /
                window.innerWidth -
                0.5;


            targetY =
                event.clientY /
                window.innerHeight -
                0.5;

        },

        { passive: true }

    );


    /* --------------------------------------------------------
       SCROLL DEPTH
    -------------------------------------------------------- */

    let scrollTarget = 0;

    let scrollCurrent = 0;


    window.addEventListener(

        "scroll",

        () => {

            scrollTarget =
                window.scrollY *
                0.00035;

        },

        { passive: true }

    );


    /* --------------------------------------------------------
       ANIMATION
    -------------------------------------------------------- */

    const clock =
        new THREE.Clock();


    function renderGlobalBackground() {

        const time =
            clock.getElapsedTime();


        /* SMOOTH MOUSE */

        mouseX +=
            (
                targetX -
                mouseX
            ) * 0.035;


        mouseY +=
            (
                targetY -
                mouseY
            ) * 0.035;


        /* SMOOTH SCROLL */

        scrollCurrent +=
            (
                scrollTarget -
                scrollCurrent
            ) * 0.025;


        /* WORLD ROTATION */

        world.rotation.y =
            mouseX * 0.075;


        world.rotation.x =
            -mouseY * 0.035;


        /* WORLD PARALLAX */

        world.position.x =
            mouseX * 0.22;


        world.position.y =
            -mouseY * 0.12 -
            scrollCurrent * 2;


        /* FLOATING FRAMES */

        structures.children.forEach(

            (object) => {

                const data =
                    object.userData;


                object.rotation.y +=

                    Math.sin(

                        time *
                        data.speed +
                        data.offset

                    ) * 0.0005;


                object.rotation.x +=

                    Math.cos(

                        time *
                        data.speed +
                        data.offset

                    ) * 0.00015;


                object.position.x +=

                    (

                        data.baseX +

                        mouseX *
                        data.depth *
                        0.35 -

                        object.position.x

                    ) * 0.018;


                object.position.y +=

                    (

                        data.baseY +

                        mouseY *
                        data.depth *
                        0.18 -

                        object.position.y

                    ) * 0.018;


                object.position.z +=

                    (

                        data.baseZ +

                        Math.sin(

                            time *
                            data.speed +
                            data.offset

                        ) * 0.12 -

                        object.position.z

                    ) * 0.018;

            }

        );


        /* FLOATING POINTS */

        pointsGroup.children.forEach(

            (point) => {

                const data =
                    point.userData;


                point.position.x =

                    data.baseX +

                    mouseX * 0.12;


                point.position.y =

                    data.baseY +

                    Math.sin(

                        time *
                        data.speed +
                        data.offset

                    ) * 0.04;


                point.position.z =

                    data.baseZ +

                    mouseY * 0.08;

            }

        );


        /* CAMERA PARALLAX */

        camera.position.x +=

            (

                mouseX * 0.35 -

                camera.position.x

            ) * 0.02;


        camera.position.y +=

            (

                mouseY * 0.18 -

                camera.position.y

            ) * 0.02;


        camera.lookAt(
            0,
            0,
            -2
        );


        renderer.render(
            scene,
            camera
        );


        requestAnimationFrame(
            renderGlobalBackground
        );

    }


    /* --------------------------------------------------------
       RESIZE
    -------------------------------------------------------- */

    window.addEventListener(

        "resize",

        () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;


            camera.updateProjectionMatrix();


            renderer.setSize(

                window.innerWidth,

                window.innerHeight

            );


            renderer.setPixelRatio(

                Math.min(

                    window.devicePixelRatio,

                    1.7

                )

            );

        },

        { passive: true }

    );


    renderGlobalBackground();


    console.log(
        "[PORTFOLIO] Global 3D background initialized"
    );

}


/* ============================================================
   THREE.JS EXISTING SCENES
============================================================ */

const threeStudies = [];


document
    .querySelectorAll("canvas[data-scene]")
    .forEach((canvas) => {

        console.log(

            "[PORTFOLIO] Creating Three.js scene:",

            canvas.dataset.scene

        );


        try {

            const scene =
                createScene(

                    canvas,

                    canvas.dataset.scene

                );


            threeStudies.push({

                canvas,

                active:
                    canvas.dataset.scene === "hero",

                scene

            });


        } catch (error) {

            console.error(

                "[PORTFOLIO] Three.js scene failed:",

                error

            );

        }

    });


console.log(

    "[PORTFOLIO] Three scenes:",

    threeStudies.length

);


/* ============================================================
   INTERACTIONS
============================================================ */

setupInteractions({

    cursor,

    enter:
        document.querySelector("#enter"),

    pointer,

    prefersReduced,

    isTouch

});


/* ============================================================
   LOADER
============================================================ */

function finishLoader() {

    if (!loader) {

        console.warn(
            "[PORTFOLIO] Loader not found"
        );

        return;

    }


    let progress = 0;


    const timer =
        setInterval(() => {

            progress =
                Math.min(

                    100,

                    progress +

                    8 +

                    Math.round(
                        Math.random() * 12
                    )

                );


            if (loaderFill) {

                loaderFill.style.width =
                    `${progress}%`;

            }


            if (loadPercent) {

                loadPercent.textContent =
                    `${progress}%`;

            }


            if (progress >= 100) {

                clearInterval(timer);


                setTimeout(() => {

                    if (prefersReduced) {

                        loader.remove();

                        return;

                    }


                    animate(loader, {

                        opacity: [1, 0],

                        translateY: [
                            0,
                            -24
                        ],

                        duration: 520,

                        ease: "inOutExpo",

                        onComplete: () => {

                            loader.remove();

                        }

                    });

                }, 150);

            }

        }, 65);

}


/* ============================================================
   TEXT SPLIT
============================================================ */

function splitText(element) {

    if (

        !element ||

        element.dataset.split

    ) {

        return [];

    }


    element.dataset.split =
        "true";


    const text =
        element.textContent.trim();


    element.setAttribute(
        "aria-label",
        text
    );


    element.textContent = "";


    return [...text].map(

        (character) => {

            const span =
                document.createElement(
                    "span"
                );


            span.className =
                "letter";


            span.setAttribute(

                "aria-hidden",

                "true"

            );


            span.textContent =

                character === " "

                    ? "\u00a0"

                    : character;


            element.append(span);


            return span;

        }

    );

}


/* ============================================================
   INTRO
============================================================ */

function intro() {

    const letters =

        [...document.querySelectorAll("h1")]

            .flatMap(splitText);


    if (prefersReduced) {

        return;

    }


    const timeline =
        createTimeline({

            autoplay: true

        });


    timeline

        .add(".eyebrow", {

            opacity: [0, 1],

            y: [16, 0],

            duration: 520,

            ease: "outExpo"

        })


        .add(

            letters,

            {

                opacity: [0, 1],

                y: [72, 0],

                rotate: [-4, 0],

                duration: 820,

                delay: stagger(18),

                ease: "outExpo"

            },

            "-=280"

        )


        .add(

            [

                ".hero-bottom",

                ".motion-lab"

            ],

            {

                opacity: [0, 1],

                y: [24, 0],

                duration: 700,

                delay: stagger(90),

                ease: "outExpo"

            },

            "-=560"

        );

}


/* ============================================================
   MOTION LAB
============================================================ */

function motionLab() {

    if (prefersReduced)
        return;


    animate(".lab-ring", {

        rotate: 360,

        duration: 18000,

        loop: true,

        ease: "linear"

    });


    animate(".lab-dash", {

        strokeDashoffset: [120, 0],

        duration: 2800,

        loop: true,

        direction: "alternate",

        ease: "inOutSine"

    });


    animate(".lab-dot", {

        x: [-22, 22],

        y: [12, -12],

        scale: [0.75, 1.16],

        delay: stagger(260),

        duration: 2300,

        loop: true,

        direction: "alternate",

        ease: "inOutQuad"

    });


    const lab =
        document.querySelector(
            ".motion-lab"
        );


    lab?.addEventListener(

        "pointermove",

        (event) => {

            const bounds =
                lab.getBoundingClientRect();


            const x =

                (

                    event.clientX -
                    bounds.left

                ) /

                    bounds.width -

                0.5;


            const y =

                (

                    event.clientY -
                    bounds.top

                ) /

                    bounds.height -

                0.5;


            animate(".lab-tilt", {

                rotateY:
                    x * 16,

                rotateX:
                    -y * 12,

                duration: 500,

                ease: "outExpo"

            });

        }

    );

}


/* ============================================================
   SECTION REVEALS
============================================================ */

function sectionMotion() {

    if (
        !("IntersectionObserver" in window)
    )

        return;


    const observer =

        new IntersectionObserver(

            (entries) => {

                entries

                    .filter(

                        entry =>
                            entry.isIntersecting

                    )

                    .forEach(

                        (entry) => {

                            if (
                                prefersReduced
                            ) {

                                observer.unobserve(
                                    entry.target
                                );

                                return;

                            }


                            animate(

                                entry.target
                                    .querySelectorAll(

                                        ".section-title, .project, .process article, .about-copy, .body-copy"

                                    ),

                                {

                                    opacity: [
                                        0,
                                        1
                                    ],

                                    y: [
                                        26,
                                        0
                                    ],

                                    duration: 700,

                                    delay:
                                        stagger(70),

                                    ease:
                                        "outExpo"

                                }

                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    );

            },

            {

                threshold:
                    0.18

            }

        );


    document

        .querySelectorAll(
            ".section"
        )

        .forEach(

            section =>
                observer.observe(
                    section
                )

        );

}


/* ============================================================
   PROJECT HOVER
============================================================ */

function projectMotion() {

    document

        .querySelectorAll(
            ".project"
        )

        .forEach(

            (project) => {


                project.addEventListener(

                    "pointerenter",

                    () => {

                        if (
                            prefersReduced
                        )

                            return;


                        animate(

                            project,

                            {

                                x: 18,

                                duration: 420,

                                ease:
                                    "outExpo"

                            }

                        );

                    }

                );


                project.addEventListener(

                    "pointerleave",

                    () => {

                        if (
                            prefersReduced
                        )

                            return;


                        animate(

                            project,

                            {

                                x: 0,

                                duration: 520,

                                ease:
                                    "outElastic(1, .5)"

                            }

                        );

                    }

                );

            }

        );

}


/* ============================================================
   EXISTING THREE INTERACTION
============================================================ */

function renderInteractiveObject() {

    const start =
        performance.now();


    function render(now) {

        const time =
            (now - start) * 0.001;


        pointer.x +=

            (

                pointer.tx -
                pointer.x

            ) * 0.055;


        pointer.y +=

            (

                pointer.ty -
                pointer.y

            ) * 0.055;


        threeStudies.forEach(

            (study) => {

                if (
                    !study.active
                )

                    return;


                const three =
                    study.scene;


                if (!three)
                    return;


                if (!prefersReduced) {


                    /* MAIN SCULPTURE */

                    three.sculpture.rotation.y +=

                        (

                            pointer.x * 0.16 -

                            three.sculpture
                                .rotation.y

                        ) * 0.035;


                    three.sculpture.rotation.x +=

                        (

                            -pointer.y * 0.10 -

                            three.sculpture
                                .rotation.x

                        ) * 0.035;


                    three.sculpture.position.x +=

                        (

                            pointer.x * 0.18 -

                            three.sculpture
                                .position.x

                        ) * 0.025;


                    three.sculpture.position.y +=

                        (

                            pointer.y * 0.10 -

                            three.sculpture
                                .position.y

                        ) * 0.025;


                    /* OBJECTS */

                    three.objects.forEach(

                        (object, index) => {

                            const data =
                                object.userData;


                            if (!data)
                                return;


                            object.rotation.y +=

                                data.speed *
                                0.0025;


                            object.rotation.z +=

                                Math.sin(

                                    time *
                                    data.speed +
                                    data.offset

                                ) * 0.0004;


                            object.position.y =

                                data.baseY +

                                Math.sin(

                                    time *
                                    data.speed +
                                    data.offset

                                ) *

                                data.float;


                            const depth =
                                data.depth;


                            object.position.x +=

                                (

                                    data.baseX +

                                    pointer.x *
                                    depth *
                                    0.08 -

                                    object.position.x

                                ) * 0.025;


                            object.position.z +=

                                (

                                    data.baseZ +

                                    pointer.y *
                                    depth *
                                    0.045 -

                                    object.position.z

                                ) * 0.025;


                            if (
                                index % 5 === 0
                            ) {

                                object.rotation.x +=

                                    pointer.y *
                                    0.0007;

                            }


                            if (
                                index % 7 === 0
                            ) {

                                object.rotation.z +=

                                    pointer.x *
                                    0.0007;

                            }

                        }

                    );

                }


                three.renderer.render(

                    three.scene,

                    three.camera

                );

            }

        );


        requestAnimationFrame(
            render
        );

    }


    requestAnimationFrame(
        render
    );

}


/* ============================================================
   SCENE VISIBILITY
============================================================ */

if (
    "IntersectionObserver" in window
) {

    const studyObserver =

        new IntersectionObserver(

            (entries) => {

                entries.forEach(

                    (entry) => {

                        const study =

                            threeStudies.find(

                                item =>
                                    item.canvas ===
                                    entry.target

                            );


                        if (study) {

                            study.active =
                                entry.isIntersecting;

                        }

                    }

                );

            },

            {

                rootMargin:
                    "250px 0px"

            }

        );


    threeStudies.forEach(

        ({ canvas }) =>

            studyObserver.observe(
                canvas
            )

    );

}


/* ============================================================
   RESIZE EXISTING THREE SCENES
============================================================ */

window.addEventListener(

    "resize",

    () => {

        threeStudies.forEach(

            ({ scene }) => {

                if (scene?.resize) {

                    scene.resize();

                }

            }

        );

    },

    { passive: true }

);


/* ============================================================
   BUS ANIMATION
============================================================ */

function busAnimation() {

    const busScene =
        document.querySelector(".bus-scene");

    const bus =
        document.querySelector("#portfolioBus");

    const busShadow =
        document.querySelector(".bus-shadow");

    const panel =
        document.querySelector("#busNavPanel");

    const closePanel =
        document.querySelector("#closeBusPanel");

    const destination =
        document.querySelector("#busDestination");

    const status =
        document.querySelector("#busStatus");

    const stops =
        document.querySelectorAll(".route-stop");

    const destinationButtons =
        document.querySelectorAll(
            ".bus-destinations button"
        );

    const roadLines =
        document.querySelectorAll(
            ".bus-road .road-line"
        );


    if (!busScene || !bus) {

        console.warn(
            "[BUS] Transit system markup not found."
        );

        return;

    }


    /* ========================================================
       SECTIONS
    ======================================================== */

    const sections = {

        home:
            document.querySelector("#home") ||
            document.querySelector(".hero"),

        projects:
            document.querySelector("#projects") ||
            document.querySelector(".projects"),

        about:
            document.querySelector("#about") ||
            document.querySelector(".about"),

        process:
            document.querySelector("#process") ||
            document.querySelector(".process"),

        contact:
            document.querySelector("#contact") ||
            document.querySelector(".contact")

    };


    /* ========================================================
       DESTINATION LABELS
    ======================================================== */

    const labels = {

        home: "HOME",

        projects: "PROJECTS",

        about: "ABOUT",

        process: "PROCESS",

        contact: "CONTACT"

    };


    /* ========================================================
       BUS MOVEMENT
    ======================================================== */

    if (!prefersReduced) {

        animate(

            bus,

            {

                translateX: [

                    "-20px",

                    "calc(100vw + 350px)"

                ],

                duration: 18000,

                ease: "linear",

                loop: true

            }

        );


        animate(

            busShadow,

            {

                scaleX: [
                    .9,
                    1.05,
                    .9
                ],

                opacity: [
                    .25,
                    .4,
                    .25
                ],

                duration: 900,

                loop: true,

                ease: "inOutSine"

            }

        );


        animate(

            roadLines,

            {

                translateX: [
                    "-140px",
                    "100vw"
                ],

                duration: 900,

                loop: true,

                ease: "linear",

                delay: stagger(150)

            }

        );


        animate(

            ".wheel",

            {

                rotate: 360,

                duration: 550,

                loop: true,

                ease: "linear"

            }

        );

    }


    /* ========================================================
       OPEN PANEL
    ======================================================== */

    function openPanel() {

        panel?.classList.add(
            "open"
        );

        if (status) {

            status.textContent =
                "SELECT DESTINATION";

        }


        if (!prefersReduced) {

            animate(

                bus,

                {

                    scale: 1.04,

                    duration: 300,

                    ease: "outExpo"

                }

            );

        }

    }


    /* ========================================================
       CLOSE PANEL
    ======================================================== */

    function closeNavigation() {

        panel?.classList.remove(
            "open"
        );

        if (status) {

            status.textContent =
                "ROUTE ACTIVE";

        }


        if (!prefersReduced) {

            animate(

                bus,

                {

                    scale: 1,

                    duration: 400,

                    ease: "outExpo"

                }

            );

        }

    }


    /* ========================================================
       SCROLL TO DESTINATION
    ======================================================== */

    function goToDestination(
        target
    ) {

        const section =
            sections[target];


        if (!section) {

            console.warn(
                "[BUS] Section not found:",
                target
            );

            return;

        }


        /* destination display */

        if (destination) {

            destination.textContent =
                labels[target];

        }


        /* close */

        closeNavigation();


        /* scroll */

        section.scrollIntoView({

            behavior:
                prefersReduced
                    ? "auto"
                    : "smooth",

            block: "start"

        });


        /* little bus reaction */

        if (!prefersReduced) {

            animate(

                bus,

                {

                    rotate: [
                        0,
                        -1.5,
                        1,
                        0
                    ],

                    duration: 650,

                    ease: "outExpo"

                }

            );

        }

    }


    /* ========================================================
       BUS CLICK
    ======================================================== */

    bus.addEventListener(

        "click",

        (event) => {

            event.preventDefault();

            openPanel();

        }

    );


    /* ========================================================
       CLOSE
    ======================================================== */

    closePanel?.addEventListener(

        "click",

        closeNavigation

    );


    /* ========================================================
       DESTINATION BUTTONS
    ======================================================== */

    destinationButtons.forEach(

        (button) => {

            button.addEventListener(

                "click",

                () => {

                    goToDestination(

                        button.dataset.target

                    );

                }

            );

        }

    );


    /* ========================================================
       ROUTE STOPS
    ======================================================== */

    stops.forEach(

        (stop) => {

            stop.addEventListener(

                "click",

                () => {

                    goToDestination(

                        stop.dataset.target

                    );

                }

            );

        }

    );


    /* ========================================================
       BUS HOVER
    ======================================================== */

    bus.addEventListener(

        "pointerenter",

        () => {

            if (prefersReduced)
                return;


            animate(

                bus,

                {

                    scale: 1.035,

                    rotate: -.6,

                    duration: 300,

                    ease: "outExpo"

                }

            );


            if (status) {

                status.textContent =
                    "CLICK TO NAVIGATE";

            }

        }

    );


    bus.addEventListener(

        "pointerleave",

        () => {

            if (prefersReduced)
                return;


            animate(

                bus,

                {

                    scale: 1,

                    rotate: 0,

                    duration: 450,

                    ease: "outElastic(1,.5)"

                }

            );


            if (
                !panel?.classList.contains(
                    "open"
                )
            ) {

                if (status) {

                    status.textContent =
                        "ROUTE ACTIVE";

                }

            }

        }

    );


    /* ========================================================
       BUS PARALLAX
    ======================================================== */

    busScene.addEventListener(

        "pointermove",

        (event) => {

            if (prefersReduced)
                return;


            const bounds =
                busScene.getBoundingClientRect();


            const x =

                (
                    event.clientX -
                    bounds.left
                ) /
                    bounds.width -
                0.5;


            const y =

                (
                    event.clientY -
                    bounds.top
                ) /
                    bounds.height -
                0.5;


            animate(

                bus,

                {

                    rotateY:
                        x * 3,

                    rotateX:
                        -y * 2,

                    duration: 600,

                    ease: "outExpo"

                }

            );

        }

    );


    /* ========================================================
       SCROLL AWARE ROUTE
    ======================================================== */

    if (
        "IntersectionObserver" in window
    ) {

        const routeObserver =

            new IntersectionObserver(

                (entries) => {

                    entries.forEach(

                        (entry) => {

                            if (
                                !entry.isIntersecting
                            )

                                return;


                            const id =
                                entry.target.id;


                            if (
                                !labels[id]
                            )

                                return;


                            /* destination */

                            if (
                                destination
                            ) {

                                destination.textContent =
                                    labels[id];

                            }


                            /* status */

                            if (status) {

                                status.textContent =
                                    `AT STOP / ${labels[id]}`;

                            }


                            /* route dots */

                            stops.forEach(

                                (stop) => {

                                    const target =
                                        stop.dataset.target;


                                    stop.classList.toggle(

                                        "active",

                                        target === id

                                    );


                                    const targetSection =
                                        sections[target];


                                    stop.classList.toggle(

                                        "visited",

                                        targetSection &&

                                        targetSection.offsetTop <
                                        window.scrollY

                                    );

                                }

                            );

                        }

                    );

                },

                {

                    threshold: .35

                }

            );


        Object.values(
            sections
        ).forEach(

            (section) => {

                if (section) {

                    routeObserver.observe(
                        section
                    );

                }

            }

        );

    }


    /* ========================================================
       ESC TO CLOSE
    ======================================================== */

    window.addEventListener(

        "keydown",

        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeNavigation();

            }

        }

    );


    console.log(
        "[BUS] SR Transit navigation active."
    );

}


/* ============================================================
   START EVERYTHING
============================================================ */

finishLoader();

intro();

motionLab();

sectionMotion();

projectMotion();

busAnimation();

/* NEW FULL PAGE 3D BACKGROUND */
createGlobal3DBackground();

/* EXISTING THREE.JS OBJECT */
renderInteractiveObject();


console.log(
    "[PORTFOLIO] All systems started"
);