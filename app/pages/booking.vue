<template>
  <div class="booking-page">
    <div class="booking-container">
      <!-- Search / filter bar -->
      <div class="search-filter-card">
        <div class="filter-grid">
          <!-- Check in -->
          <div
            class="filter-col"
            :class="{ 'is-active': activePopover === 'calendar' }"
            @click="togglePopover('calendar')"
          >
            <div class="filter-col-inner">
              <span class="filter-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              <div class="filter-info">
                <span class="filter-label">Check in</span>
                <span class="filter-value">{{ formattedCheckIn }}</span>
              </div>
            </div>
            <span class="chevron-arrow">&#9662;</span>
          </div>

          <!-- Check out -->
          <div
            class="filter-col"
            :class="{ 'is-active': activePopover === 'calendar' }"
            @click="togglePopover('calendar')"
          >
            <div class="filter-col-inner">
              <span class="filter-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              <div class="filter-info">
                <span class="filter-label">Check out</span>
                <span class="filter-value">{{ formattedCheckOut }}</span>
              </div>
            </div>
            <span class="chevron-arrow">&#9662;</span>
          </div>

          <!-- Guests -->
          <div
            class="filter-col"
            :class="{ 'is-active': activePopover === 'guests' }"
            @click="togglePopover('guests')"
          >
            <div class="filter-col-inner">
              <span class="filter-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <div class="filter-info">
                <span class="filter-label">Guests</span>
                <span class="filter-value">{{ totalGuests }} guest{{ totalGuests > 1 ? 's' : '' }}</span>
              </div>
            </div>
            <span class="chevron-arrow">&#9662;</span>
          </div>

          <!-- Rooms -->
          <div
            class="filter-col"
            :class="{ 'is-active': activePopover === 'rooms' }"
            @click="togglePopover('rooms')"
          >
            <div class="filter-col-inner">
              <span class="filter-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"></path>
                  <path d="M2 13v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"></path>
                  <path d="M2 9h20"></path>
                  <path d="M12 13v8"></path>
                </svg>
              </span>
              <div class="filter-info">
                <span class="filter-label">Rooms</span>
                <span class="filter-value">{{ selectedRoomIds.length > 0 ? selectedRoomIds.length + ' room' + (selectedRoomIds.length > 1 ? 's' : '') : 'Select rooms' }}</span>
              </div>
            </div>
            <span class="chevron-arrow">&#9662;</span>
          </div>

          <!-- Check availability -->
          <div class="filter-col action-col">
            <button type="button" class="check-btn" @click.stop="handleCheckAvailability">
              Check availability
            </button>
          </div>
        </div>

        <!-- Rooms popover -->
        <transition name="popover-fade">
          <div v-if="activePopover === 'rooms'" class="popover rooms-popover" @click.stop>
            <div class="popover-header">
              <span class="popover-title">Select rooms</span>
              <button class="popover-link-btn" @click="openAllRoomsInfo">View room details</button>
            </div>

            <div class="popover-room-list">
              <div
                v-for="room in allRooms"
                :key="room.id"
                class="popover-room-row"
                :class="{ 'is-selected': isRoomSelected(room.id) }"
              >
                <label class="room-checkbox-label">
                  <input
                    type="checkbox"
                    :checked="isRoomSelected(room.id)"
                    @change="toggleRoomSelection(room.id)"
                  />
                  <span class="custom-checkbox"></span>
                  <div class="room-row-label">
                    <span class="room-row-name">Room {{ room.id }}</span>
                    <span class="room-row-type">{{ room.viewType === 'lake' ? 'Lake view (twin)' : 'Garden view (twin)' }}</span>
                  </div>
                </label>

                <div class="room-qty-control">
                  <button
                    class="qty-btn"
                    :disabled="!isRoomSelected(room.id)"
                    @click="setRoomSelection(room.id, false)"
                    aria-label="Deselect room"
                  >&minus;</button>
                  <span class="qty-num">{{ isRoomSelected(room.id) ? 1 : 0 }}</span>
                  <button
                    class="qty-btn"
                    :disabled="isRoomSelected(room.id)"
                    @click="setRoomSelection(room.id, true)"
                    aria-label="Select room"
                  >&plus;</button>
                </div>
              </div>
            </div>

            <div class="popover-footer">
              <span class="total-rooms-text">Rooms selected: <strong>{{ selectedRoomIds.length }}</strong></span>
              <button class="popover-done-btn" @click="activePopover = null">Done</button>
            </div>
          </div>
        </transition>

        <!-- Calendar popover -->
        <transition name="popover-fade">
          <div v-if="activePopover === 'calendar'" class="popover calendar-popover" @click.stop>
            <div class="cal-popover-header">
              <div class="cal-summary-pill">
                <span class="cal-pill-tag">{{ totalNights }} night{{ totalNights > 1 ? 's' : '' }}</span>
                <span class="cal-pill-dates">{{ formattedCheckIn }} &ndash; {{ formattedCheckOut }}</span>
              </div>
              <button class="cal-close-btn" @click="activePopover = null" aria-label="Close">&times;</button>
            </div>

            <div class="calendar-months-wrap">
              <div class="month-navigation-bar">
                <button class="month-nav-btn" @click="prevCalendarMonth" :disabled="isPastMonth">&lsaquo; Prev</button>
                <span class="calendar-instruction-hint">Select check-in and check-out dates</span>
                <button class="month-nav-btn" @click="nextCalendarMonth">Next &rsaquo;</button>
              </div>

              <div class="two-months-grid">
                <div v-for="(month, mi) in [calMonth1, calMonth2]" :key="mi" class="month-block">
                  <h4 class="month-title">{{ monthNames[month.getMonth()] }} {{ month.getFullYear() }}</h4>
                  <div class="cal-weekdays">
                    <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d">{{ d }}</span>
                  </div>
                  <div class="cal-days-grid">
                    <div
                      v-for="(day, idx) in getMonthDays(month)"
                      :key="mi + '-' + idx"
                      class="cal-day-cell"
                      :class="getDayClasses(day)"
                      @click="day && !isDateDisabled(day) && handleDateClick(day)"
                      @mouseenter="day && handleDateHover(day)"
                    >
                      <span v-if="day" class="day-number">{{ day.getDate() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cal-footer-presets">
              <div class="presets-row">
                <span class="presets-label">Quick options:</span>
                <button class="preset-chip" @click="setPresetDates(2)">Weekend (2 nights)</button>
                <button class="preset-chip" @click="setPresetDates(5)">5 nights</button>
                <button class="preset-chip" @click="setPresetDates(7)">1 week</button>
              </div>
              <button class="popover-done-btn" @click="activePopover = null">Apply dates</button>
            </div>
          </div>
        </transition>

        <!-- Guests popover -->
        <transition name="popover-fade">
          <div v-if="activePopover === 'guests'" class="popover guests-popover" @click.stop>
            <div class="popover-header">
              <span class="popover-title">Guests</span>
            </div>
            <div class="guests-rows">
              <div class="guest-counter-row">
                <div class="guest-desc">
                  <span class="guest-type">Adults</span>
                  <span class="guest-sub">Age 13+</span>
                </div>
                <div class="room-qty-control">
                  <button class="qty-btn" :disabled="adultsCount <= 1" @click="adultsCount--" aria-label="Fewer adults">&minus;</button>
                  <span class="qty-num">{{ adultsCount }}</span>
                  <button class="qty-btn" :disabled="adultsCount >= 8" @click="adultsCount++" aria-label="More adults">&plus;</button>
                </div>
              </div>
              <div class="guest-counter-row">
                <div class="guest-desc">
                  <span class="guest-type">Children</span>
                  <span class="guest-sub">Ages 0&ndash;12</span>
                </div>
                <div class="room-qty-control">
                  <button class="qty-btn" :disabled="childrenCount <= 0" @click="childrenCount--" aria-label="Fewer children">&minus;</button>
                  <span class="qty-num">{{ childrenCount }}</span>
                  <button class="qty-btn" :disabled="childrenCount >= 4" @click="childrenCount++" aria-label="More children">&plus;</button>
                </div>
              </div>
              <p class="guest-notice">
                Each twin room sleeps up to 2 guests in two single beds.
              </p>
            </div>
            <div class="popover-footer">
              <span>Total: <strong>{{ totalGuests }} guest{{ totalGuests > 1 ? 's' : '' }}</strong></span>
              <button class="popover-done-btn" @click="activePopover = null">Done</button>
            </div>
          </div>
        </transition>

        <!-- Availability popover -->
        <transition name="popover-fade">
          <div v-if="activePopover === 'availability'" class="popover availability-popover" @click.stop>
            <div class="popover-header">
              <span class="popover-title">Your stay</span>
            </div>
            <div class="stay-summary-card">
              <div class="stay-summary-grid">
                <div class="stay-meta-item">
                  <span class="meta-label">Dates</span>
                  <span class="meta-val">{{ formattedCheckIn }} &ndash; {{ formattedCheckOut }} ({{ totalNights }} night{{ totalNights > 1 ? 's' : '' }})</span>
                </div>
                <div class="stay-meta-item">
                  <span class="meta-label">Guests</span>
                  <span class="meta-val">{{ totalGuests }} guest{{ totalGuests > 1 ? 's' : '' }}</span>
                </div>
              </div>
            </div>
            <div class="popover-footer">
              <button class="popover-done-btn full-w" @click="scrollToRooms">View rooms</button>
            </div>
          </div>
        </transition>
      </div>

      <!-- View filter tabs -->
      <div class="view-filter-bar">
        <div class="filter-tabs">
          <button class="filter-tab-btn" :class="{ active: viewFilter === 'all' }" @click="viewFilter = 'all'">
            All rooms (4)
          </button>
          <button class="filter-tab-btn" :class="{ active: viewFilter === 'lake' }" @click="viewFilter = 'lake'">
            Lake view (2)
          </button>
          <button class="filter-tab-btn" :class="{ active: viewFilter === 'garden' }" @click="viewFilter = 'garden'">
            Garden view (2)
          </button>
        </div>
      </div>

      <!-- Room listings -->
      <section class="rooms-listings-section">
        <div v-for="room in filteredRooms" :key="room.id" class="room-booking-card">
          <div class="card-left-content">
            <div class="room-image-slider">
              <img :src="room.image" :alt="room.name" class="room-photo" />
            </div>

            <div class="room-details-body">
              <h2 class="room-title clickable" @click="openRoomModal(room)" title="View room details">{{ room.name }}</h2>
              <p class="room-description">{{ room.description }}</p>
            </div>
          </div>

          <div class="card-right-summary">
            <div class="price-header-box">
              <span class="total-price-val">{{ formatINR(computeSingleRoomTotal(room)) }}</span>
              <span class="total-price-sub">total for {{ totalNights }} night{{ totalNights > 1 ? 's' : '' }} (incl. taxes)</span>
            </div>

            <div class="stay-meta-box">
              <div class="stay-meta-line">
                <span class="meta-svg">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <span class="meta-text">{{ formattedCheckIn }} &ndash; {{ formattedCheckOut }}</span>
                <span class="meta-badge">{{ totalNights }} night{{ totalNights > 1 ? 's' : '' }}</span>
              </div>
              <div class="stay-meta-line">
                <span class="meta-svg">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <span class="meta-text">1 room, 2 guests</span>
              </div>
            </div>

            <button class="reserve-cta-btn" @click="initiateBooking(room)">
              Reserve room {{ room.id }}
            </button>
          </div>
        </div>
      </section>

      <!-- Multi-room summary bar -->
      <transition name="bar-slide">
        <div v-if="selectedRoomIds.length > 0" class="floating-booking-summary-bar">
          <div class="floating-bar-inner">
            <div class="floating-left">
              <span class="floating-room-count">
                <strong>{{ selectedRoomIds.length }}</strong> room{{ selectedRoomIds.length > 1 ? 's' : '' }} selected
              </span>
              <span class="floating-dates">{{ formattedCheckIn }} &ndash; {{ formattedCheckOut }} ({{ totalNights }} night{{ totalNights > 1 ? 's' : '' }})</span>
            </div>
            <div class="floating-right">
              <div class="floating-price-box">
                <span class="floating-total-label">Total (incl. GST)</span>
                <span class="floating-total-amount">{{ formatINR(computeCombinedTotal()) }}</span>
              </div>
              <button class="floating-book-btn" @click="openCheckoutModal">
                Book {{ selectedRoomIds.length }} room{{ selectedRoomIds.length > 1 ? 's' : '' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Room details modal -->
    <transition name="modal-fade">
      <div v-if="activeRoomModal" class="modal-backdrop" @click="activeRoomModal = null">
        <div class="modal-dialog room-info-dialog" @click.stop>
          <button class="modal-close-btn" @click="activeRoomModal = null" aria-label="Close">&times;</button>

          <div class="modal-header-img">
            <img :src="activeRoomModal.image" :alt="activeRoomModal.name" />
            <div class="modal-title-overlay">
              <span class="modal-tag">{{ activeRoomModal.tag }}</span>
              <h3 class="modal-room-name">{{ activeRoomModal.name }} (Room {{ activeRoomModal.id }})</h3>
              <span class="modal-wing-name">{{ activeRoomModal.wing }}</span>
            </div>
          </div>

          <div class="modal-content-scroll">
            <div class="modal-grid-specs">
              <div class="spec-tile">
                <span class="spec-label">Beds</span>
                <strong class="spec-val">2 twin single beds</strong>
                <span class="spec-sub">100cm &times; 200cm each</span>
              </div>
              <div class="spec-tile">
                <span class="spec-label">View</span>
                <strong class="spec-val">{{ activeRoomModal.viewLabel }}</strong>
                <span class="spec-sub">{{ activeRoomModal.viewType === 'lake' ? 'Backwater' : 'Palm garden' }}</span>
              </div>
              <div class="spec-tile">
                <span class="spec-label">Capacity</span>
                <strong class="spec-val">Up to 2 adults</strong>
                <span class="spec-sub">Twin occupancy</span>
              </div>
              <div class="spec-tile">
                <span class="spec-label">Size</span>
                <strong class="spec-val">38 m&sup2; (409 sq ft)</strong>
                <span class="spec-sub">With private balcony</span>
              </div>
            </div>

            <div class="modal-section">
              <h4 class="section-title">About this room</h4>
              <p class="modal-p">{{ activeRoomModal.description }}</p>
              <p class="modal-p">
                Built in traditional Kerala style with polished teak, hand-loomed cotton linens and brass details.
              </p>
            </div>

            <div class="modal-section">
              <h4 class="section-title">Amenities</h4>
              <div class="amenities-chips-list">
                <span v-for="amenity in activeRoomModal.amenities" :key="amenity" class="amenity-chip">
                  {{ amenity }}
                </span>
              </div>
            </div>

            <div class="modal-section">
              <h4 class="section-title">Policies</h4>
              <ul class="policy-bullets">
                <li><strong>Check-in:</strong> 2:00 PM &nbsp;|&nbsp; <strong>Check-out:</strong> 11:00 AM</li>
                <li><strong>Cancellation:</strong> Free up to 48 hours before arrival.</li>
                <li><strong>Smoking:</strong> Not allowed inside rooms. Open garden areas are available.</li>
                <li><strong>Wi-Fi:</strong> Available in all rooms and across the grounds.</li>
              </ul>
            </div>
          </div>

          <div class="modal-footer-action">
            <div class="modal-price-indicator">
              <span class="modal-rate-label">Rate per night</span>
              <strong class="modal-rate-amt">{{ formatINR(activeRoomModal.basePrice) }}</strong>
            </div>
            <button
              class="modal-select-btn"
              @click="toggleRoomSelection(activeRoomModal.id); activeRoomModal = null"
            >
              {{ isRoomSelected(activeRoomModal.id) ? 'Remove room' : 'Select room ' + activeRoomModal.id }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Checkout modal -->
    <transition name="modal-fade">
      <div v-if="isCheckoutOpen" class="modal-backdrop" @click="closeCheckoutModal">
        <div class="modal-dialog checkout-dialog" @click.stop>
          <button class="modal-close-btn" @click="closeCheckoutModal" aria-label="Close">&times;</button>

          <!-- Reservation form -->
          <div v-if="!isBookingConfirmed" class="checkout-form-container">
            <div class="checkout-header-title">
              <span class="checkout-eyebrow">Aambal Resort reservation</span>
              <h3 class="checkout-main-title">Complete your booking</h3>
              <p class="checkout-subtitle">
                {{ selectedRoomIds.length }} room{{ selectedRoomIds.length > 1 ? 's' : '' }} &middot; {{ totalNights }} night{{ totalNights > 1 ? 's' : '' }} &middot; {{ formattedCheckIn }} to {{ formattedCheckOut }}
              </p>
            </div>

            <div class="checkout-two-col">
              <div class="checkout-left-form">
                <h4 class="form-sec-title">Guest details</h4>
                <div class="form-row two-inputs">
                  <div class="form-group">
                    <label>First name *</label>
                    <input type="text" v-model="guestForm.firstName" placeholder="e.g. Rahul" required />
                  </div>
                  <div class="form-group">
                    <label>Last name *</label>
                    <input type="text" v-model="guestForm.lastName" placeholder="e.g. Sharma" required />
                  </div>
                </div>

                <div class="form-row two-inputs">
                  <div class="form-group">
                    <label>Email *</label>
                    <input type="email" v-model="guestForm.email" placeholder="rahul@example.com" required />
                  </div>
                  <div class="form-group">
                    <label>Phone *</label>
                    <input type="tel" v-model="guestForm.phone" placeholder="+91 98765 43210" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Estimated arrival time</label>
                  <select v-model="guestForm.arrivalTime">
                    <option value="Standard Check-in (2:00 PM - 4:00 PM)">2:00 PM &ndash; 4:00 PM (standard check-in)</option>
                    <option value="Early Afternoon (12:00 PM - 2:00 PM)">12:00 PM &ndash; 2:00 PM</option>
                    <option value="Late Evening (6:00 PM - 10:00 PM)">6:00 PM &ndash; 10:00 PM</option>
                    <option value="Night Arrival (After 10:00 PM)">After 10:00 PM</option>
                  </select>
                </div>

                <h4 class="form-sec-title mt-4">Add-ons (optional)</h4>
                <div class="addons-list">
                  <label class="addon-option-row">
                    <input type="checkbox" v-model="guestForm.addons.breakfast" />
                    <span class="custom-checkbox"></span>
                    <div class="addon-text">
                      <span class="addon-name">Daily breakfast</span>
                      <span class="addon-sub">Fresh fruit, Kerala dishes and continental options</span>
                    </div>
                    <span class="addon-price">+{{ formatINR(1200 * totalNights * selectedRoomIds.length) }}</span>
                  </label>

                  <label class="addon-option-row">
                    <input type="checkbox" v-model="guestForm.addons.boatCruise" />
                    <span class="custom-checkbox"></span>
                    <div class="addon-text">
                      <span class="addon-name">Sunset backwater cruise</span>
                      <span class="addon-sub">Private 90-minute wooden boat ride</span>
                    </div>
                    <span class="addon-price">+{{ formatINR(3500) }}</span>
                  </label>

                  <label class="addon-option-row">
                    <input type="checkbox" v-model="guestForm.addons.spaSession" />
                    <span class="custom-checkbox"></span>
                    <div class="addon-text">
                      <span class="addon-name">Abhyanga massage</span>
                      <span class="addon-sub">Herbal oil massage at the lotus pavilion</span>
                    </div>
                    <span class="addon-price">+{{ formatINR(4000) }}</span>
                  </label>
                </div>

                <div class="form-group mt-3">
                  <label>Special requests</label>
                  <textarea
                    v-model="guestForm.specialRequests"
                    rows="2"
                    placeholder="Dietary needs, room preferences or a special occasion"
                  ></textarea>
                </div>
              </div>

              <!-- Price summary -->
              <div class="checkout-right-summary">
                <div class="summary-card-inner">
                  <h4 class="summary-card-title">Reservation summary</h4>

                  <div class="summary-stay-dates">
                    <div class="stay-date-box">
                      <span class="date-lbl">Check-in</span>
                      <strong class="date-val">{{ formattedCheckIn }}</strong>
                      <span class="time-lbl">from 2:00 PM</span>
                    </div>
                    <div class="stay-date-arrow">&rarr;</div>
                    <div class="stay-date-box">
                      <span class="date-lbl">Check-out</span>
                      <strong class="date-val">{{ formattedCheckOut }}</strong>
                      <span class="time-lbl">until 11:00 AM</span>
                    </div>
                  </div>

                  <div class="selected-rooms-pill-list">
                    <div v-for="id in selectedRoomIds" :key="id" class="sel-room-item">
                      <span class="sel-r-name">Room {{ id }} (twin &middot; {{ getRoomById(id).viewType === 'lake' ? 'lake view' : 'garden view' }})</span>
                      <span class="sel-r-price">{{ formatINR(getRoomById(id).basePrice * totalNights) }}</span>
                    </div>
                  </div>

                  <div class="pricing-math-breakdown">
                    <div class="math-row">
                      <span>Rooms ({{ totalNights }} night{{ totalNights > 1 ? 's' : '' }})</span>
                      <span>{{ formatINR(computeRoomsSubtotal()) }}</span>
                    </div>

                    <div v-if="selectedRoomIds.length > 1" class="math-row discount-row">
                      <span>Multi-room discount (5%)</span>
                      <span>&minus;{{ formatINR(computeGroupDiscount()) }}</span>
                    </div>

                    <div v-if="computeAddonsTotal() > 0" class="math-row">
                      <span>Add-ons</span>
                      <span>+{{ formatINR(computeAddonsTotal()) }}</span>
                    </div>

                    <div class="math-row">
                      <span>GST (12%)</span>
                      <span>{{ formatINR(computeTaxes()) }}</span>
                    </div>

                    <div class="math-divider"></div>

                    <div class="math-row grand-total-row">
                      <span class="gt-label">Total</span>
                      <span class="gt-value">{{ formatINR(computeFinalGrandTotal()) }}</span>
                    </div>
                  </div>

                  <div class="payment-method-options">
                    <label class="pay-radio">
                      <input type="radio" value="property" v-model="guestForm.paymentMethod" />
                      <span>Pay at the resort (UPI, card or cash)</span>
                    </label>
                    <label class="pay-radio">
                      <input type="radio" value="card" v-model="guestForm.paymentMethod" />
                      <span>Guarantee with a card</span>
                    </label>
                  </div>

                  <button
                    class="confirm-booking-btn"
                    :disabled="!guestForm.firstName || !guestForm.email"
                    @click="confirmBooking"
                  >
                    Confirm reservation
                  </button>

                  <p class="terms-footnote">
                    By confirming, you agree to Aambal Resort's cancellation policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation -->
          <div v-else class="confirmation-success-screen">
            <div class="conf-badge-icon">&check;</div>
            <span class="conf-subtitle">Reservation confirmed</span>
            <h2 class="conf-title">Thank you for booking with us</h2>
            <p class="conf-intro">
              Thank you, <strong>{{ guestForm.firstName }} {{ guestForm.lastName }}</strong>. Your stay at Aambal Resort is confirmed. A receipt has been emailed to <strong>{{ guestForm.email }}</strong>.
            </p>

            <div class="conf-card-details">
              <div class="conf-row">
                <span class="conf-label">Booking reference</span>
                <strong class="conf-code">{{ bookingReferenceCode }}</strong>
              </div>
              <div class="conf-row">
                <span class="conf-label">Stay</span>
                <span>{{ formattedCheckIn }} &ndash; {{ formattedCheckOut }} ({{ totalNights }} night{{ totalNights > 1 ? 's' : '' }})</span>
              </div>
              <div class="conf-row">
                <span class="conf-label">Rooms</span>
                <div>
                  <span v-for="id in selectedRoomIds" :key="id" class="conf-room-pill">
                    Room {{ id }} (twin &middot; {{ getRoomById(id).viewType === 'lake' ? 'lake view' : 'garden view' }})
                  </span>
                </div>
              </div>
              <div class="conf-row">
                <span class="conf-label">Total</span>
                <strong class="conf-price">{{ formatINR(computeFinalGrandTotal()) }}</strong>
              </div>
              <div class="conf-row">
                <span class="conf-label">Payment</span>
                <span>{{ guestForm.paymentMethod === 'property' ? 'Pay at check-in' : 'Card guaranteed' }}</span>
              </div>
            </div>

            <div class="conf-actions-row">
              <button class="conf-btn-primary" @click="printConfirmation">Print confirmation</button>
              <NuxtLink to="/" class="conf-btn-secondary">Back to home</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  alias: '/book'
})

useHead({
  title: 'Book Your Stay | Aambal Resort, Kerala',
  meta: [
    { name: 'description', content: 'Book twin rooms with lake or garden views at Aambal Resort, Kerala.' }
  ]
})

function formatINR(amount) {
  if (amount === undefined || amount === null) return '₹ 0'
  return '₹ ' + Math.round(amount).toLocaleString('en-IN')
}

// =================== DATES & CALENDAR ===================
const checkInDate = ref(new Date(2026, 9, 23))
const checkOutDate = ref(new Date(2026, 9, 29))
const hoveredDate = ref(null)
const dateSelectionStep = ref('start')

const calMonth1 = ref(new Date(2026, 9, 1))
const calMonth2 = ref(new Date(2026, 10, 1))

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function formatDateLong(d) {
  if (!d) return ''
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
  return `${weekday}, ${d.getDate()} ${month} ${d.getFullYear()}`
}

const formattedCheckIn = computed(() => formatDateLong(checkInDate.value))
const formattedCheckOut = computed(() => formatDateLong(checkOutDate.value))

const isPastMonth = computed(() => {
  const now = new Date()
  return (
    calMonth1.value.getFullYear() < now.getFullYear() ||
    (calMonth1.value.getFullYear() === now.getFullYear() && calMonth1.value.getMonth() <= now.getMonth())
  )
})

const totalNights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 1
  const diffTime = checkOutDate.value.getTime() - checkInDate.value.getTime()
  const nights = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : 1
})

function prevCalendarMonth() {
  calMonth1.value = new Date(calMonth1.value.getFullYear(), calMonth1.value.getMonth() - 1, 1)
  calMonth2.value = new Date(calMonth2.value.getFullYear(), calMonth2.value.getMonth() - 1, 1)
}

function nextCalendarMonth() {
  calMonth1.value = new Date(calMonth1.value.getFullYear(), calMonth1.value.getMonth() + 1, 1)
  calMonth2.value = new Date(calMonth2.value.getFullYear(), calMonth2.value.getMonth() + 1, 1)
}

function getMonthDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDayIndex; i++) days.push(null)
  for (let d = 1; d <= lastDate; d++) days.push(new Date(year, month, d))
  return days
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function isDateDisabled(day) {
  if (!day) return true
  return false
}

