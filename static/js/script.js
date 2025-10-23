// CardioPredict - Main JavaScript File
// Handles navigation, form interactions, and animations

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 16px rgba(74, 144, 226, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.1)';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.info-card, .stat-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Prediction Form Handling
const predictionForm = document.getElementById('predictionForm');

if (predictionForm) {
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.submit-button');
        const buttonText = document.getElementById('buttonText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('errorMessage');
        
        // Show loading state
        submitButton.disabled = true;
        buttonText.textContent = 'Analyzing...';
        loadingSpinner.style.display = 'inline-block';
        errorMessage.style.display = 'none';
        
        // Collect form data
        const formData = new FormData(this);
        
        // Validate all fields
        let isValid = true;
        formData.forEach((value, key) => {
            if (!value) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            errorMessage.textContent = 'Please fill in all required fields.';
            errorMessage.style.display = 'block';
            submitButton.disabled = false;
            buttonText.textContent = 'Predict Heart Disease Risk';
            loadingSpinner.style.display = 'none';
            return;
        }
        
        try {
            // Send prediction request
            const response = await fetch('/predict_disease', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Store result in sessionStorage
                sessionStorage.setItem('predictionResult', JSON.stringify(result));
                
                // Redirect to result page
                window.location.href = '/result';
            } else {
                errorMessage.textContent = result.error || 'An error occurred during prediction.';
                errorMessage.style.display = 'block';
                
                // Reset button
                submitButton.disabled = false;
                buttonText.textContent = 'Predict Heart Disease Risk';
                loadingSpinner.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'Network error. Please check your connection and try again.';
            errorMessage.style.display = 'block';
            
            // Reset button
            submitButton.disabled = false;
            buttonText.textContent = 'Predict Heart Disease Risk';
            loadingSpinner.style.display = 'none';
        }
    });
    
    // Form validation styling
    const inputs = predictionForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.style.borderColor = '#51CF66';
            } else {
                this.style.borderColor = '#E3F2FD';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#4A90E2';
        });
    });
    
    // Reset form styling
    predictionForm.addEventListener('reset', function() {
        setTimeout(() => {
            inputs.forEach(input => {
                input.style.borderColor = '#E3F2FD';
            });
        }, 10);
    });
}

// Number input validation
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.min && parseFloat(this.value) < parseFloat(this.min)) {
            this.value = this.min;
        }
        if (this.max && parseFloat(this.value) > parseFloat(this.max)) {
            this.value = this.max;
        }
    });
});

// Tooltips
function addTooltips() {
    const tooltipData = {
        'age': 'Your current age in years',
        'sex': 'Biological sex (Male = 1, Female = 0)',
        'cp': 'Type of chest pain experienced',
        'trestbps': 'Blood pressure at rest (normal: 120 mm Hg)',
        'chol': 'Serum cholesterol level (normal: < 200 mg/dl)',
        'fbs': 'Whether fasting blood sugar > 120 mg/dl',
        'restecg': 'Results of resting electrocardiogram',
        'thalach': 'Maximum heart rate achieved during exercise',
        'exang': 'Exercise-induced chest pain',
        'oldpeak': 'ST depression induced by exercise',
        'slope': 'Slope of peak exercise ST segment',
        'ca': 'Number of major vessels colored by fluoroscopy',
        'thal': 'Thalassemia (blood disorder)'
    };
    
    Object.keys(tooltipData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.title = tooltipData[key];
        }
    });
}

addTooltips();

// Stats counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Trigger counter animation
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const match = text.match(/\d+/);
                    if (match) {
                        const num = parseInt(match[0]);
                        stat.textContent = '0';
                        setTimeout(() => {
                            animateCounter(stat, num);
                        }, 200);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

console.log('%c CardioPredict ', 'background: #4A90E2; color: white; font-size: 20px; padding: 10px;');
console.log('%c Heart Disease Prediction System powered by Random Forest ML ', 'font-size: 12px; color: #4A90E2;');
