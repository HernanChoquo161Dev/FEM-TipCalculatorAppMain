const gridOptions = document.querySelectorAll(".tip-grid__option-tip");
const singleInputs = document.querySelectorAll(".single-input__input");
const outputAmounts = document.querySelectorAll(".output-amount__amount");
const resetOption = document.querySelector(".output-amount__reset");
const tipCustomOption = document.querySelector(".tip-grid__text-option-tip");

var optionSelect = -1;

function tipPerOption(optionSelect){
    if (optionSelect == 0) return 0.05;
    if (optionSelect == 1) return 0.1;
    if (optionSelect == 2) return 0.15;
    if (optionSelect == 3) return 0.25;
    if (optionSelect == 4) return 0.5;
}

function activeCalculator(singleInputs, tipCustomOption, optionSelect){
    let checkInputs = true;
    let checkOption = true;
    let checkCustomOption = true;

    singleInputs.forEach(element => {
        if(element.value.length == 0){
            checkInputs = false;
        }
    });

    if(optionSelect == -1){
        if(tipCustomOption.value.length <= 0) {
            checkOption = false;
            checkCustomOption = false;
        }
    }

    return checkInputs && checkOption && checkCustomOption;
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function calculateTip(singleInputs, outputAmounts, optionSelect){
    let paymentPerPeople = parseFloat(singleInputs[0].value) / singleInputs[1].value;

    if(tipCustomOption.value.length == 0){
        let tipPerPeople = paymentPerPeople * tipPerOption(optionSelect);
        let totalTipPerPeople = paymentPerPeople + tipPerPeople;
    
        outputAmounts[0].textContent = "$" + roundToTwo(tipPerPeople);
        outputAmounts[1].textContent = "$" + roundToTwo(totalTipPerPeople);
    }
    else{
        let tipPerPeople = paymentPerPeople * parseFloat(tipCustomOption.value / 100);
        let totalTipPerPeople = paymentPerPeople + tipPerPeople;
    
        outputAmounts[0].textContent = "$" + roundToTwo(tipPerPeople);
        outputAmounts[1].textContent = "$" + roundToTwo(totalTipPerPeople);
    }
}

function addEventClickGridOption(optionGrid, singleInputs, outputAmounts, resetOption, tipCustomOption, index){
    optionGrid[index].addEventListener('click', function (event) {

        optionGrid[index].style.backgroundColor = "hsl(172, 67%, 45%)";
        optionGrid[index].style.color = "hsl(183, 100%, 15%)";

        if(optionSelect != -1){
            optionGrid[optionSelect].style.backgroundColor = "hsl(183, 100%, 15%)";
            optionGrid[optionSelect].style.color = "hsl(0, 0%, 100%)";
        }

        optionSelect = index;

        if(activeCalculator(singleInputs, tipCustomOption,optionSelect)){
            calculateTip(singleInputs, outputAmounts, optionSelect);

            if(resetOption.disabled){
                resetOption.disabled = false;
                resetOption.style.backgroundColor = "hsl(172, 67%, 45%)";
            }
        }
    });
  }

var firstInput = [true, true];

function numericalInputValidation(elementInputs, enabledPoint){
    elementInputs.onkeydown = function(e) {

        if(e.which == 8) return true;
        if(enabledPoint){
            if(e.which == 190 || e.which == 110)
                return true;
        }
        if(isNaN(parseInt(e.key))) return false;
    };
}

function addEventInputGridOption(index){
    singleInputs[index].addEventListener('input', function (event) {

        if(event.target.value.length == 1 && firstInput){
            if(isNaN(parseInt(event.target.value))){
                event.target.value = "";

                firstInput[index] = false;
            }
        }
    
        if(index == 0)
            numericalInputValidation(singleInputs[index], true);
        else 
            numericalInputValidation(singleInputs[index], false);

        if(activeCalculator(singleInputs, tipCustomOption,optionSelect)){
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
}

resetOption.disabled = true;

var customFirstInput = true;

tipCustomOption.addEventListener('input', function (event) {

    numericalInputValidation(tipCustomOption, true);
    
    if(!customFirstInput){
        tipCustomOption.style.textAlign = "right";
    }

    if(event.target.value.length == 0){
        tipCustomOption.style.textAlign = "center";
    }

    if(event.target.value.length == 1 && customFirstInput){
        if(isNaN(parseInt(event.target.value))){
            event.target.value = "";

            customFirstInput = false;
        }
    }

    if(event.target.value.length > 0 && optionSelect != -1){
        gridOptions[optionSelect].style.backgroundColor = "hsl(172, 67%, 45%)";
        gridOptions[optionSelect].style.color = "hsl(183, 100%, 15%)";

        optionSelect = -1;
    }

    if(activeCalculator(singleInputs, tipCustomOption,optionSelect)){
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

resetOption.addEventListener('click', function (event) {
    /*singleInputs.forEach(
        function(currentValue, currentIndex, listObj) {
          console.log(currentValue + ', ' + currentIndex + ', ' + this);
          currentValue.value = "";
        },
        'miEsteArg'
      );*/

    singleInputs.forEach(element => {
        element.value = "";
    });

    outputAmounts.forEach(element => {
        element.textContent = "$0.00";
    });

    if(optionSelect != -1){
        gridOptions[optionSelect].style.backgroundColor = "hsl(183, 100%, 15%)";
        gridOptions[optionSelect].style.color = "hsl(0, 0%, 100%)";
    }

    optionSelect = -1;
});

for(b = 0; b < gridOptions.length; b++){
    addEventClickGridOption(gridOptions, singleInputs, outputAmounts, resetOption, tipCustomOption,b);
}
for(c = 0; c < singleInputs.length; c++){
    addEventInputGridOption(c);
}