function handleDateClick(day) {
  if (dateSelectionStep.value === 'start') {
    checkInDate.value = day
    checkOutDate.value = new Date(day.getTime() + 86400000)
    dateSelectionStep.value = 'end'
  } else if (day.getTime() <= checkInDate.value.getTime()) {
    checkInDate.value = day
    checkOutDate.value = new Date(day.getTime() + 86400000)
  } else {
    checkOutDate.value = day
    dateSelectionStep.value = 'start'
    setTimeout(() => {
      activePopover.value = null
    }, 350)
  }
}

function handleDateHover(day) {
  if (dateSelectionStep.value === 'end') hoveredDate.value = day
}

function getDayClasses(day) {
  if (!day) return 'empty-cell'
  const isStart = isSameDay(day, checkInDate.value)
  const isEnd = isSameDay(day, checkOutDate.value)
  let inRange = false

  if (checkInDate.value && checkOutDate.value) {
    inRange = day.getTime() > checkInDate.value.getTime() && day.getTime() < checkOutDate.value.getTime()
  }

  return {
    'day-start': isStart,
    'day-end': isEnd,
    'in-range': inRange,
    'is-disabled': isDateDisabled(day)
  }
}

function setPresetDates(nights) {
  const start = new Date(checkInDate.value)
  checkOutDate.value = new Date(start.getTime() + nights * 86400000)
  dateSelectionStep.value = 'start'
  activePopover.value = null
}

