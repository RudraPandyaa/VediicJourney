<template>
  <footer class="site-footer">

    <!-- ================================
         ACCREDITATIONS
    ================================= -->
    <section class="footer-accreditations">
      <div class="footer-container">

        <div class="accreditation-grid">

          <div class="accreditation-item">
            <img
              src="/images/footer/images.png"
              alt="MATAI Fiji Happiness Specialist"
            />
          </div>

          <div class="accreditation-item">
            <img
              src="/images/footer/images.png"
              alt="Aussie Specialist"
            />
          </div>

          <div class="accreditation-item">
            <img
              src="/images/footer/images.png"
              alt="IATA TIDS"
            />
          </div>

          <div class="accreditation-item">
            <img
              src="/images/footer/images.png"
              alt="ETAA"
            />
          </div>

          <div class="accreditation-item">
            <img
              src="/images/footer/images.png"
              alt="TOAI"
            />
          </div>

        </div>

      </div>
    </section>


    <!-- ================================
         MAIN FOOTER
    ================================= -->
    <section class="footer-main">

      <div class="footer-container">

        <div class="footer-divider"></div>

        <div class="footer-grid">

          <!-- LEFT -->
          <div class="footer-brand">

            <NuxtLink to="/" class="footer-logo">
              <img
                src="/images/logo/logo.png"
                alt="Vedic Journey"
              />
            </NuxtLink>

            <address class="footer-address">
              Innov8 CP2, 44, Backary Portion<br />
              2nd Floor, Regal Building,<br />
              New Delhi, 110001
            </address>

            <!-- SOCIAL -->
            <div class="footer-socials">

              <a
                href="#"
                class="social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    class="social-dot"
                  />
                </svg>
              </a>

              <a
                href="#"
                class="social-link"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="#"
                class="social-link"
                aria-label="Pinterest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3a8.5 8.5 0 0 0-3.1 16.4c-.1-1.4 0-3 .4-4.2l1.1-4.7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-4.8 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.2-4.8 4.5 0 .9.3 1.8.8 2.3.1.1.1.2.1.4l-.3 1.2c-.1.4-.4.5-.7.3-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.2 6.7-6.2 3.5 0 6.3 2.5 6.3 5.7 0 3.4-2.1 6.1-5.1 6.1-1 0-2-.5-2.3-1.1l-.6 2.3c-.2.9-.8 2-1.2 2.7.9.3 1.8.5 2.8.5A8.5 8.5 0 1 0 12 3Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="#"
                class="social-link"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 8.5A2 2 0 1 0 5 4.5a2 2 0 0 0 0 4ZM3.5 10h3v10h-3V10Zm5 0h2.9v1.4h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.9V20h-3v-4.8c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V20h-3V10Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

            </div>

          </div>


          <!-- QUICK LINKS -->
          <nav class="footer-quick-links" aria-label="Quick Links">

            <p class="quick-links-eyebrow">
              Quick Links
            </p>

            <div class="quick-links-list">

              <NuxtLink to="/contact">
                Contact Us
              </NuxtLink>

              <NuxtLink to="/about">
                About Us
              </NuxtLink>

              <NuxtLink to="/blogs">
                Blogs
              </NuxtLink>

              <NuxtLink to="/destinations">
                Destinations
              </NuxtLink>

              <NuxtLink to="/support/visa">
                Visa Assistant
              </NuxtLink>

              <NuxtLink to="/support/private-chauffeur">
                Cab Services
              </NuxtLink>

            </div>

          </nav>


          <!-- RIGHT -->
          <div class="footer-newsletter">

            <div class="newsletter-card">

              <p class="newsletter-eyebrow">
                Stay Inspired
              </p>

              <h2 class="newsletter-title">
                JOURNEYS, STORIES<br />
                &amp; INSPIRATION.
              </h2>

              <p class="newsletter-description">
                Subscribe for exclusive travel inspiration,
                destination stories and thoughtfully curated offers.
              </p>

              <form
                class="newsletter-form"
                @submit.prevent
              >

                <label for="footer-email">
                  Email Address
                </label>

                <div class="newsletter-input-row">

                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Enter your email"
                    autocomplete="email"
                  />

                  <button type="submit">
                    Subscribe
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>


        <!-- BOTTOM -->
        <div class="footer-bottom">

          <p>
            © {{ currentYear }} Vedic Journey.
            All rights reserved.
          </p>

          <div class="footer-bottom-links">
            <NuxtLink to="/privacy-policy">
              Privacy Policy
            </NuxtLink>

            <NuxtLink to="/terms">
              Terms &amp; Conditions
            </NuxtLink>
          </div>

        </div>

      </div>

    </section>

  </footer>
