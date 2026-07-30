import * as THREE from "./vendor/three.module.min.js";

const root = document.documentElement;
const stage = document.querySelector("[data-atlas-stage]");
const canvas = document.querySelector("[data-atlas-canvas]");
const status = document.querySelector("[data-atlas-status]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (stage && canvas) {
    initialiseAtlas().catch(showFallback);
}

async function initialiseAtlas() {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(0, -0.8, 38);

    const hemisphere = new THREE.HemisphereLight(0xfffdf8, 0x315852, 2.45);
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(-7, -4, 16);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 45;
    keyLight.shadow.camera.left = -14;
    keyLight.shadow.camera.right = 14;
    keyLight.shadow.camera.top = 14;
    keyLight.shadow.camera.bottom = -14;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9ecbc5, 2.1);
    rimLight.position.set(8, 7, 8);
    scene.add(rimLight);

    const response = await fetch("./macao-boundary.geojson", { cache: "force-cache" });
    if (!response.ok) throw new Error(`Map data returned ${response.status}`);
    const geojson = await response.json();
    const shapes = geojsonToShapes(geojson);
    if (!shapes.length) throw new Error("Map data contained no polygon");

    const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: 0.5,
        steps: 1,
        curveSegments: 2,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.075,
        bevelThickness: 0.085,
    });
    geometry.center();
    geometry.computeVertexNormals();

    const palette = [0x0e1010, 0x1648ff, 0xd9ff55];
    const materials = palette.map(
        (color) =>
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.68,
                metalness: 0.04,
            }),
    );

    const mapGroup = new THREE.Group();
    const layers = materials.map((material, index) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = (index - 1) * 0.8;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mapGroup.add(mesh);
        return mesh;
    });
    scene.add(mapGroup);

    const shadowMaterial = new THREE.ShadowMaterial({
        color: 0x0e1010,
        opacity: 0.2,
        transparent: true,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), shadowMaterial);
    shadowPlane.position.z = -4;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const modes = [
        {
            rotation: { x: -0.52, y: 0.08, z: 0.2 },
            depth: [-0.82, 0, 0.82],
            colors: [0x0e1010, 0x1648ff, 0xd9ff55],
        },
        {
            rotation: { x: -0.76, y: -0.33, z: -0.24 },
            depth: [-2.45, 0, 2.45],
            colors: [0x1648ff, 0xff5836, 0xf8f6ef],
        },
        {
            rotation: { x: -0.2, y: 0.42, z: 0.46 },
            depth: [-3.1, 0, 3.1],
            colors: [0x0e1010, 0x9ecbc5, 0xff5836],
        },
    ];

    const baseRotation = { ...modes[0].rotation };
    const dragCurrent = { x: 0, y: 0 };
    const dragTarget = { x: 0, y: 0 };
    let activeMode = 0;
    let dragging = false;
    let pointerId = null;
    let lastPointer = { x: 0, y: 0 };
    let visible = true;
    let frame = 0;
    let disposed = false;

    function setMode(modeIndex, animate = true) {
        const next = Math.max(0, Math.min(modes.length - 1, Number(modeIndex) || 0));
        activeMode = next;
        const mode = modes[next];
        const gsap = window.gsap;

        if (animate && gsap && !reducedMotion.matches) {
            gsap.killTweensOf(baseRotation);
            gsap.to(baseRotation, { ...mode.rotation, duration: 1.1, ease: "power3.inOut" });
            layers.forEach((layer, index) => {
                gsap.killTweensOf(layer.position);
                gsap.to(layer.position, {
                    z: mode.depth[index],
                    duration: 1.05,
                    delay: index * 0.045,
                    ease: "power3.inOut",
                });
                const target = new THREE.Color(mode.colors[index]);
                gsap.killTweensOf(materials[index].color);
                gsap.to(materials[index].color, {
                    r: target.r,
                    g: target.g,
                    b: target.b,
                    duration: 0.75,
                    ease: "power2.inOut",
                });
            });
        } else {
            Object.assign(baseRotation, mode.rotation);
            layers.forEach((layer, index) => {
                layer.position.z = mode.depth[index];
                materials[index].color.set(mode.colors[index]);
            });
        }
    }

    function resetRotation() {
        const gsap = window.gsap;
        if (gsap && !reducedMotion.matches) {
            gsap.to(dragTarget, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
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
        dragTarget.y += deltaX * 0.006;
        dragTarget.x = THREE.MathUtils.clamp(dragTarget.x + deltaY * 0.004, -0.58, 0.58);
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

    function onKeyDown(event) {
        const amount = event.shiftKey ? 0.18 : 0.08;
        if (event.key === "ArrowLeft") dragTarget.y -= amount;
        else if (event.key === "ArrowRight") dragTarget.y += amount;
        else if (event.key === "ArrowUp") dragTarget.x = THREE.MathUtils.clamp(dragTarget.x - amount, -0.58, 0.58);
        else if (event.key === "ArrowDown") dragTarget.x = THREE.MathUtils.clamp(dragTarget.x + amount, -0.58, 0.58);
        else if (event.key.toLowerCase() === "r") resetRotation();
        else if (event.key === "PageUp") {
            window.dispatchEvent(new CustomEvent("atlas:mode-request", { detail: { mode: (activeMode + 2) % 3 } }));
        } else if (event.key === "PageDown") {
            window.dispatchEvent(new CustomEvent("atlas:mode-request", { detail: { mode: (activeMode + 1) % 3 } }));
        } else return;
        event.preventDefault();
    }

    const abortController = new AbortController();
    const signal = abortController.signal;
    stage.addEventListener("pointerdown", onPointerDown, { signal });
    stage.addEventListener("pointermove", onPointerMove, { signal });
    stage.addEventListener("pointerup", endDrag, { signal });
    stage.addEventListener("pointercancel", endDrag, { signal });
    stage.addEventListener("lostpointercapture", endDrag, { signal });
    stage.addEventListener("keydown", onKeyDown, { signal });
    window.addEventListener("atlas:mode", (event) => setMode(event.detail?.mode), { signal });

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
        { rootMargin: "150px" },
    );
    visibilityObserver.observe(stage);

    function render(time) {
        if (disposed) return;
        frame = requestAnimationFrame(render);
        if (!visible || document.hidden) return;

        const ease = reducedMotion.matches ? 1 : dragging ? 0.24 : 0.11;
        dragCurrent.x += (dragTarget.x - dragCurrent.x) * ease;
        dragCurrent.y += (dragTarget.y - dragCurrent.y) * ease;
        const idle = reducedMotion.matches ? 0 : Math.sin(time * 0.00028) * 0.025;
        mapGroup.rotation.set(
            baseRotation.x + dragCurrent.x,
            baseRotation.y + dragCurrent.y + idle,
            baseRotation.z,
        );
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
    setMode(0, false);
    render(0);
    root.classList.add("atlas-ready");
    window.dispatchEvent(new CustomEvent("atlas:ready"));
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
    console.warn("The 3D atlas could not start; showing the static relief.", error);
    root.classList.add("atlas-failed");
    if (status) {
        status.textContent = root.dataset.language === "en"
            ? "Static map mode"
            : "已切換為靜態地圖";
    }
}