// =================== GUESTS & POPOVERS ===================
const activePopover = ref(null)

function handleCheckAvailability() {
  activePopover.value = activePopover.value === 'availability' ? null : 'availability'
}

function scrollToRooms() {
  activePopover.value = null
  if (typeof window !== 'undefined') {
    const el = document.querySelector('.rooms-listings-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function togglePopover(name) {
  activePopover.value = activePopover.value === name ? null : name
}

const adultsCount = ref(2)
const childrenCount = ref(0)
const totalGuests = computed(() => adultsCount.value + childrenCount.value)

// =================== ROOMS ===================
const allRooms = [
  {
    id: 1,
    name: 'Twin Room with Lake View',
    tag: 'Premium room',
    viewType: 'lake',
    viewLabel: 'Lake view',
    wing: 'Vembanad Lake Wing',
    basePrice: 14500,
    image: '/rooms/lake-twin-main.jpg',
    description: 'A comfortable stay with views over the lake. Two single beds, an en-suite bathroom and everything you need for a restful visit.',
    amenities: [
      'Two twin beds with organic linens',
      'Lake and backwater view',
      'Private balcony with teak chairs',
      'En-suite bathroom with rain shower',
      '50" smart TV',
      'Fibre Wi-Fi',
      'Tea and coffee station',
      'Air conditioning',
      'Ayurvedic bath products',
      'In-room safe'
    ]
  },
  {
    id: 2,
    name: 'Twin Room with Lake View',
    tag: 'Premium room',
    viewType: 'lake',
    viewLabel: 'Lake view',
    wing: 'Sunset Pavilion Wing',
    basePrice: 14500,
    image: '/rooms/lake-twin-1.jpg',
    description: 'Wake up to lake breezes and morning light on the water. Two single beds with handcrafted rattan headboards, a full bathroom and a spacious private veranda.',
    amenities: [
      'Two twin beds with orthopedic mattresses',
      'Waterfront sunset view',
      'Private shaded veranda with cane recliners',
      'En-suite bathroom with rain shower',
      '50" smart TV',
      'Wi-Fi',
      'Electric kettle and tea selection',
      'Air conditioning and ceiling fan',
      'Ayurvedic toiletries',
      'In-room safe and mini fridge'
    ]
  },
  {
    id: 3,
    name: 'Twin Room with Garden View',
    tag: 'Garden retreat',
    viewType: 'garden',
    viewLabel: 'Garden view',
    wing: 'Botanical Garden Wing',
    basePrice: 12000,
    image: '/rooms/garden-twin-main.jpg',
    description: 'Surrounded by tropical greenery. Two single beds, terracotta details, an en-suite rain shower and a private stone patio in the garden.',
    amenities: [
      'Two twin beds with handwoven bedding',
      'Tropical garden view',
      'Private patio among palms and frangipani',
      'Stone en-suite bathroom',
      '50" smart TV',
      'Wi-Fi',
      'Tea and coffee maker',
      'Air conditioning',
      'Bathrobes and slippers',
      'In-room safe and work nook'
    ]
  },
  {
    id: 4,
    name: 'Twin Room with Garden View',
    tag: 'Garden retreat',
    viewType: 'garden',
    viewLabel: 'Garden view',
    wing: 'Palm Sanctuary Wing',
    basePrice: 12000,
    image: '/rooms/room-resort-3.jpg',
    description: 'Overlooks the quiet courtyard and coconut grove. Two single beds, an en-suite rain shower and a covered private veranda for afternoon tea.',
    amenities: [
      'Two twin beds with premium linens',
      'Palm grove and courtyard view',
      'Private covered veranda with cane seating',
      'En-suite bathroom with rain shower',
      '50" smart TV',
      'Fibre Wi-Fi',
      'Tea and coffee kit',
      'Air conditioning',
      'Ayurvedic toiletries and fresh towels',
      'In-room safe'
    ]
  }
]

const selectedRoomIds = ref([])
const viewFilter = ref('all')

const filteredRooms = computed(() => {
  if (viewFilter.value === 'all') return allRooms
  return allRooms.filter(r => r.viewType === viewFilter.value)
})

function isRoomSelected(id) {
  return selectedRoomIds.value.includes(id)
}

function toggleRoomSelection(id) {
  if (isRoomSelected(id)) {
    selectedRoomIds.value = selectedRoomIds.value.filter(item => item !== id)
  } else {
    selectedRoomIds.value.push(id)
  }
}

function setRoomSelection(id, select) {
  if (select && !isRoomSelected(id)) {
    selectedRoomIds.value.push(id)
  } else if (!select && isRoomSelected(id)) {
    selectedRoomIds.value = selectedRoomIds.value.filter(item => item !== id)
  }
}

function getRoomById(id) {
  return allRooms.find(r => r.id === id) || allRooms[0]
}

// =================== PRICING (INR) ===================
function computeSingleRoomTotal(room) {
  const base = room.basePrice * totalNights.value
  return Math.round(base * 1.12)
}

function computeRoomsSubtotal() {
  const roomList = selectedRoomIds.value.length > 0 ? selectedRoomIds.value : [1]
  return roomList.reduce((sum, id) => sum + getRoomById(id).basePrice * totalNights.value, 0)
}

function computeGroupDiscount() {
  if (selectedRoomIds.value.length > 1) {
    return Math.round(computeRoomsSubtotal() * 0.05)
  }
  return 0
}

function computeAddonsTotal() {
  let total = 0
  if (guestForm.value.addons.breakfast) {
    total += 1200 * totalNights.value * (selectedRoomIds.value.length || 1)
  }
  if (guestForm.value.addons.boatCruise) total += 3500
  if (guestForm.value.addons.spaSession) total += 4000
  return total
}

function computeTaxes() {
  const taxable = computeRoomsSubtotal() - computeGroupDiscount() + computeAddonsTotal()
  return Math.round(taxable * 0.12)
}

function computeFinalGrandTotal() {
  return computeRoomsSubtotal() - computeGroupDiscount() + computeAddonsTotal() + computeTaxes()
}

function computeCombinedTotal() {
  return computeFinalGrandTotal()
}

// =================== MODALS & CHECKOUT ===================
const activeRoomModal = ref(null)

function openRoomModal(room) {
  activeRoomModal.value = room
}

function openAllRoomsInfo() {
  activePopover.value = null
  activeRoomModal.value = allRooms[0]
}

const isCheckoutOpen = ref(false)
const isBookingConfirmed = ref(false)
const bookingReferenceCode = ref('')

const guestForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  arrivalTime: 'Standard Check-in (2:00 PM - 4:00 PM)',
  specialRequests: '',
  paymentMethod: 'property',
  addons: {
    breakfast: false,
    boatCruise: false,
    spaSession: false
  }
})

