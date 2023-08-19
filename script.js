const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
mistakeTag = document.querySelector(".mistake span"),
timeTag = document.querySelector(".time span b"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span"),
tryAgainBtn = document.querySelector(".content button");

let timer,
maxTime = 60,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

function loadPara() {
    // Getting random number and it'll always be less than the paragraph length
    const randIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";

    // Getting random items from the paragraphs array, splitting all characters
    // of it, adding each character inside span and adding this span inside p tag
    paragraphs[randIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");

    // Focusing input field on keydown or click event 
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) { // once timer is start, it won't restart again on every key clicked
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        // If user hasn't entered any character or pressed backspace
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--; // Decrement char index
            // Decrement mistakes only if charIndex span contains incorrect class
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct","incorrect");
        }
    }
        else {
            if(characters[charIndex].innerText == typedChar) {
                // If the user typed character and shown character matched then add the correct class else increment the mistakes and add the incorrect class
                characters[charIndex].classList.add("correct");
            }
            else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }   
            charIndex++; // Increment the charIndex either user typed or incorrect character
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");
        // To get WPM, first, subtract total mistakes from the total typed characters then divide it by 5 and again divide the output by 
        //subtracting timeLeft from maxTime and last multiplying the output with 60. 5 means assuming 5 characters = 1 word.

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60); 

        // If WPM value = 0, empty or infinity, then setting its value to 0
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm; 

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes; // cpm will not count mistakes
        }

        else {
            clearInterval(timer);
            inpField.value= "";
        }
    }

function initTimer() {
    // If timeLeft is greater than 0 decrement the timeLeft else clear the timer
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    }
    else {
        clearInterval(timer);
    }
}

function resetGame() {
    // Calling loadPara function and resetting each variable and elements value to default
    loadPara();
    clearInterval(timer);
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0;
    inpField.value= "";
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = 0;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

loadPara();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
