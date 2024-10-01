function blurHandler(event) {
  checkValidationOfInput(event);
}

function checkValidationOfInput(event) {
  var inputElement = event.target;
  switch (inputElement.id) {
    case 'email':
      if (
        inputElement.value.includes('@') &&
        inputElement.value.includes('.')
      ) {
        checkValidInput(inputElement);
      } else checkInvalidInput(inputElement);
      break;
    case 'username':
      if (inputElement.value !== '') {
        checkValidInput(inputElement);
      } else checkInvalidInput(inputElement);
      break;
    case 'password':
      if (inputElement.value.length < 6) {
        checkInvalidInput(inputElement);
      } else checkValidInput(inputElement);
      break;
    case 'password_confirmation':
      var passwordEle = document.querySelector('#password');
      var passwordConfirmEle = document.querySelector('#password_confirmation');
      if (passwordConfirmEle.value !== passwordEle.value) {
        checkInvalidInput(inputElement);
      } else checkValidInput(inputElement);
      break;
    default:
      console.log('loi');
  }
}

function checkInvalidInput(inputElement) {
  inputElement.classList.add('form-input--error');
  var errorMessage = inputElement.parentElement.querySelector('.error-message');
  errorMessage.style.display = 'block';
}

function checkValidInput(inputElement) {
  inputElement.classList.remove('form-input--error');
  var errorMessage = inputElement.parentElement.querySelector('.error-message');
  errorMessage.style.display = 'none';
}

function inputHandler(event) {
  checkValidationOfInput(event);
}

async function submitHandler(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const username = event.target.username.value;
  const password = event.target.password.value;
  const password_confirmation = event.target.password_confirmation.value;
  const formData = {
    email,
    username,
    password,
    rePassword: password_confirmation,
  };
  try {
    const response = await fetch('http://localhost:8080/auth/signup', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
    const resData = await response.json();

    window.location.assign('./login.html');
  } catch (error) {
    var errorForm = document.querySelector('.error');
    errorForm.innerText = error.info.data[0].msg;
    errorForm.style.display = 'block';

    for (var i = 0; i < inputElements.length; ++i) {
      inputElements[i].classList.add('form-input--error');
    }
  }
}

const token = localStorage.getItem('token');
if (token) {
  window.location.assign('./profile.html');
}

var form = document.querySelector('.signup-form form');
form.onsubmit = submitHandler;

var inputElements = document.querySelectorAll('.form-input');
var inputElementsLength = inputElements.length;
for (var i = 0; i < inputElementsLength; ++i) {
  inputElements[i].onblur = blurHandler;
  inputElements[i].oninput = inputHandler;
}
