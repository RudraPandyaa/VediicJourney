<template>
  <div class="editor-page">
    <header class="editor-header">
      <div>
        <button class="back-btn" @click="navigateTo('/pages')">
          ← Back to Pages
        </button>

        <span class="eyebrow">PAGE CMS</span>
        <h1>{{ page?.title || pageLabel }}</h1>

        <p>
          Manage page content, SEO and publishing settings.
        </p>
      </div>

      <div v-if="page" class="header-actions">
        <span
          class="status"
          :class="form.isPublished ? 'published' : 'draft'"
        >
          {{ form.isPublished ? 'Published' : 'Draft' }}
        </span>

        <button
          class="save-btn"
          :disabled="saving"
          @click="savePage"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </header>

    <div v-if="loadingPage" class="loading-state">
      Loading page content...
    </div>

    <div v-else-if="loadError" class="error-state">
      <strong>Unable to load page</strong>
      <span>{{ loadError }}</span>

      <button @click="loadPage">
        Try Again
      </button>
    </div>

    <template v-else-if="page">
      <div class="editor-layout">
        <!-- MAIN -->
        <main class="editor-main">
          <!-- General -->
          <section class="panel">
            <div class="panel-heading">
              <div>
                <span>GENERAL</span>
                <h2>Page Information</h2>
              </div>
            </div>

            <div class="field">
              <label>Page Title</label>

              <input
                v-model="form.title"
                type="text"
                maxlength="150"
                placeholder="Page title"
              />

              <small>
                Internal/page-level title. Maximum 150 characters.
              </small>
            </div>
          </section>

          <!-- CONTENT -->
          <section class="panel">
            <div class="panel-heading">
              <div>
                <span>CONTENT</span>
                <h2>Page Sections</h2>
              </div>

              <span class="page-type">
                {{ pageLabel }}
              </span>
            </div>

            <!-- HOME -->
            <template v-if="pageKey === 'home'">
              <!-- 01 HERO -->
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero Section</h3>
                    <p>Main homepage introduction and hero media.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Eyebrow</label>
                  <input
                    v-model="form.content.hero.eyebrow"
                    type="text"
                    placeholder="Bespoke journeys, thoughtfully designed"
                  />
                </div>

                <div class="field">
                  <label>Title</label>
                  <input
                    v-model="form.content.hero.title"
                    type="text"
                    placeholder="Travel beyond the ordinary"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>CTA Label</label>
                    <input
                      v-model="form.content.hero.primaryCta.label"
                      type="text"
                      placeholder="Plan Your Journey"
                    />
                  </div>

                  <div class="field">
                    <label>CTA Link</label>
                    <input
                      v-model="form.content.hero.primaryCta.href"
                      type="text"
                      placeholder="/contact"
                    />
                  </div>
                </div>

                <div class="field">
                  <label>Hero Video</label>

                  <button
                    type="button"
                    class="media-select"
                    @click="openHomeMediaPicker('heroVideo', 'video')"
                  >
                    {{ form.content.hero.video
                      ? 'Change Hero Video'
                      : '+ Select Hero Video' }}
                  </button>
                </div>
              </div>

              <!-- 02 DESTINATIONS -->
              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Destinations</h3>
                    <p>Homepage destination discovery section.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Eyebrow</label>
                  <input
                    v-model="form.content.destinations.eyebrow"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Title</label>
                  <input
                    v-model="form.content.destinations.title"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.destinations.description"
                    rows="4"
                  />
                </div>

                <div class="field">
                  <label>Featured Region Slugs</label>
                  <input
                    :value="form.content.destinations.featuredRegionSlugs.join(', ')"
                    type="text"
                    placeholder="asia, europe, africa"
                    @input="
                      form.content.destinations.featuredRegionSlugs =
                        splitCommaList(($event.target as HTMLInputElement).value)
                    "
                  />
                  <small>Comma-separated region slugs.</small>
                </div>
              </div>

              <!-- 03 EXPERIENCES -->
              <div class="section-block">
                <div class="section-title">
                  <span>03</span>
                  <div>
                    <h3>Experiences</h3>
                    <p>Homepage experience discovery configuration.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Title</label>
                  <input
                    v-model="form.content.experiences.title"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Featured Experience Slugs</label>
                  <input
                    :value="form.content.experiences.featuredExperienceSlugs.join(', ')"
                    type="text"
                    placeholder="spiritual, wellness, adventure"
                    @input="
                      form.content.experiences.featuredExperienceSlugs =
                        splitCommaList(($event.target as HTMLInputElement).value)
                    "
                  />
                  <small>Comma-separated experience slugs.</small>
                </div>
              </div>

              <!-- 04 INDIA SPOTLIGHT -->
              <div class="section-block">
                <div class="section-title">
                  <span>04</span>
                  <div>
                    <h3>India Spotlight</h3>
                    <p>India feature section displayed on the homepage.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Label</label>
                  <input
                    v-model="form.content.indiaSpotlight.label"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description — Paragraph 1</label>
                  <textarea
                    v-model="form.content.indiaSpotlight.description[0]"
                    rows="5"
                  />
                </div>

                <div class="field">
                  <label>Description — Paragraph 2</label>
                  <textarea
                    v-model="form.content.indiaSpotlight.description[1]"
                    rows="5"
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>CTA Label</label>
                    <input
                      v-model="form.content.indiaSpotlight.cta.label"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label>CTA Link</label>
                    <input
                      v-model="form.content.indiaSpotlight.cta.href"
                      type="text"
                    />
                  </div>
                </div>

                <div class="field">
                  <label>Display Lines</label>
                  <input
                    :value="form.content.indiaSpotlight.displayLines.join(', ')"
                    type="text"
                    placeholder="LET'S, EXPERIENCE, INDIA..."
                    @input="
                      form.content.indiaSpotlight.displayLines =
                        splitCommaList(($event.target as HTMLInputElement).value)
                    "
                  />
                  <small>Comma-separated animated display lines.</small>
                </div>

                <div class="field">
                  <label>India Spotlight Video</label>

                  <button
                    type="button"
                    class="media-select"
                    @click="openHomeMediaPicker('indiaVideo', 'video')"
                  >
                    {{
                      form.content.indiaSpotlight.video
                        ? 'Change Video'
                        : '+ Select Video'
                    }}
                  </button>
                </div>
              </div>

              <!-- 05 REGION SHOWCASE -->
              <div class="section-block">
                <div class="section-title">
                  <span>05</span>
                  <div>
                    <h3>Region Showcase</h3>
                    <p>Animated region showcase configuration.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Display Lines</label>
                  <input
                    :value="form.content.journeys.displayLines.join(', ')"
                    type="text"
                    @input="
                      form.content.journeys.displayLines =
                        splitCommaList(($event.target as HTMLInputElement).value)
                    "
                  />
                </div>

                <div class="field">
                  <label>Featured Region Slugs</label>
                  <input
                    :value="form.content.journeys.featuredRegionSlugs.join(', ')"
                    type="text"
                    placeholder="europe, africa, asia, south-america"
                    @input="
                      form.content.journeys.featuredRegionSlugs =
                        splitCommaList(($event.target as HTMLInputElement).value)
                    "
                  />
                </div>
              </div>

              <!-- 06 PHILOSOPHY -->
              <div class="section-block">
                <div class="section-title">
                  <span>06</span>
                  <div>
                    <h3>Philosophy</h3>
                    <p>Vedic Journey philosophy section.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Eyebrow</label>
                  <input
                    v-model="form.content.philosophy.eyebrow"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Title</label>
                  <input
                    v-model="form.content.philosophy.title"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.philosophy.description"
                    rows="5"
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>CTA Label</label>
                    <input
                      v-model="form.content.philosophy.cta.label"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label>CTA Link</label>
                    <input
                      v-model="form.content.philosophy.cta.href"
                      type="text"
                    />
                  </div>
                </div>

                <div class="field">
                  <label>Philosophy Image</label>

                  <button
                    type="button"
                    class="media-select"
                    @click="openHomeMediaPicker('philosophyImage', 'image')"
                  >
                    {{
                      form.content.philosophy.image
                        ? 'Change Philosophy Image'
                        : '+ Select Image'
                    }}
                  </button>
                </div>
              </div>
              <!-- 07 WHY CHOOSE US -->

              <div class="section-block">
                <div class="section-title">
                  <span>07</span>

                  <div>
                    <h3>Why Choose Us</h3>
                    <p>
                      Manage the four reasons travellers choose Vedic Journey.
                    </p>
                  </div>
                </div>

                <div
                  v-for="(item, index) in form.content.whyVedic.items"
                  :key="index"
                  class="nested-item"
                >
                  <div class="field">
                    <label>
                      Reason {{ Number(index) + 1 }} Title
                    </label>

                    <input
                      v-model="item.title"
                      type="text"
                      :placeholder="`Reason ${Number(index) + 1} title`"
                    />
                  </div>

                  <div class="field">
                    <label>Description</label>

                    <textarea
                      v-model="item.description"
                      rows="3"
                      :placeholder="`Reason ${Number(index) + 1} description`"
                    />
                  </div>
                </div>
              </div>

              <!-- 08 TRAVEL SUPPORT -->
              <div class="section-block">
                <div class="section-title">
                  <span>08</span>
                  <div>
                    <h3>Travel Support</h3>
                    <p>Homepage travel assistance and support section.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Title</label>
                  <input
                    v-model="form.content.travelSupport.title"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.travelSupport.description"
                    rows="4"
                  />
                </div>

                <div
                  v-for="(service, index) in form.content.travelSupport.services"
                  :key="index"
                  class="nested-item"
                >
                  <div class="two-column">
                    <div class="field">
                      <label>Service {{ Number(index)  + 1 }} Title</label>
                      <input v-model="service.title" type="text" />
                    </div>

                    <div class="field">
                      <label>Slug</label>
                      <input v-model="service.slug" type="text" />
                    </div>
                  </div>

                  <div class="field">
                    <label>Description</label>
                    <textarea
                      v-model="service.description"
                      rows="3"
                    />
                  </div>

                  <div class="field">
                    <label>Service Image</label>

                    <button
                      type="button"
                      class="media-select"
                      @click="
                        openHomeMediaPicker(
                          `supportImage:${Number(index)}`,
                          'image',
                        )
                      "
                    >
                      {{
                        service.image
                          ? 'Change Service Image'
                          : '+ Select Image'
                      }}
                    </button>
                  </div>
                </div>

                <div class="field">
                  <label>CTA Title</label>
                  <input
                    v-model="form.content.travelSupport.cta.title"
                    type="text"
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>CTA Label</label>
                    <input
                      v-model="form.content.travelSupport.cta.label"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label>CTA Link</label>
                    <input
                      v-model="form.content.travelSupport.cta.href"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <!-- 09 CERTIFICATES -->
              <div class="section-block">
                <div class="section-title">
                  <span>09</span>
                  <div>
                    <h3>Certificates</h3>
                    <p>
                      Homepage certificate section heading. Certificate cards come
                      from the Certificates collection.
                    </p>
                  </div>
                </div>

                <div class="field">
                  <label>Title</label>
                  <input
                    v-model="form.content.certificates.title"
                    type="text"
                  />
                </div>
              </div>
            </template>

            <!-- ABOUT -->
            <template v-else-if="pageKey === 'about'">

              <!-- 01 HERO -->
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero Section</h3>
                    <p>About page introduction and hero image.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.hero.heading"
                    type="text"
                    placeholder="TRAVEL WITH PURPOSE"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                  />
                </div>

                <div class="field">
                  <label>Hero Image</label>
                  <button
                    type="button"
                    class="media-select"
                    @click="openHomeMediaPicker('aboutHeroImage', 'image')"
                  >
                    {{
                      form.content.hero.image
                        ? 'Change Hero Image'
                        : '+ Select Hero Image'
                    }}
                  </button>
                </div>
              </div>

              <!-- 02 CULTURE -->
              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Our Culture</h3>
                    <p>Vedic Journey culture and brand story.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.culture.heading"
                    type="text"
                    placeholder="OUR CULTURE."
                  />
                </div>

                <div
                  v-for="(_, index) in form.content.culture.paragraphs"
                  :key="`culture-${index}`"
                  class="field"
                >
                  <label>Paragraph {{ Number(index) + 1 }}</label>
                  <textarea
                    v-model="form.content.culture.paragraphs[index]"
                    rows="4"
                  />
                </div>
              </div>

              <!-- 03 PURPOSE -->
              <div class="section-block">
                <div class="section-title">
                  <span>03</span>
                  <div>
                    <h3>Our Purpose</h3>
                    <p>The purpose and approach behind Vedic Journey.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.purpose.heading"
                    type="text"
                    placeholder="OUR PURPOSE."
                  />
                </div>

                <div
                  v-for="(_, index) in form.content.purpose.paragraphs"
                  :key="`purpose-${index}`"
                  class="field"
                >
                  <label>Paragraph {{ Number(index) + 1 }}</label>
                  <textarea
                    v-model="form.content.purpose.paragraphs[index]"
                    rows="4"
                  />
                </div>
              </div>

              <!-- 04 STORY COLLAGE -->
              <div class="section-block">
                <div class="section-title">
                  <span>04</span>
                  <div>
                    <h3>Story Collage</h3>
                    <p>Images displayed in the animated About page collage.</p>
                  </div>
                </div>

                <div
                  v-for="(_, index) in form.content.collage.images"
                  :key="`collage-${index}`"
                  class="field"
                >
                  <label>Collage Image {{ Number(index) + 1 }}</label>

                  <button
                    type="button"
                    class="media-select"
                    @click="
                      openHomeMediaPicker(
                        `aboutCollage:${Number(index)}`,
                        'image'
                      )
                    "
                  >
                    {{
                      form.content.collage.images[index]
                        ? `Change Image ${Number(index) + 1}`
                        : `+ Select Image ${Number(index) + 1}`
                    }}
                  </button>
                </div>
              </div>

              <!-- 05 MISSION / VISION / VALUES -->
              <div class="section-block">
                <div class="section-title">
                  <span>05</span>
                  <div>
                    <h3>Mission, Vision & Values</h3>
                    <p>Core beliefs displayed on the About page.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Section Heading</label>
                  <input
                    v-model="form.content.beliefs.heading"
                    type="text"
                    placeholder="MISSION, VISION & VALUES."
                  />
                </div>

                <div
                  v-for="(item, index) in form.content.beliefs.items"
                  :key="`belief-${index}`"
                  class="nested-item"
                >
                  <div class="field">
                    <label>Item {{ Number(index) + 1 }} Title</label>
                    <input
                      v-model="item.title"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label>Description</label>
                    <textarea
                      v-model="item.description"
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              <!-- 06 FOUNDER -->
              <div class="section-block">
                <div class="section-title">
                  <span>06</span>
                  <div>
                    <h3>Founder</h3>
                    <p>Founder profile, story and experience highlights.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Eyebrow</label>
                  <input
                    v-model="form.content.founder.eyebrow"
                    type="text"
                    placeholder="Meet the Founder"
                  />
                </div>

                <div class="field">
                  <label>Name</label>
                  <input
                    v-model="form.content.founder.name"
                    type="text"
                    placeholder="SUBRATA CHATTERJEE."
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.founder.description"
                    rows="6"
                  />
                </div>

                <div class="field">
                  <label>Founder Image</label>

                  <button
                    type="button"
                    class="media-select"
                    @click="openHomeMediaPicker('aboutFounderImage', 'image')"
                  >
                    {{
                      form.content.founder.image
                        ? 'Change Founder Image'
                        : '+ Select Founder Image'
                    }}
                  </button>
                </div>

                <div
                  v-for="(_, index) in form.content.founder.features"
                  :key="`founder-feature-${index}`"
                  class="field"
                >
                  <label>Highlight {{ Number(index) + 1 }}</label>
                  <input
                    v-model="form.content.founder.features[index]"
                    type="text"
                  />
                </div>
              </div>

              <!-- 07 PHILOSOPHY -->
              <div class="section-block">
                <div class="section-title">
                  <span>07</span>
                  <div>
                    <h3>Philosophy</h3>
                    <p>Founder philosophy and supporting copy.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Quote</label>
                  <textarea
                    v-model="form.content.philosophy.quote"
                    rows="4"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.philosophy.description"
                    rows="5"
                  />
                </div>
              </div>

              <!-- 08 EXPLORE WORLD -->
              <div class="section-block">
                <div class="section-title">
                  <span>08</span>
                  <div>
                    <h3>Explore The World</h3>
                    <p>Destination discovery call-to-action.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.destinationsCta.heading"
                    type="text"
                    placeholder="EXPLORE THE WORLD"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.destinationsCta.description"
                    rows="4"
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>Button Label</label>
                    <input
                      v-model="form.content.destinationsCta.buttonLabel"
                      type="text"
                      placeholder="Explore Destinations"
                    />
                  </div>

                  <div class="field">
                    <label>Button Link</label>
                    <input
                      v-model="form.content.destinationsCta.buttonUrl"
                      type="text"
                      placeholder="/destinations"
                    />
                  </div>
                </div>

                <div class="field">
                  <label>Background Image</label>

                  <button
                    type="button"
                    class="media-select"
                    @click="openHomeMediaPicker('aboutDestinationsImage', 'image')"
                  >
                    {{
                      form.content.destinationsCta.image
                        ? 'Change Background Image'
                        : '+ Select Background Image'
                    }}
                  </button>
                </div>
              </div>

              <!-- 09 FINAL CTA -->
              <div class="section-block">
                <div class="section-title">
                  <span>09</span>
                  <div>
                    <h3>Final CTA</h3>
                    <p>Closing About page call-to-action.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.finalCta.heading"
                    type="text"
                    placeholder="LET'S MAKE IT MEMORABLE."
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>Button Label</label>
                    <input
                      v-model="form.content.finalCta.buttonLabel"
                      type="text"
                      placeholder="Contact Us"
                    />
                  </div>

                  <div class="field">
                    <label>Button Link</label>
                    <input
                      v-model="form.content.finalCta.buttonUrl"
                      type="text"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>

            </template>

            <!-- DESTINATIONS -->
            <template v-else-if="pageKey === 'destinations'">
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero</h3>
                    <p>Destinations landing page introduction.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.hero.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Destination Collection</h3>
                    <p>
                      Copy shown above dynamic regions and destinations.
                    </p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.collection.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.collection.description"
                    rows="4"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>03</span>
                  <div>
                    <h3>Final CTA</h3>
                    <p>Destination enquiry call-to-action.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.cta.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.cta.description"
                    rows="3"
                  />
                </div>
              </div>
            </template>

            <!-- CONTACT -->
            <template v-else-if="pageKey === 'contact'">
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero</h3>
                    <p>Contact page introduction.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.hero.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Enquiry Introduction</h3>
                    <p>Copy displayed near the enquiry form.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.enquiry.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.enquiry.description"
                    rows="5"
                  />
                </div>
              </div>
            </template>
          </section>

          <!-- SEO -->
          <section class="panel">
            <div class="panel-heading">
              <div>
                <span>SEARCH & SHARING</span>
                <h2>SEO</h2>
              </div>
            </div>

            <div class="field">
              <div class="label-row">
                <label>SEO Title</label>
                <span>{{ form.seo.title.length }}/70</span>
              </div>

              <input
                v-model="form.seo.title"
                type="text"
                maxlength="70"
                placeholder="SEO title"
              />
            </div>

            <div class="field">
              <div class="label-row">
                <label>Meta Description</label>
                <span>{{ form.seo.description.length }}/180</span>
              </div>

              <textarea
                v-model="form.seo.description"
                rows="4"
                maxlength="180"
                placeholder="Search engine description..."
              />
            </div>

            <div class="field">
              <label>Open Graph Image</label>

              <div v-if="selectedOgImage" class="media-preview">
                <img
                  :src="selectedOgImage.url"
                  :alt="selectedOgImage.altText || ''"
                />

                <div>
                  <strong>Social sharing image</strong>
                  <span>{{ selectedOgImage.altText || 'No alt text' }}</span>
                </div>

                <button type="button" @click="mediaPickerOpen = true">
                  Change
                </button>
              </div>

              <button
                v-else
                type="button"
                class="media-select"
                @click="mediaPickerOpen = true"
              >
                + Select from Media Library
              </button>

              <small>
                Existing OG image can be changed. Removal is not enabled
                because the current backend DTO does not accept null.
              </small>
            </div>
          </section>
        </main>

        <!-- SIDEBAR -->
        <aside class="editor-sidebar">
          <section class="panel sticky-panel">
            <div class="panel-heading">
              <div>
                <span>VISIBILITY</span>
                <h2>Publishing</h2>
              </div>
            </div>

            <label class="publish-toggle">
              <div>
                <strong>Published</strong>
                <span>
                  Make this page available on the public website.
                </span>
              </div>

              <input
                v-model="form.isPublished"
                type="checkbox"
              />
            </label>

            <div class="sidebar-divider" />

            <div class="info-row">
              <span>Page Key</span>
              <strong>{{ page.key }}</strong>
            </div>

            <div class="info-row">
              <span>Last Updated</span>
              <strong>{{ formatDate(page.updatedAt) }}</strong>
            </div>

            <button
              class="save-btn full"
              :disabled="saving"
              @click="savePage"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>

            <p v-if="saveSuccess" class="save-success">
              Changes saved successfully.
            </p>

            <p v-if="saveError" class="save-error">
              {{ saveError }}
            </p>
          </section>
        </aside>
      </div>
    </template>

    <ClientOnly>
      <MediaPickerModal
        :open="mediaPickerOpen"
        type="image"
        @close="mediaPickerOpen = false"
        @select="selectOgImage"
      />
    </ClientOnly>
    <ClientOnly>
      <MediaPickerModal
        :open="homeMediaPickerOpen"
        :type="homeMediaType"
        :title="
          homeMediaType === 'video'
            ? 'Select video'
            : 'Select image'
        "
        @close="homeMediaPickerOpen = false"
        @select="selectHomeMedia"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import MediaPickerModal from '~/components/media/MediaPickerModal.vue'
