function openUserInfoForm() {
    document.getElementById("user-info-modal").style.display = "block";
}

function closeUserInfoForm() {
    document.getElementById("user-info-modal").style.display = "none";
}

function openAllergyInfoForm() {
    closeUserInfoForm();
    document.getElementById("food-allergy-modal").style.display = "block";
}

function closeAllergyInfoForm() {
    document.getElementById("food-allergy-modal").style.display = "none";
}

function openRecommendationModal() {
    closeAllergyInfoForm();
    document.getElementById("recommendation-modal").style.display = "block";
}

const backendUrl = 'http://localhost:3000'; // Replace with your backend URL

    // Function to Insert Recommendations
    async function insertRecommendations() {
        try {
            const response = await fetch(`${backendUrl}/api/recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Fetch recommendations for a sample user (update the ID accordingly)
                // getRecommendations(12); // Replace 1 with the actual userId
            } else {
                console.error('Insert Error:', result);
                alert(`Failed to insert recommendations: ${result.message}`);
            }
        } catch (error) {
            console.error('Error inserting recommendations:', error);
            alert('Error inserting recommendations.');
        }
    }

    // Function to Get Recommendations for a User
    async function getRecommendations(userId) {
        try {
            // Pass userId as a query parameter in the URL
            const response = await fetch(`${backendUrl}/api/getrecommendations?userId=${encodeURIComponent(userId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            const result = await response.json();
            console.log(result);
            if (response.ok) {
                displayRecommendations(result.recommendations || []);
            } else {
                console.error('Fetch Error:', result);
                alert(`Failed to fetch recommendations: ${result.message}`);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('Error fetching recommendations.');
        }
    }
    

    // Function to Display Recommendations
    function displayRecommendations(recommendations) {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = ''; // Clear the list

        if (recommendations.length === 0) {
            const noData = document.createElement('li');
            noData.textContent = 'No recommendations found.';
            recommendationsList.appendChild(noData);
            return;
        }

        recommendations.forEach(recommendation => {
            const listItem = document.createElement('li');
            listItem.textContent = `Food: ${recommendation.food_name}, Reason: ${recommendation.reason}`;
            recommendationsList.appendChild(listItem);
        });
    }

    document.getElementById('Update-recommend-btn').addEventListener('click', () =>{
        insertRecommendations();
    })
    // Event Listener for Recommend Now Button
    document.getElementById('recommend-now-btn').addEventListener('click', () => {
        console.log('clicking' );
        getRecommendations(12);
    });

function validateUserInfo(data) {
    // Check required fields
    for (const [key, value] of Object.entries(data)) {
        if (!value) {
            alert(`Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
            return false;
        }
    }

    // Validate ranges
    if (data.age < 0 || data.age > 110) {
        alert("Please enter a valid age between 0 and 120.");
        return false;
    }

    if (data.weight < 20 || data.weight > 500) {
        alert("Please enter a valid weight between 20 and 500 kg.");
        return false;
    }

    if (data.height < 50 || data.height > 300) {
        alert("Please enter a valid height between 50 and 300 cm.");
        return false;
    }
    return true;
}  

async function saveUserInfo(userData) {
    try{
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                userData
            })
        });

        const data = await response.json();

        if(response.ok){
            alert("Data Submitted Successfully!")
            // userInfoForm.reset();
        }
        else{
            alert(data.error)
        }
    } catch (error) {
        errorMessage.textContent = "Server error. Please try again later.";
        console.error('Error:', error);
    }
}

function validateAllergyInfo(data) {
    if (!data.userId) {
        alert('Enter user id');
        return false;
    }

    if (!data.allergyName || !data.severityLevel || !data.diagnosedDate) {
        alert('Please fill out all allergy information fields');
        return false;
    }

    return true;
}

async function saveAllergyInfo(allergyData) {
    try {
        const response = await fetch('http://localhost:3000/api/allergies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({allergyData})
        });

        const data = await response.json();

        if (response.ok) {
            alert("Data Submitted Successfully!")
            return true;
        } else {
            throw new Error(data.error || 'Failed to save allergy data');
        }
    } catch (error) {
        console.error('Error in saveAllergyInfo:', error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const userInfoForm = document.querySelector("#user-info-form");
    const foodAllergyForm = document.querySelector("#food-allergy-form");
    
    userInfoForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userInfoData = { 
            userId : userInfoForm.querySelector('input[name=user_id]').value.trim(),
            age : userInfoForm.querySelector('input[name=age]').value.trim(),
            gender : userInfoForm.querySelector('select[name=gender]').value.trim(),
            weight : userInfoForm.querySelector('input[name=weight]').value.trim(),
            height : userInfoForm.querySelector('input[name=height]').value.trim(),
            activityLevel : userInfoForm.querySelector('select[name=activity-level]').value.trim(),
            dietaryPreferences : userInfoForm.querySelector('select[name=dietary-preferences]').value.trim(),
            healthConditions : userInfoForm.querySelector('textarea[name=health-conditions]').value.trim()
        }

        // validations for each one
        if (validateUserInfo(userInfoData)) {
            console.log("Validate userinfo successfull")
            try{
                // const success = true;
                const success = await saveUserInfo(userInfoData);
                if(success) {
                    closeUserInfoForm();
                    document.getElementById("food-allergy-modal").style.display = "block";
                }
            } catch (error) {
                console.error('Error in handleUserInfoSubmit:', error);
                alert('Failed to save user information. Please try again.');
            }
        }

    });

    // Food allergy 
    foodAllergyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const allergyData = { 
            userId : foodAllergyForm.querySelector('input[name=user_id]').value.trim(),
            allergyName : foodAllergyForm.querySelector('input[name=allergy-name]').value.trim(),
            severityLevel : foodAllergyForm.querySelector('select[name=severity-level]').value.trim(),
            diagnosedDate : foodAllergyForm.querySelector('input[name=diagnosed-date]').value.trim(),
        }

        if (validateAllergyInfo(allergyData)) {
            try {
                const success = await saveAllergyInfo(allergyData);
                if (success) {
                    closeAllergyInfoForm();
                    document.getElementById("recommendation-modal").style.display = "block";
                }
            } catch (error) {
                console.error('Error in handleAllergySubmit:', error);
                alert('Failed to save allergy information. Please try again.');
            }
        }

    });

});

