const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = JSON.parse(localStorage.getItem('favoriteUsers'))
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")


function renderUserList(data) {

  let rawHTML = ''
  data.forEach((item) => {

    rawHTML += `
     <div class="col-sm-3">
        <div class="mb-2">

          <div class="card">
            <img class="card-img-top" src="${item.avatar}" alt="User img">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
            </div>
            <div class="card-footer">

              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${item.id}"> More
              </button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}"> X </button>

            </div>
          </div>
        </div>
      </div>
    `

  })
  dataPanel.innerHTML = rawHTML
}

function showUserModal(id) {

  const modalTitle = document.querySelector("#user-modal-title")
  const modalImage = document.querySelector("#user-modal-avatar")
  const userName = document.querySelector("#user-name")
  const userSurname = document.querySelector("#user-surname")
  const userEmail = document.querySelector("#user-email")
  const userGender = document.querySelector("#user-gender")
  const userAge = document.querySelector("#user-age")
  const userRegion = document.querySelector("#user-region")
  const userBirthday = document.querySelector("#user-birthday")



  axios.get(INDEX_URL + id).then((response) => {

    const data = response.data
    modalTitle.innerText = data.name
    userName.innerText = 'NAME : ' + data.name
    userSurname.innerText = 'SURNAME : ' + data.surname
    userEmail.innerText = 'EMAIL : ' + data.email
    userGender.innerText = 'GENDER : ' + data.gender
    userAge.innerText = 'AGE : ' + data.age
    userRegion.innerText = 'REGION : ' + data.region
    userBirthday.innerText = 'BIRTHDAY : ' + data.birthday
    modalImage.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="avatar-fuid">`

  })
}


function removeFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex, 1)
  localStorage.setItem("favoriteUsers", JSON.stringify(users))

  renderUserList(users)
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFavorite(Number(event.target.dataset.id))
  }

})

searchForm.addEventListener('submit', function onSearchFormSubmit(event) {

  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredUsers = []

  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的資料`)
  }

  renderUserList(filteredUsers)
})

renderUserList(users)
