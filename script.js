document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // Preloader
  // =============================================
  const preloader = document.querySelector('.preloader');
  
  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.classList.add('fade-out');
      
      setTimeout(function() {
        preloader.style.display = 'none';
      }, 500);
    }, 1000);
  });

  // =============================================
  // Navigation
  // =============================================
  const nav = document.querySelector('.app-nav');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Scroll effect for navigation
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body scroll when menu is open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // =============================================
  // Hero Section
  // =============================================
  // Animate stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateStats() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000;
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        stat.textContent = Math.floor(current);
        
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    });
  }
  
  // Intersection Observer for stats animation
  const heroStats = document.querySelector('.hero-stats');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(heroStats);

  // =============================================
  // Services Section
  // =============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  const bookServiceButtons = document.querySelectorAll('.book-service');
  
  // Service filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      // Filter services
      serviceCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(',');
        
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Favorite button toggle
  favoriteButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('active');
      
      // Show toast notification
      const serviceName = this.closest('.service-card').querySelector('h3').textContent;
      if (this.classList.contains('active')) {
        showToast(`${serviceName} added to favorites`);
      } else {
        showToast(`${serviceName} removed from favorites`);
      }
    });
  });

  // Book service buttons
  bookServiceButtons.forEach(button => {
    button.addEventListener('click', function() {
      const serviceName = this.getAttribute('data-service');
      
      // Open booking widget and set the service
      openBookingWidget();
      selectService(serviceName);
    });
  });

  // =============================================
  // Barbers Section
  // =============================================
  const viewBarberButtons = document.querySelectorAll('.view-barber');
  
  // View barber profile
  viewBarberButtons.forEach(button => {
    button.addEventListener('click', function() {
      const barberName = this.getAttribute('data-barber');
      showBarberProfile(barberName);
    });
  });

  // =============================================
  // Booking Widget
  // =============================================
  const bookNowBtn = document.getElementById('book-now-btn');
  const heroBookBtn = document.getElementById('hero-book-btn');
  const bookingWidget = document.querySelector('.booking-widget');
  const closeWidget = document.querySelector('.close-widget');
  const nextStepBtn = document.getElementById('next-step');
  const prevStepBtn = document.getElementById('prev-step');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const bookingSteps = document.querySelectorAll('.booking-step');
  const serviceOptions = document.querySelectorAll('.service-option');
  const barberOptions = document.querySelectorAll('.barber-option');
  const prevMonthBtn = document.querySelector('.prev-month');
  const nextMonthBtn = document.querySelector('.next-month');
  const calendarGrid = document.querySelector('.calendar-grid');
  const timeSlotsGrid = document.querySelector('.time-slots-grid');
  const bookingForm = document.querySelector('.booking-form');
  
  let currentStep = 1;
  let selectedService = null;
  let selectedBarber = null;
  let selectedDate = null;
  let selectedTime = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // Open booking widget
  function openBookingWidget() {
    bookingWidget.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateStep(1);
  }

  // Close booking widget
  function closeBookingWidget() {
    bookingWidget.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Mobile book now button
  const mobileBookNow = document.querySelector('.book-now-btn');
  if (mobileBookNow) {
    mobileBookNow.addEventListener('click', function() {
      openBookingWidget();
    });
  }

  // Event listeners for booking widget
  bookNowBtn.addEventListener('click', openBookingWidget);
  heroBookBtn.addEventListener('click', openBookingWidget);
  closeWidget.addEventListener('click', closeBookingWidget);

  // Service option selection
  serviceOptions.forEach(option => {
    option.addEventListener('click', function() {
      serviceOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      const serviceName = this.querySelector('h5').textContent;
      selectService(serviceName);
    });
  });

  // Select service function
  function selectService(serviceName) {
    selectedService = serviceName;
    updateSummary();
  }

  // Barber option selection
  barberOptions.forEach(option => {
    option.addEventListener('click', function() {
      barberOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      const barberName = this.getAttribute('data-barber');
      selectedBarber = barberName;
      updateSummary();
    });
  });

  // Next step in booking process
  nextStepBtn.addEventListener('click', function() {
    if (currentStep < 4) {
      // Validate current step before proceeding
      if (validateStep(currentStep)) {
        updateStep(currentStep + 1);
        
        // Initialize calendar when moving to step 3
        if (currentStep === 2) {
          renderCalendar(currentMonth, currentYear);
          generateTimeSlots();
        }
      }
    } else {
      // Submit booking
      if (validateBookingForm()) {
        submitBooking();
      }
    }
  });

  // Previous step in booking process
  prevStepBtn.addEventListener('click', function() {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
    }
  });

  // Validate current step
  function validateStep(step) {
    switch(step) {
      case 1:
        if (!selectedService) {
          showToast('Please select a service');
          return false;
        }
        break;
      case 2:
        if (!selectedBarber) {
          showToast('Please select a barber');
          return false;
        }
        break;
      case 3:
        if (!selectedDate || !selectedTime) {
          showToast('Please select a date and time');
          return false;
        }
        break;
    }
    return true;
  }

  // Validate booking form
  function validateBookingForm() {
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const email = document.getElementById('client-email').value;
    
    if (!name || !phone || !email) {
      showToast('Please fill in all required fields');
      return false;
    }
    
    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Please enter a valid email address');
      return false;
    }
    
    return true;
  }

  // Submit booking
  function submitBooking() {
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const email = document.getElementById('client-email').value;
    const notes = document.getElementById('client-notes').value;
    
    // In a real app, you would send this data to your backend
    const bookingData = {
      service: selectedService,
      barber: selectedBarber,
      date: selectedDate,
      time: selectedTime,
      client: { name, phone, email },
      notes: notes
    };
    
    console.log('Booking submitted:', bookingData);
    
    // Close booking widget
    closeBookingWidget();
    
    // Show success message
    showToast('Appointment booked successfully!');
    
    // Reset booking widget
    setTimeout(() => {
      resetBookingWidget();
    }, 500);
  }

  // Reset booking widget
  function resetBookingWidget() {
    selectedService = null;
    selectedBarber = null;
    selectedDate = null;
    selectedTime = null;
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    
    serviceOptions.forEach(opt => opt.classList.remove('active'));
    barberOptions.forEach(opt => opt.classList.remove('active'));
    bookingForm.reset();
    
    updateStep(1);
  }

  // Update step in booking process
  function updateStep(step) {
    // Update current step
    currentStep = step;
    
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
      if (index + 1 <= step) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
    
    // Update step content
    bookingSteps.forEach(stepContent => {
      if (parseInt(stepContent.getAttribute('data-step-content')) === step) {
        stepContent.classList.add('active');
      } else {
        stepContent.classList.remove('active');
      }
    });
    
    // Update button states
    prevStepBtn.disabled = step === 1;
    nextStepBtn.textContent = step === 4 ? 'Confirm Booking' : 'Next';
    
    // Update summary if on confirmation step
    if (step === 4) {
      updateSummary();
    }
  }

  // Update booking summary
  function updateSummary() {
    if (selectedService) {
      document.getElementById('summary-service').textContent = selectedService;
      
      // Find the selected service to get duration and price
      const serviceOption = Array.from(serviceOptions).find(opt => 
        opt.querySelector('h5').textContent === selectedService
      );
      
      if (serviceOption) {
        document.getElementById('summary-duration').textContent = 
          serviceOption.getAttribute('data-duration') + ' min';
        document.getElementById('summary-total').textContent = 
          'R' + serviceOption.getAttribute('data-price');
      }
    }
    
    if (selectedBarber) {
      document.getElementById('summary-barber').textContent = selectedBarber;
    }
    
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('summary-date').textContent = 
        dateObj.toLocaleDateString('en-US', options);
    }
    
    if (selectedTime) {
      document.getElementById('summary-time').textContent = selectedTime;
    }
  }

  // Calendar navigation
  prevMonthBtn.addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextMonthBtn.addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  // Render calendar
  function renderCalendar(month, year) {
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get current date for comparison
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day disabled';
      calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;
      
      // Disable past dates
      if (year < currentYear || 
          (year === currentYear && month < currentMonth) || 
          (year === currentYear && month === currentMonth && day < currentDate)) {
        dayElement.classList.add('disabled');
      }
      
      // Highlight today
      if (day === currentDate && month === currentMonth && year === currentYear) {
        dayElement.classList.add('active');
      }
      
      // Add click event
      dayElement.addEventListener('click', function() {
        if (!this.classList.contains('disabled')) {
          // Remove active class from all days
          document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('active');
          });
          
          // Add active class to selected day
          this.classList.add('active');
          
          // Set selected date
          selectedDate = new Date(year, month, day);
          updateSummary();
          
          // Generate time slots for selected date
          generateTimeSlots();
        }
      });
      
      calendarGrid.appendChild(dayElement);
    }
    
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    document.querySelector('.current-month').textContent = 
      `${monthNames[month]} ${year}`;
  }

  // Generate time slots
  function generateTimeSlots() {
    // Clear previous time slots
    timeSlotsGrid.innerHTML = '';
    
    if (!selectedDate) return;
    
    // Generate time slots from 9am to 6pm every 30 minutes
    const startHour = 9;
    const endHour = 18;
    const timeSlots = [];
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Full hour slot
      timeSlots.push({
        hour: hour,
        minute: 0,
        display: `${hour}:00 AM`
      });
      
      // Half hour slot
      if (hour < endHour - 1) {
        timeSlots.push({
          hour: hour,
          minute: 30,
          display: `${hour}:30 AM`
        });
      }
    }
    
    // Filter out unavailable times (randomly for demo)
    const availableSlots = timeSlots.filter(slot => {
      return Math.random() > 0.3; // 70% chance of being available
    });
    
    // Create time slot elements
    availableSlots.forEach(slot => {
      const slotElement = document.createElement('div');
      slotElement.className = 'time-slot';
      slotElement.textContent = slot.display;
      
      slotElement.addEventListener('click', function() {
        // Remove active class from all slots
        document.querySelectorAll('.time-slot').forEach(slot => {
          slot.classList.remove('active');
        });
        
        // Add active class to selected slot
        this.classList.add('active');
        
        // Set selected time
        selectedTime = this.textContent;
        updateSummary();
      });
      
      timeSlotsGrid.appendChild(slotElement);
    });
  }

  // =============================================
  // Gift Card Modal
  // =============================================
  const giftCardBtn = document.getElementById('gift-card-btn');
  const giftCardModal = document.getElementById('gift-card-modal');
  const closeGiftModal = document.querySelectorAll('.close-modal');
  const giftOptions = document.querySelectorAll('.gift-option');
  const giftCardForm = document.getElementById('gift-card-form');
  const purchaseGiftCardBtn = document.getElementById('purchase-gift-card');
  const giftAmountInput = document.getElementById('gift-amount');
  
  // Open gift card modal
  giftCardBtn.addEventListener('click', function() {
    giftCardModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close modals
  closeGiftModal.forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    });
  });

  // Close modals when clicking outside
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Gift option selection
  giftOptions.forEach(option => {
    option.addEventListener('click', function() {
      const amount = this.getAttribute('data-amount');
      
      if (amount === 'custom') {
        giftCardForm.classList.add('active');
        giftAmountInput.focus();
      } else {
        giftCardForm.classList.remove('active');
        giftAmountInput.value = amount;
      }
    });
  });

  // Purchase gift card
  purchaseGiftCardBtn.addEventListener('click', function() {
    const amount = giftAmountInput.value;
    const recipientName = document.getElementById('recipient-name').value;
    const recipientEmail = document.getElementById('recipient-email').value;
    const message = document.getElementById('gift-message').value;
    
    if (!amount || !recipientName || !recipientEmail) {
      showToast('Please fill in all required fields');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(recipientEmail)) {
      showToast('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would send this data to your backend
    const giftCardData = {
      amount: amount,
      recipientName: recipientName,
      recipientEmail: recipientEmail,
      message: message
    };
    
    console.log('Gift card purchased:', giftCardData);
    
    // Close modal
    giftCardModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Show success message
    showToast(`Gift card for R${amount} sent to ${recipientEmail}`);
    
    // Reset form
    giftCardForm.reset();
    giftCardForm.classList.remove('active');
    giftOptions.forEach(opt => opt.classList.remove('active'));
  });

  // =============================================
  // Video Modal
  // =============================================
  const videoBtn = document.getElementById('video-btn');
  const videoModal = document.getElementById('video-modal');
  
  if (videoBtn) {
    videoBtn.addEventListener('click', function() {
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // =============================================
  // Barber Profile Modal
  // =============================================
  const barberModal = document.getElementById('barber-modal');
  const bookThisBarberBtn = document.getElementById('book-this-barber');
  
  // Show barber profile
  function showBarberProfile(barberName) {
    // In a real app, you would fetch barber data from your backend
    const barbers = {
      'James Wilson': {
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        specialty: 'Master Barber / Founder',
        rating: '4.8 (210)',
        bio: 'With over 15 years of experience in the industry, James founded UpTown Barber with a vision to create a space where traditional barbering meets modern style. His precision cutting techniques and attention to detail have made him one of Cape Town\'s most sought-after barbers.',
        specialties: [
          'Precision haircuts',
          'Classic styles',
          'Hot towel shaves',
          'Beard sculpting'
        ]
      },
      // Add other barbers here...
    };
    
    const barber = barbers[barberName];
    
    if (barber) {
      document.getElementById('barber-profile-name').textContent = barberName;
      document.getElementById('barber-profile-image').src = barber.image;
      document.getElementById('barber-profile-specialty').textContent = barber.specialty;
      document.getElementById('barber-profile-rating').textContent = barber.rating;
      document.getElementById('barber-profile-bio').textContent = barber.bio;
      
      const specialtiesList = document.getElementById('barber-specialties');
      specialtiesList.innerHTML = '';
      barber.specialties.forEach(specialty => {
        const li = document.createElement('li');
        li.textContent = specialty;
        specialtiesList.appendChild(li);
      });
      
      barberModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Book this barber button
  bookThisBarberBtn.addEventListener('click', function() {
    const barberName = document.getElementById('barber-profile-name').textContent;
    selectedBarber = barberName;
    
    // Close barber modal
    barberModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Open booking widget at step 2 (barber selection)
    openBookingWidget();
    updateStep(2);
    
    // Auto-select the barber
    document.querySelectorAll('.barber-option').forEach(option => {
      if (option.getAttribute('data-barber') === barberName) {
        option.classList.add('active');
      }
    });
  });

  // =============================================
  // Directions Button
  // =============================================
  const directionsBtn = document.getElementById('directions-btn');
  
  if (directionsBtn) {
    directionsBtn.addEventListener('click', function() {
      // In a real app, this would open maps with the shop location
      window.open('https://www.google.com/maps?q=42+Station+Road,+Woodstock,+Cape+Town');
    });
  }

  // =============================================
  // Newsletter Form
  // =============================================
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('newsletter-email').value;
      const consent = document.getElementById('consent').checked;
      
      if (!email) {
        showToast('Please enter your email address');
        return;
      }
      
      if (!consent) {
        showToast('Please agree to receive marketing emails');
        return;
      }
      
      // In a real app, you would send this data to your backend
      console.log('Newsletter subscription:', email);
      
      // Show success message
      showToast('Thank you for subscribing!');
      
      // Reset form
      newsletterForm.reset();
    });
  }

  // =============================================
  // Toast Notification
  // =============================================
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    
    // Remove toast after animation
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }

  // =============================================
  // Smooth Scrolling for Anchor Links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = 80; // Adjust for fixed header
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =============================================
  // Lazy Loading for Images
  // =============================================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers without native lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      lazyLoadObserver.observe(img);
    });
  }
});
