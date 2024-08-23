const heightSlider = document.getElementById('heightSlider');
const heightValue = document.getElementById('heightValue');
const widthSlider = document.getElementById('widthSlider');
const widthValue = document.getElementById('widthValue');
const modeSwitch = document.getElementById('modeButton');
const box = document.querySelector('.box');

let heightMode = '%';
let widthMode = '%';

let heightPercentage = heightSlider.value;
let widthPercentage = widthSlider.value;

let updateDimensions = () => {
    heightPercentage = heightSlider.value;
    heightValue.textContent = heightPercentage + heightMode;
    box.style.height = heightPercentage + heightMode;

    widthPercentage = widthSlider.value;
    widthValue.textContent = widthPercentage + widthMode;
    box.style.width = widthPercentage + widthMode;
}

heightSlider.addEventListener('input', function () {
    updateDimensions();
});

widthSlider.addEventListener('input', function () {
    updateDimensions();
});

modeSwitch.addEventListener('click', function () {
    if (heightMode === "%" & widthMode === "%") {
        heightMode = "vh";
        widthMode = "vw";
        modeButton.innerHTML = "Change to %";
    } else {
        heightMode = "%";
        widthMode = "%";
        modeButton.innerHTML = "Change to vh/vw";
    }

    updateDimensions();
});


