var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbdown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)

    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
      })
    })

      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  })
})

Array.from(thumbdown).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
    console.log('Thumbs-down count:', thumbDown)
    fetch('messages/down', {
      method: 'put',//  updates the number
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbDown': thumbDown
      })
    })

      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  })
})

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
})



function chosenpic(button) {
  const emotion = button.dataset.pic // reads the emotion likr 'happy'
  const results = document.querySelector('.result')// finds the question or message to that picture
  results.innerText = ` I am feeling ${emotion}`
}

let rightNowQuestion = 0
function nextQuestion() {

  const myQuestions = document.querySelectorAll('.message')
  myQuestions[rightNowQuestion].style.display = 'none'

  rightNowQuestion++ //moves to the next question 

  if (rightNowQuestion === myQuestions.length) {
    alert('ALL DONE, START OVER!')
    rightNowQuestion = 0

  }

  myQuestions[rightNowQuestion].style.display = 'block' //this will display only the next question and block previous ones
  document.querySelector('.result').innerText = ''
}