</template>


<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>


<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;


/* =========================================
   FOOTER
========================================= */

.site-footer {
  width: 100%;
  background: #e9e6dc;
}


/* =========================================
   CONTAINER
========================================= */

.footer-container {
  width: min(100% - 80px, 1440px);
  margin: 0 auto;
}


/* =========================================
   ACCREDITATIONS
========================================= */

.footer-accreditations {
  padding: 45px 0 35px;
  background: #e9e6dc;
}

.accreditation-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
  gap: 35px;
}

.accreditation-item {
  width: 100%;
  height: 90px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.accreditation-item img {
  max-width: 120px;
  max-height: 120px;
  width: auto;
  height: auto;

  object-fit: contain;

  opacity: 0.8;

  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.accreditation-item:hover img {
  opacity: 1;
  transform: translateY(-4px);
}


/* =========================================
   DIVIDER
========================================= */

.footer-divider {
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.4);
}


/* =========================================
   MAIN
========================================= */

.footer-main {
  padding-bottom: 35px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 0.8fr 0.42fr 1.08fr;
  gap: 55px;

  padding: 45px 0 45px;
}


/* =========================================
   BRAND
========================================= */

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 28px;
}

.footer-logo img {
  width: 240px;
  max-width: 100%;
  height: auto;
  display: block;
}


.footer-address {
  margin: 0;

  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  font-style: normal;
  font-weight: 400;

  color: rgba(0, 0, 0, 0.75);
}


/* =========================================
   SOCIAL
========================================= */

.footer-socials {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
}

.social-link {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 50%;

  color: black;

  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
}

.social-link svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.social-link:hover {
  background: Transparent;
  border-color: #000000;
  color: $color-charcoal;
  transform: translateY(-3px);
}


/* =========================================
   QUICK LINKS
========================================= */

.footer-quick-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 4px;
}

.quick-links-eyebrow {
  margin: 0 0 18px;

  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  font-weight: 600;

  letter-spacing: 0.02em;
  text-transform: uppercase;

  color: #000000;
}

.quick-links-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.quick-links-list a {
  position: relative;

  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 400;

  color: rgba(0, 0, 0, 0.68);
  text-decoration: none;

  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

.quick-links-list a::after {
  content: '';

  position: absolute;
  right: 0;
  bottom: -3px;
  left: 0;

  height: 1px;

  background: currentColor;

  transform: scaleX(0);
  transform-origin: left;

  transition: transform 0.3s ease;
}

.quick-links-list a:hover {
  color: #000000;
  transform: translateX(3px);
}

.quick-links-list a:hover::after {
  transform: scaleX(1);
}


/* =========================================
   NEWSLETTER
========================================= */

.footer-newsletter {
  display: flex;
  align-items: stretch;
}

.newsletter-card {
  width: 100%;

  padding: 32px;

  border: 1px solid rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.045);
}


/* eyebrow */

.newsletter-eyebrow {
  margin: 0 0 16px;

  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.18em;
  text-transform: uppercase;

  color: #000000;
}


/* title */

.newsletter-title {
  margin: 0;

  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(38px, 4vw, 62px);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: 0.025em;

  color: #030303;
}