function initiateBooking(room) {
  if (!isRoomSelected(room.id)) {
    selectedRoomIds.value = [room.id]
  }
  openCheckoutModal()
}

function openCheckoutModal() {
  if (selectedRoomIds.value.length === 0) {
    selectedRoomIds.value = [1]
  }
  isBookingConfirmed.value = false
  isCheckoutOpen.value = true
}

function closeCheckoutModal() {
  isCheckoutOpen.value = false
}

function confirmBooking() {
  const randomNum = Math.floor(10000 + Math.random() * 90000)
  bookingReferenceCode.value = `AAMBAL-2026-${randomNum}`
  isBookingConfirmed.value = true
}

function printConfirmation() {
  window.print()
}

onMounted(() => {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.search-filter-card')) {
      activePopover.value = null
    }
  })
})
</script>

<style scoped>
.booking-page {
  position: relative;
  margin-top:130px;
  min-height: 100vh;
  background-color: #faf4ea;
  color: #24201c;
  padding: 40px 24px 120px;
}

.booking-container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #183c28;
  outline-offset: 2px;
}

/* ================= SEARCH BAR ================= */
.search-filter-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e5dccb;
  border-radius: 12px;
  margin-bottom: 32px;
  z-index: 20;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1.25fr 1.25fr 1.25fr 1.25fr 1.5fr;
  align-items: stretch;
}

