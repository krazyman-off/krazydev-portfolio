(function () {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var submit = document.getElementById("cf-submit");
    var status = document.getElementById("cf-status");
    var sent = false;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var honey = form.querySelector('[name="_honey"]');
        if (honey && honey.value !== "") return;
        if (!form.checkValidity()) { form.reportValidity(); return; }

        if (sent) {
            if (status) { status.textContent = "Message déjà envoyé — regarde tes mails ✔"; status.style.color = "var(--red)"; }
            return;
        }

        var btnText = submit.textContent;
        submit.disabled = true;
        submit.style.opacity = ".6";
        submit.textContent = "Envoi en cours…";
        if (status) { status.textContent = "Envoi en cours…"; status.style.color = ""; }

        fetch(form.action, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Accept": "application/json" },
            body: new URLSearchParams(new FormData(form)).toString()
        })
        .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            sent = true;
            submit.textContent = "Message bien envoyé ✓";
            submit.style.opacity = "1";
            if (status) { status.textContent = "C'est envoyé ! Réponse sous 24h à " + (form.querySelector('[name="email"]').value || "ton email") + "."; status.style.color = "var(--red)"; }
            form.reset();
        })
        .catch(function () {
            submit.disabled = false;
            submit.textContent = btnText;
            submit.style.opacity = "1";
            if (status) { status.textContent = "Erreur réseau — écris-moi directement à krazyman.off@gmail.com."; status.style.color = "var(--red)"; }
        });
    });
})();