/* description */

.newsletter-description {
  max-width: 520px;

  margin: 20px 0 28px;

  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  font-weight: 400;

  color: rgba(0, 0, 0, 0.65);
}


/* form */

.newsletter-form {
  display: flex;
  flex-direction: column;
}

.newsletter-form label {
  margin-bottom: 10px;

  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.12em;
  text-transform: uppercase;

  color: rgba(0, 0, 0, 0.7);
}

.newsletter-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.newsletter-input-row input {
  min-width: 0;
  height: 52px;

  padding: 0 17px;

  border: 1px solid rgba(2, 2, 2, 0.25);
  border-radius: 0;

  outline: none;

  background: rgba(255, 255, 255, 0.06);

  color: $color-ivory;

  font-family: 'Manrope', sans-serif;
  font-size: 14px;

  transition: border-color 0.3s ease;
}

.newsletter-input-row input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.newsletter-input-row input:focus {
  border-color: #030303;
}

.newsletter-input-row button {
  height: 52px;

  padding: 0 28px;

  border: 1px solid #ffffff;
  border-radius: 0;

  background: #ffffff;
  color: #030303;

  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.12em;
  text-transform: uppercase;

  cursor: pointer;

  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.newsletter-input-row button:hover {
  background: transparent;
  color: #000000;
}


/* =========================================
   BOTTOM
========================================= */

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 18px;

  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.footer-bottom p {
  margin: 0;

  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  letter-spacing: 0.04em;

  color: rgba(0, 0, 0, 0.45);
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.footer-bottom-links a {
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  color: rgba(0, 0, 0, 0.45);

  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: #bd9b07;
}


/* =========================================
   TABLET
========================================= */

@media (max-width: 991px) {

  .footer-container {
    width: min(100% - 50px, 1440px);
  }

  .footer-accreditations {
    padding: 60px 0 50px;
  }

  .accreditation-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 35px;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 40px 0 40px;
  }

  .footer-brand {
    grid-column: 1;
  }

  .footer-quick-links {
    grid-column: 2;
  }

  .footer-newsletter {
    grid-column: 1 / -1;
  }

}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 600px) {

  .footer-container {
    width: min(100% - 32px, 1440px);
  }


  /* Accreditations */

  .footer-accreditations {
    padding: 35px 0 30px;
  }

  .accreditation-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px 15px;
  }

  .accreditation-item {
    height: 80px;
  }

  .accreditation-item img {
    max-width: 115px;
    max-height: 75px;
  }


  /* Main */

  .footer-grid {
    grid-template-columns: 1fr;
    padding: 40px 0;
    gap: 35px;
  }

  .footer-brand,
  .footer-quick-links,
  .footer-newsletter {
    grid-column: auto;
  }


  /* Logo */

  .footer-logo {
    margin-bottom: 24px;
  }

  .footer-logo img {
    width: 200px;
  }


  /* Address */

  .footer-address {
    font-size: 14px;
  }


  /* Social */

  .footer-socials {
    margin-top: 24px;
  }

  .social-link {
    width: 44px;
    height: 44px;
  }


  /* Quick Links */

  .footer-quick-links {
    padding-top: 0;
  }

  .quick-links-list {
    gap: 10px;
  }

  .quick-links-list a {
    font-size: 13px;
  }


  /* Newsletter */

  .newsletter-card {
    padding: 26px 22px;
  }

  .newsletter-title {
    font-size: 42px;
  }

  .newsletter-description {
    font-size: 13px;
    margin: 20px 0 28px;
  }

  .newsletter-input-row {
    grid-template-columns: 1fr;
  }

  .newsletter-input-row input,
  .newsletter-input-row button {
    width: 100%;
  }


  /* Bottom */

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;

    padding: 22px 0;
  }

  .footer-bottom-links {
    flex-wrap: wrap;
    gap: 15px 22px;
  }

}
</style>