.filter-col {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-right: 1px solid #ede4d5;
  cursor: pointer;
  user-select: none;
}

.filter-col:last-child {
  border-right: none;
}

.filter-col:hover,
.filter-col.is-active {
  background-color: #fbf7ee;
}

.filter-col.is-active {
  border-bottom: 2px solid #183c28;
}

.filter-col-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-icon {
  color: #3b5e43;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.filter-info {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #857a6e;
}

.filter-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f1b17;
  white-space: nowrap;
}

.chevron-arrow {
  font-size: 10px;
  color: #8c8072;
  margin-left: 8px;
}

.filter-col.action-col {
  padding: 8px 12px;
  justify-content: center;
  cursor: default;
}

.filter-col.action-col:hover {
  background: transparent;
}

.check-btn {
  width: 100%;
  min-height: 48px;
  background: #183c28;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 16px;
  white-space: nowrap;
}

.check-btn:hover {
  background: #122f1f;
}

/* ================= POPOVERS ================= */
.popover {
  position: absolute;
  top: calc(100% + 8px);
  background: #ffffff;
  border: 1px solid #ded3bf;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  z-index: 100;
  padding: 20px;
  box-sizing: border-box;
}

.rooms-popover {
  right: 180px;
  width: 340px;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0e6d6;
}

