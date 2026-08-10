export function setupInteractions({
    cursor,
    enter,
    pointer,
    prefersReduced,
    isTouch
}) {

    const state = {
        scrollVelocity: 0,
        scrollProgress: 0,
        activeSection: "top",
        lastScroll: window.scrollY,
        lastTime: performance.now(),
        pointerDown: false
    };


    /* =====================================================
       POINTER
    ===================================================== */

    const updatePointer = (event) => {

        pointer.tx =
            (event.clientX / window.innerWidth) * 2 - 1;

        pointer.ty =
            -(
                (event.clientY / window.innerHeight) * 2 - 1
            );


        if (!isTouch && cursor) {

            cursor.style.transform =
                `translate3d(
                    ${event.clientX}px,
                    ${event.clientY}px,
                    0
                ) translate(-50%, -50%)`;

        }

    };


    window.addEventListener(
        "pointermove",
        updatePointer,
        { passive: true }
    );


    window.addEventListener(
        "pointerdown",
        () => {

            state.pointerDown = true;

            cursor?.classList.add("is-pressed");

        },
        { passive: true }
    );


    window.addEventListener(
        "pointerup",
        () => {

            state.pointerDown = false;

            cursor?.classList.remove("is-pressed");

        },
        { passive: true }
    );


    /* =====================================================
       SCROLL
    ===================================================== */

    window.addEventListener(
        "scroll",
        () => {

            const now =
                performance.now();

            const elapsed =
                Math.max(
                    16,
                    now - state.lastTime
                );

            const nextScroll =
                window.scrollY;

            state.scrollVelocity =
                (nextScroll - state.lastScroll) /
                elapsed;

            state.lastScroll =
                nextScroll;

            state.lastTime =
                now;

            const scrollable =
                Math.max(
                    1,
                    document.documentElement.scrollHeight -
                    window.innerHeight
                );

            state.scrollProgress =
                Math.min(
                    1,
                    Math.max(
                        0,
                        nextScroll / scrollable
                    )
                );

        },
        { passive: true }
    );


    /* =====================================================
       ACTIVE SECTION
    ===================================================== */

    const sections =
        [
            ...document.querySelectorAll(
                "main section[id]"
            )
        ];


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    const visible =
                        entries
                            .filter(
                                entry =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            )[0];

                    if (visible) {

                        state.activeSection =
                            visible.target.id;

                    }

                },
                {
                    rootMargin:
                        "-35% 0px -45% 0px",

                    threshold: [
                        0.05,
                        0.25,
                        0.6
                    ]
                }
            );


        sections.forEach(
            section =>
                observer.observe(section)
        );

    }


    /* =====================================================
       ENTER BUTTON
    ===================================================== */

    if (enter) {

        enter.addEventListener(
            "click",
            () => {

                document
                    .querySelector("#work")
                    ?.scrollIntoView({
                        behavior:
                            prefersReduced
                                ? "auto"
                                : "smooth",

                        block: "start"
                    });

            }
        );

    }


    /* =====================================================
       CURSOR
    ===================================================== */

    if (!isTouch && cursor) {

        document
            .querySelectorAll(
                "[data-hover], .project, button, a"
            )
            .forEach(
                (element) => {

                    element.addEventListener(
                        "mouseenter",
                        () => {

                            cursor.classList.add(
                                "active"
                            );

                        }
                    );


                    element.addEventListener(
                        "mouseleave",
                        () => {

                            cursor.classList.remove(
                                "active"
                            );

                        }
                    );

                }
            );

    }


    return {

        getScrollVelocity:
            () =>
                state.scrollVelocity,

        getScrollProgress:
            () =>
                state.scrollProgress,

        getActiveSection:
            () =>
                state.activeSection,

        dampScroll:
            () => {
                state.scrollVelocity *= 0.86;
            },

        destroy:
            () => {}

    };

}