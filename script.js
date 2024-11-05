document.addEventListener('DOMContentLoaded', function () {
    const searchbutton = document.getElementById('search-btn');
    const usernameinput = document.getElementById('user-input');
    const statscontainer = document.getElementById('stats-container');
    const easyprogressCircle = document.querySelector(".easy-progress");
    const mediumprogressCircle = document.querySelector(".medium-progress");
    const hardprogressCircle = document.querySelector(".hard-progress");
    const easylevel = document.getElementById('easy-level');
    const mediumlevel = document.getElementById('medium-level');
    const hardlevel = document.getElementById('hard-level');
    const cardstatscontiner = document.getElementById('stats-cards');

    //1  user validating the name
    function validateuserName(username) {
        // let username = "   John   ";
        // console.log(username.trim()); // Output: "John"
        if (username.trim() === "") {
            alert("User name can't be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }
    //  2 we are now fetching the user details 
    async function fetchUserDetails(username) { 
        try {
            searchbutton.textContent = 'Searching...';
            searchbutton.disabled = true;  // button ko disable kr diya

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n   query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql, 
               
              
            };


            const response = await fetch( (proxyUrl+targetUrl), requestOptions);
            console.log("after fetch block ");

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const parsedata = await response.json();
            console.log("logging data", parsedata);
            DisplayData(parsedata);
        }
        catch (error) {
            console.log(error);

            statscontainer.innerHTML =  `<p>${error.message}</p>`;
        }
        finally {
            searchbutton.textContent = "Search";
            searchbutton.disabled = false;
        }
    }
    function updateProgress(solved , total , label , circle)
    {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function DisplayData(parsedata)
    {
        // total numbr of question 
        const totalque = parsedata.data.allQuestionsCount[0].count;
        const totalEasyque = parsedata.data.allQuestionsCount[1].count;
        const totalMediumque = parsedata.data.allQuestionsCount[2].count;
        const totalHardque = parsedata.data.allQuestionsCount[3].count;

        // total solved question 

        const solvedtotalque = parsedata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasytotalque = parsedata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumtotalque = parsedata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardtotalque = parsedata.data.matchedUser.submitStats.acSubmissionNum[3].count;
 
        // update the progress of each level

        updateProgress( solvedEasytotalque , totalEasyque , easylevel ,easyprogressCircle);
        updateProgress( solvedMediumtotalque , totalMediumque , mediumlevel ,mediumprogressCircle);
        updateProgress( solvedHardtotalque , totalHardque , hardlevel ,hardprogressCircle);


        // card status 

        const cardsData = [ 
            {label:"overall Leetcode submission" ,value : parsedata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label:"overall Easy submission" ,value : parsedata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label:"overall Medium submission" ,value : parsedata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label:"overall Hard submission" ,value : parsedata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
        ];

        console.log("Total submission data :" , cardsData);

        cardstatscontiner.innerHTML = cardsData.map(
            data=>
                 `<div class="card">  
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>`
            
        ).join("");
        
    }
    searchbutton.addEventListener('click', function () {
        let username = usernameinput.value;
        console.log("hi this is ", username);
        if (validateuserName(username)) {
            fetchUserDetails(username);
        }

    });

});