import type { AdminPage } from '~/composables/usePages'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

interface MediaItem {
  _id: string
  type?: 'image' | 'video'
  filename?: string
  url: string
  altText?: string
}

const route = useRoute()

const {
  fetchPage,
  updatePage,
} = usePages()

const pageKey = computed(() =>
  String(route.params.key || '').toLowerCase(),
)

const allowedPages = [
  'home',
  'about',
  'destinations',
  'contact',
]

const page = ref<AdminPage | null>(null)
const loadingPage = ref(true)
const saving = ref(false)
const loadError = ref<string | null>(null)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

const mediaPickerOpen = ref(false)
const selectedOgImage = ref<MediaItem | null>(null)

type PageMediaTarget =
  | 'heroVideo'
  | 'indiaVideo'
  | 'philosophyImage'
  | `supportImage:${number}`
  | 'aboutHeroImage'
  | `aboutCollage:${number}`
  | 'aboutFounderImage'
  | 'aboutDestinationsImage'

const homeMediaPickerOpen = ref(false)
const homeMediaTarget = ref<PageMediaTarget | null>(null)
const homeMediaType = ref<'image' | 'video'>('image')

const openHomeMediaPicker = (
  target: PageMediaTarget,
  type: 'image' | 'video',
) => {
  homeMediaTarget.value = target
  homeMediaType.value = type
  homeMediaPickerOpen.value = true
}