.popover-title {
  font-size: 15px;
  font-weight: 700;
  color: #171412;
}

.popover-link-btn {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #c26928;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.popover-room-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

.popover-room-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fbf8f2;
  border: 1px solid transparent;
}

.popover-room-row.is-selected {
  background: #f3efe6;
  border-color: #d6cab5;
}

.room-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.room-checkbox-label input {
  display: none;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #a89c89;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.room-checkbox-label input:checked + .custom-checkbox {
  background: #183c28;
  border-color: #183c28;
}

.room-checkbox-label input:checked + .custom-checkbox::after {
  content: '✓';
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.room-row-label {
  display: flex;
  flex-direction: column;
}

.room-row-name {
  font-size: 14px;
  font-weight: 700;
  color: #211d19;
}

.room-row-type {
  font-size: 12px;
  color: #6d6356;
}

.room-qty-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #c9bea9;
  background: #ffffff;
  font-size: 14px;
  font-weight: 700;
  color: #383129;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.qty-btn:hover:not(:disabled) {
  background: #183c28;
  color: #ffffff;
  border-color: #183c28;
}

.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.qty-num {
  font-size: 14px;
  font-weight: 700;
  min-width: 14px;
  text-align: center;
  color: #211d19;
}

.popover-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0e6d6;
}

.total-rooms-text {
  font-size: 13px;
  color: #4b4237;
}

.popover-done-btn {
  background: #183c28;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
}

.popover-done-btn:hover {
  background: #122f1f;
}

.popover-done-btn.full-w {
  width: 100%;
  padding: 11px 18px;
  font-size: 14px;
}

/* Calendar */
.calendar-popover {
  left: 0;
  width: 680px;
}

.cal-popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.cal-summary-pill {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cal-pill-tag {
  background: #183c28;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
}

.cal-pill-dates {
  font-size: 14px;
  font-weight: 600;
  color: #2e2822;
}

.cal-close-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #8c7f70;
  cursor: pointer;
}

