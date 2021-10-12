const gridOptions = document.querySelectorAll(".tip-grid__option-tip");
const singleInputs = document.querySelectorAll(".single-input__input");
const outputAmounts = document.querySelectorAll(".output-amount__amount");
const resetOption = document.querySelector(".output-amount__reset");
const tipCustomOption = document.querySelector(".tip-grid__text-option-tip");

var optionSelect = -1;
var firstInput = [true, true];
var customFirstInput = true;

resetOption.disabled = true;

function tipPerOption(optionSelect){
    if (optionSelect == 0) return 0.05;
    if (optionSelect == 1) return 0.1;
    if (optionSelect == 2) return 0.15;
    if (optionSelect == 3) return 0.25;
    if (optionSelect == 4) return 0.5;
}

function activeCalculator(singleInputs, tipCustomOption, optionSelect){
    if(singleInputs[0].value.length == 0) return 0;
    if(singleInputs[1].value.length == 0) return 1;

    if(optionSelect == -1){
        if(tipCustomOption.value.length == 0) {
            return 2;
        }
    }

    return -1;
}

function roundToTwo(number) {    
    return +(Math.round(number + "e+2")  + "e-2");
}

function calculateTip(singleInputs, outputAmounts, optionSelect){
    let paymentPerPeople = parseFloat(singleInputs[0].value) / singleInputs[1].value;

    let tipPerPeople;
    let totalTipPerPeople;

    if(optionSelect != -1){
        tipPerPeople = paymentPerPeople * tipPerOption(optionSelect);
    }
    else{
        tipPerPeople = paymentPerPeople * parseFloat(tipCustomOption.value / 100);
    }
    totalTipPerPeople = paymentPerPeople + tipPerPeople;

    outputAmounts[0].textContent = "$" + roundToTwo(tipPerPeople);
    outputAmounts[1].textContent = "$" + roundToTwo(totalTipPerPeople);
}

function changeColorOption(optionGridSelect, colorBack, color){
    optionGridSelect.style.backgroundColor = colorBack;
    optionGridSelect.style.color = color;
}

function activateAlertTextInput(singleInputsPerson){
    let textAlert = document.querySelector(".single-input__text-alert");
            
    singleInputsPerson.classList.toggle("single-input__input--alert");
    textAlert.classList.toggle("single-input__text-alert--active");
}

function addEventClickGridOption(optionGrid, singleInputs, outputAmounts, resetOption, tipCustomOption, index){
    optionGrid[index].addEventListener('click', function (event) {

        /*style change of a selected option*/
        changeColorOption(optionGrid[index], "hsl(172, 67%, 45%)", "hsl(183, 100%, 15%)");

        if(optionSelect != -1){
            changeColorOption(optionGrid[optionSelect], "hsl(183, 100%, 15%)", "hsl(0, 0%, 100%)");
        }
        optionSelect = index;

        /*validation data*/

        let validationInput = activeCalculator(singleInputs, tipCustomOption,optionSelect);

        if(validationInput == -1){
            if(singleInputs[1].classList.contains("single-input__input--alert"))
                activateAlertTextInput(singleInputs[1]);

            calculateTip(singleInputs, outputAmounts, optionSelect);

            if(resetOption.disabled){
                resetOption.disabled = false;
                resetOption.style.backgroundColor = "hsl(172, 67%, 45%)";
            }
        }
        else if(validationInput == 1){
            if(!singleInputs[1].classList.contains("single-input__input--alert"))      
                activateAlertTextInput(singleInputs[1]);
        }
    });
}

function numericalInputValidation(elementInputs, enabledPoint, enabledArrows){
    elementInputs.onkeydown = function(e) {

        if(e.which == 8) return true;
        if(enabledPoint){
            if(e.which == 190 || e.which == 110)
                return true;
        }
        if(enabledArrows) 
            if(e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40)
                return true;
        if(isNaN(parseInt(e.key))) return false;
    };
}

function desactiveOptionReset(optionReset){
    if(!optionReset.disabled){
        optionReset.disabled = true;
        optionReset.style.backgroundColor = "hsla(172, 67%, 45%, 0.5)";
    }
}