const selectHomeMedia = (items: MediaItem[]) => {
  const media = items[0]
  const target = homeMediaTarget.value

  if (!media || !target) return

  if (target === 'heroVideo') {
    form.content.hero.video = media._id
  } else if (target === 'indiaVideo') {
    form.content.indiaSpotlight.video = media._id
  } else if (target === 'philosophyImage') {
    form.content.philosophy.image = media._id
  } else if (target.startsWith('supportImage:')) {
    const index = Number(target.split(':')[1])

    const service =
      form.content.travelSupport.services[index]

    if (service) {
      service.image = media._id
    }
  } else if (target === 'aboutHeroImage') {
    form.content.hero.image = media._id
  } else if (target.startsWith('aboutCollage:')) {
    const index = Number(target.split(':')[1])

    if (Number.isInteger(index)) {
      form.content.collage.images[index] = media._id
    }
  } else if (target === 'aboutFounderImage') {
    form.content.founder.image = media._id
  } else if (target === 'aboutDestinationsImage') {
    form.content.destinationsCta.image = media._id
  }

  homeMediaPickerOpen.value = false
  homeMediaTarget.value = null
}

const createDefaultContent = (key: string) => {
  if (key === 'home') {
    return {
      hero: {
        eyebrow: '',
        title: '',
        description: '',
        primaryCta: {
          label: '',
          href: '',
        },
        video: '',
      },

      destinations: {
        eyebrow: '',
        title: '',
        description: '',
        featuredRegionSlugs: [],
      },

      experiences: {
        title: '',
        featuredExperienceSlugs: [],
      },

      indiaSpotlight: {
        label: '',
        description: ['', ''],
        cta: {
          label: '',
          href: '',
        },
        displayLines: [],
        video: '',
      },

      journeys: {
        displayLines: [],
        featuredRegionSlugs: [],
      },

      philosophy: {
        eyebrow: '',
        title: '',
        description: '',
        cta: {
          label: '',
          href: '',
        },
        image: '',
      },

    whyVedic: {
      items: [],
    },
      travelSupport: {
        title: '',
        description: '',
        services: [],
        cta: {
          title: '',
          label: '',
          href: '',
        },
      },

      certificates: {
        title: '',
      },
    }
  }

  if (key === 'about') {
    return {
      hero: {
        heading: '',
        description: '',
        image: '',
      },

      culture: {
        heading: '',
        paragraphs: ['', '', ''],
      },

      purpose: {
        heading: '',
        paragraphs: ['', ''],
      },

      collage: {
        images: Array(12).fill(''),
      },

      beliefs: {
        heading: '',
        items: [
          { title: 'MISSION', description: '' },
          { title: 'VISION', description: '' },
          { title: 'VALUES', description: '' },
        ],
      },

      founder: {
        eyebrow: '',
        name: '',
        description: '',
        image: '',
        features: ['', '', '', ''],
      },

      philosophy: {
        quote: '',
        description: '',
      },

      destinationsCta: {
        heading: '',
        description: '',
        buttonLabel: '',
        buttonUrl: '/destinations',
        image: '',
      },

      finalCta: {
        heading: '',
        buttonLabel: '',
        buttonUrl: '/contact',
      },
    }
  }

  if (key === 'destinations') {
    return {
      hero: {
        heading: '',
        description: '',
      },
      collection: {
        heading: '',
        description: '',
      },
      cta: {
        heading: '',
        description: '',
      },
    }
  }

  return {
    hero: {
      heading: '',
      description: '',
    },
    enquiry: {
      heading: '',
      description: '',
    },
  }
}

