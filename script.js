const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const navLinksContainer = document.querySelector(".nav-links");
const navHighlight = document.querySelector(".nav-highlight");
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

const updateNavHighlight = () => {
    if (!navLinksContainer || !navHighlight || window.innerWidth <= 780) {
        return;
    }

    const activeLink = navLinksContainer.querySelector(".nav-link.active");
    if (!activeLink) {
        navHighlight.style.opacity = "0";
        return;
    }

    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const offsetLeft = linkRect.left - containerRect.left;
    const offsetTop = linkRect.top - containerRect.top;

    navHighlight.style.width = `${linkRect.width}px`;
    navHighlight.style.height = `${linkRect.height}px`;
    navHighlight.style.transform = `translate3d(${offsetLeft}px, 0, 0)`;
    navHighlight.style.top = `${offsetTop}px`;
    navHighlight.style.opacity = "1";
};

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    updateNavHighlight();
};

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveLink(target.id);
    });
});

const syncActiveSection = () => {
    const scrollMarker = window.scrollY + 180;
    let currentSection = sections[0];

    sections.forEach((section) => {
        if (scrollMarker >= section.offsetTop) {
            currentSection = section;
        }
    });

    if (currentSection) {
        setActiveLink(currentSection.id);
    }
};

window.addEventListener(
    "scroll",
    () => {
        syncActiveSection();
    },
    { passive: true }
);
window.addEventListener("resize", () => {
    syncActiveSection();
    updateNavHighlight();
});
window.addEventListener("load", () => {
    syncActiveSection();
    updateNavHighlight();
});

syncActiveSection();

const contactForm = document.getElementById("contactForm");
let formFeedbackTimeout;

if (contactForm) {
    const webhookUrl = "https://discord.com/api/webhooks/1496552343356047380/lo3sUEjYOQwORO2xCGkd0y5uwxzz8xCwBgI_KbZWW79B_-sfykdL62-M-IjDcFromtP4";

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const button = this.querySelector(".form-submit");
        const successBox = document.getElementById("formSuccess");
        const name = document.getElementById("name")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const subject = document.getElementById("subject")?.value.trim() || "_(none)_";
        const message = document.getElementById("message")?.value.trim() || "";

        if (!webhookUrl || webhookUrl === "PASTE_YOUR_DISCORD_WEBHOOK_URL_HERE") {
            if (successBox) {
                successBox.textContent = "Add your Discord webhook URL in script.js to enable the form.";
                successBox.style.color = "#f4c16d";
                successBox.style.display = "block";
            }
            return;
        }

        if (button) {
            button.textContent = "Sending...";
            button.disabled = true;
        }

        if (successBox) {
            successBox.style.display = "none";
        }

        window.clearTimeout(formFeedbackTimeout);

        const payload = {
            username: "Portfolio Contact Form",
            avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
            embeds: [
                {
                    title: "New Message from Portfolio",
                    color: 0xc8a96e,
                    fields: [
                        { name: "Name", value: name, inline: true },
                        { name: "Email", value: email, inline: true },
                        { name: "Subject", value: subject, inline: false },
                        { name: "Message", value: message, inline: false },
                    ],
                    footer: { text: "Aaditya Portfolio" },
                    timestamp: new Date().toISOString(),
                },
            ],
        };

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Webhook error");
            }

            if (successBox) {
                successBox.textContent = "Message sent! I'll get back to you soon.";
                successBox.style.color = "#9fdfb3";
                successBox.style.display = "block";
                formFeedbackTimeout = window.setTimeout(() => {
                    successBox.style.display = "none";
                }, 3200);
            }

            this.reset();
        } catch (error) {
            if (successBox) {
                successBox.textContent = "Something went wrong. Please email me directly.";
                successBox.style.color = "#ff8e8e";
                successBox.style.display = "block";
            }
        }

        if (button) {
            button.textContent = "Send ->";
            button.disabled = false;
        }
    });
}

const copyEmailButton = document.getElementById("copyEmail");
const copyToast = document.getElementById("copyToast");
let copyToastTimeout;

const showCopyToast = (message) => {
    if (!copyToast) {
        return;
    }

    copyToast.textContent = message;
    copyToast.classList.add("is-visible");

    window.clearTimeout(copyToastTimeout);
    copyToastTimeout = window.setTimeout(() => {
        copyToast.classList.remove("is-visible");
    }, 1800);
};

if (copyEmailButton) {
    copyEmailButton.addEventListener("click", async () => {
        const email = "aadityaa0069@gmail.com";

        try {
            await navigator.clipboard.writeText(email);
            copyEmailButton.querySelector(".social-meta").textContent = "Copied";
            showCopyToast("Email copied");
            window.setTimeout(() => {
                copyEmailButton.querySelector(".social-meta").textContent = "Copy";
            }, 1400);
        } catch (error) {
            window.alert(email);
        }
    });
}

const cursorRing = document.querySelector(".cursor-ring");

if (cursorRing && window.matchMedia("(pointer: fine)").matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const animateCursor = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        cursorRing.style.left = `${currentX}px`;
        cursorRing.style.top = `${currentY}px`;
        window.requestAnimationFrame(animateCursor);
    };

    window.addEventListener("mousemove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        cursorRing.classList.add("is-visible");
    });

    window.addEventListener("mousedown", () => {
        cursorRing.classList.add("is-active");
    });

    window.addEventListener("mouseup", () => {
        cursorRing.classList.remove("is-active");
    });

    document.querySelectorAll("a, button, input, textarea, label").forEach((element) => {
        element.addEventListener("mouseenter", () => {
            cursorRing.classList.add("is-active");
        });

        element.addEventListener("mouseleave", () => {
            cursorRing.classList.remove("is-active");
        });
    });

    document.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("is-visible");
    });

    animateCursor();
}
