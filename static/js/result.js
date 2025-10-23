// CardioPredict - Result Page JavaScript
// Handles display of prediction results with animations and charts

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve prediction result from sessionStorage
    const resultData = sessionStorage.getItem('predictionResult');
    
    if (!resultData) {
        // If no result data, redirect to prediction page
        window.location.href = '/predict';
        return;
    }
    
    const result = JSON.parse(resultData);
    displayResults(result);
});

function displayResults(result) {
    const { prediction, probability, risk_level, message } = result;
    
    // Update status section
    const resultStatus = document.getElementById('resultStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');
    
    if (prediction === 1) {
        // High Risk
        resultStatus.classList.add('high-risk');
        statusIcon.textContent = '⚠️';
        statusTitle.textContent = 'High Risk Detected';
        statusDescription.textContent = 'Based on your health parameters, you may be at risk for heart disease.';
    } else {
        // Low Risk
        resultStatus.classList.add('low-risk');
        statusIcon.textContent = '✅';
        statusTitle.textContent = 'Low Risk';
        statusDescription.textContent = 'Your heart health parameters look good!';
    }
    
    // Animate status appearance
    resultStatus.style.opacity = '0';
    resultStatus.style.transform = 'scale(0.9)';
    setTimeout(() => {
        resultStatus.style.transition = 'all 0.5s ease';
        resultStatus.style.opacity = '1';
        resultStatus.style.transform = 'scale(1)';
    }, 100);
    
    // Update probability bars
    updateProbabilityBars(probability);
    
    // Create chart
    createRiskChart(probability);
    
    // Update health message
    document.getElementById('messageText').textContent = message;
    
    // Animate health message
    const healthMessage = document.getElementById('healthMessage');
    healthMessage.style.opacity = '0';
    healthMessage.style.transform = 'translateY(20px)';
    setTimeout(() => {
        healthMessage.style.transition = 'all 0.6s ease';
        healthMessage.style.opacity = '1';
        healthMessage.style.transform = 'translateY(0)';
    }, 400);
    
    // Update tips based on risk level
    updateTips(prediction);
}

function updateProbabilityBars(probability) {
    const noDiseaseProb = document.getElementById('noDiseaseProbability');
    const diseaseProb = document.getElementById('diseaseProbability');
    const noDiseaseBar = document.getElementById('noDiseaseBar');
    const diseaseBar = document.getElementById('diseaseBar');
    
    // Format probabilities
    const noDisease = probability.no_disease.toFixed(1);
    const disease = probability.disease.toFixed(1);
    
    noDiseaseProb.textContent = `${noDisease}%`;
    diseaseProb.textContent = `${disease}%`;
    
    // Animate bars
    setTimeout(() => {
        noDiseaseBar.style.width = `${noDisease}%`;
        diseaseBar.style.width = `${disease}%`;
    }, 200);
}

function createRiskChart(probability) {
    const ctx = document.getElementById('riskChart');
    
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['No Disease', 'Heart Disease'],
            datasets: [{
                label: 'Risk Probability',
                data: [probability.no_disease, probability.disease],
                backgroundColor: [
                    'rgba(81, 207, 102, 0.8)',
                    'rgba(255, 107, 107, 0.8)'
                ],
                borderColor: [
                    'rgba(81, 207, 102, 1)',
                    'rgba(255, 107, 107, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Poppins'
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Risk Assessment Breakdown',
                    font: {
                        size: 18,
                        family: 'Poppins',
                        weight: '600'
                    },
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(1) + '%';
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        family: 'Poppins'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Poppins'
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

function updateTips(prediction) {
    const tipsContainer = document.getElementById('tipsContainer');
    
    let tips;
    
    if (prediction === 1) {
        // High Risk Tips
        tips = [
            {
                icon: '🏥',
                text: 'Schedule an appointment with a cardiologist immediately'
            },
            {
                icon: '💊',
                text: 'Follow prescribed medications and treatment plan'
            },
            {
                icon: '🥗',
                text: 'Adopt a heart-healthy diet (low sodium, low cholesterol)'
            },
            {
                icon: '🚶',
                text: 'Start gentle exercise with doctor\'s approval'
            },
            {
                icon: '📊',
                text: 'Monitor blood pressure and cholesterol regularly'
            },
            {
                icon: '🚭',
                text: 'Quit smoking and avoid secondhand smoke'
            },
            {
                icon: '😌',
                text: 'Practice stress management techniques daily'
            },
            {
                icon: '💤',
                text: 'Get 7-9 hours of quality sleep each night'
            }
        ];
    } else {
        // Low Risk Tips
        tips = [
            {
                icon: '🏃',
                text: 'Maintain regular exercise routine (30 min/day)'
            },
            {
                icon: '🥗',
                text: 'Continue eating a balanced, nutritious diet'
            },
            {
                icon: '📅',
                text: 'Schedule annual health checkups'
            },
            {
                icon: '😌',
                text: 'Keep stress levels under control'
            },
            {
                icon: '💧',
                text: 'Stay hydrated throughout the day'
            },
            {
                icon: '🚭',
                text: 'Avoid tobacco and limit alcohol consumption'
            },
            {
                icon: '⚖️',
                text: 'Maintain a healthy body weight'
            },
            {
                icon: '📊',
                text: 'Monitor your health parameters periodically'
            }
        ];
    }
    
    // Clear existing tips
    tipsContainer.innerHTML = '';
    
    // Add new tips with staggered animation
    tips.forEach((tip, index) => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.style.opacity = '0';
        tipElement.style.transform = 'translateX(-20px)';
        
        tipElement.innerHTML = `
            <span class="tip-icon">${tip.icon}</span>
            <p>${tip.text}</p>
        `;
        
        tipsContainer.appendChild(tipElement);
        
        // Animate tip appearance
        setTimeout(() => {
            tipElement.style.transition = 'all 0.4s ease';
            tipElement.style.opacity = '1';
            tipElement.style.transform = 'translateX(0)';
        }, 600 + (index * 80));
    });
}

function animateElements() {
    const elements = [
        document.querySelector('.risk-meter'),
        document.querySelector('.chart-container'),
        document.querySelector('.doctor-tips'),
        document.querySelector('.result-actions')
    ];
    
    elements.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        }
    });
}

// Call animation function
setTimeout(animateElements, 100);

function printResults() {
    window.print();
}