const form = reactive({
  title: '',
  content: createDefaultContent(pageKey.value) as any,
  seo: {
    title: '',
    description: '',
    ogImage: '' as string,
  },
  isPublished: true,
})

const pageLabel = computed(() => {
  const labels: Record<string, string> = {
    home: 'Home Page',
    about: 'About Page',
    destinations: 'Destinations Page',
    contact: 'Contact Page',
  }

  return labels[pageKey.value] || 'Page'
})

const splitCommaList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const mergeContent = (
  defaults: Record<string, any>,
  saved: Record<string, any>,
) => {
  const result = structuredClone(defaults)

  for (const [key, value] of Object.entries(saved || {})) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof result[key] === 'object'
    ) {
      result[key] = {
        ...result[key],
        ...value,
      }
    } else {
      result[key] = value
    }
  }

  return result
}

const loadPage = async () => {
  if (!allowedPages.includes(pageKey.value)) {
    return navigateTo('/pages')
  }

  loadingPage.value = true
  loadError.value = null

  try {
    const data = await fetchPage(pageKey.value)

    page.value = data

    form.title = data.title || ''
    form.content = mergeContent(
      createDefaultContent(pageKey.value),
      data.content || {},
    )

    if (pageKey.value === 'home') {
      const mediaId = (value: any) => {
        if (!value) return ''
        if (typeof value === 'string') return value
        return value?._id || ''
      }

      form.content.hero.video =
        mediaId(form.content.hero.video)

      form.content.indiaSpotlight.video =
        mediaId(form.content.indiaSpotlight.video)

      form.content.philosophy.image =
        mediaId(form.content.philosophy.image)


      form.content.travelSupport.services =
        (form.content.travelSupport.services || []).map(
          (service: any) => ({
            ...service,
            image: mediaId(service.image),
          }),
        )
    }

    if (pageKey.value === 'about') {
          const mediaId = (value: any) => {
            if (!value) return ''
            if (typeof value === 'string') return value
            return value?._id || ''
          }

          form.content.hero.image =
            mediaId(form.content.hero.image)

          form.content.collage.images =
            (form.content.collage.images || []).map(
              (image: any) => mediaId(image),
            )

          form.content.founder.image =
            mediaId(form.content.founder.image)

          form.content.destinationsCta.image =
            mediaId(form.content.destinationsCta.image)
    }

    form.seo.title = data.seo?.title || ''
    form.seo.description = data.seo?.description || ''

    const ogImage = data.seo?.ogImage

    if (
      ogImage &&
      typeof ogImage === 'object'
    ) {
      selectedOgImage.value = ogImage as MediaItem
      form.seo.ogImage = ogImage._id
    } else {
      selectedOgImage.value = null
      form.seo.ogImage =
        typeof ogImage === 'string'
          ? ogImage
          : ''
    }

    form.isPublished = data.isPublished ?? true
  } catch (error: any) {
    loadError.value =
      error?.data?.message ||
      error?.message ||
      'Unable to load page.'
  } finally {
    loadingPage.value = false
  }
}