function addEventInputGridOption(index){
    singleInputs[index].addEventListener('input', function (event) {

        /*Fix bug caused by first input character*/
        if(event.target.value.length == 1 && firstInput){
            if(isNaN(parseInt(event.target.value))){
                event.target.value = "";

                firstInput[index] = false;
            }
        }

        /*control alert message and data insufficiency*/
        if(event.target.value.length > 0){
            if(singleInputs[1].classList.contains("single-input__input--alert")){
                activateAlertTextInput(singleInputs[1]);
            }
        }
        else{
            outputAmounts.forEach(element => {
                element.textContent = "$0.00";
            });

            desactiveOptionReset(resetOption);
        }

        /*check inputs*/
    
        if(index == 0)
            numericalInputValidation(singleInputs[index], true, true);
        else 
            numericalInputValidation(singleInputs[index], false, true);

        /*validation data*/
            
        let validationInput = activeCalculator(singleInputs, tipCustomOption,optionSelect);

        if(validationInput == -1){
            calculateTip(singleInputs, outputAmounts, optionSelect);
            
            if(resetOption.disabled){
                resetOption.disabled = false;
                resetOption.style.backgroundColor = "hsl(172, 67%, 45%)";
            }
        }
        else if(validationInput == 0){
            if(singleInputs[1].classList.contains("single-input__input--alert")){
                activateAlertTextInput(singleInputs[1]);
            }
        }
        else if(validationInput == 1){
            if(!singleInputs[1].classList.contains("single-input__input--alert")){
                activateAlertTextInput(singleInputs[1]);
            }
        }
    });
}

tipCustomOption.addEventListener('input', function (event) {
    /*check inputs*/

    numericalInputValidation(tipCustomOption, true, true);
    
    /*change styles custom tip option*/

    if(!customFirstInput){
        tipCustomOption.style.textAlign = "right";
    }

    if(event.target.value.length == 0){
        tipCustomOption.style.textAlign = "center";
    }

    /*Fix bug caused by first input character*/

    if(event.target.value.length == 1 && customFirstInput){
        if(isNaN(parseInt(event.target.value))){
            event.target.value = "";

            customFirstInput = false;
        }
    }

    /*change styles tip custom option and option selected */

    if(event.target.value.length > 0){
        if(optionSelect != -1){
            changeColorOption(gridOptions[optionSelect], "hsl(183, 100%, 15%)", "hsl(0, 0%, 100%)");

            optionSelect = -1;
        }
    }
    else{
        desactiveOptionReset(resetOption);
    }

    /*validation data */

    if(activeCalculator(singleInputs, tipCustomOption,optionSelect) == -1){
        calculateTip(singleInputs, outputAmounts, optionSelect);

        if(resetOption.disabled){
            resetOption.disabled = false;
            resetOption.style.backgroundColor = "hsl(172, 67%, 45%)";
        }
    }
    else{
        outputAmounts.forEach(element => {
            element.textContent = "$0.00";
        });
    }
});

function resetCalculator(singleInputs, gridOptions, outputAmounts, tipCustomOption, resetOption, optionSelect){
    singleInputs.forEach(element => {
        element.value = "";
    });

    outputAmounts.forEach(element => {
        element.textContent = "$0.00";
    });
    
    tipCustomOption.value = "";

    if(optionSelect != -1){
        gridOptions[optionSelect].style.backgroundColor = "hsl(183, 100%, 15%)";
        gridOptions[optionSelect].style.color = "hsl(0, 0%, 100%)";
    }

    desactiveOptionReset(resetOption);

    optionSelect = -1;
}

resetOption.addEventListener('click', function (event) {
    resetCalculator(singleInputs, gridOptions, outputAmounts, tipCustomOption, resetOption, optionSelect);
});

for(b = 0; b < gridOptions.length; b++){
    addEventClickGridOption(gridOptions, singleInputs, outputAmounts, resetOption, tipCustomOption,b);
}
for(c = 0; c < singleInputs.length; c++){
    addEventInputGridOption(c);
}