.month-navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.month-nav-btn {
  background: #f1e7d4;
  border: none;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  color: #2b241c;
}

.month-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.calendar-instruction-hint {
  font-size: 12px;
  color: #7a6e60;
}

.two-months-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.month-title {
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #211c18;
  margin-bottom: 10px;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #948777;
  margin-bottom: 6px;
}

.cal-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.cal-day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: #2e2821;
  border-radius: 6px;
  cursor: pointer;
}

.cal-day-cell:hover:not(.empty-cell):not(.is-disabled) {
  background: #ebddc5;
}

.cal-day-cell.day-start,
.cal-day-cell.day-end {
  background: #183c28 !important;
  color: #ffffff !important;
  font-weight: 700;
  border-radius: 50%;
}

.cal-day-cell.in-range {
  background: #f4ecdc;
  color: #1b1612;
  border-radius: 0;
}

.cal-day-cell.empty-cell {
  cursor: default;
}

.cal-day-cell.is-disabled {
  color: #c9bea9;
  cursor: not-allowed;
}

.cal-footer-presets {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid #f0e6d6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.presets-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.presets-label {
  font-size: 12px;
  color: #6a5e50;
  font-weight: 600;
}

.preset-chip {
  background: #fbf8f2;
  border: 1px solid #ded3c1;
  font-size: 12px;
  font-weight: 600;
  color: #3b332b;
  padding: 4px 10px;
  border-radius: 9999px;
  cursor: pointer;
}

.preset-chip:hover {
  background: #183c28;
  color: #ffffff;
  border-color: #183c28;
}

/* Guests */
.guests-popover {
  left: 320px;
  width: 320px;
}

.guests-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 14px;
}

.guest-counter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.guest-desc {
  display: flex;
  flex-direction: column;
}

.guest-type {
  font-size: 14px;
  font-weight: 700;
  color: #211c18;
}

.guest-sub {
  font-size: 12px;
  color: #7b7062;
}

.guest-notice {
  font-size: 12px;
  color: #706354;
  line-height: 1.4;
  background: #fbf8f2;
  padding: 8px 10px;
  border-radius: 6px;
  margin: 0;
}

/* Availability */
.availability-popover {
  right: 0;
  left: auto;
  width: 400px;
  max-width: 92vw;
}

.stay-summary-card {
  background: #fbf8f2;
  border: 1px solid #ede3d2;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 14px;
}

.stay-summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stay-meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 12px;
  font-weight: 600;
  color: #8c8072;
}

.meta-val {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 2px;
}

/* ================= VIEW FILTER TABS ================= */
.view-filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab-btn {
  background: #f2e9dc;
  border: 1px solid #e0d4c1;
  padding: 8px 18px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  color: #4b4136;
  cursor: pointer;
}

.filter-tab-btn.active {
  background: #183c28;
  color: #ffffff;
  border-color: #183c28;
}

/* ================= ROOM CARDS ================= */
.rooms-listings-section {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.room-booking-card {
  background: #ffffff;
  border: 1px solid #e7ded0;
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 390px;
}

.card-left-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  border-right: 1px solid #eee5d7;
}

.room-image-slider {
  background: #181512;
  overflow: hidden;
  min-height: 280px;
}

.room-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.room-details-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
}

.room-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 24px;
  font-weight: 600;
  color: #1c1713;
  margin: 0 0 12px;
}

.room-title.clickable {
  cursor: pointer;
}

.room-title.clickable:hover {
  text-decoration: underline;
}

.room-description {
  font-size: 14px;
  line-height: 1.6;
  color: #5c5246;
  margin: 0;
}

.card-right-summary {
  padding: 24px 28px;
  background: #faf6ef;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.price-header-box {
  margin-bottom: 14px;
}

.total-price-val {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 30px;
  font-weight: 700;
  color: #171412;
  display: block;
  line-height: 1;
}

.total-price-sub {
  font-size: 12px;
  color: #7b7062;
  margin-top: 4px;
  display: block;
}

.stay-meta-box {
  background: #ffffff;
  border: 1px solid #eae0d0;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stay-meta-line {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #3b332a;
  gap: 8px;
}

.meta-svg {
  color: #3b5e43;
  display: flex;
  align-items: center;
}

.meta-badge {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  background: #f1e7d4;
  color: #4b4136;
  padding: 2px 6px;
  border-radius: 4px;
}

.reserve-cta-btn {
  background: #183c28;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 13px 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.reserve-cta-btn:hover {
  background: #122f1f;
}

/* ================= SUMMARY BAR ================= */
.floating-booking-summary-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 1040px;
  background: #183c28;
  color: #ffffff;
  border-radius: 12px;
  padding: 16px 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 90;
}

.floating-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.floating-left {
  display: flex;
  flex-direction: column;
}

.floating-room-count {
  font-size: 17px;
}

.floating-dates {
  font-size: 13px;
  opacity: 0.85;
}

.floating-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.floating-price-box {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.floating-total-label {
  font-size: 12px;
  opacity: 0.8;
}

.floating-total-amount {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 24px;
  font-weight: 700;
}

.floating-book-btn {
  background: #c26928;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.floating-book-btn:hover {
  background: #ac5b20;
}

/* ================= MODALS ================= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(18, 14, 11, 0.6);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-dialog {
  background: #ffffff;
  border-radius: 12px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.room-info-dialog {
  width: 680px;
  max-width: 95vw;
}

.modal-header-img {
  position: relative;
  height: 220px;
  flex-shrink: 0;
}

.modal-header-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
  color: #ffffff;
  padding: 20px 24px;
}

.modal-tag {
  font-size: 13px;
  font-weight: 600;
  color: #f7a268;
}

.modal-room-name {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 26px;
  margin: 4px 0 2px;
  color: #ffffff;
}

.modal-wing-name {
  font-size: 13px;
  opacity: 0.85;
}

.modal-content-scroll {
  padding: 24px;
  overflow-y: auto;
}

.modal-grid-specs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.spec-tile {
  background: #fbf8f2;
  border: 1px solid #ebdcc8;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 12px;
  font-weight: 600;
  color: #7b6d5c;
}

.spec-val {
  font-size: 13px;
  color: #1c1712;
  margin: 4px 0 2px;
}

.spec-sub {
  font-size: 12px;
  color: #8c7e6c;
}

.modal-section {
  margin-bottom: 22px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1c1712;
  margin-bottom: 8px;
}

.modal-p {
  font-size: 14px;
  line-height: 1.6;
  color: #4b4136;
  margin-bottom: 8px;
}

.amenities-chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.amenity-chip {
  background: #f4ece0;
  font-size: 12px;
  font-weight: 500;
  color: #3b3227;
  padding: 5px 10px;
  border-radius: 9999px;
}

.policy-bullets {
  font-size: 13px;
  color: #4b4136;
  line-height: 1.6;
  padding-left: 20px;
}

.modal-footer-action {
  padding: 16px 24px;
  background: #faf5ec;
  border-top: 1px solid #ede3d3;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-price-indicator {
  display: flex;
  flex-direction: column;
}

.modal-rate-label {
  font-size: 12px;
  color: #786b5b;
}

.modal-rate-amt {
  font-size: 20px;
  color: #183c28;
}

.modal-select-btn {
  background: #183c28;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
}

.modal-select-btn:hover {
  background: #122f1f;
}

/* ================= CHECKOUT ================= */
.checkout-dialog {
  width: 960px;
  max-width: 95vw;
}

.checkout-form-container {
  padding: 32px;
  overflow-y: auto;
}

.checkout-header-title {
  margin-bottom: 24px;
  border-bottom: 1px solid #f0e6d6;
  padding-bottom: 14px;
}

.checkout-eyebrow {
  font-size: 13px;
  font-weight: 600;
  color: #3b5e43;
}

.checkout-main-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 32px;
  font-weight: 600;
  color: #171412;
  margin: 4px 0;
}