const selectOgImage = (
  items: MediaItem[],
) => {
  const media = items[0]

  if (!media) return

  selectedOgImage.value = media
  form.seo.ogImage = media._id
  mediaPickerOpen.value = false
}

const savePage = async () => {
  if (saving.value) return

  saving.value = true
  saveError.value = null
  saveSuccess.value = false

  if (pageKey.value === 'home') {
    delete form.content.whyVedic?.eyebrow
    delete form.content.whyVedic?.title
    delete form.content.whyVedic?.image
  }

  if (pageKey.value === 'about') {
    delete form.content.story
    delete form.content.cta

    if (form.content.founder) {
      delete form.content.founder.title
    }
  }

  try {
    const seo: Record<string, string> = {
      title: form.seo.title.trim(),
      description: form.seo.description.trim(),
    }

    if (form.seo.ogImage) {
      seo.ogImage = form.seo.ogImage
    }

    const updated = await updatePage(
      pageKey.value,
      {
        title: form.title.trim(),
        content: JSON.parse(
          JSON.stringify(form.content),
        ),
        seo,
        isPublished: form.isPublished,
      },
    )

    page.value = updated
    saveSuccess.value = true

    window.setTimeout(() => {
      saveSuccess.value = false
    }, 2500)
  } catch (error: any) {
    saveError.value =
      error?.data?.message ||
      error?.message ||
      'Unable to save page.'
  } finally {
    saving.value = false
  }
}

