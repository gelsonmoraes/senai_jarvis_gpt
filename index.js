const switchButton = document.querySelector(".switch-button input");

switchButton.addEventListener("click", () => {
    if (switchButton.checked) {
        // Enable dark mode
        document.body.classList.add("dark-mode");
    } else {
        // Disable dark mode
        document.body.classList.remove("dark-mode");
    }
});
