import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";


export function createScene(
    canvas,
    kind = "hero"
) {

    console.log(
        "[THREE] Creating:",
        kind
    );


    const scene =
        new THREE.Scene();


    const camera =
        new THREE.PerspectiveCamera(
            38,
            1.5,
            0.1,
            60
        );


    camera.position.set(
        0,
        0,
        9
    );


    const renderer =
        new THREE.WebGLRenderer({
            canvas,

            antialias: true,

            alpha: true,

            powerPreference:
                "high-performance"
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.15;


    renderer.setClearColor(
        0x000000,
        0
    );


    /* =====================================================
       WORLD
    ===================================================== */

    const world =
        new THREE.Group();

    scene.add(world);


    const objects = [];


    /* =====================================================
       MATERIALS
    ===================================================== */

    const black =
        new THREE.MeshStandardMaterial({
            color: 0x151412,
            roughness: 0.58,
            metalness: 0.25
        });


    const dark =
        new THREE.MeshStandardMaterial({
            color: 0x3a3732,
            roughness: 0.78,
            metalness: 0.08
        });


    const cream =
        new THREE.MeshStandardMaterial({
            color: 0xd9d1c2,
            roughness: 0.9
        });


    const red =
        new THREE.MeshStandardMaterial({
            color: 0xd7472f,
            roughness: 0.68,
            metalness: 0.08
        });


    const brass =
        new THREE.MeshStandardMaterial({
            color: 0x907951,
            roughness: 0.3,
            metalness: 0.82
        });


    const wire =
        new THREE.MeshBasicMaterial({
            color: 0x24221f,
            wireframe: true
        });


    /* =====================================================
       ADD OBJECT
    ===================================================== */

    function add(
        geometry,
        material,
        position = [0, 0, 0],
        rotation = [0, 0, 0]
    ) {

        const object =
            new THREE.Mesh(
                geometry,
                material
            );


        object.position.set(
            ...position
        );


        object.rotation.set(
            ...rotation
        );


        object.userData.baseX =
            position[0];

        object.userData.baseY =
            position[1];

        object.userData.baseZ =
            position[2];


        object.userData.depth =
            Math.max(
                0.2,
                Math.abs(position[2]) + 0.5
            );


        object.userData.speed =
            0.15 +
            Math.random() * 0.25;


        object.userData.float =
            0.015 +
            Math.random() * 0.025;


        object.userData.offset =
            Math.random() *
            Math.PI *
            2;


        world.add(object);

        objects.push(object);

        return object;
    }


    function box(
        size,
        material,
        position,
        rotation = [0, 0, 0]
    ) {

        return add(
            new THREE.BoxGeometry(
                ...size
            ),

            material,

            position,

            rotation
        );

    }


    function cylinder(
        radius,
        height,
        material,
        position,
        rotation = [0, 0, 0]
    ) {

        return add(
            new THREE.CylinderGeometry(
                radius,
                radius,
                height,
                24
            ),

            material,

            position,

            rotation
        );

    }


    function torus(
        radius,
        tube,
        material,
        position,
        rotation = [0, 0, 0]
    ) {

        return add(
            new THREE.TorusGeometry(
                radius,
                tube,
                12,
                64
            ),

            material,

            position,

            rotation
        );

    }


    /* =====================================================
       HERO LIGHTS
    ===================================================== */

    scene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x1a1714,
            1.8
        )
    );


    const key =
        new THREE.DirectionalLight(
            0xffead4,
            3.5
        );


    key.position.set(
        -4,
        5,
        7
    );


    scene.add(key);


    const accent =
        new THREE.PointLight(
            0xe84a2f,
            7,
            14,
            2
        );


    accent.position.set(
        3,
        1,
        5
    );


    scene.add(accent);


    /* =====================================================
       ACTUAL 3D OBJECT
    ===================================================== */

    /* =====================================================
       RESIZE
    ===================================================== */

    function resize() {

        const rect =
            canvas.getBoundingClientRect();


        if (
            !rect.width ||
            !rect.height
        ) {
            return;
        }


        camera.aspect =
            rect.width /
            rect.height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            rect.width,
            rect.height,
            false
        );

    }


    resize();


    console.log(
        "[THREE] Scene ready:",
        kind
    );


    return {

        scene,

        camera,

        renderer,

        sculpture:
            world,

        objects,

        resize,

        kind

    };

}