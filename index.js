const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = []
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const USERS_PER_PAGE = 12
const paginator = document.querySelector("#paginator")
let filteredUsers = []

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}"> + </button>

            </div>
          </div>
        </div>
      </div>
    `

  })

  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
     <li class="page-item" > <a class="page-link" href="#" data-page="${page}">${page}</a></li >
    `
  }
  paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {

  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)

  renderUserList(getUsersByPage(page))
})

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

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此名單已收藏')
  }

  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

searchForm.addEventListener('submit', function onSearchFormSubmit(event) {

  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()


  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的資料`)
  }
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})




axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  console.log(users)
  renderPaginator(users.length)
  renderUserList(getUsersByPage(1))
})
  .catch((err) => console.log(err))
