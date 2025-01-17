const authContainer = document.getElementById('auth-container');
    const calculatorContainer = document.getElementById('calculator-container');
    const businessTitle = document.getElementById('business-title');
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentUser = null;
    let pricePerHour = 45;

    // Check for existing session
    function checkSession() {
      const user = localStorage.getItem('currentUser');
      if (user) {
        const { businessName, price } = JSON.parse(user);
        currentUser = businessName;
        pricePerHour = price;
        showCalculator();
      }
    }

    function showCalculator() {
      authContainer.style.display = 'none';
      calculatorContainer.style.display = 'block';
      businessTitle.textContent = `${currentUser}'s Pond Calculator`;
    }

    function showAuth() {
      calculatorContainer.style.display = 'none';
      authContainer.style.display = 'block';
    }

    function clearForm() {
      document.getElementById('time-in').value = '';
      document.getElementById('time-out').value = '';
      document.getElementById('result').textContent = '';
    }

    function calculatePrice() {
      const timeIn = document.getElementById('time-in').value;
      const timeOut = document.getElementById('time-out').value;
      
      if (!timeIn || !timeOut) {
        alert('Please enter both time in and time out');
        return;
      }
      
      const [inHours, inMinutes] = timeIn.split(':').map(Number);
      const [outHours, outMinutes] = timeOut.split(':').map(Number);
      
      const totalMinutesIn = inHours * 60 + inMinutes;
      const totalMinutesOut = outHours * 60 + outMinutes;
      
      let totalMinutes = totalMinutesOut - totalMinutesIn;
      
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const price = ((totalMinutes * pricePerHour) / 60).toFixed(2);
      
      const timeSpent = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      document.getElementById('result').innerHTML = `
        Total Time: ${timeSpent}<br>
        Total Price: $${price}
      `;
    }

    signupBtn.addEventListener('click', () => {
      const businessName = document.getElementById('business-name').value;
      const price = parseFloat(document.getElementById('price-per-hour').value);
      
      if (!businessName || !price) {
        alert('Please enter both business name and price per hour');
        return;
      }
      
      localStorage.setItem('currentUser', JSON.stringify({
        businessName,
        price
      }));
      
      currentUser = businessName;
      pricePerHour = price;
      showCalculator();
    });

    loginBtn.addEventListener('click', () => {
      const businessName = document.getElementById('business-name').value;
      const storedUser = localStorage.getItem(businessName);
      
      if (!storedUser) {
        alert('Business not found. Please sign up first.');
        return;
      }
      
      const { price } = JSON.parse(storedUser);
      localStorage.setItem('currentUser', JSON.stringify({
        businessName,
        price
      }));
      
      currentUser = businessName;
      pricePerHour = price;
      showCalculator();
    });

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      currentUser = null;
      showAuth();
    });

    clearBtn.addEventListener('click', clearForm);
    document.getElementById('calculate-btn').addEventListener('click', calculatePrice);

    // Initialize
    checkSession();
