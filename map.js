import * as THREE from "./vendor/three.module.min.js";

const root = document.documentElement;
const fieldApp = document.querySelector("[data-field-app]");
const stage = document.querySelector("[data-map-stage]");
const canvas = document.querySelector("[data-map-canvas]");
const status = document.querySelector("[data-map-status]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (stage && canvas) {
    initialiseMap().catch(showFallback);
}

async function initialiseMap() {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(0, -0.6, 38);

    scene.add(new THREE.HemisphereLight(0xfffdf7, 0x315852, 2.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
    keyLight.position.set(-8, -5, 16);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -18;
    keyLight.shadow.camera.right = 18;
    keyLight.shadow.camera.top = 18;
    keyLight.shadow.camera.bottom = -18;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x91cbc5, 2.25);
    rimLight.position.set(9, 8, 9);
    scene.add(rimLight);

    const response = await fetch("./macao-boundary.geojson", { cache: "force-cache" });
    if (!response.ok) throw new Error(`Map data returned ${response.status}`);
    const geojson = await response.json();
    const shapes = geojsonToShapes(geojson);
    if (!shapes.length) throw new Error("Map data contained no polygon");

    const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: 0.52,
        steps: 1,
        curveSegments: 2,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.075,
        bevelThickness: 0.09,
    });
    geometry.center();
    geometry.computeVertexNormals();

    const materials = [0x0b0d0d, 0x1648ff, 0xd9ff4f].map(
        (color) =>
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.66,
                metalness: 0.05,
            }),
    );

    const mapGroup = new THREE.Group();
    const layers = materials.map((material, index) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = (index - 1) * 0.85;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mapGroup.add(mesh);
        return mesh;
    });
    scene.add(mapGroup);

    const shadowMaterial = new THREE.ShadowMaterial({
        color: 0x0b0d0d,
        opacity: 0.22,
        transparent: true,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(42, 42), shadowMaterial);
    shadowPlane.position.z = -5;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const fieldModes = {
        overview: {
            x: 0,
            y: -0.15,
            scale: 1,
            rotationX: -0.52,
            rotationY: 0.08,
            rotationZ: 0.2,
            cameraZ: 38,
            depth: [-0.85, 0, 0.85],
            colors: [0x0b0d0d, 0x1648ff, 0xd9ff4f],
        },
        systems: {
            x: -8.1,
            y: 0.2,
            scale: 0.78,
            rotationX: -0.66,
            rotationY: -0.28,
            rotationZ: 0.22,
            cameraZ: 35.5,
            depth: [-2.6, 0, 2.6],
            colors: [0x0b0d0d, 0x1648ff, 0xff5736],
        },
        voice: {
            x: 8.3,
            y: 0.1,
            scale: 0.72,
            rotationX: -0.78,
            rotationY: 0.42,
            rotationZ: -0.24,
            cameraZ: 35,
            depth: [-1.9, 0, 1.9],
            colors: [0x1648ff, 0xff5736, 0xfffdf7],
        },
        words: {
            x: 8.4,
            y: 3,
            scale: 0.5,
            rotationX: -0.2,
            rotationY: 0.18,
            rotationZ: 0.62,
            cameraZ: 36,
            depth: [-3.1, 0, 3.1],
            colors: [0x0b0d0d, 0x91cbc5, 0xff5736],
        },
    };

    const initialScene = fieldModes[fieldApp?.dataset.scene] ? fieldApp.dataset.scene : "overview";
    const initialMode = fieldModes[initialScene];
    const view = {
        x: initialMode.x,
        y: initialMode.y,
        scale: initialMode.scale,
        rotationX: initialMode.rotationX,
        rotationY: initialMode.rotationY,
        rotationZ: initialMode.rotationZ,
        cameraZ: initialMode.cameraZ,
    };
    const dragCurrent = { x: 0, y: 0 };
    const dragTarget = { x: 0, y: 0 };
    let zoomOffset = 0;
    let cameraZCurrent = view.cameraZ;
    let currentField = initialScene;
    let dragging = false;
    let pointerId = null;
    let lastPointer = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    let disposed = false;

    function applyField(field, animate = true) {
        const next = fieldModes[field] ? field : "overview";
        const mode = fieldModes[next];
        currentField = next;
        zoomOffset = 0;
        const gsap = window.gsap;

        if (animate && gsap && !reducedMotion.matches) {
            gsap.killTweensOf(view);
            gsap.to(view, {
                x: mode.x,
                y: mode.y,
                scale: mode.scale,
                rotationX: mode.rotationX,
                rotationY: mode.rotationY,
                rotationZ: mode.rotationZ,
                cameraZ: mode.cameraZ,
                duration: 1.15,
                ease: "power3.inOut",
                overwrite: "auto",
            });
            gsap.to(dragTarget, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });

            layers.forEach((layer, index) => {
                gsap.killTweensOf(layer.position);
                gsap.to(layer.position, {
                    z: mode.depth[index],
                    duration: 1.08,
                    delay: index * 0.045,
                    ease: "power3.inOut",
                    overwrite: "auto",
                });
                const target = new THREE.Color(mode.colors[index]);
                gsap.killTweensOf(materials[index].color);
                gsap.to(materials[index].color, {
                    r: target.r,
                    g: target.g,
                    b: target.b,
                    duration: 0.78,
                    ease: "power2.inOut",
                    overwrite: "auto",
                });
            });
        } else {
            Object.assign(view, {
                x: mode.x,
                y: mode.y,
                scale: mode.scale,
                rotationX: mode.rotationX,
                rotationY: mode.rotationY,
                rotationZ: mode.rotationZ,
                cameraZ: mode.cameraZ,
            });
            dragTarget.x = 0;
            dragTarget.y = 0;
            layers.forEach((layer, index) => {
                layer.position.z = mode.depth[index];
                materials[index].color.set(mode.colors[index]);
            });
        }
    }

    function resetTerrain() {
        const gsap = window.gsap;
        zoomOffset = 0;
        if (gsap && !reducedMotion.matches) {
            gsap.to(dragTarget, { x: 0, y: 0, duration: 0.68, ease: "power3.out", overwrite: "auto" });
        } else {
            dragTarget.x = 0;
            dragTarget.y = 0;
        }
    }

    function onPointerDown(event) {
        if (event.button !== 0 && event.pointerType === "mouse") return;
        dragging = true;
        pointerId = event.pointerId;
        lastPointer = { x: event.clientX, y: event.clientY };
        stage.classList.add("is-dragging");
        stage.setPointerCapture?.(pointerId);
    }

    function onPointerMove(event) {
        if (!dragging || event.pointerId !== pointerId) return;
        const deltaX = event.clientX - lastPointer.x;
        const deltaY = event.clientY - lastPointer.y;
        lastPointer = { x: event.clientX, y: event.clientY };
        dragTarget.y += deltaX * 0.0055;
        dragTarget.x = THREE.MathUtils.clamp(dragTarget.x + deltaY * 0.004, -0.62, 0.62);
    }

    function endDrag(event) {
        if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
        dragging = false;
        stage.classList.remove("is-dragging");
        if (pointerId !== null && stage.hasPointerCapture?.(pointerId)) {
            stage.releasePointerCapture(pointerId);
        }
        pointerId = null;
    }

    function onWheel(event) {
        event.preventDefault();
        const delta = event.deltaMode === 1 ? event.deltaY * 12 : event.deltaY;
        zoomOffset = THREE.MathUtils.clamp(zoomOffset + delta * 0.012, -7, 8);
    }

    function onKeyDown(event) {
        const amount = event.shiftKey ? 0.18 : 0.08;
        if (event.key === "ArrowLeft") dragTarget.y -= amount;
        else if (event.key === "ArrowRight") dragTarget.y += amount;
        else if (event.key === "ArrowUp") dragTarget.x = THREE.MathUtils.clamp(dragTarget.x - amount, -0.62, 0.62);
        else if (event.key === "ArrowDown") dragTarget.x = THREE.MathUtils.clamp(dragTarget.x + amount, -0.62, 0.62);
        else if (event.key === "+" || event.key === "=") zoomOffset = Math.max(-7, zoomOffset - 1.2);
        else if (event.key === "-") zoomOffset = Math.min(8, zoomOffset + 1.2);
        else if (event.key.toLowerCase() === "r") resetTerrain();
        else return;
        event.preventDefault();
        event.stopPropagation();
    }

    const abortController = new AbortController();
    const signal = abortController.signal;
    stage.addEventListener("pointerdown", onPointerDown, { signal });
    stage.addEventListener("pointermove", onPointerMove, { signal });
    stage.addEventListener("pointerup", endDrag, { signal });
    stage.addEventListener("pointercancel", endDrag, { signal });
    stage.addEventListener("lostpointercapture", endDrag, { signal });
    stage.addEventListener("wheel", onWheel, { passive: false, signal });
    stage.addEventListener("keydown", onKeyDown, { signal });
    window.addEventListener("field:scene", (event) => applyField(event.detail?.scene), { signal });

    function resize() {
        const bounds = stage.getBoundingClientRect();
        const width = Math.max(1, Math.round(bounds.width));
        const height = Math.max(1, Math.round(bounds.height));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
            visible = entry.isIntersecting;
        },
        { rootMargin: "100px" },
    );
    visibilityObserver.observe(stage);

    function render(time) {
        if (disposed) return;
        frame = requestAnimationFrame(render);
        if (!visible || document.hidden) return;

        const ease = reducedMotion.matches ? 1 : dragging ? 0.25 : 0.105;
        dragCurrent.x += (dragTarget.x - dragCurrent.x) * ease;
        dragCurrent.y += (dragTarget.y - dragCurrent.y) * ease;
        cameraZCurrent += (view.cameraZ + zoomOffset - cameraZCurrent) * (reducedMotion.matches ? 1 : 0.1);

        const idle = reducedMotion.matches || currentField !== "overview"
            ? 0
            : Math.sin(time * 0.00026) * 0.024;
        mapGroup.position.set(view.x, view.y, 0);
        mapGroup.scale.setScalar(view.scale);
        mapGroup.rotation.set(
            view.rotationX + dragCurrent.x,
            view.rotationY + dragCurrent.y + idle,
            view.rotationZ,
        );
        camera.position.z = cameraZCurrent;
        renderer.render(scene, camera);
    }

    function dispose() {
        disposed = true;
        cancelAnimationFrame(frame);
        abortController.abort();
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        geometry.dispose();
        materials.forEach((material) => material.dispose());
        shadowMaterial.dispose();
        shadowPlane.geometry.dispose();
        renderer.dispose();
    }

    window.addEventListener("pagehide", dispose, { once: true, signal });
    applyField(initialScene, false);
    render(0);
    root.classList.add("map-ready");
    window.dispatchEvent(new CustomEvent("map:ready"));
}

