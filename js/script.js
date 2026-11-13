(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const activePage = document.body.dataset.page;

  if (activePage) {
    navLinks.forEach((link) => {
      const isActive =
        link.dataset.page === activePage ||
        (activePage.startsWith("service-detail") && link.dataset.page === "services");
      link.classList.toggle("active", isActive);
    });
  }

  const closeMenu = () => {
    menuToggle?.classList.remove("active");
    navMenu?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.classList.toggle("active");
    navMenu?.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (navMenu?.classList.contains("open") && !event.target.closest(".nav")) closeMenu();
  });

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((faqItem) => {
        faqItem.classList.remove("open");
        faqItem.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const submitButton = document.getElementById("submit-button");
    const messageBox = document.getElementById("contact-form-status");
    const fields = {
      fullName: document.getElementById("full-name"),
      phoneNumber: document.getElementById("phone-number"),
      vehicleType: document.getElementById("vehicle-type"),
      serviceInterest: document.getElementById("service-interest"),
      message: document.getElementById("message")
    };

    const setError = (field, message) => {
      const fieldError = field.closest(".field").querySelector(".field-error");
      field.setAttribute("aria-invalid", "true");
      fieldError.textContent = message;
    };

    const clearError = (field) => {
      const fieldError = field.closest(".field").querySelector(".field-error");
      field.setAttribute("aria-invalid", "false");
      fieldError.textContent = "";
    };

    const validatePhone = (value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    };

    const clearFormStatus = () => {
      messageBox.classList.remove("is-success", "is-error");
      messageBox.textContent = "";
    };

    Object.entries(fields).forEach(([key, field]) => {
      if (!field) return;
      field.addEventListener("input", () => {
        if (field.value.trim()) {
          clearError(field);
        }
        clearFormStatus();
      });
      field.addEventListener("change", () => {
        if (field.value) {
          clearError(field);
        }
        clearFormStatus();
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFormStatus();

      let isValid = true;
      const entries = Object.values(fields);

      entries.forEach((field) => {
        if (!field) return;
        const value = field.value.trim();
        const fieldName = field.name;

        if (fieldName === "fullName" && !value) {
          setError(field, "Please enter your full name.");
          isValid = false;
        } else if (fieldName === "phoneNumber") {
          if (!value) {
            setError(field, "Please enter your phone number.");
            isValid = false;
          } else if (!validatePhone(value)) {
            setError(field, "Please enter a valid phone number.");
            isValid = false;
          } else {
            clearError(field);
          }
        } else if (fieldName === "vehicleType" && !value) {
          setError(field, "Please select a vehicle type.");
          isValid = false;
        } else if (fieldName === "serviceInterest" && !value) {
          setError(field, "Please select a service.");
          isValid = false;
        } else if (fieldName === "message" && !value) {
          setError(field, "Please tell us what you need.");
          isValid = false;
        } else {
          clearError(field);
        }
      });

      if (!isValid) {
        messageBox.classList.add("is-error");
        messageBox.textContent = "Please correct the highlighted fields and try again.";
        const firstInvalid = entries.find((field) => field && field.getAttribute("aria-invalid") === "true");
        firstInvalid?.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Opening WhatsApp...";
      messageBox.classList.add("is-success");
      messageBox.textContent = "Your pre-filled WhatsApp message is ready. Please send it to complete your enquiry.";

      const whatsappText = [
        `Customer Name: ${fields.fullName.value.trim()}`,
        `Phone Number: ${fields.phoneNumber.value.trim()}`,
        `Vehicle Type: ${fields.vehicleType.value}`,
        `Service Interested In: ${fields.serviceInterest.value}`,
        `Message:\n${fields.message.value.trim()}`
      ].join("\n");

      const whatsappUrl = `https://wa.me/2347085170538?text=${encodeURIComponent(whatsappText)}`;
      const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      if (!popup) {
        messageBox.classList.remove("is-success");
        messageBox.classList.add("is-error");
        messageBox.innerHTML = 'WhatsApp could not be opened automatically. <a href="' + whatsappUrl + '" target="_blank" rel="noopener">Open the pre-filled WhatsApp message here.</a>';
      }

      submitButton.disabled = false;
      submitButton.textContent = "Send Enquiry";
    });
  }

  const sections = [...document.querySelectorAll("main section[id], header[id]")];
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-30% 0px -65%", threshold: 0 });
  sections.forEach((section) => activeObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
})();