const formatDate = (value?: string) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

onMounted(loadPage)
</script>

<style scoped>
.editor-page {
  width: 100%;
}

.editor-header {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}

.back-btn {
  margin: 0 0 20px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #81777f;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}

.back-btn:hover {
  color: #a20eac;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #a20eac;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .16em;
}

.editor-header h1 {
  margin: 0;
  color: #211d21;
  font-size: 42px;
  letter-spacing: -.035em;
}

.editor-header p {
  margin: 9px 0 0;
  color: #80777f;
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  padding: 8px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
}

.status.published {
  background: #edf7f2;
  color: #328462;
}

.status.draft {
  background: #f1eef0;
  color: #776e75;
}

.save-btn {
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 9px;
  background: linear-gradient(135deg, #ec12c7, #821092);
  color: white;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: .55;
  cursor: wait;
}

.save-btn.full {
  width: 100%;
  margin-top: 22px;
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 20px;
  align-items: start;
}

.editor-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel {
  padding: 24px;
  border: 1px solid #ebe5ea;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(35, 15, 32, .035);
}

.panel-heading {
  margin-bottom: 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-heading span {
  color: #a20eac;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .13em;
}

.panel-heading h2 {
  margin: 5px 0 0;
  color: #2a2529;
  font-size: 20px;
}

.page-type {
  padding: 7px 10px;
  border-radius: 7px;
  background: #faf5f9;
}

.section-block {
  padding: 22px 0;
  border-top: 1px solid #f0ebef;
}

.section-block:first-of-type {
  padding-top: 0;
  border-top: 0;
}

.section-title {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.section-title > span {
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #faf0f8;
  color: #a20eac;
  font-size: 10px;
  font-weight: 800;
}

.section-title h3 {
  margin: 0;
  color: #312b30;
  font-size: 15px;
}

.section-title p {
  margin: 4px 0 0;
  color: #91878f;
  font-size: 12px;
}

.field {
  margin-top: 17px;
}

.field:first-child {
  margin-top: 0;
}

.field label {
  display: block;
  margin-bottom: 7px;
  color: #514950;
  font-size: 13px;
  font-weight: 700;
}

.field input,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e6dfe4;
  border-radius: 9px;
  background: #fff;
  color: #2a2529;
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}

.field input {
  height: 44px;
  padding: 0 13px;
}

.field textarea {
  padding: 12px 13px;
  line-height: 1.6;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(216, 11, 185, .55);
  box-shadow: 0 0 0 3px rgba(216, 11, 185, .07);
}

.field small {
  display: block;
  margin-top: 7px;
  color: #9b9199;
  font-size: 11px;
  line-height: 1.5;
}

.label-row {
  display: flex;
  justify-content: space-between;
}

.label-row span {
  color: #9a9098;
  font-size: 11px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.sticky-panel {
  position: sticky;
  top: 20px;
}

.publish-toggle {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  cursor: pointer;
}

.publish-toggle strong {
  display: block;
  color: #403940;
  font-size: 13px;
}

.publish-toggle span {
  max-width: 190px;
  margin-top: 5px;
  display: block;
  color: #90868e;
  font-size: 11px;
  line-height: 1.5;
}

.publish-toggle input {
  width: 18px;
  height: 18px;
  accent-color: #b20eaf;
}

.sidebar-divider {
  height: 1px;
  margin: 21px 0;
  background: #eee8ec;
}

.info-row {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.info-row span {
  color: #938991;
  font-size: 11px;
}

.info-row strong {
  color: #514950;
  font-size: 11px;
  text-align: right;
}

.media-select {
  width: 100%;
  min-height: 80px;
  border: 1px dashed #d9cdd6;
  border-radius: 10px;
  background: #fdfbfd;
  color: #a20eac;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.media-preview {
  padding: 10px;
  display: grid;
  grid-template-columns: 76px 1fr auto;
  align-items: center;
  gap: 12px;
  border: 1px solid #e9e2e7;
  border-radius: 10px;
}

.media-preview img {
  width: 76px;
  height: 55px;
  border-radius: 7px;
  object-fit: cover;
}

.media-preview strong,
.media-preview span {
  display: block;
}

.media-preview strong {
  color: #494148;
  font-size: 12px;
}

.media-preview span {
  margin-top: 4px;
  color: #938991;
  font-size: 10px;
}

.media-preview button {
  border: 0;
  background: transparent;
  color: #a20eac;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.save-success,
.save-error {
  margin: 12px 0 0;
  font-size: 11px;
  text-align: center;
}

.save-success {
  color: #328462;
}

.save-error {
  color: #b94a55;
}

.loading-state,
.error-state {
  min-height: 300px;
  display: grid;
  place-items: center;
  border: 1px solid #ebe5ea;
  border-radius: 17px;
  background: white;
  color: #80777f;
  font-size: 14px;
}

.error-state {
  align-content: center;
  gap: 8px;
}

.error-state strong {
  color: #a3434d;
}

.error-state button {
  margin-top: 10px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #e2d9df;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

@media (max-width: 1050px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }

  .sticky-panel {
    position: static;
  }
}

@media (max-width: 700px) {
  .editor-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .editor-header h1 {
    font-size: 34px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }
}
</style>