.checkout-subtitle {
  font-size: 14px;
  color: #635749;
}

.checkout-two-col {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 32px;
  align-items: start;
}

.form-sec-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f1a16;
  margin-bottom: 14px;
}

.form-sec-title.mt-4 {
  margin-top: 24px;
}

.form-row.two-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #4b4136;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #cebfab;
  border-radius: 8px;
  background: #faf8f5;
  color: #1f1a16;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #183c28;
  background: #ffffff;
}

.addons-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.addon-option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #ebdcc8;
  border-radius: 8px;
  background: #fdfbf7;
  cursor: pointer;
}

.addon-option-row:hover {
  background: #f7eee2;
}

.addon-option-row input {
  display: none;
}

.addon-option-row input:checked + .custom-checkbox {
  background: #183c28;
  border-color: #183c28;
}

.addon-option-row input:checked + .custom-checkbox::after {
  content: '✓';
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.addon-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.addon-name {
  font-size: 13px;
  font-weight: 700;
  color: #211c18;
}

.addon-sub {
  font-size: 12px;
  color: #7a6e60;
}

.addon-price {
  font-size: 12px;
  font-weight: 700;
  color: #183c28;
}

.summary-card-inner {
  background: #faf6ef;
  border: 1px solid #e7ded0;
  border-radius: 10px;
  padding: 22px;
}

.summary-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1c1712;
  margin-bottom: 14px;
}

.summary-stay-dates {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #eae0d0;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 14px;
}

.stay-date-box {
  display: flex;
  flex-direction: column;
}

.date-lbl {
  font-size: 12px;
  font-weight: 600;
  color: #8c7e6c;
}

.date-val {
  font-size: 12px;
  color: #1f1a16;
}

.time-lbl {
  font-size: 12px;
  color: #8c7e6c;
}

.stay-date-arrow {
  color: #183c28;
  font-size: 18px;
}

.selected-rooms-pill-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.sel-room-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  background: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ece2d2;
}

.sel-r-name {
  font-weight: 600;
  color: #3b3227;
}

.sel-r-price {
  font-weight: 700;
  color: #183c28;
}

.pricing-math-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.math-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4b4136;
}

.discount-row {
  color: #245c35;
  font-weight: 600;
}

.math-divider {
  height: 1px;
  background: #decfae;
  margin: 6px 0;
}

.grand-total-row {
  font-size: 17px;
  font-weight: 700;
  color: #171412;
}

.gt-value {
  color: #183c28;
  font-size: 20px;
  font-family: var(--font-heading, 'Playfair Display', serif);
}

.payment-method-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.pay-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #383027;
  cursor: pointer;
}

.confirm-booking-btn {
  background: #183c28;
  color: #ffffff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.confirm-booking-btn:hover:not(:disabled) {
  background: #122f1f;
}

.confirm-booking-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.terms-footnote {
  font-size: 12px;
  color: #857868;
  text-align: center;
  margin-top: 10px;
  line-height: 1.4;
}

/* ================= CONFIRMATION ================= */
.confirmation-success-screen {
  padding: 48px 36px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.conf-badge-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #183c28;
  color: #ffffff;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.conf-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #c26928;
}

.conf-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 34px;
  font-weight: 600;
  color: #171412;
  margin: 6px 0 12px;
}

.conf-intro {
  font-size: 15px;
  color: #4b4136;
  max-width: 580px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.conf-card-details {
  background: #faf6ef;
  border: 1px solid #e7ded0;
  border-radius: 10px;
  padding: 20px 24px;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
  text-align: left;
}

.conf-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #3b3227;
}

.conf-label {
  color: #786b5b;
}

.conf-code {
  font-family: monospace;
  font-size: 15px;
  color: #183c28;
}

.conf-price {
  font-size: 18px;
  color: #183c28;
  font-family: var(--font-heading, 'Playfair Display', serif);
}

.conf-room-pill {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #2e261f;
}

.conf-actions-row {
  display: flex;
  gap: 14px;
}

.conf-btn-primary {
  background: #183c28;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
}

.conf-btn-secondary {
  background: #f2e7d5;
  color: #2b231a;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
}

/* ================= TRANSITIONS ================= */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.15s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
}

.bar-slide-enter-active,
.bar-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.bar-slide-enter-from,
.bar-slide-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 1080px) {
  .room-booking-card {
    grid-template-columns: 1fr;
  }
  .card-left-content {
    border-right: none;
    border-bottom: 1px solid #eee5d7;
  }
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-col {
    border-bottom: 1px solid #ede4d5;
  }
  .filter-col.action-col {
    grid-column: 1 / -1;
  }
  .calendar-popover {
    width: 90vw;
    left: 5%;
  }
  .two-months-grid {
    grid-template-columns: 1fr;
  }
  .rooms-popover,
  .guests-popover {
    right: 10px;
    left: auto;
    width: 320px;
  }
  .availability-popover {
    width: 90vw;
    right: 5%;
  }
}

@media (max-width: 768px) {
  .card-left-content {
    grid-template-columns: 1fr;
  }
  .room-image-slider {
    height: 240px;
  }
  .filter-grid {
    grid-template-columns: 1fr;
  }
  .checkout-two-col {
    grid-template-columns: 1fr;
  }
  .checkout-dialog {
    max-height: 96vh;
  }
  .modal-grid-specs {
    grid-template-columns: repeat(2, 1fr);
  }
  .floating-bar-inner {
    flex-direction: column;
    align-items: stretch;
  }
  .floating-right {
    justify-content: space-between;
  }
}
</style>