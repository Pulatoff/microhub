const button = document.querySelector('#button')
const email = document.querySelector('#email')
const first_name = document.querySelector('#first_name')
const last_name = document.querySelector('#last_name')
const password = document.querySelector('#password')
const passwordConfirm = document.querySelector('#passwordConfirm')

async function register(body) {
    const response = await fetch('http://localhost:8000/api/v1/users/signup/client', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
}

async function checkUser() {
    const response = await fetch('http://localhost:8000/api/v1/users/self')
    const data = await response.json()
    renderHtml(data)
}

button.addEventListener('click', async function (e) {
    const { data, status } = await register({
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
        first_name: first_name.value,
        last_name: last_name.value,
    })
    renderHtml({ data, status })
})

function renderHtml({ data, status }) {
    const html = `
        <div>
            <h1 style="color:${status === 'success' ? 'green' : 'red'};">${status}<h1>
        </div>
        <div>
            <h2>FULL NAME: ${data?.user?.first_name} ${data?.user?.last_name}</h2>
        </div>
    `
    document.querySelector('#root').innerHTML = html
}

checkUser()