function geojsonToShapes(geojson) {
    const geometries = (geojson.features || [])
        .map((feature) => feature.geometry)
        .filter(Boolean);
    const polygons = geometries.flatMap((geometry) => {
        if (geometry.type === "Polygon") return [geometry.coordinates];
        if (geometry.type === "MultiPolygon") return geometry.coordinates;
        return [];
    });
    const allPoints = polygons.flat(2);
    if (!allPoints.length) return [];

    const longitudes = allPoints.map((point) => point[0]);
    const latitudes = allPoints.map((point) => point[1]);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);
    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const centerLongitude = (minLongitude + maxLongitude) / 2;
    const centerLatitude = (minLatitude + maxLatitude) / 2;
    const longitudeScale = Math.cos(THREE.MathUtils.degToRad(centerLatitude));
    const width = (maxLongitude - minLongitude) * longitudeScale;
    const height = maxLatitude - minLatitude;
    const scale = 17.5 / Math.max(width, height);

    const projectRing = (ring) =>
        ring.slice(0, -1).map(
            ([longitude, latitude]) =>
                new THREE.Vector2(
                    (longitude - centerLongitude) * longitudeScale * scale,
                    (latitude - centerLatitude) * scale,
                ),
        );

    return polygons
        .map((polygon) => {
            const outer = projectRing(polygon[0]);
            if (outer.length < 3) return null;
            if (!THREE.ShapeUtils.isClockWise(outer)) outer.reverse();
            const shape = new THREE.Shape(outer);

            polygon.slice(1).forEach((ring) => {
                const hole = projectRing(ring);
                if (hole.length < 3) return;
                if (THREE.ShapeUtils.isClockWise(hole)) hole.reverse();
                shape.holes.push(new THREE.Path(hole));
            });
            return shape;
        })
        .filter(Boolean);
}

function showFallback(error) {
    console.warn("The 3D map could not start; showing the data-derived outline.", error);
    root.classList.add("map-failed");
    if (status) {
        status.textContent = root.dataset.language === "en"
            ? "Static map mode"
            : "已切換為靜態地圖";
    }
}
